'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * The site's only load-time motion. Server components mark an element with
 * `data-reveal` and this single observer flips it to `data-reveal="shown"` as
 * it enters the viewport, which fades and lifts it 12px. One observer for the
 * whole document rather than a client wrapper per element, so the amount of
 * JavaScript shipped does not grow with the length of the page.
 *
 * No scroll listener is used anywhere on this site. Under
 * prefers-reduced-motion the CSS shows everything immediately and this effect
 * exits without doing any work.
 */
export function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal=""]'))
    if (targets.length === 0) return

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.setAttribute('data-reveal', 'shown'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-reveal', 'shown')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
