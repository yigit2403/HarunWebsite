'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import type { Locale } from '@/lib/i18n'

/**
 * First-party analytics beacon.
 *
 * One `sendBeacon` per page view, plus a single delegated click listener that
 * records which documents people ask for. No cookies, no IP, no cross-site id.
 * The session id lives in sessionStorage and dies with the tab.
 *
 * Honours Do Not Track and Global Privacy Control, and exits without doing any
 * work when either is set.
 */

const KEY = 'lql.sid'

function sessionId(): string | null {
  try {
    let id = sessionStorage.getItem(KEY)
    if (!id) {
      id = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      sessionStorage.setItem(KEY, id)
    }
    return id
  } catch {
    // Private mode with storage disabled. Skip rather than fall back to
    // anything that could identify the visitor.
    return null
  }
}

function optedOut(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string }
  return nav.doNotTrack === '1' || nav.globalPrivacyControl === true
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload)
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/collect', new Blob([body], { type: 'application/json' }))
      return
    }
  } catch {
    // sendBeacon can throw on a blocked origin. Fall through to fetch.
  }
  void fetch('/api/collect', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}

export function Beacon({ locale }: { locale: Locale }) {
  const pathname = usePathname()

  useEffect(() => {
    if (optedOut()) return
    const session = sessionId()
    if (!session) return

    send({
      type: 'view',
      path: pathname,
      locale,
      session,
      ref: document.referrer || '',
      width: window.innerWidth,
    })
  }, [pathname, locale])

  useEffect(() => {
    if (optedOut()) return

    // One delegated listener for the whole document, so the document rows stay
    // server components and no per-row client boundary is created.
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-track-doc]')
      if (!target) return
      const session = sessionId()
      if (!session) return
      send({ type: 'doc', doc: target.dataset.trackDoc, locale, session })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [locale])

  return null
}
