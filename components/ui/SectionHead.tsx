import type { ReactNode } from 'react'

/**
 * Section heading with the business card's short red rule above it.
 *
 * The rule is the site's recurring brand artifact and appears on every major
 * heading. The uppercase text `kicker` above it is deliberately rationed and
 * is used on no more than three sections of a page.
 */
export function SectionHead({
  kicker,
  title,
  lead,
  action,
  id,
  as: Heading = 'h2',
  centred = false,
}: {
  kicker?: string
  title: ReactNode
  lead?: ReactNode
  action?: ReactNode
  id?: string
  as?: 'h1' | 'h2' | 'h3'
  centred?: boolean
}) {
  const head = (
    <div>
      <span className={centred ? 'rule rule--center' : 'rule'} aria-hidden="true" />
      {kicker ? <span className="kicker">{kicker}</span> : null}
      <Heading id={id} className="section-head__title">
        {title}
      </Heading>
      {lead ? <p className="section-head__lead">{lead}</p> : null}
    </div>
  )

  if (!action) {
    return (
      <div className="section-head" data-reveal="">
        {head}
      </div>
    )
  }

  return (
    <div className="section-head section-head--row" data-reveal="">
      {head}
      <div>{action}</div>
    </div>
  )
}
