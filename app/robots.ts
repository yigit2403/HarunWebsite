import type { MetadataRoute } from 'next'

import { COMPANY } from '@/content/site'
import { isIndexable } from '@/lib/deployment'

export default function robots(): MetadataRoute.Robots {
  // A customer-review deployment must not be crawled. If it is indexed, the
  // staging copy competes with the real domain the moment that goes live.
  if (!isIndexable()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${COMPANY.origin}/sitemap.xml`,
    host: COMPANY.origin,
  }
}
