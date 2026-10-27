import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AboutPage } from '@/components/pages/AboutPage'
import { ApplicationDetailPage } from '@/components/pages/ApplicationDetailPage'
import { ApplicationsPage } from '@/components/pages/ApplicationsPage'
import { ContactPage } from '@/components/pages/ContactPage'
import { EngineeringPage } from '@/components/pages/EngineeringPage'
import { GearPumpPage } from '@/components/pages/GearPumpPage'
import { ProductDetailPage } from '@/components/pages/ProductDetailPage'
import { ProductsPage } from '@/components/pages/ProductsPage'
import { RotorsPage } from '@/components/pages/RotorsPage'
import { SupportPage } from '@/components/pages/SupportPage'
import { APPLICATIONS, applicationBySlug } from '@/content/applications'
import { NAV_LABEL } from '@/content/dict'
import { GEAR_PUMP } from '@/content/gear-pump'
import { ABOUT_PAGE, APPLICATIONS_SECTION, CONTACT_PAGE, ENGINEERING_PAGE, PRODUCTS_SECTION, SUPPORT_PAGE } from '@/content/pages'
import { ROTOR_INTRO } from '@/content/rotors'
import { PRODUCTS, SEARCH_NAME, productBySlug } from '@/content/products'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import { SEGMENTS, href, pageKeyFromSegment, type PageKey } from '@/lib/routes'

/**
 * Every interior page resolves through here.
 *
 * URL segments are localised, so /tr/urunler/lql-50 and /en/products/lql-50
 * are the same page in two languages rather than two separate route trees. One
 * table in lib/routes.ts drives the resolution, generateStaticParams, the
 * header, the footer, the sitemap and the language switcher.
 */

type Resolved =
  | { kind: PageKey }
  | { kind: 'product'; slug: string }
  | { kind: 'application'; slug: string }
  | { kind: 'gearPump' }

function resolve(locale: Locale, slug: string[]): Resolved | null {
  const [section, detail, ...rest] = slug
  if (!section || rest.length > 0) return null

  const key = pageKeyFromSegment(locale, section)
  if (!key) return null

  if (!detail) return { kind: key }
  if (key === 'products' && productBySlug(detail)) return { kind: 'product', slug: detail }
  if (key === 'products' && detail === GEAR_PUMP.slug[locale]) return { kind: 'gearPump' }
  if (key === 'applications' && applicationBySlug(locale, detail)) {
    return { kind: 'application', slug: detail }
  }
  return null
}

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = []

  for (const locale of LOCALES) {
    for (const key of Object.keys(SEGMENTS) as PageKey[]) {
      params.push({ locale, slug: [SEGMENTS[key][locale]] })
    }
    for (const product of PRODUCTS) {
      params.push({ locale, slug: [SEGMENTS.products[locale], product.slug] })
    }
    params.push({ locale, slug: [SEGMENTS.products[locale], GEAR_PUMP.slug[locale]] })
    for (const app of APPLICATIONS) {
      params.push({ locale, slug: [SEGMENTS.applications[locale], app.slug[locale]] })
    }
  }

  return params
}

/** Title and description per page, plus the matching path in the other language. */
function seoFor(locale: Locale, resolved: Resolved) {
  const other: Locale = locale === 'tr' ? 'en' : 'tr'

  switch (resolved.kind) {
    case 'product': {
      const product = productBySlug(resolved.slug)!
      // "LQL-50 Lob Pompa · DN 50 · Loblu Rotorlu Pompa": the searched name, the
      // port size buyers also search by, then the trade name. The trade name is
      // dropped where it would only repeat the search name, as in English.
      const name = SEARCH_NAME.title[locale]
      const type = product.type[locale]
      return {
        title: [`${product.name} ${name}`, product.specs.connection[locale], type === name ? null : type]
          .filter(Boolean)
          .join(' · '),
        description: `${product.name} ${SEARCH_NAME.inline[locale]}. ${product.summary[locale]} ${product.keySpecs.map((s) => `${s.label[locale]}: ${s.value[locale]}`).join('. ')}.`,
        path: href(locale, 'products', product.slug),
        alternatePath: href(other, 'products', product.slug),
      }
    }
    case 'gearPump':
      return {
        title: GEAR_PUMP.seoTitle[locale],
        description: GEAR_PUMP.summary[locale],
        path: href(locale, 'products', GEAR_PUMP.slug[locale]),
        alternatePath: href(other, 'products', GEAR_PUMP.slug[other]),
      }
    case 'application': {
      const app = applicationBySlug(locale, resolved.slug)!
      return {
        // "Dairy Pumps · Dairy" says the same word twice; drop the name when the
        // search term already contains it.
        title: app.pumpTerm[locale].toLocaleLowerCase(locale).includes(app.name[locale].toLocaleLowerCase(locale))
          ? app.pumpTerm[locale]
          : `${app.pumpTerm[locale]} · ${app.name[locale]}`,
        description: `${app.pumpTerm[locale]}: ${app.lead[locale]}`,
        path: href(locale, 'applications', app.slug[locale]),
        alternatePath: href(other, 'applications', app.slug[other]),
      }
    }
    default: {
      const key = resolved.kind
      const copy: Record<PageKey, { title: string; description: string }> = {
        products: {
          title: PRODUCTS_SECTION.seoTitle[locale],
          description: PRODUCTS_SECTION.lead[locale],
        },
        rotors: {
          title: locale === 'tr' ? 'Lob Pompa Rotor Tipleri · Rotor Teknolojileri' : 'Lobe Pump Rotor Types · Rotor Technologies',
          description: ROTOR_INTRO[locale],
        },
        applications: {
          title: `${NAV_LABEL.applications[locale]} · ${APPLICATIONS_SECTION.title[locale]}`,
          description: APPLICATIONS_SECTION.lead[locale],
        },
        engineering: {
          title: ENGINEERING_PAGE.title[locale],
          description: ENGINEERING_PAGE.lead[locale],
        },
        about: { title: ABOUT_PAGE.title[locale], description: ABOUT_PAGE.lead[locale] },
        support: { title: SUPPORT_PAGE.title[locale], description: SUPPORT_PAGE.lead[locale] },
        contact: { title: CONTACT_PAGE.title[locale], description: CONTACT_PAGE.lead[locale] },
      }
      return {
        ...copy[key],
        path: href(locale, key),
        alternatePath: href(other, key),
      }
    }
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const resolved = resolve(locale, slug)
  if (!resolved) return {}

  const { pageMetadata } = await import('@/lib/seo')
  return pageMetadata({ locale, ...seoFor(locale, resolved) })
}

export default async function InteriorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  const resolved = resolve(locale, slug)
  if (!resolved) notFound()

  switch (resolved.kind) {
    case 'product':
      return <ProductDetailPage product={productBySlug(resolved.slug)!} locale={locale} />
    case 'application':
      return <ApplicationDetailPage application={applicationBySlug(locale, resolved.slug)!} locale={locale} />
    case 'gearPump':
      return <GearPumpPage locale={locale} />
    case 'products':
      return <ProductsPage locale={locale} />
    case 'rotors':
      return <RotorsPage locale={locale} />
    case 'applications':
      return <ApplicationsPage locale={locale} />
    case 'engineering':
      return <EngineeringPage locale={locale} />
    case 'about':
      return <AboutPage locale={locale} />
    case 'support':
      return <SupportPage locale={locale} />
    case 'contact':
      return <ContactPage locale={locale} />
  }
}
