import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { ProductImage } from '@/components/ui/ProductImage'
import { UI } from '@/content/dict'
import type { Product } from '@/content/products'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

/**
 * Catalogue tile. Model, type, drawing, one line of description and the three
 * specification values an engineer scans first. There is deliberately no
 * price, no rating and no cart control anywhere in this component.
 */
export function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const detail = href(locale, 'products', product.slug)

  return (
    <article className="product-card" data-reveal="">
      <div className="product-card__figure">
        {/* Scaled to the model's frame size, normalised against the largest,
            so the four cards show the real size step instead of one photo
            repeated four times. */}
        <div
          className="product-card__scale"
          style={{ ['--scale' as string]: `${Math.round((product.drawScale / 1.15) * 100)}%` }}
        >
          <ProductImage locale={locale} sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 44vw, 88vw" />
        </div>
      </div>

      <div className="product-card__body">
        <span className="product-card__type">{product.type[locale]}</span>
        <h3 className="product-card__name">
          <Link href={detail}>{product.name}</Link>
        </h3>
        <p className="product-card__desc">{product.summary[locale]}</p>

        <dl className="product-card__specs">
          {product.keySpecs.map((spec) => (
            <div className="product-card__spec" key={spec.label.en}>
              <dt>{spec.label[locale]}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="product-card__foot">
          <Link className="link-arrow" href={detail}>
            {UI.technicalDetails[locale]}
            <IconArrowRight size={18} stroke={2} aria-hidden="true" />
            <span className="sr-only"> {product.name}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
