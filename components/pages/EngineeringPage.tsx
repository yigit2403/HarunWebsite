import { RotorSection } from '@/components/graphics/RotorSection'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { SectionHead } from '@/components/ui/SectionHead'
import { NAV_LABEL, UI } from '@/content/dict'
import { ENGINEERING_BAND, ENGINEERING_PAGE, HOME_CTA, PHOTOS, PRINCIPLE } from '@/content/pages'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

export function EngineeringPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: UI.home[locale], url: href(locale) },
          { label: NAV_LABEL.engineering[locale] },
        ]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h1 className="masthead__title">{ENGINEERING_PAGE.title[locale]}</h1>
          <p className="masthead__lead">{ENGINEERING_PAGE.lead[locale]}</p>
        </div>
      </section>

      {/* Philosophy, set against the general arrangement of the pump set. */}
      <section className="section section--canvas">
        <div className="container split">
          <div className="prose" data-reveal="">
            {ENGINEERING_PAGE.philosophy[locale].map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <PhotoSlot slot={PHOTOS.unitDrawing} locale={locale} />
        </div>
      </section>

      {/* Capability matrix. */}
      <section className="section section--cloud">
        <div className="container">
          <SectionHead title={ENGINEERING_PAGE.capabilities.title[locale]} />
          {/* Four divided columns, so this section does not read the same as
              the 2x2 selection matrix further down the page. */}
          <div className="pillars">
            {ENGINEERING_PAGE.capabilities.items.map((item) => (
              <div className="pillar" key={item.term.en} data-reveal="">
                <span className="pillar__mark" aria-hidden="true" />
                <h3 className="pillar__title">{item.term[locale]}</h3>
                <p className="pillar__body">{item.def[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Working principle, with the section drawing. */}
      <section className="section section--canvas">
        <div className="container principle">
          <figure className="tech-frame" data-reveal="">
            <RotorSection
              title={PRINCIPLE.drawingCaption[locale]}
              labels={{
                suction: locale === 'tr' ? 'Emme' : 'Suction',
                discharge: locale === 'tr' ? 'Basma' : 'Discharge',
              }}
            />
            <figcaption className="tech-frame__caption">{PRINCIPLE.drawingCaption[locale]}</figcaption>
          </figure>

          <div data-reveal="">
            <span className="rule" aria-hidden="true" />
            <h2 className="section-head__title">{PRINCIPLE.title[locale]}</h2>
            <p className="section-head__lead" style={{ marginBottom: 'var(--s8)' }}>
              {PRINCIPLE.lead[locale]}
            </p>
            <ol className="principle__steps">
              {PRINCIPLE.steps.map((step, index) => (
                <li className="principle__step" key={step.title.en}>
                  <span className="principle__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{step.title[locale]}</h3>
                    <p>{step.body[locale]}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Selection method, on the dark band. */}
      <section className="slab slab-band">
        <div className="container">
          <div className="slab-band__grid">
            <div data-reveal="">
              <span className="rule" aria-hidden="true" />
              <h2 className="slab-band__title">{ENGINEERING_PAGE.selection.title[locale]}</h2>
              <p className="slab-band__body">{ENGINEERING_PAGE.selection.lead[locale]}</p>
            </div>
            <div className="statement" data-reveal="">
              {ENGINEERING_BAND.body[locale]}
            </div>
          </div>

          <div className="matrix slab-band__figures">
            {ENGINEERING_PAGE.selection.steps.map((step, index) => (
              <div className="matrix__item" key={step.title.en} data-reveal="">
                <span className="matrix__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="matrix__term">{step.title[locale]}</h3>
                <p className="matrix__def">{step.body[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} title={HOME_CTA.title[locale]} body={HOME_CTA.body[locale]} />
    </>
  )
}
