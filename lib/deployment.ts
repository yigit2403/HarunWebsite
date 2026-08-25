/**
 * What this build is, and whether search engines should see it.
 *
 * The site is exported as static files, so these questions are answered once,
 * at build time, and baked into robots.txt and every page's metadata. There is
 * no request to reconsider them on.
 *
 * A customer-review copy on a temporary hosting address is the single easiest
 * way to damage a site's launch: Google indexes the review copy, and once the
 * real domain goes live the two compete over duplicate content. Everything
 * here exists to make that impossible by default rather than by remembering to
 * tick a box — a build with nothing set is a build that no crawler will touch.
 */

export type Stage = 'production' | 'preview' | 'development'

export function stage(): Stage {
  // SITE_STAGE is what this site's builds set. VERCEL_ENV is read as well so
  // that a move back to a Node host on Vercel needs no change here.
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
