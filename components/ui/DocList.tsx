import Link from 'next/link'
import { IconArrowRight, IconFileDescription } from '@tabler/icons-react'

import { UI } from '@/content/dict'
import type { DOCUMENTS } from '@/content/pages'
import type { Locale } from '@/lib/i18n'
import { inquiryHref } from '@/lib/routes'

/**
 * Document list.
 *
 * Nothing here links to a file, because no catalogue or datasheet has been
 * issued yet. Rather than publish dead download buttons, every row routes to
 * the technical inquiry form with the document named in the request. When the
 * real files land, add an `href` to the row and swap the label for a download.
 */
export function DocList({
  documents,
  locale,
}: {
  documents: typeof DOCUMENTS
  locale: Locale
}) {
  return (
    <div className="doc-list">
      {documents.map((doc) => (
        <div className="doc-row" key={doc.id} data-reveal="">
          <div>
            <h3 className="doc-row__title">
              <IconFileDescription size={22} stroke={1.75} aria-hidden="true" />
              {doc.title[locale]}
            </h3>
            <p className="doc-row__meta">
              {doc.meta[locale]} · {UI.onRequest[locale]}
            </p>
          </div>
          <Link
            className="btn btn--secondary btn--sm"
            href={inquiryHref(locale, doc.id)}
            data-track-doc={doc.id}
          >
            {UI.requestDocument[locale]}
            <IconArrowRight size={16} stroke={2} aria-hidden="true" />
            <span className="sr-only">: {doc.title[locale]}</span>
          </Link>
        </div>
      ))}
    </div>
  )
}
