import type { Metadata } from 'next'

import { COMPANY } from '@/content/site'
import { LOCALES, LOCALE_TAG, type Locale } from '@/lib/i18n'

/**
 * Metadata and structured data helpers. Every page declares its own canonical
 * URL and the hreflang pair, so the Turkish and English versions are linked
 * rather than competing with each other in search results.
 */

export function pageMetadata({
  locale,
  title,
  description,
  path,
  alternatePath,
}: {
  locale: Locale
  title: string
  description: string
  /** Path for the current locale, e.g. /tr/urunler */
  path: string
  /** Path for the other locale. Falls back to the other home page. */
  alternatePath?: string
}): Metadata {
  const other: Locale = locale === 'tr' ? 'en' : 'tr'
  const languages: Record<string, string> = {
    [LOCALE_TAG[locale]]: path,
    [LOCALE_TAG[other]]: alternatePath ?? `/${other}`,
  }

  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: 'website',
      siteName: `${COMPANY.brand} · ${COMPANY.shortName}`,
      title,
      description,
      url: path,
      locale: LOCALE_TAG[locale].replace('-', '_'),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function organizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${COMPANY.origin}/#organization`,
    name: COMPANY.legalName,
    alternateName: [COMPANY.shortName, COMPANY.brand],
    url: COMPANY.origin,
    telephone: COMPANY.phoneDisplay,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.district,
      addressRegion: COMPANY.address.city,
      addressCountry: COMPANY.address.countryCode,
    },
    sameAs: COMPANY.sites.map((s) => s.href),
    inLanguage: LOCALES.map((l) => LOCALE_TAG[l]),
  }
}

export function productJsonLd({
  name,
  description,
  category,
  url,
}: {
  name: string
  description: string
  category: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    category,
    url: `${COMPANY.origin}${url}`,
    brand: { '@type': 'Brand', name: COMPANY.brand },
    manufacturer: { '@type': 'Organization', name: COMPANY.legalName },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${COMPANY.origin}${item.url}`,
    })),
  }
}
