import Link from 'next/link'

import './globals.css'

import { DEFAULT_LOCALE, LOCALE_TAG } from '@/lib/i18n'
import { UI } from '@/content/dict'

/**
 * Root-level 404, reached only for paths outside any locale segment. The root
 * layout is a pass-through, so this page owns its own document shell.
 */
export default function RootNotFound() {
  const locale = DEFAULT_LOCALE
  return (
    <html lang={LOCALE_TAG[locale]}>
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
