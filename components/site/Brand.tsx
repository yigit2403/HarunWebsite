import Image from 'next/image'
import Link from 'next/link'

import logo from '@/assets/brand/liquilob-logo.webp'
import { COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { home } from '@/lib/routes'

/**
 * Brand lockup.
 *
 * This is Profimann's supplied logo artwork, not a reconstruction: the
 * wordmark has a bespoke Q and a fixed relationship to its red field, and both
 * are lost the moment it is re-set in a system typeface.
 *
 * The supplied file carries a wide red margin that left the wordmark at half
 * the plate height, and the BY PROFIMANN endorsement illegible in a 40px
 * header. It has been cropped to its ink with even padding, which renders the
 * wordmark around 40% larger in the same space without altering the mark.
 *
 * Imported statically so Next.js knows the intrinsic size and reserves the
 * space, keeping the header out of the layout-shift budget.
 */
export function Brand({ locale, footer = false }: { locale: Locale; footer?: boolean }) {
  const mark = (
    <Image
      src={logo}
      alt={`${COMPANY.brand} ${COMPANY.brandEndorsement.toLowerCase()}`}
      className="brand__mark"
      sizes="200px"
      priority={!footer}
    />
  )

  if (footer) {
    return (
      <span className="brand">
        {mark}
        <span className="sr-only">{COMPANY.legalName}</span>
      </span>
    )
  }

  return (
    <Link className="brand" href={home(locale)} aria-label={`${COMPANY.brand} ${COMPANY.legalName}`}>
      {mark}
    </Link>
  )
}
