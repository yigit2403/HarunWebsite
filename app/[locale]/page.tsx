import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { IconArrowRight, IconArrowUpRight } from '@tabler/icons-react'

import { RotorProfile, RotorSection } from '@/components/graphics/RotorSection'
import { CtaBand } from '@/components/site/CtaBand'
import { ApplicationIcon } from '@/components/ui/ApplicationIcon'
import { BleedBand } from '@/components/ui/BleedBand'
import { DocList } from '@/components/ui/DocList'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductImage } from '@/components/ui/ProductImage'
import { SectionHead } from '@/components/ui/SectionHead'
import { APPLICATIONS } from '@/content/applications'
import { NAV_LABEL, UI } from '@/content/dict'
import {
  ABOUT_STATEMENT,
  APPLICATIONS_SECTION,
  DOCUMENTS,
  ENGINEERING_BAND,
  HERO,
  HOME_CTA,
  PHOTOS,
  PILLARS,
  PRINCIPLE,
  PRODUCTS_SECTION,
  RESOURCES_SECTION,
  UNIT_IMAGE,
} from '@/content/pages'
import { PRODUCTS } from '@/content/products'
import { ROTORS_CONTENT, ROTOR_INTRO } from '@/content/rotors'
import { isLocale, type Locale } from '@/lib/i18n'
import { href, inquiryHref } from '@/lib/routes'
import { pageMetadata } from '@/lib/seo'

const ROTORS_TITLE = {
  tr: 'Dört rotor geometrisi, tek hidrolik prensip',
  en: 'Four rotor geometries, one hydraulic principle',
} as const

const META = {
  tr: {
    title: 'Liquilob Loblu Rotorlu Pompalar · Profimann Makine',
    description:
      'Gıda, süt, kimya, ilaç ve atıksu uygulamaları için Liquilob loblu rotorlu pompalar. Konya üretimi, uluslararası mühendislik pratiği. LQL serisi DN 25 – DN 150.',
  },
  en: {
    title: 'Liquilob Rotary Lobe Pumps · Profimann Makine',
    description:
      'Liquilob rotary lobe pumps for food, dairy, chemical, pharmaceutical and wastewater duties. Manufactured in Konya to international engineering practice. LQL series, DN 25 to DN 150.',
  },
} as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return pageMetadata({
    locale,
    title: META[locale].title,
    description: META[locale].description,
    path: `/${locale}`,
    alternatePath: locale === 'tr' ? '/en' : '/tr',
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  return (
    <>
      {/* 1. Hero. Asymmetric split with the card's red block as a real column. */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__mark" aria-hidden="true" />

          <div className="hero__copy">
            <h1 className="hero__title">
              {HERO.title[locale].map((line) => (
                <span key={line} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="hero__lead">{HERO.lead[locale]}</p>
            <div className="btn-row hero__actions">
              <Link className="btn btn--primary" href={href(locale, 'products')}>
                {UI.ctaProducts[locale]}
                <IconArrowRight size={18} stroke={2} aria-hidden="true" />
              </Link>
              <Link className="btn btn--secondary" href={inquiryHref(locale)}>
                {UI.ctaSupport[locale]}
              </Link>
            </div>
          </div>

          <figure className="tech-frame tech-frame--product">
            <ProductImage
              locale={locale}
              image={UNIT_IMAGE}
              priority
              sizes="(min-width: 64rem) 46vw, 92vw"
            />
            <figcaption className="tech-frame__caption">{HERO.drawingCaption[locale]}</figcaption>
          </figure>
        </div>
      </section>

      {/* 2. Engineering value. Divided columns, not icon cards. */}
      <section className="section section--tight section--cloud">
        <div className="container">
          <div className="pillars">
            {PILLARS.map((pillar) => (
              <div className="pillar" key={pillar.title.en} data-reveal="">
                <span className="pillar__mark" aria-hidden="true" />
                <h2 className="pillar__title">{pillar.title[locale]}</h2>
                <p className="pillar__body">{pillar.body[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product range. Catalogue grid. */}
      <section className="section section--canvas">
        <div className="container">
          <SectionHead
            kicker={PRODUCTS_SECTION.kicker[locale]}
            title={PRODUCTS_SECTION.title[locale]}
            lead={PRODUCTS_SECTION.lead[locale]}
            action={
              <Link className="link-arrow" href={href(locale, 'products')}>
                {UI.allProducts[locale]}
                <IconArrowRight size={18} stroke={2} aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid grid--4">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Rotor family. The product's real differentiator, so it earns a
          section rather than a row in a specification table. */}
      <section className="section section--cloud">
        <div className="container">
          <SectionHead
            title={ROTORS_TITLE[locale]}
            lead={ROTOR_INTRO[locale]}
            action={
              <Link className="link-arrow" href={href(locale, 'rotors')}>
                {NAV_LABEL.rotors[locale]}
                <IconArrowRight size={18} stroke={2} aria-hidden="true" />
              </Link>
            }
          />
          <ol className="rotor-strip">
            {ROTORS_CONTENT.map((rotor) => (
              <li className="rotor-strip__item rotor-strip__item--link" key={rotor.key} data-reveal="">
                <Link href={`${href(locale, 'rotors')}#${rotor.slug}`}>
                  <RotorProfile rotor={rotor.key} title={rotor.name[locale]} />
                  <h3 className="rotor-strip__name">{rotor.name[locale]}</h3>
                  <p className="rotor-strip__latin">{rotor.latin}</p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Working principle. Diagram-led, numbered sequence beside it. */}
      <section className="section section--canvas">
        <div className="container principle">
          <figure className="tech-frame tech-frame--plain" data-reveal="">
            <RotorSection
              title={PRINCIPLE.drawingCaption[locale]}
              labels={{
                suction: locale === 'tr' ? 'Emme' : 'Suction',
                discharge: locale === 'tr' ? 'Basma' : 'Discharge',
              }}
            />
            <figcaption className="tech-frame__caption">
              {PRINCIPLE.drawingCaption[locale]}
            </figcaption>
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

      {/* 6. Applications. Compact tile matrix. */}
      <section className="section section--cloud">
        <div className="container">
          <SectionHead
            kicker={APPLICATIONS_SECTION.kicker[locale]}
            title={APPLICATIONS_SECTION.title[locale]}
            lead={APPLICATIONS_SECTION.lead[locale]}
          />
          <div className="grid grid--3">
            {APPLICATIONS.map((app) => (
              <Link
                className="industry-tile"
                key={app.key}
                href={href(locale, 'applications', app.slug[locale])}
                data-reveal=""
              >
                <ApplicationIcon name={app.icon} className="industry-tile__icon" />
                <h3 className="industry-tile__name">{app.name[locale]}</h3>
                <p className="pillar__body">{app.short[locale]}</p>
                <p className="industry-tile__fluids">{app.fluids[locale]}</p>
                <span className="industry-tile__go">
                  {UI.viewApplication[locale]}
                  <IconArrowRight size={15} stroke={2} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. The one full-width photograph, running straight into the dark
          band so the two read as a single dramatic beat. */}
      <BleedBand slot={PHOTOS.installation} locale={locale} />

      {/* 8. Engineering. The one dark band on the page. */}
      <section className="slab slab-band">
        <div className="container">
          <div className="slab-band__grid slab-band__grid--single">
            <div data-reveal="">
              <span className="rule" aria-hidden="true" />
              <span className="kicker">{ENGINEERING_BAND.kicker[locale]}</span>
              <h2 className="slab-band__title">
                {ENGINEERING_BAND.title[locale].map((line) => (
                  <span key={line} style={{ display: 'block' }}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className="slab-band__body">{ENGINEERING_BAND.body[locale]}</p>
              <div className="btn-row" style={{ marginTop: 'var(--s8)' }}>
                <Link className="btn btn--secondary" href={href(locale, 'engineering')}>
                  {NAV_LABEL.engineering[locale]}
                  <IconArrowRight size={18} stroke={2} aria-hidden="true" />
                </Link>
              </div>
            </div>

          </div>

          <div className="figures slab-band__figures">
            {ENGINEERING_BAND.figures.map((figure) => (
              <div className="figure-item" key={figure.value} data-reveal="">
                <span className="figure-item__value">
                  {figure.value}
                  {figure.unit[locale] ? (
                    <span className="figure-item__unit">{figure.unit[locale]}</span>
                  ) : null}
                </span>
                <span className="figure-item__label">{figure.label[locale]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. About. One pulled statement, the full story lives on its own page. */}
      <section className="section section--canvas">
        <div className="container statement-band">
          <p className="statement" data-reveal="">
            {ABOUT_STATEMENT.statement[locale]}
          </p>
          <div data-reveal="">
            <p className="statement-band__body">{ABOUT_STATEMENT.body[locale]}</p>
            <Link className="link-arrow statement-band__link" href={href(locale, 'about')}>
              {NAV_LABEL.about[locale]}
              <IconArrowUpRight size={18} stroke={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Technical resources. A list, not a card grid. */}
      <section className="section section--cloud">
        <div className="container">
          <SectionHead
            title={RESOURCES_SECTION.title[locale]}
            lead={RESOURCES_SECTION.lead[locale]}
            action={
              <Link className="link-arrow" href={href(locale, 'support')}>
                {NAV_LABEL.support[locale]}
                <IconArrowRight size={18} stroke={2} aria-hidden="true" />
              </Link>
            }
          />
          <DocList documents={DOCUMENTS.slice(0, 4)} locale={locale} />
        </div>
      </section>

      {/* 11. Technical inquiry. */}
      <CtaBand
        locale={locale}
        surface="canvas"
        title={HOME_CTA.title[locale]}
        body={HOME_CTA.body[locale]}
      />
    </>
  )
}
