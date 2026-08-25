import Image from 'next/image'

import type { PhotoSlot as Slot } from '@/content/pages'
import type { Locale } from '@/lib/i18n'

/**
 * Reserved position for Profimann photography.
 *
 * There is no pump photography yet and a generic stock photograph of a factory
 * would be worse than none, so until a file is dropped into /public/photos and
 * referenced from content/pages.ts this renders as a measured frame naming the
 * shot that belongs here. The shot list is in PHOTOGRAPHY.md. Adding the real
 * image is a one-line change and every layout around it stays as it is.
 */
export function PhotoSlot({
  slot,
  locale,
  priority = false,
  sizes = '(min-width: 64rem) 46vw, 100vw',
}: {
  slot: Slot
  locale: Locale
  priority?: boolean
  sizes?: string
}) {
  if (slot.src) {
    return (
      <div className="photo" style={{ aspectRatio: slot.ratio }}>
        <Image
          src={slot.src}
          alt={slot.label[locale]}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div className="photo-slot" style={{ aspectRatio: slot.ratio }} data-reveal="">
      <span className="photo-slot__mark" aria-hidden="true" />
      <p className="photo-slot__label">{slot.label[locale]}</p>
      <p className="photo-slot__spec">{slot.ratio.replace(' / ', ':')}</p>
    </div>
  )
}
