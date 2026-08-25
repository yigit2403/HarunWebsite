import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { ProductCard } from '@/components/ui/ProductCard'
import { SectionHead } from '@/components/ui/SectionHead'
import { CompareTable } from '@/components/ui/SpecTable'
import { APPLICATIONS } from '@/content/applications'
import { CONFIGURATIONS } from '@/content/configurations'
import { NAV_LABEL, UI } from '@/content/dict'
import { HOME_CTA, PRODUCTS_SECTION } from '@/content/pages'
import { COMPARE_COLUMNS, COMPARE_ROWS, PRODUCTS } from '@/content/products'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

const COMPARE_CAPTION = {
  tr: 'LQL serisi karşılaştırma',
  en: 'LQL series comparison',
} as const

const CONFIG_TITLE = { tr: 'Gövde konfigürasyonları', en: 'Body configurations' } as const
const CONFIG_LEAD = {
  tr: 'Ceketli ve PP gövde, ayrı model değil; serideki her gövde boyu bu konfigürasyonlarda üretilebilir.',
  en: 'Jacketed and polypropylene bodies are not separate models. Any frame size in the series can be built in either configuration.',
} as const
const CONFIG_FOR = { tr: 'Tipik kullanım', en: 'Typical use' } as const

/**
 * Catalogue. A comparison table sits above the grid, because an engineer who
 * already knows their duty point wants to read four models against each other
 * in one glance rather than open four cards to find out.
 */
export function ProductsPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: UI.home[locale], url: href(locale) },
          { label: NAV_LABEL.products[locale] },
        ]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h1 className="masthead__title">{PRODUCTS_SECTION.title[locale]}</h1>
          <p className="masthead__lead">{PRODUCTS_SECTION.lead[locale]}</p>
        </div>
      </section>

      <section className="section section--canvas">
        <div className="container">
          <div className="compare-strip" data-reveal="">
            <CompareTable
              locale={locale}
              caption={COMPARE_CAPTION[locale]}
              columns={COMPARE_COLUMNS.map((c) => ({ key: c.key, label: c.label[locale] }))}
              rows={PRODUCTS.map((p) => ({ model: p.name, values: COMPARE_ROWS[p.slug] }))}
            />
          </div>

          <div className="grid grid--4">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Configurations cut across the range, so they sit below the models
          rather than pretending to be more models. */}
      <section className="section section--cloud">
        <div className="container">
          <SectionHead title={CONFIG_TITLE[locale]} lead={CONFIG_LEAD[locale]} />
          <div className="matrix">
            {CONFIGURATIONS.map((config) => {
              const used = config.applications
                .map((key) => APPLICATIONS.find((a) => a.key === key))
                .filter((a): a is NonNullable<typeof a> => Boolean(a))
              return (
                <div className="matrix__item" key={config.key} data-reveal="">
                  <h3 className="matrix__term">
                    {config.name[locale]}{' '}
                    <span style={{ color: 'var(--graphite)', fontWeight: 400 }}>
                      · {config.latin}
                    </span>
                  </h3>
                  <p className="matrix__def">{config.summary[locale]}</p>
                  <ul className="tick-list" style={{ marginTop: 'var(--s5)' }}>
                    {config.points[locale].map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="rotor-card__used">
                    <span className="rotor-card__used-label">{CONFIG_FOR[locale]}</span>
                    <div className="rotor-card__links">
                      {used.map((app) => (
                        <Link key={app.key} href={href(locale, 'applications', app.slug[locale])}>
                          {app.name[locale]}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="btn-row" style={{ marginTop: 'var(--s10)' }}>
            <Link className="btn btn--secondary" href={href(locale, 'rotors')}>
              {NAV_LABEL.rotors[locale]}
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
