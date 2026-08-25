import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { CurveFrame } from '@/components/graphics/CurveFrame'
import { DimensionOutline } from '@/components/graphics/DimensionOutline'
import { PumpElevation } from '@/components/graphics/PumpElevation'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { DocList } from '@/components/ui/DocList'
import { JsonLd } from '@/components/ui/JsonLd'
import { SpecTable } from '@/components/ui/SpecTable'
import { APPLICATIONS } from '@/content/applications'
import { DETAIL_SECTIONS, NAV_LABEL, UI } from '@/content/dict'
import { DOCUMENTS, HOME_CTA } from '@/content/pages'
import { PRODUCTS, type Product } from '@/content/products'
import type { Locale } from '@/lib/i18n'
import { href, inquiryHref } from '@/lib/routes'
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo'

const ANCHORS = ['overview', 'advantages', 'applications', 'technical', 'configuration', 'documents'] as const

export function ProductDetailPage({ product, locale }: { product: Product; locale: Locale }) {
  const url = href(locale, 'products', product.slug)
  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3)
  const usedIn = product.applications
    .map((key) => APPLICATIONS.find((a) => a.key === key))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: UI.home[locale], url: href(locale) },
          { label: NAV_LABEL.products[locale], url: href(locale, 'products') },
          { label: product.name },
        ]}
      />

      {/* Product hero. The machine reads clearly, the numbers sit beside it. */}
      <section className="product-hero">
        <div className="container product-hero__grid">
          <figure className="tech-frame">
            <PumpElevation title={`${product.name} ${product.type[locale]}`} scale={product.drawScale} />
            <figcaption className="tech-frame__caption">
              {product.name} · {product.type[locale]}
            </figcaption>
          </figure>

          <div>
            <span className="rule" aria-hidden="true" />
            <span className="product-hero__series" lang="en">{product.series}</span>
            <h1 className="product-hero__name">{product.name}</h1>
            <p className="product-hero__type">{product.type[locale]}</p>
            <p className="product-hero__desc">{product.summary[locale]}</p>

            <dl className="key-specs">
              {product.keySpecs.map((spec) => (
                <div className="key-spec" key={spec.label.en}>
                  <dt className="key-spec__label">{spec.label[locale]}</dt>
                  <dd className="key-spec__value">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="btn-row" style={{ marginTop: 'var(--s8)' }}>
              <Link className="btn btn--primary" href={inquiryHref(locale)}>
                {UI.ctaSupport[locale]}
                <IconArrowRight size={18} stroke={2} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="anchor-nav" aria-label={product.name}>
        <div className="container anchor-nav__track">
          {ANCHORS.map((key) => (
            <a key={key} href={`#${key}`}>
              {DETAIL_SECTIONS[key][locale]}
            </a>
          ))}
        </div>
      </nav>

      <div className="container">
        <section className="product-section" id="overview">
          <h2 className="product-section__title">{DETAIL_SECTIONS.overview[locale]}</h2>
          <div className="prose" data-reveal="">
            {product.description[locale].map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="product-section" id="advantages">
          <h2 className="product-section__title">{DETAIL_SECTIONS.advantages[locale]}</h2>
          <div className="matrix">
            {product.advantages.map((item) => (
              <div className="matrix__item" key={item.term.en} data-reveal="">
                <h3 className="matrix__term">{item.term[locale]}</h3>
                <p className="matrix__def">{item.def[locale]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="product-section" id="applications">
          <h2 className="product-section__title">{DETAIL_SECTIONS.applications[locale]}</h2>
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
        </section>

        <section className="product-section" id="technical">
          <h2 className="product-section__title">{DETAIL_SECTIONS.technical[locale]}</h2>
          <div className="grid" style={{ gap: 'var(--s8)' }}>
            {product.specGroups.map((group, index) => (
              <div key={group.title.en} data-reveal="">
                <SpecTable group={group} locale={locale} note={index === product.specGroups.length - 1} />
              </div>
            ))}
          </div>
        </section>

        {/* Curves and dimensions are configuration-dependent and unpublished.
            Both render as a drawn frame plus an honest empty state rather than
            a plausible-looking made-up curve. */}
        <section className="product-section" id="configuration">
          <h2 className="product-section__title">{DETAIL_SECTIONS.configuration[locale]}</h2>

          <div className="split split--even" style={{ rowGap: 'var(--s12)' }}>
            <div data-reveal="">
              <h3 className="matrix__term" style={{ marginBottom: 'var(--s5)' }}>
                {UI.curvesTitle[locale]}
              </h3>
              <figure className="tech-frame tech-frame--plain" style={{ marginBottom: 'var(--s5)' }}>
                <CurveFrame
                  title={UI.curvesTitle[locale]}
                  axisX="Q (m³/h)"
                  axisY="Δp (bar)"
                />
              </figure>
              <div className="empty-state">
                <p className="empty-state__title">{UI.curvesEmptyTitle[locale]}</p>
                <p className="empty-state__body">{UI.curvesEmptyBody[locale]}</p>
                <Link className="link-arrow" href={inquiryHref(locale)}>
                  {UI.ctaSupport[locale]}
                  <IconArrowRight size={18} stroke={2} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div data-reveal="">
              <h3 className="matrix__term" style={{ marginBottom: 'var(--s5)' }}>
                {UI.dimensionsTitle[locale]}
              </h3>
              <figure className="tech-frame tech-frame--plain" style={{ marginBottom: 'var(--s5)' }}>
                <DimensionOutline title={UI.dimensionsTitle[locale]} />
              </figure>
              <div className="empty-state">
                <p className="empty-state__title">{UI.dimensionsEmptyTitle[locale]}</p>
                <p className="empty-state__body">{UI.dimensionsEmptyBody[locale]}</p>
                <Link className="link-arrow" href={inquiryHref(locale)}>
                  {UI.ctaSupport[locale]}
                  <IconArrowRight size={18} stroke={2} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="product-section" id="documents">
          <h2 className="product-section__title">{DETAIL_SECTIONS.documents[locale]}</h2>
          <DocList documents={DOCUMENTS} locale={locale} />
        </section>

        <section className="product-section">
          <h2 className="product-section__title">
            {locale === 'tr' ? 'Diğer gövde boyları' : 'Other frame sizes'}
          </h2>
          <div className="related">
            {related.map((item) => (
              <Link
                className="industry-tile"
                key={item.slug}
                href={href(locale, 'products', item.slug)}
                data-reveal=""
              >
                <h3 className="industry-tile__name">{item.name}</h3>
                <p className="pillar__body">{item.summary[locale]}</p>
                <p className="industry-tile__fluids">
                  {item.keySpecs.map((s) => s.value).join('  ·  ')}
                </p>
                <span className="industry-tile__go">
                  {UI.technicalDetails[locale]}
                  <IconArrowRight size={15} stroke={2} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <CtaBand locale={locale} title={HOME_CTA.title[locale]} body={HOME_CTA.body[locale]} />

      <JsonLd
        data={productJsonLd({
          name: `${product.series} ${product.name}`,
          description: product.summary[locale],
          category: product.type[locale],
          url,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: UI.home[locale], url: href(locale) },
          { name: NAV_LABEL.products[locale], url: href(locale, 'products') },
          { name: product.name, url },
        ])}
      />
    </>
  )
}
