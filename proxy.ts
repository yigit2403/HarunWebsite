import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'

/**
 * Two jobs.
 *
 * 1. Locale. The site has no unlocalised routes: every page lives under /tr or
 *    /en so search engines index one canonical address per language. A bare
 *    path is sent to /tr, or to /en when the browser asks for English. Turkish
 *    is the default because the company, its address and its home market are
 *    Turkish.
 *
 * 2. The admin panel. /admin is not part of the public site: it is not
 *    localised, not in the sitemap, and it is behind HTTP Basic auth. With
 *    ADMIN_PASSWORD unset the panel refuses to serve at all rather than
 *    standing open, so forgetting to configure it fails closed.
 */

const ADMIN_REALM = 'Liquilob admin'

/** Constant-time compare, so a wrong password cannot be found a byte at a time. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function unauthorised(): NextResponse {
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'www-authenticate': `Basic realm="${ADMIN_REALM}", charset="UTF-8"` },
  })
}

function requireAdmin(request: NextRequest): NextResponse {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    return new NextResponse(
      'The admin panel is not configured. Set ADMIN_PASSWORD to enable it.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    )
  }

  const header = request.headers.get('authorization') ?? ''
  if (!header.startsWith('Basic ')) return unauthorised()

  let decoded: string
  try {
    decoded = atob(header.slice(6))
  } catch {
    return unauthorised()
  }

  const separator = decoded.indexOf(':')
  if (separator < 0) return unauthorised()

  const user = decoded.slice(0, separator)
  const pass = decoded.slice(separator + 1)
  const expectedUser = process.env.ADMIN_USER || 'admin'

  if (!safeEqual(user, expectedUser) || !safeEqual(pass, password)) return unauthorised()

  const response = NextResponse.next()
  response.headers.set('x-robots-tag', 'noindex, nofollow')
  return response
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return requireAdmin(request)
  }

  // API routes and framework assets are never locale-redirected.
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

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
    '/((?!_next/static|_next/image|photos|favicon\\.ico|icon\\.svg|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|pdf|dwg)$).*)',
  ],
}
