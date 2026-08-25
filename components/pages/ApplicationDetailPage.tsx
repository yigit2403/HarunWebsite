import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { ApplicationIcon } from '@/components/ui/ApplicationIcon'
import { JsonLd } from '@/components/ui/JsonLd'
import { PhotoSlot } from '@/components/ui/PhotoSlot'
import type { Application } from '@/content/applications'
import { NAV_LABEL, UI } from '@/content/dict'
import { HOME_CTA, PHOTOS } from '@/content/pages'
import { productBySlug } from '@/content/products'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'
import { breadcrumbJsonLd } from '@/lib/seo'

const HEADINGS = {
  process: { tr: 'Proses', en: 'The process' },
  characteristics: { tr: 'Akışkan özellikleri', en: 'Fluid characteristics' },
  challenges: { tr: 'Karşılaşılan zorluklar', en: 'Where it gets difficult' },
  approach: { tr: 'Liquilob yaklaşımı', en: 'The Liquilob approach' },
  materials: { tr: 'Malzeme ve hijyen', en: 'Materials and hygiene' },
  models: { tr: 'Uygun gövde boyları', en: 'Suitable frame sizes' },
} as const

export function ApplicationDetailPage({
  application,
  locale,
}: {
  application: Application
  locale: Locale
}) {
  const url = href(locale, 'applications', application.slug[locale])

  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: UI.home[locale], url: href(locale) },
          { label: NAV_LABEL.applications[locale], url: href(locale, 'applications') },
          { label: application.name[locale] },
        ]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <ApplicationIcon
            name={application.icon}
            className="industry-tile__icon"
          />
          <h1 className="masthead__title" style={{ marginTop: 'var(--s5)' }}>
            {application.name[locale]}
          </h1>
          <p className="masthead__lead">{application.lead[locale]}</p>
        </div>
      </section>

      <section className="section section--canvas">
        <div className="container app-detail">
          <div>
            <div className="prose" data-reveal="">
              <h2 className="section-head__title" style={{ fontSize: '1.5rem' }}>
                {HEADINGS.process[locale]}
              </h2>
              {application.process[locale].map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>

            <div style={{ marginTop: 'var(--s12)' }} data-reveal="">
              <h2 className="section-head__title" style={{ fontSize: '1.5rem', marginBottom: 'var(--s6)' }}>
                {HEADINGS.characteristics[locale]}
              </h2>
              <ul className="tick-list">
                {application.characteristics[locale].map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 'var(--s12)' }} data-reveal="">
              <h2 className="section-head__title" style={{ fontSize: '1.5rem', marginBottom: 'var(--s6)' }}>
                {HEADINGS.challenges[locale]}
              </h2>
              <ul className="tick-list">
                {application.challenges[locale].map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </div>

            <figure style={{ marginTop: 'var(--s12)' }}>
              <PhotoSlot slot={PHOTOS.installation} locale={locale} />
            </figure>

            <div className="prose" style={{ marginTop: 'var(--s12)' }} data-reveal="">
              <h2 className="section-head__title" style={{ fontSize: '1.5rem' }}>
                {HEADINGS.approach[locale]}
              </h2>
              {application.approach[locale].map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>

            <div style={{ marginTop: 'var(--s12)' }} data-reveal="">
              <h2 className="section-head__title" style={{ fontSize: '1.5rem', marginBottom: 'var(--s6)' }}>
                {HEADINGS.materials[locale]}
              </h2>
              <div className="callout">{application.materials[locale]}</div>
            </div>
          </div>

          <aside className="app-aside" data-reveal="">
            <h2 className="app-aside__title">{HEADINGS.models[locale]}</h2>
            <div className="app-model-list">
              {application.models.map((entry) => {
                const product = productBySlug(entry.slug)
                if (!product) return null
                return (
                  <Link className="app-model" key={entry.slug} href={href(locale, 'products', entry.slug)}>
                    <span className="app-model__name">{product.name}</span>
                    <span className="app-model__note">{entry.note[locale]}</span>
                  </Link>
                )
              })}
            </div>
            <Link className="link-arrow" href={href(locale, 'products')}>
              {UI.allProducts[locale]}
              <IconArrowRight size={18} stroke={2} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>

      <CtaBand locale={locale} title={HOME_CTA.title[locale]} body={HOME_CTA.body[locale]} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: UI.home[locale], url: href(locale) },
          { name: NAV_LABEL.applications[locale], url: href(locale, 'applications') },
          { name: application.name[locale], url },
        ])}
      />
    </>
  )
}
