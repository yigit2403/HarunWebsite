import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { ProductCard } from '@/components/ui/ProductCard'
import { CompareTable } from '@/components/ui/SpecTable'
import { NAV_LABEL, UI } from '@/content/dict'
import { HOME_CTA, PRODUCTS_SECTION } from '@/content/pages'
import { COMPARE_COLUMNS, COMPARE_ROWS, PRODUCTS } from '@/content/products'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

const COMPARE_CAPTION = {
  tr: 'LQL serisi karşılaştırma',
  en: 'LQL series comparison',
} as const

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

      <CtaBand locale={locale} title={HOME_CTA.title[locale]} body={HOME_CTA.body[locale]} />
    </>
  )
}
