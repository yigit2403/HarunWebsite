import type { MetadataRoute } from 'next'

import { COMPANY } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${COMPANY.origin}/sitemap.xml`,
    host: COMPANY.origin,
  }
}
