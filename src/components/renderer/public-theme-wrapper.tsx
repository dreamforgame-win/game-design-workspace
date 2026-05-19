'use client'

import { useEffect } from 'react'

interface PublicThemeWrapperProps {
  theme: string
  children: React.ReactNode
}

/**
 * Client component that sets the data-theme attribute on <html>
 * for public share pages (Server Components can't access DOM).
 */
export function PublicThemeWrapper({ theme, children }: PublicThemeWrapperProps) {
  useEffect(() => {
    if (theme && theme !== 'black-gold') {
      document.documentElement.setAttribute('data-theme', theme)
    } else {
      document.documentElement.removeAttribute('data-theme')
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  return <>{children}</>
}
