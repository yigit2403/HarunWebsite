'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { APPLICATIONS } from '@/content/applications'
import { UI } from '@/content/dict'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { PAGE_KEYS, SEGMENTS } from '@/lib/routes'

/**
 * Switches language while staying on the same page.
 *
 * URL segments are localised (/tr/urunler <-> /en/products), so the current
 * path is translated segment by segment rather than swapping the locale prefix
 * and dropping the reader on the wrong page. Anything it cannot translate
 * falls back to the home page of the target language instead of a 404.
 */
function translatePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean)
  const [current, section, detail] = parts

  if (!current || !isLocale(current)) return `/${target}`
  if (!section) return `/${target}`

  const pageKey = PAGE_KEYS.find((key) => SEGMENTS[key][current] === section)
  if (!pageKey) return `/${target}`

  const translatedSection = SEGMENTS[pageKey][target]
  if (!detail) return `/${target}/${translatedSection}`

  // Model codes are identical in both languages. Application slugs are not.
  if (pageKey === 'applications') {
    const app = APPLICATIONS.find((a) => a.slug[current] === detail)
    if (!app) return `/${target}/${translatedSection}`
    return `/${target}/${translatedSection}/${app.slug[target]}`
  }

  return `/${target}/${translatedSection}/${detail}`
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`

  return (
    <div className="lang" role="group" aria-label={UI.language[locale]}>
      {LOCALES.map((option) => {
        const isCurrent = option === locale
        return (
          <Link
            key={option}
            className="lang__opt"
            href={translatePath(pathname, option)}
            hrefLang={option}
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={option === 'tr' ? 'Türkçe' : 'English'}
          >
            {option.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}
