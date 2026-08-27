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
    // suppressHydrationWarning: the inline script below stamps data-js onto
    // <html> before React hydrates, and that attribute is meant to differ
    // from the server-rendered markup.
    <html
      lang={LOCALE_TAG[locale]}
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* The entrance reveal hides content until an observer shows it, so
            the hidden state must be opt-in from JavaScript: this runs inline
            before first paint, and base.css scopes the hiding rule under
            html[data-js]. A browser with scripts disabled, blocked, or still
            arriving over a slow link shows the full page instead of blank
            bands. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.setAttribute('data-js','')` }} />
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
