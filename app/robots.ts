import type { MetadataRoute } from 'next'

import { COMPANY } from '@/content/site'
import { isIndexable } from '@/lib/deployment'

/**
 * Written once, at build time. The site is exported as static files, so there
 * is no request to vary on: whether crawlers are allowed is decided by the
 * environment the build ran in. See lib/deployment.ts.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  // A customer-review deployment must not be crawled. If it is indexed, the
  // staging copy competes with the real domain the moment that goes live.
  if (!isIndexable()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    // Nothing is excluded: the site is a folder of static pages, and every
    // one of them is meant to be found. The admin panel and the API routes
    // that used to be disallowed here no longer exist — see server/README.md.
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${COMPANY.origin}/sitemap.xml`,
    host: COMPANY.origin,
  }
}
