import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { RotorProfile } from '@/components/graphics/RotorSection'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { SectionHead } from '@/components/ui/SectionHead'
import { APPLICATIONS } from '@/content/applications'
import { NAV_LABEL, UI } from '@/content/dict'
import { HOME_CTA, PHOTOS } from '@/content/pages'
import { ROTORS_CONTENT, ROTOR_CLOSING, ROTOR_INTRO, ROTOR_QUALITY } from '@/content/rotors'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

const TITLE = { tr: 'Rotor Teknolojileri', en: 'Rotor Technologies' } as const
const USED_IN = { tr: 'Kullanıldığı alanlar', en: 'Specified for' } as const
const QUALITY_TITLE = { tr: 'Her rotorda ortak olan', en: 'Common to every rotor' } as const
const COMPARE = {
  tr: 'Dört geometri, tek hidrolik prensip',
  en: 'Four geometries, one hydraulic principle',
} as const
const COMPARE_LEAD = {
  tr: 'Aşağıdaki kesitler ölçekli ve aynı gövde çapına göre çizilmiştir; aradaki fark rotorun kendisidir. Lob sayısı arttıkça devir başına açılan hücre sayısı artar, hücre hacmi küçülür ve akış hassaslaşır. Azaldıkça hücre büyür ve parçacık taşıma kabiliyeti artar.',
  en: 'The sections below are drawn to scale against the same bore diameter, so the only thing changing is the rotor. As the lobe count rises, more cells open per revolution, each carries less volume and the flow becomes finer. As it falls, the cells grow and the pump carries larger particles.',
} as const

export function RotorsPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[{ label: UI.home[locale], url: href(locale) }, { label: NAV_LABEL.rotors[locale] }]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h1 className="masthead__title">{TITLE[locale]}</h1>
          <p className="masthead__lead">{ROTOR_INTRO[locale]}</p>
        </div>
      </section>

      {/* The real rotor family, then the same four drawn to a common scale. */}
      <section className="section section--tight section--canvas">
        <div className="container">
          <figure data-reveal="">
            <PhotoSlot slot={PHOTOS.rotorFamily} locale={locale} sizes="(min-width: 82.5rem) 1240px, 94vw" />
          </figure>
        </div>
      </section>

      <section className="section section--cloud">
        <div className="container">
          <SectionHead title={COMPARE[locale]} lead={COMPARE_LEAD[locale]} />
          <ol className="rotor-strip">
            {ROTORS_CONTENT.map((rotor) => (
              <li className="rotor-strip__item" key={rotor.key} data-reveal="">
                <RotorProfile rotor={rotor.key} title={rotor.name[locale]} />
                <h3 className="rotor-strip__name">{rotor.name[locale]}</h3>
                <p className="rotor-strip__latin">{rotor.latin}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* One card per geometry. */}
      <section className="section section--canvas">
        <div className="container">
          <div className="rotor-grid">
            {ROTORS_CONTENT.map((rotor) => {
              const used = rotor.applications
                .map((key) => APPLICATIONS.find((a) => a.key === key))
                .filter((a): a is NonNullable<typeof a> => Boolean(a))

              return (
                <article className="rotor-card" key={rotor.key} id={rotor.slug} data-reveal="">
                  <div className="rotor-card__head">
                    <span className="rule" aria-hidden="true" />
                    <h2 className="rotor-card__name">{rotor.name[locale]}</h2>
                    <p className="rotor-card__latin">{rotor.latin}</p>
                  </div>

                  <p className="rotor-card__summary">{rotor.summary[locale]}</p>
                  <p className="rotor-card__body">{rotor.body[locale]}</p>

                  <ul className="tick-list rotor-card__points">
                    {rotor.points[locale].map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <div className="rotor-card__used">
                    <span className="rotor-card__used-label">{USED_IN[locale]}</span>
                    <div className="rotor-card__links">
                      {used.map((app) => (
                        <Link key={app.key} href={href(locale, 'applications', app.slug[locale])}>
                          {app.name[locale]}
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* What every rotor shares, on the dark band. */}
      <section className="slab slab-band">
        <div className="container statement-band statement-band--centred">
          <p className="statement" data-reveal="">
            {ROTOR_CLOSING[locale]}
          </p>
          <div data-reveal="">
            <h2 className="footer-col__title">{QUALITY_TITLE[locale]}</h2>
            <ul className="tick-list">
              {ROTOR_QUALITY[locale].map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link
              className="link-arrow"
              href={href(locale, 'products')}
              style={{ marginTop: 'var(--s8)' }}
            >
              {UI.ctaProducts[locale]}
              <IconArrowRight size={18} stroke={2} aria-hidden="true" />
            </Link>
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
