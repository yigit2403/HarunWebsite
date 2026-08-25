import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { UI } from '@/content/dict'
import { COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { inquiryHref } from '@/lib/routes'

/**
 * Closing technical inquiry band. One primary action, and the phone number
 * beside it as a second route rather than a second button competing with the
 * first. The same pair closes every page on the site.
 */
export function CtaBand({
  locale,
  title,
  body,
  surface = 'cloud',
}: {
  locale: Locale
  title: string
  body: string
  /** Pick the surface that does not repeat the band directly above it. */
  surface?: 'cloud' | 'canvas'
}) {
  return (
    <section className={surface === 'canvas' ? 'cta-band cta-band--canvas' : 'cta-band'}>
      <div className="container cta-band__inner">
        <div data-reveal="">
          <span className="rule" aria-hidden="true" />
          <h2 className="cta-band__title">{title}</h2>
          <p className="cta-band__body">{body}</p>
          <div className="btn-row" style={{ marginTop: 'var(--s8)' }}>
            <Link className="btn btn--primary" href={inquiryHref(locale)}>
              {UI.ctaSupport[locale]}
              <IconArrowRight size={18} stroke={2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="cta-band__aside" data-reveal="">
          <div>
            <span className="cta-band__phone-label">{UI.callUs[locale]}</span>
            <a className="cta-band__phone" href={COMPANY.phoneHref}>
              {COMPANY.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
