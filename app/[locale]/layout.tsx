import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'

import '../globals.css'

import { mono, sans } from '../fonts'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/ui/JsonLd'
import { Reveal } from '@/components/ui/Reveal'
import { UI } from '@/content/dict'
import { COMPANY } from '@/content/site'
import { isIndexable } from '@/lib/deployment'
import { LOCALES, LOCALE_TAG, isLocale, type Locale } from '@/lib/i18n'
import { organizationJsonLd } from '@/lib/seo'

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
        {/* Entrance reveal is driven by JavaScript. Without this, a browser
            with scripts disabled — not rare on corporate IT — keeps every
            data-reveal element at opacity 0 and the page appears empty. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1;transform:none}`}</style>
        </noscript>
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
