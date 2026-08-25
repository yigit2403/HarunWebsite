/**
 * Where this build is running, and whether search engines should see it.
 *
 * A customer-review deployment on a *.vercel.app URL is the single easiest way
 * to damage a site's launch: Google indexes the staging copy, and once the real
 * domain goes live the two compete with each other over duplicate content.
 * Everything here exists to make that impossible by default rather than by
 * remembering to tick a box.
 */

export type Stage = 'production' | 'preview' | 'development'

export function stage(): Stage {
  // Vercel sets VERCEL_ENV. Anything self-hosted can set SITE_STAGE.
  const explicit = process.env.SITE_STAGE ?? process.env.VERCEL_ENV
  if (explicit === 'production') return 'production'
  if (explicit === 'preview') return 'preview'
  if (explicit) return 'development'
  return process.env.NODE_ENV === 'production' ? 'production' : 'development'
}

/**
 * Indexing is allowed only on a production build that has been told its real
 * public address. A preview never qualifies, and neither does a production
 * build still pointing at the placeholder origin.
 */
export function isIndexable(): boolean {
  return stage() === 'production' && Boolean(process.env.NEXT_PUBLIC_SITE_URL)
}

/**
 * Canonical origin, in order of confidence:
 *   1. NEXT_PUBLIC_SITE_URL, set deliberately
 *   2. the Vercel deployment URL, so a preview's canonicals and sitemap point
 *      at the preview rather than at a domain that does not exist yet
 *   3. the intended production domain, as a last resort
 */
export function origin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`

  return 'https://www.liquilob.com'
}
