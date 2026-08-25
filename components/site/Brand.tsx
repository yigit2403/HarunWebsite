import Link from 'next/link'

import { COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { home } from '@/lib/routes'

/**
 * Brand lockup rebuilt from the business card: the solid red block, the
 * LIQUILOB wordmark in heavy black, and the BY PROFIMANN endorsement beneath
 * it. Set in the site's own typeface rather than shipped as an image, so it
 * stays sharp at any size and inverts cleanly on the dark footer.
 */
export function Brand({ locale, footer = false }: { locale: Locale; footer?: boolean }) {
  const content = (
    <>
      <span className="brand__block" aria-hidden="true" />
      <span className="brand__names">
        <span className="brand__primary">{COMPANY.brand.toUpperCase()}</span>
        <span className="brand__sub">{COMPANY.brandEndorsement}</span>
      </span>
    </>
  )

  if (footer) {
    return (
      <span className="brand">
        {content}
        <span className="sr-only">{COMPANY.legalName}</span>
      </span>
    )
  }

  return (
    <Link className="brand" href={home(locale)} aria-label={`${COMPANY.brand} ${COMPANY.legalName}`}>
      {content}
    </Link>
  )
}
