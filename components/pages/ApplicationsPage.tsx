import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import { Breadcrumb } from '@/components/site/Breadcrumb'
import { CtaBand } from '@/components/site/CtaBand'
import { ApplicationIcon } from '@/components/ui/ApplicationIcon'
import { APPLICATIONS } from '@/content/applications'
import { NAV_LABEL, UI } from '@/content/dict'
import { APPLICATIONS_SECTION, HOME_CTA } from '@/content/pages'
import type { Locale } from '@/lib/i18n'
import { href } from '@/lib/routes'

export function ApplicationsPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[
          { label: UI.home[locale], url: href(locale) },
          { label: NAV_LABEL.applications[locale] },
        ]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h1 className="masthead__title">{APPLICATIONS_SECTION.title[locale]}</h1>
          <p className="masthead__lead">{APPLICATIONS_SECTION.lead[locale]}</p>
        </div>
      </section>

      <section className="section section--canvas">
        <div className="container">
          <div className="grid grid--3">
            {APPLICATIONS.map((app) => (
              <Link
                className="industry-tile"
                key={app.key}
                href={href(locale, 'applications', app.slug[locale])}
                data-reveal=""
              >
                <ApplicationIcon name={app.icon} className="industry-tile__icon" />
                <h2 className="industry-tile__name">{app.name[locale]}</h2>
                <p className="pillar__body">{app.short[locale]}</p>
                <p className="industry-tile__fluids">{app.fluids[locale]}</p>
                <span className="industry-tile__go">
                  {UI.viewApplication[locale]}
                  <IconArrowRight size={15} stroke={2} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} title={HOME_CTA.title[locale]} body={HOME_CTA.body[locale]} />
    </>
  )
}
