import Image from 'next/image'

import { PRODUCT_IMAGE } from '@/content/pages'
import type { Locale } from '@/lib/i18n'

type Subject = {
  src: string
  width: number
  height: number
  alt: Record<Locale, string>
}

/**
 * A keyed render of the machine, sized by the layout rather than by the file.
 *
 * Two subjects use this. `PRODUCT_IMAGE`, the default, is the pump on its own
 * with the front cover removed, and it carries the catalogue: one render across
 * the LQL series, with the specification rows separating the frame sizes, which
 * is how an industrial catalogue normally works. `UNIT_IMAGE` is the complete
 * set on its baseplate and carries the home hero.
 *
 * Neither retires the line drawings. Those moved to where a drawing genuinely
 * does more than a render, which is the dimensional and sectional content.
 */
export function ProductImage({
  locale,
  image = PRODUCT_IMAGE,
  priority = false,
  sizes = '(min-width: 64rem) 46vw, 90vw',
  className,
}: {
  locale: Locale
  image?: Subject
  priority?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <Image
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt[locale]}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}
