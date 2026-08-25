export const LOCALES = ['tr', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'tr'

/** Full BCP 47 tags, used for <html lang>, hreflang and Open Graph. */
export const LOCALE_TAG: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-GB',
}

export const LOCALE_NAME: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/** A value that exists in both languages. Every string on this site is one. */
export type Localised<T = string> = Record<Locale, T>

export function pick<T>(value: Localised<T>, locale: Locale): T {
  return value[locale]
}
