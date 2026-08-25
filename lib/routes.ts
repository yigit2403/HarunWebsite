import { LOCALES, type Locale, type Localised } from './i18n'

/**
 * Localised URL structure.
 *
 *   /tr/urunler/lql-100        /en/products/lql-100
 *   /tr/uygulamalar/sut        /en/applications/dairy
 *
 * One table drives routing, the header, the footer, the sitemap and the
 * language switcher. Adding a page means adding one row here.
 */

export const PAGE_KEYS = [
  'products',
  'rotors',
  'applications',
  'engineering',
  'about',
  'support',
  'contact',
] as const

export type PageKey = (typeof PAGE_KEYS)[number]

export const SEGMENTS: Record<PageKey, Localised> = {
  products: { tr: 'urunler', en: 'products' },
  rotors: { tr: 'rotor-teknolojileri', en: 'rotor-technologies' },
  applications: { tr: 'uygulamalar', en: 'applications' },
  engineering: { tr: 'muhendislik', en: 'engineering' },
  about: { tr: 'kurumsal', en: 'about' },
  support: { tr: 'teknik-kaynaklar', en: 'technical-resources' },
  contact: { tr: 'iletisim', en: 'contact' },
}

/** The anchor on the contact page that holds the technical inquiry form. */
export const INQUIRY_ANCHOR: Localised = { tr: 'teknik-talep', en: 'technical-inquiry' }

export function home(locale: Locale): string {
  return `/${locale}`
}

/** Build a localised path: href('tr', 'products', 'lql-100') -> /tr/urunler/lql-100 */
export function href(locale: Locale, page?: PageKey, ...rest: string[]): string {
  if (!page) return home(locale)
  const parts = [locale, SEGMENTS[page][locale], ...rest.filter(Boolean)]
  return `/${parts.join('/')}`
}

/**
 * The technical inquiry form.
 *
 * `doc` names a document the visitor asked for. It travels as a query
 * parameter so the form can say what it is answering and the inquiry names it
 * on arrival. No document is served as a file yet, so this is the only record
 * of which one to produce first.
 */
export function inquiryHref(locale: Locale, doc?: string): string {
  const query = doc ? `?doc=${encodeURIComponent(doc)}` : ''
  return `${href(locale, 'contact')}${query}#${INQUIRY_ANCHOR[locale]}`
}

/** Reverse lookup for the router and the language switcher. */
export function pageKeyFromSegment(locale: Locale, segment: string): PageKey | null {
  for (const key of PAGE_KEYS) {
    if (SEGMENTS[key][locale] === segment) return key
  }
  return null
}

/** Every page key, in the order they appear in the primary navigation. */
export const NAV_ORDER: PageKey[] = [
  'products',
  'rotors',
  'applications',
  'engineering',
  'about',
  'support',
]

export function allLocales(): readonly Locale[] {
  return LOCALES
}
