import type { Locale } from '@/lib/i18n'

/**
 * First-party analytics events.
 *
 * No cookies, no IP address, no cross-site identifier. A "session" is a random
 * id held in sessionStorage: it disappears when the tab closes and cannot be
 * used to recognise the same person on a later visit or on another site.
 * Because nothing here identifies a person, the site needs no consent banner.
 */

export type ViewEvent = {
  type: 'view'
  ts: number
  /** Pathname only. Query strings are dropped before the event is stored. */
  path: string
  locale: Locale
  /** Referring host, or null for direct and same-site navigation. */
  ref: string | null
  session: string
  /** Viewport width bucket, for deciding how much mobile work is worth doing. */
  width: number
}

/**
 * A document someone asked for. The library is not published yet, so this is
 * the most useful signal on the site: it says which document to produce first.
 */
export type DocEvent = {
  type: 'doc'
  ts: number
  doc: string
  locale: Locale
  session: string
}

export type InquiryEvent = {
  type: 'inquiry'
  ts: number
  locale: Locale
  fields: Record<string, string>
  /** How the inquiry left the building, if it did. */
  delivery: 'mail' | 'webhook' | 'stored'
}

export type AnalyticsEvent = ViewEvent | DocEvent | InquiryEvent

export const MAX_EVENTS = 20_000
