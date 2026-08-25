import Link from 'next/link'

import { UI } from '@/content/dict'
import { DEFAULT_LOCALE } from '@/lib/i18n'
import { home } from '@/lib/routes'

/**
 * Localised 404. Rendered inside the locale layout, so the header, footer and
 * language switcher all stay available rather than dropping the visitor onto a
 * bare page. The locale segment is not readable from a not-found boundary, so
 * this falls back to the site default.
 */
export default function NotFound() {
  const locale = DEFAULT_LOCALE
  return (
    <div className="container notfound">
      <span className="notfound__code">404</span>
      <h1 className="masthead__title">{UI.notFoundTitle[locale]}</h1>
      <p className="masthead__lead" style={{ marginTop: 0 }}>
        {UI.notFoundBody[locale]}
      </p>
      <Link className="btn btn--primary" href={home(locale)}>
        {UI.backHome[locale]}
      </Link>
    </div>
  )
}
