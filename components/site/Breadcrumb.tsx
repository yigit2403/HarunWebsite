import Link from 'next/link'

import { UI } from '@/content/dict'
import type { Locale } from '@/lib/i18n'

export type Crumb = { label: string; url?: string }

export function Breadcrumb({ trail, locale }: { trail: Crumb[]; locale: Locale }) {
  return (
    <nav className="breadcrumb" aria-label={UI.breadcrumb[locale]}>
      <div className="container">
        <ol>
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1
            return (
              <li key={`${crumb.label}-${index}`}>
                {crumb.url && !last ? (
                  <Link href={crumb.url}>{crumb.label}</Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined}>{crumb.label}</span>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
