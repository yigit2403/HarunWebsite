import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { PhotoSlot } from '@/components/ui/PhotoSlot'
import { SectionHead } from '@/components/ui/SectionHead'
import { GEAR_PHOTOS, GEAR_PUMP, GEAR_PUMP_HEADINGS } from '@/content/gear-pump'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

/**
 * The second pump type, where the LQL range is listed. Without it the internal
 * gear pump is reachable only from the footer, because the primary navigation
 * stays at six items: a seventh does not fit beside the phone number and the
 * language switch at the widths this audience actually browses at.
 *
 * On the fog surface, because on both pages that use it the LQL grid above is
 * canvas and the section below is cloud.
 */
export function GearPumpTeaser({ locale }: { locale: Locale }) {
  return (
    <section className="section section--fog">
      <div className="container split">
        <div data-reveal="">
          <SectionHead
            kicker={GEAR_PUMP_HEADINGS.family[locale]}
            title={GEAR_PUMP.name[locale]}
            lead={GEAR_PUMP.summary[locale]}
          />
          <Link className="link-arrow" href={href(locale, 'products', GEAR_PUMP.slug[locale])}>
            {GEAR_PUMP.name[locale]}
            <IconArrowRight size={18} stroke={2} aria-hidden="true" />
          </Link>
        </div>
        <figure data-reveal="">
          <PhotoSlot slot={GEAR_PHOTOS.set} locale={locale} sizes="(min-width: 64rem) 54vw, 92vw" />
        </figure>
      </div>
    </section>
  )
}
