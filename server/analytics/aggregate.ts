import type { AnalyticsEvent, InquiryEvent } from './types'
import { LOCALES, type Locale } from '@/lib/i18n'

/** Rolls a raw event log into the shape the dashboard renders. */

export type DayBucket = { date: string; views: number; sessions: number; inquiries: number }
export type Ranked = { label: string; value: number }

export type Summary = {
  days: number
  totals: {
    views: number
    sessions: number
    inquiries: number
    docRequests: number
    undelivered: number
  }
  /** Same-length window immediately before this one, for the deltas. */
  previous: { views: number; sessions: number; inquiries: number; docRequests: number }
  perDay: DayBucket[]
  topPages: Ranked[]
  topReferrers: Ranked[]
  topDocs: Ranked[]
  localeSplit: { locale: Locale; views: number }[]
  viewport: { mobile: number; tablet: number; desktop: number }
  recentInquiries: InquiryEvent[]
}

const DAY = 86_400_000

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10)
}

function rank(counts: Map<string, number>, limit: number): Ranked[] {
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .slice(0, limit)
}

export function summarise(events: AnalyticsEvent[], days: number, now: number): Summary {
  const windowStart = now - days * DAY
  const previousStart = windowStart - days * DAY

  const current = events.filter((e) => e.ts >= windowStart)
  const previous = events.filter((e) => e.ts >= previousStart && e.ts < windowStart)

  const pages = new Map<string, number>()
  const referrers = new Map<string, number>()
  const docs = new Map<string, number>()
  const localeViews = new Map<Locale, number>()
  const sessions = new Set<string>()
  const viewport = { mobile: 0, tablet: 0, desktop: 0 }

  // Pre-seed every day in the window so a quiet day renders as a zero bar
  // rather than silently collapsing the axis.
  const buckets = new Map<string, DayBucket>()
  for (let i = days - 1; i >= 0; i--) {
    const key = dayKey(now - i * DAY)
    buckets.set(key, { date: key, views: 0, sessions: 0, inquiries: 0 })
  }
  const sessionsPerDay = new Map<string, Set<string>>()

  let views = 0
  let inquiries = 0
  let docRequests = 0
  let undelivered = 0
  const recentInquiries: InquiryEvent[] = []

  for (const event of current) {
    const key = dayKey(event.ts)
    const bucket = buckets.get(key)

    if (event.type === 'view') {
      views++
      sessions.add(event.session)
      pages.set(event.path, (pages.get(event.path) ?? 0) + 1)
      localeViews.set(event.locale, (localeViews.get(event.locale) ?? 0) + 1)
      if (event.ref) referrers.set(event.ref, (referrers.get(event.ref) ?? 0) + 1)
      if (event.width < 768) viewport.mobile++
      else if (event.width < 1024) viewport.tablet++
      else viewport.desktop++

      if (bucket) {
        bucket.views++
        let seen = sessionsPerDay.get(key)
        if (!seen) {
          seen = new Set()
          sessionsPerDay.set(key, seen)
        }
        seen.add(event.session)
      }
    } else if (event.type === 'doc') {
      docRequests++
      docs.set(event.doc, (docs.get(event.doc) ?? 0) + 1)
    } else {
      inquiries++
      if (event.delivery === 'stored') undelivered++
      if (bucket) bucket.inquiries++
      recentInquiries.push(event)
    }
  }

  for (const [key, seen] of sessionsPerDay) {
    const bucket = buckets.get(key)
    if (bucket) bucket.sessions = seen.size
  }

  const previousSessions = new Set<string>()
  let previousViews = 0
  let previousInquiries = 0
  let previousDocs = 0
  for (const event of previous) {
    if (event.type === 'view') {
      previousViews++
      previousSessions.add(event.session)
    } else if (event.type === 'inquiry') {
      previousInquiries++
    } else {
      previousDocs++
    }
  }

  return {
    days,
    totals: { views, sessions: sessions.size, inquiries, docRequests, undelivered },
    previous: {
      views: previousViews,
      sessions: previousSessions.size,
      inquiries: previousInquiries,
      docRequests: previousDocs,
    },
    perDay: [...buckets.values()],
    topPages: rank(pages, 10),
    topReferrers: rank(referrers, 8),
    topDocs: rank(docs, 8),
    localeSplit: LOCALES.map((locale) => ({ locale, views: localeViews.get(locale) ?? 0 })),
    viewport,
    recentInquiries: recentInquiries.sort((a, b) => b.ts - a.ts).slice(0, 25),
  }
}

/** Percentage change, or null when there is no prior period to compare against. */
export function delta(current: number, previous: number): number | null {
  if (previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}
