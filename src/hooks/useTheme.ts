'use client'

import { useTheme as useThemeContext } from '@/features/themes/theme-provider'
import { THEMES } from '@/types/theme'
import type { ThemeId, ThemeConfig } from '@/types/theme'

/**
 * Access the active theme and its full config.
 */
export function useTheme() {
  const { theme, setTheme } = useThemeContext()

  const config: ThemeConfig = THEMES[theme]

  return {
    theme,
    config,
    setTheme,
    allThemes: Object.values(THEMES),
  }
}

export type { ThemeId, ThemeConfig }
