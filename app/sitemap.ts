import type { MetadataRoute } from 'next'

import { APPLICATIONS } from '@/content/applications'
import { PRODUCTS } from '@/content/products'
import { COMPANY } from '@/content/site'
import { LOCALES, type Locale } from '@/lib/i18n'
import { PAGE_KEYS, href } from '@/lib/routes'

/**
 * Every page in both languages, each entry declaring its counterpart through
 * `alternates.languages` so the two versions are treated as one document.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const absolute = (path: string) => `${COMPANY.origin}${path}`

  const pairs: { tr: string; en: string; priority: number }[] = [
    { tr: href('tr'), en: href('en'), priority: 1 },
  ]

  for (const key of PAGE_KEYS) {
    pairs.push({ tr: href('tr', key), en: href('en', key), priority: 0.8 })
  }
  for (const product of PRODUCTS) {
    pairs.push({
      tr: href('tr', 'products', product.slug),
      en: href('en', 'products', product.slug),
      priority: 0.9,
    })
  }
  for (const app of APPLICATIONS) {
    pairs.push({
      tr: href('tr', 'applications', app.slug.tr),
      en: href('en', 'applications', app.slug.en),
      priority: 0.7,
    })
  }

  for (const pair of pairs) {
    for (const locale of LOCALES) {
      entries.push({
        url: absolute(pair[locale as Locale]),
        changeFrequency: 'monthly',
        priority: pair.priority,
        alternates: { languages: { tr: absolute(pair.tr), en: absolute(pair.en) } },
      })
    }
  }

  return entries
}
