import Image from 'next/image'

import { PRODUCT_IMAGE } from '@/content/pages'
import type { Locale } from '@/lib/i18n'

/**
 * The Liquilob product render.
 *
 * One render covers the LQL series, which is how an industrial catalogue
 * normally works: the photograph establishes the machine and the specification
 * rows separate the frame sizes. The line drawings are not retired by it, they
 * move to where a drawing genuinely does more than a photograph, which is the
 * dimensional and sectional content.
 */
export function ProductImage({
  locale,
  priority = false,
  sizes = '(min-width: 64rem) 46vw, 90vw',
  className,
}: {
  locale: Locale
  priority?: boolean
  sizes?: string
  className?: string
}) {
  return (
    <Image
      src={PRODUCT_IMAGE.src}
      width={PRODUCT_IMAGE.width}
      height={PRODUCT_IMAGE.height}
      alt={PRODUCT_IMAGE.alt[locale]}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}
