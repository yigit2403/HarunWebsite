import { origin } from '@/lib/deployment'
import type { Localised } from '@/lib/i18n'

/**
 * Company facts. Every value here is taken from the Profimann / Liquilob
 * business card or from the written company brief. Nothing is invented.
 *
 * The card carries no email address and no social channels, so this site
 * publishes none. Add them here when they exist and they appear everywhere.
 */

export const COMPANY = {
  legalName: 'Profimann Makine San. Tic. Ltd. Şti.',
  shortName: 'Profimann',
  brand: 'Liquilob',
  brandEndorsement: 'BY PROFIMANN',

  phoneDisplay: '+90 505 353 50 70',
  phoneHref: 'tel:+905053535070',

  address: {
    street: 'Horozluhan Mah. Tekelioğlu Sk. No. 65',
    district: 'Selçuklu',
    city: 'Konya',
    country: { tr: 'Türkiye', en: 'Türkiye' } as Localised,
    countryCode: 'TR',
  },

  sites: [
    { label: 'www.liquilob.com', href: 'https://www.liquilob.com' },
    { label: 'www.profimann.com', href: 'https://www.profimann.com' },
  ],

  /** Canonical origin. See lib/deployment.ts for how it is resolved. */
  origin: origin(),
} as const

export const ADDRESS_LINES: Localised<string[]> = {
  tr: ['Horozluhan Mah. Tekelioğlu Sk.', 'No. 65 Selçuklu / Konya', 'Türkiye'],
  en: ['Horozluhan Mah. Tekelioglu Sk.', 'No. 65 Selcuklu / Konya', 'Türkiye'],
}

/**
 * Specification values across this site are engineering placeholders pending
 * Profimann's verified test data. While this flag is true, every table and
 * every card carries a visible advisory. Set it to false once the real
 * figures are in content/products.ts and the advisories disappear.
 */
export const SPECS_ARE_PROVISIONAL = true
