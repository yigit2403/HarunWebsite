import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

import '../globals.css'

import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/ui/JsonLd'
import { Reveal } from '@/components/ui/Reveal'
import { UI } from '@/content/dict'
import { COMPANY } from '@/content/site'
import { isIndexable } from '@/lib/deployment'
import { LOCALES, LOCALE_TAG, isLocale, type Locale } from '@/lib/i18n'
import { organizationJsonLd } from '@/lib/seo'

/**
 * IBM Plex Sans is an engineering typeface, drawn for technical documentation,
 * and it carries the full Turkish character set in latin-ext. Plex Mono sets
 * every number on the site: capacities, pressures, dimensions and the phone
 * number. Both are self-hosted through next/font, so there is no render-
 * blocking request to a font CDN.
 */
const sans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
})

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  return {
    metadataBase: new URL(COMPANY.origin),
    title: {
      default: `${COMPANY.brand} · ${COMPANY.legalName}`,
      template: `%s · ${COMPANY.brand}`,
    },
    applicationName: COMPANY.brand,
    authors: [{ name: COMPANY.legalName }],
    formatDetection: { telephone: true },
    // robots.txt already refuses crawlers on a preview; this is the per-page
    // belt to that braces, since a direct link can bypass robots.txt.
    robots: isIndexable()
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale = raw as Locale

  return (
    <html lang={LOCALE_TAG[locale]} className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          {UI.skipToContent[locale]}
        </a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <Reveal />
        <JsonLd data={organizationJsonLd(locale)} />
      </body>
    </html>
  )
}
