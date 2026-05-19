'use client'

import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import type { ThemeId } from '@/types/theme'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeId
}

export function ThemeProvider({ children, defaultTheme = 'black-gold' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme)

  const setTheme = useCallback((newTheme: ThemeId) => {
    if (newTheme === theme) return
    // Crossfade: fade out → swap theme → fade in
    document.body.style.transition = 'opacity 150ms ease'
    document.body.style.opacity = '0'
    setTimeout(() => {
      setThemeState(newTheme)
      document.documentElement.setAttribute('data-theme', newTheme === 'black-gold' ? '' : newTheme)
      requestAnimationFrame(() => {
        document.body.style.opacity = '1'
        setTimeout(() => {
          document.body.style.transition = ''
        }, 150)
      })
    }, 150)
  }, [theme])

  useEffect(() => {
    // Apply theme on mount (skip for default which uses :root)
    if (theme !== 'black-gold') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
