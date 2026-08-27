import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

/**
 * IBM Plex Sans is an engineering typeface, drawn for technical documentation,
 * and it carries the full Turkish character set in latin-ext. Plex Mono sets
 * every number on the site: capacities, pressures, dimensions and the phone
 * number. Both are self-hosted through next/font, so there is no render-
 * blocking request to a font CDN.
 *
 * Declared once and imported by every file that renders an <html> element.
 * There are two of those: the locale layout, and the root 404 page, which owns
 * its own document shell. Without these classes on <html> the CSS font tokens
 * reference an undefined variable, the font shorthand becomes invalid, and the
 * page silently falls back to the browser's default serif.
 */
export const sans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
})

export const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
})
