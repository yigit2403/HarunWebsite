import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

import '../globals.css'
import '../../styles/admin.css'

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

/**
 * The admin panel sits outside the locale tree: it is not part of the public
 * site, so it is not localised into the URL, not in the sitemap, and never
 * indexed. Access is enforced in proxy.ts, which fails closed when
 * ADMIN_PASSWORD is unset.
 */
export const metadata: Metadata = {
  title: 'Liquilob admin',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
