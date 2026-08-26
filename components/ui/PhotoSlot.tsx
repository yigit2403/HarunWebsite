import Image from 'next/image'

import type { PhotoSlot as Slot } from '@/content/pages'
import type { Locale } from '@/lib/i18n'

/**
 * A position on the page that holds one of Profimann's own images.
 *
 * Every slot in content/pages.ts currently carries a `src`, so in practice this
 * renders a lazily loaded image in a hairline frame. The branch below it is
 * what makes adding a new position safe: a slot declared without a `src` draws
 * a measured frame naming the shot that belongs there, rather than reaching for
 * a stock photograph of somebody else's factory. The shot list is in
 * PHOTOGRAPHY.md. Filling a slot is a one-line change and nothing around it
 * moves, because the slot already reserves the right aspect ratio.
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
