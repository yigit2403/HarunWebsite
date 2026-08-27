import { IconMail, IconMapPin, IconPhone, IconWorld } from '@tabler/icons-react'

import { InquiryForm } from '@/components/forms/InquiryForm'
import { Breadcrumb } from '@/components/site/Breadcrumb'
import { NAV_LABEL, UI } from '@/content/dict'
import { CONTACT_PAGE } from '@/content/pages'
import { ADDRESS_LINES, COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { INQUIRY_ANCHOR, href } from '@/lib/routes'

export function ContactPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Breadcrumb
        locale={locale}
        trail={[{ label: UI.home[locale], url: href(locale) }, { label: NAV_LABEL.contact[locale] }]}
      />

      <section className="masthead">
        <div className="container">
          <span className="rule" aria-hidden="true" />
          <h1 className="masthead__title">{CONTACT_PAGE.title[locale]}</h1>
          <p className="masthead__lead">{CONTACT_PAGE.lead[locale]}</p>
        </div>
      </section>

      <section className="section section--canvas" id={INQUIRY_ANCHOR[locale]}>
        <div className="container app-detail">
          <div data-reveal="">
            <h2 className="section-head__title section-head__title--sm">
              {CONTACT_PAGE.formTitle[locale]}
            </h2>
            <p className="section-head__lead" style={{ marginBottom: 'var(--s10)' }}>
              {CONTACT_PAGE.formLead[locale]}
            </p>
            <InquiryForm locale={locale} />
          </div>

          <aside className="app-aside" data-reveal="">
            <h2 className="app-aside__title">{CONTACT_PAGE.officeTitle[locale]}</h2>

            <ul className="footer-contact footer-contact--light">
              <li>
                <IconMapPin size={18} stroke={1.75} aria-hidden="true" />
                <span>
                  <strong style={{ display: 'block', color: 'var(--ink)', fontWeight: 600 }}>
                    {COMPANY.legalName}
                  </strong>
                  {ADDRESS_LINES[locale].map((line) => (
                    <span key={line} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <IconPhone size={18} stroke={1.75} aria-hidden="true" />
                <a className="phone-link" href={COMPANY.phoneHref}>
                  {COMPANY.phoneDisplay}
                </a>
              </li>
              <li>
                <IconMail size={18} stroke={1.75} aria-hidden="true" />
                <a href={COMPANY.emailHref}>{COMPANY.email}</a>
              </li>
              <li>
                <IconWorld size={18} stroke={1.75} aria-hidden="true" />
                <span>
                  {COMPANY.sites.map((site) => (
                    <span key={site.href} style={{ display: 'block' }}>
                      <a href={site.href} rel="noopener">
                        {site.label}
                      </a>
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}
