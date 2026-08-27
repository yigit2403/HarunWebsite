import Link from 'next/link'
import type { Metadata, Viewport } from 'next'

import './globals.css'

import { mono, sans } from './fonts'
import { UI } from '@/content/dict'
import { COMPANY } from '@/content/site'
import { DEFAULT_LOCALE, LOCALE_TAG } from '@/lib/i18n'

/**
 * Root-level 404. In production this is out/404.html, which .htaccess serves
 * for every path that matches no file — so despite living outside the locale
 * tree, this is the 404 a visitor actually sees. It owns its own document
 * shell (the root layout is a pass-through), which is why it must attach the
 * font classes itself: without them the CSS font tokens resolve to nothing and
 * the page falls back to the browser's default serif.
 */

export const metadata: Metadata = {
  title: `${UI.notFoundTitle[DEFAULT_LOCALE]} · ${COMPANY.brand}`,
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export default function RootNotFound() {
  const locale = DEFAULT_LOCALE
  return (
    <html lang={LOCALE_TAG[locale]} className={`${sans.variable} ${mono.variable}`}>
      <body>
        <main className="container notfound">
          <span className="notfound__code">404</span>
          <h1 className="masthead__title">{UI.notFoundTitle[locale]}</h1>
          <p className="masthead__lead" style={{ marginTop: 0 }}>
            {UI.notFoundBody[locale]}
          </p>
          <Link className="btn btn--primary" href={`/${locale}`}>
            {UI.backHome[locale]}
          </Link>
        </main>
      </body>
    </html>
  )
}
