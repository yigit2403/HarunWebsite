import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { SectionHead } from '@/components/ui/SectionHead'
import { NAV_LABEL, UI } from '@/content/dict'
import { ABOUT_PAGE, ABOUT_STATEMENT, HOME_CTA, PHOTOS } from '@/content/pages'
import { ADDRESS_LINES, COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

export function AboutPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[{ label: UI.home[locale], url: href(locale) }, { label: NAV_LABEL.about[locale] }]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h1 className="masthead__title">{ABOUT_PAGE.title[locale]}</h1>
          <p className="masthead__lead">{ABOUT_PAGE.lead[locale]}</p>
        </div>
      </section>

      {/* The company story, broken into three passages rather than one block. */}
      <section className="section section--canvas">
        <div className="container split">
          <div className="prose" data-reveal="">
            {ABOUT_PAGE.story[locale].map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <PhotoSlot slot={PHOTOS.manufacturing} locale={locale} />
        </div>
      </section>

      {/* The quality statement carries the section on its own. */}
      <section className="slab slab-band">
        <div className="container statement-band">
          <p className="statement" data-reveal="">
            {ABOUT_STATEMENT.statement[locale]}
          </p>
          <div data-reveal="">
            <h2 className="footer-col__title">{ABOUT_PAGE.quality.title[locale]}</h2>
            <p className="slab-band__body" style={{ marginTop: 0, marginBottom: 'var(--s6)' }}>
              {ABOUT_PAGE.quality.body[locale]}
            </p>
            <ul className="tick-list">
              {ABOUT_PAGE.quality.points[locale].map((point) => (
                <li key={point.slice(0, 40)}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Vision and mission, side by side. */}
      <section className="section section--canvas">
        <div className="container split split--even">
          <div data-reveal="">
            <span className="rule" aria-hidden="true" />
            <h2 className="section-head__title">{ABOUT_PAGE.vision.title[locale]}</h2>
            <p className="section-head__lead" style={{ marginBottom: 'var(--s6)' }}>
              {ABOUT_PAGE.vision.body[locale]}
            </p>
            <ul className="tick-list">
              {ABOUT_PAGE.vision.points[locale].map((point) => (
                <li key={point.slice(0, 40)}>{point}</li>
              ))}
            </ul>
          </div>

          <div data-reveal="">
            <span className="rule" aria-hidden="true" />
            <h2 className="section-head__title">{ABOUT_PAGE.mission.title[locale]}</h2>
            <p className="section-head__lead" style={{ marginBottom: 'var(--s6)' }}>
              {ABOUT_PAGE.mission.body[locale]}
            </p>
            <ul className="tick-list">
              {ABOUT_PAGE.mission.points[locale].map((point) => (
                <li key={point.slice(0, 40)}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Where the company actually is. */}
      <section className="section section--cloud section--tight">
        <div className="container">
          <SectionHead title={locale === 'tr' ? 'Merkez ve üretim' : 'Head office and production'} />
          <div className="figures">
            <div className="figure-item" data-reveal="">
              <span className="figure-item__label" style={{ marginTop: 0 }}>
                <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 4 }}>
                  {COMPANY.legalName}
                </strong>
                {ADDRESS_LINES[locale].join(', ')}
              </span>
            </div>
            <div className="figure-item" data-reveal="">
              <span className="figure-item__label" style={{ marginTop: 0 }}>
                <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 4 }}>
                  {UI.phone[locale]}
                </strong>
                <a href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>
              </span>
            </div>
            <div className="figure-item" data-reveal="">
              <span className="figure-item__label" style={{ marginTop: 0 }}>
                <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 4 }}>
                  {UI.web[locale]}
                </strong>
                {COMPANY.sites.map((s) => (
                  <a key={s.href} href={s.href} rel="noopener" style={{ display: 'block' }}>
                    {s.label}
                  </a>
                ))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        locale={locale}
        surface="canvas"
        title={HOME_CTA.title[locale]}
        body={HOME_CTA.body[locale]}
      />
    </>
  )
}
