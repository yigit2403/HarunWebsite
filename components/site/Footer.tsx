import Link from 'next/link'
import { IconMail, IconMapPin, IconPhone, IconWorld } from '@tabler/icons-react'

import { Brand } from './Brand'
import { LanguageSwitcher } from './LanguageSwitcher'
import { APPLICATIONS } from '@/content/applications'
import { NAV_LABEL, UI } from '@/content/dict'
import { PRODUCTS } from '@/content/products'
import { ADDRESS_LINES, COMPANY } from '@/content/site'
import type { Locale, Localised } from '@/lib/i18n'
import { href } from '@/lib/routes'

const FOOTER_COMPANY_COL: Localised = { tr: 'Şirket', en: 'Company' }

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Brand locale={locale} footer />
            <p className="footer-brand__legal">{COMPANY.legalName}</p>
            <ul className="footer-contact">
              <li>
                <IconMapPin size={18} stroke={1.75} aria-hidden="true" />
                <span>
                  {ADDRESS_LINES[locale].map((line) => (
                    <span key={line} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <IconPhone size={18} stroke={1.75} aria-hidden="true" />
                <a href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>
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
          </div>

          <div className="footer-col">
            <h2 className="footer-col__title">{NAV_LABEL.products[locale]}</h2>
            <ul>
              {PRODUCTS.map((product) => (
                <li key={product.slug}>
                  <Link href={href(locale, 'products', product.slug)}>{product.name}</Link>
                </li>
              ))}
              <li>
                <Link href={href(locale, 'products')}>{UI.allProducts[locale]}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-col__title">{NAV_LABEL.applications[locale]}</h2>
            <ul>
              {APPLICATIONS.map((app) => (
                <li key={app.key}>
                  <Link href={href(locale, 'applications', app.slug[locale])}>
                    {app.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-col__title">{FOOTER_COMPANY_COL[locale]}</h2>
            <ul>
              <li>
                <Link href={href(locale, 'about')}>{NAV_LABEL.about[locale]}</Link>
              </li>
              <li>
                <Link href={href(locale, 'engineering')}>{NAV_LABEL.engineering[locale]}</Link>
              </li>
              <li>
                <Link href={href(locale, 'support')}>{NAV_LABEL.support[locale]}</Link>
              </li>
              <li>
                <Link href={href(locale, 'contact')}>{NAV_LABEL.contact[locale]}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <p>
            © {year} {COMPANY.legalName} {UI.copyright[locale]}
          </p>
          <div className="footer-base__links">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  )
}
