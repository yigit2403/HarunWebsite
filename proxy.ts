import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'

/**
 * Locale redirect, for `next dev` only.
 *
 * The site has no unlocalised routes: every page lives under /tr or /en so
 * search engines index one canonical address per language. A bare path is sent
 * to /tr, or to /en when the browser asks for English. Turkish is the default
 * because the company, its address and its home market are Turkish.
 *
 * IMPORTANT: a static export has no middleware, and the deployed site is a
 * static export. In production this same redirect is performed by Apache, from
 * the rules in public/.htaccess. This file exists so that local development
 * behaves the way the deployed site does; if you change the rule here, change
 * it there too, and vice versa.
 */

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Framework assets are never locale-redirected.
  if (pathname.startsWith('/_next/')) return NextResponse.next()

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const accept = request.headers.get('accept-language')?.toLowerCase() ?? ''
  const prefersEnglish = /(^|,)\s*en\b/.test(accept) && !/(^|,)\s*tr\b/.test(accept)
  const locale = prefersEnglish ? 'en' : DEFAULT_LOCALE

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|photos|favicon\.ico|icon\.svg|robots\.txt|sitemap\.xml|inquiry\.php|inquiry-data\.json|.*\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|pdf|dwg)$).*)',
  ],
}
