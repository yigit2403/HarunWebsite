'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconChevronRight, IconMenu2, IconPhone, IconX } from '@tabler/icons-react'

import { Brand } from './Brand'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NAV_LABEL, UI } from '@/content/dict'
import { COMPANY } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { NAV_ORDER, SEGMENTS, href } from '@/lib/routes'

/**
 * Sticky header. One line at desktop at 72px, a hamburger drawer below 1024px.
 * The active section is marked with a red underline and with aria-current, so
 * the state is never carried by colour alone.
 */
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? ''
  const [open, setOpen] = useState(false)
  const currentSegment = pathname.split('/').filter(Boolean)[1]

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [pathname])

  // Lock the page behind the drawer while it is open.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const items = NAV_ORDER.map((key) => ({
    key,
    label: NAV_LABEL[key][locale],
    url: href(locale, key),
    active: SEGMENTS[key][locale] === currentSegment,
  }))

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand locale={locale} />

        <nav className="site-nav" aria-label={UI.primaryNav[locale]}>
          {items.map((item) => (
            <Link
              key={item.key}
              className="site-nav__link"
              href={item.url}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="header-phone" href={COMPANY.phoneHref}>
            {COMPANY.phoneDisplay}
          </a>
          <LanguageSwitcher locale={locale} />
          <Link className="btn btn--primary btn--sm" href={href(locale, 'contact')}>
            {UI.ctaContactShort[locale]}
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="site-drawer"
            aria-label={open ? UI.closeMenu[locale] : UI.openMenu[locale]}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <IconX size={24} stroke={1.75} aria-hidden="true" />
            ) : (
              <IconMenu2 size={24} stroke={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div className="drawer" id="site-drawer">
          <div className="container">
            <nav className="drawer__list" aria-label={UI.primaryNav[locale]}>
              {items.map((item) => (
                <Link
                  key={item.key}
                  className="drawer__link"
                  href={item.url}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {item.label}
                  <IconChevronRight size={20} stroke={1.75} aria-hidden="true" />
                </Link>
              ))}
              <Link className="drawer__link" href={href(locale, 'contact')}>
                {NAV_LABEL.contact[locale]}
                <IconChevronRight size={20} stroke={1.75} aria-hidden="true" />
              </Link>
            </nav>

            <div className="drawer__foot">
              <a className="drawer__phone" href={COMPANY.phoneHref}>
                <IconPhone size={20} stroke={1.75} aria-hidden="true" />
                {COMPANY.phoneDisplay}
              </a>
              <Link className="btn btn--primary btn--block" href={href(locale, 'contact')}>
                {UI.ctaSupport[locale]}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
