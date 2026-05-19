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
    setThemeState(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme === 'black-gold' ? '' : newTheme)
  }, [])

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
