import Image from 'next/image'

import type { PhotoSlot } from '@/content/pages'
import type { Locale } from '@/lib/i18n'

/**
 * Full-width photographic band.
 *
 * The brief asked for occasional dramatic full-width sections and warned in the
 * same breath against setting copy over a background image. So this band does
 * exactly one thing: it shows the photograph edge to edge with a caption
 * anchored outside the image area. Nothing is laid over the picture.
 *
 * Renders nothing at all when the slot has no photograph yet, rather than
 * leaving a full-width grey rectangle across the page.
 */
export function BleedBand({ slot, locale }: { slot: PhotoSlot; locale: Locale }) {
  if (!slot.src) return null

  return (
    <figure className="bleed">
      <Image
        src={slot.src}
        alt={slot.label[locale]}
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
      <figcaption className="bleed__caption">{slot.label[locale]}</figcaption>
    </figure>
  )
}
