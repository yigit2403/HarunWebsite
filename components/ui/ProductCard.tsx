import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { PumpElevation } from '@/components/graphics/PumpElevation'
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
        <PumpElevation title={`${product.name} ${product.type[locale]}`} scale={product.drawScale} />
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
