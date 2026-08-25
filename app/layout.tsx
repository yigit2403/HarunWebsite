import type { ReactNode } from 'react'

/**
 * Pass-through root. The real document shell lives in app/[locale]/layout.tsx
 * so that <html lang> carries the language of the page being served rather
 * than a hardcoded default.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
