import { NextResponse } from 'next/server'

import { analyticsStore } from '@/server/analytics/store'
import type { AnalyticsEvent } from '@/server/analytics/types'
import { isLocale } from '@/lib/i18n'

/**
 * Analytics beacon.
 *
 * Accepts a view or a document-request event and nothing else. Every field is
 * validated and clamped here rather than trusted, because this endpoint is
 * public: a bad actor can post to it, so it must not be possible to store
 * arbitrary strings or to grow the log without bound.
 *
 * Deliberately stores no IP address and sets no cookie.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_PATH = 200
const MAX_REF = 100
const MAX_DOC = 80

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/** Referrer is reduced to a bare hostname. Full URLs can carry personal data. */
function refHost(value: unknown, selfHost: string): string | null {
  const raw = str(value, 500)
  if (!raw) return null
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '')
    if (!host || host === selfHost.replace(/^www\./, '')) return null
    return host.slice(0, MAX_REF)
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  const locale = str(body.locale, 5)
  if (!isLocale(locale)) return new NextResponse(null, { status: 204 })

  const session = str(body.session, 40)
  if (!/^[a-z0-9]{8,40}$/i.test(session)) return new NextResponse(null, { status: 204 })

  const ts = Date.now()
  const store = analyticsStore()
  let event: AnalyticsEvent

  if (body.type === 'doc') {
    const doc = str(body.doc, MAX_DOC)
    if (!doc) return new NextResponse(null, { status: 204 })
    event = { type: 'doc', ts, doc, locale, session }
  } else {
    // Query strings are dropped: they are the most common way personal data
    // leaks into an analytics log.
    const path = str(body.path, MAX_PATH).split('?')[0].split('#')[0]
    if (!path.startsWith('/')) return new NextResponse(null, { status: 204 })
    const width = Math.min(Math.max(Number(body.width) || 0, 0), 10_000)
    const selfHost = new URL(request.url).hostname
    event = { type: 'view', ts, path, locale, ref: refHost(body.ref, selfHost), session, width }
  }

  try {
    await store.append(event)
  } catch (error) {
    // Analytics must never break the page it is measuring.
    console.error('[collect] append failed', error)
  }

  return new NextResponse(null, { status: 204 })
}
