import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { JsonLd } from '@/components/ui/JsonLd'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { ProductImage } from '@/components/ui/ProductImage'
import { APPLICATIONS } from '@/content/applications'
import { NAV_LABEL, UI } from '@/content/dict'
import { GEAR_PHOTOS, GEAR_PUMP, GEAR_PUMP_HEADINGS as H } from '@/content/gear-pump'
import { HOME_CTA } from '@/content/pages'
import { COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { href, inquiryHref } from '@/lib/routes'
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo'

/**
 * The internal gear pump. Laid out like an LQL model page so the two pump
 * types read as one range, but with no key specifications and no data table:
 * no figures have been issued for this pump, and an empty table would look
 * like an omission where a plain sentence reads as a fact.
 */
export function GearPumpPage({ locale }: { locale: Locale }) {
  const url = href(locale, 'products', GEAR_PUMP.slug[locale])
  const usedIn = GEAR_PUMP.applications
    .map((key) => APPLICATIONS.find((a) => a.key === key))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: UI.home[locale], url: href(locale) },
          { label: NAV_LABEL.products[locale], url: href(locale, 'products') },
          { label: GEAR_PUMP.name[locale] },
        ]}
      />

      <section className="product-hero">
        <div className="container product-hero__grid">
          <figure className="tech-frame tech-frame--product">
            <ProductImage
              locale={locale}
              image={{ src: GEAR_PHOTOS.side.src!, width: 1690, height: 931, alt: GEAR_PHOTOS.side.label }}
              priority
              sizes="(min-width: 64rem) 52vw, 92vw"
            />
            <figcaption className="tech-frame__caption">
              {GEAR_PUMP.name[locale]} · {GEAR_PUMP.type[locale]}
            </figcaption>
          </figure>

          <div>
            <span className="rule" aria-hidden="true" />
            <span className="product-hero__series" lang="en">{COMPANY.brand}</span>
            <h1 className="product-hero__name">{GEAR_PUMP.name[locale]}</h1>
            <p className="product-hero__type">{GEAR_PUMP.type[locale]}</p>
            <p className="product-hero__desc">{GEAR_PUMP.summary[locale]}</p>

            <div className="btn-row" style={{ marginTop: 'var(--s8)' }}>
              <Link className="btn btn--primary" href={inquiryHref(locale)}>
                {UI.ctaSupport[locale]}
                <IconArrowRight size={18} stroke={2} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="product-section" id="overview">
          <h2 className="product-section__title">{H.overview[locale]}</h2>
          <div className="prose" data-reveal="">
            {GEAR_PUMP.overview[locale].map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="product-section" id="principle">
          <h2 className="product-section__title">{H.principle[locale]}</h2>
          <ol className="principle__steps" data-reveal="">
            {GEAR_PUMP.principle.map((step, index) => (
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
        </section>

        <section className="product-section" id="advantages">
          <h2 className="product-section__title">{H.advantages[locale]}</h2>
          <div className="matrix">
            {GEAR_PUMP.advantages.map((item) => (
              <div className="matrix__item" key={item.term.en} data-reveal="">
                <h3 className="matrix__term">{item.term[locale]}</h3>
                <p className="matrix__def">{item.def[locale]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="product-section" id="applications">
          <h2 className="product-section__title">{H.applications[locale]}</h2>
          <div className="app-model-list" data-reveal="">
            {usedIn.map((app) => (
              <Link
                className="app-model"
                key={app.key}
                href={href(locale, 'applications', app.slug[locale])}
              >
                <span className="app-model__name">{app.name[locale]}</span>
                <span className="app-model__note">{app.fluids[locale]}</span>
              </Link>
            ))}
          </div>
          <ul className="tick-list" style={{ marginTop: 'var(--s8)' }} data-reveal="">
            {GEAR_PUMP.otherIndustries[locale].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="callout" style={{ marginTop: 'var(--s10)' }} data-reveal="">
            <strong>{GEAR_PUMP.versusLobe.title[locale]}</strong> {GEAR_PUMP.versusLobe.body[locale]}
          </div>
        </section>

        <section className="product-section" id="views">
          <h2 className="product-section__title">{H.gallery[locale]}</h2>
          <div className="grid grid--2">
            <figure data-reveal="">
              <PhotoSlot slot={GEAR_PHOTOS.set} locale={locale} sizes="(min-width: 40rem) 46vw, 92vw" />
            </figure>
            <figure data-reveal="">
              <PhotoSlot slot={GEAR_PHOTOS.front} locale={locale} sizes="(min-width: 40rem) 46vw, 92vw" />
            </figure>
          </div>
        </section>

        <section className="product-section" id="technical">
          <h2 className="product-section__title">{H.data[locale]}</h2>
          <div className="callout" data-reveal="">{GEAR_PUMP.dataNote[locale]}</div>
          <div className="btn-row" style={{ marginTop: 'var(--s8)' }}>
            <Link className="btn btn--secondary" href={inquiryHref(locale)}>
              {UI.ctaSupport[locale]}
              <IconArrowRight size={18} stroke={2} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

      <CtaBand locale={locale} title={HOME_CTA.title[locale]} body={HOME_CTA.body[locale]} />

      <JsonLd
        data={productJsonLd({
          name: `${COMPANY.brand} ${GEAR_PUMP.name[locale]}`,
          description: GEAR_PUMP.summary[locale],
          category: GEAR_PUMP.type[locale],
          url,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: UI.home[locale], url: href(locale) },
          { name: NAV_LABEL.products[locale], url: href(locale, 'products') },
          { name: GEAR_PUMP.name[locale], url },
        ])}
      />
    </>
  )
}
