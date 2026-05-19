/**
 * Theme type definitions
 * Matches CSS custom property structure in globals.css
 */

export type ThemeId = 'black-gold' | 'scroll' | 'wargame'

export interface ThemeConfig {
  id: ThemeId
  name: string
  displayName: string
  description: string
  colors: {
    background: string
    foreground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    muted: string
    mutedForeground: string
    border: string
    card: string
    cardForeground: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    codeFont: string
    headingWeight: number
    bodyLineHeight: number
    scale: [number, number, number, number, number, number] // h1-h6 in rem
  }
  spacing: {
    sectionGap: string
    paragraphGap: string
    contentMaxWidth: string
  }
  decoration: {
    radius: string
    borderWidth: string
    shadowStyle: 'none' | 'subtle' | 'elevated'
    backgroundType: 'solid' | 'gradient' | 'texture'
    backgroundValue: string
  }
  animation: {
    pageTransition: 'fade' | 'slide' | 'none'
    entranceStagger: number // ms
    hoverScale: number
  }
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'black-gold': {
    id: 'black-gold',
    name: 'black-gold',
    displayName: '极简黑金',
    description: '商业汇报 · 系统设计',
    colors: {
      background: '#0a0a0a',
      foreground: '#fafafa',
      primary: '#d4af37',
      primaryForeground: '#0a0a0a',
      secondary: '#1a1a1a',
      secondaryForeground: '#fafafa',
      accent: '#b8860b',
      muted: '#262626',
      mutedForeground: '#a3a3a3',
      border: '#2a2a2a',
      card: '#111111',
      cardForeground: '#fafafa',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      codeFont: 'JetBrains Mono',
      headingWeight: 700,
      bodyLineHeight: 1.5,
      scale: [2.5, 2, 1.5, 1.25, 1, 0.875],
    },
    spacing: {
      sectionGap: '3rem',
      paragraphGap: '1.5rem',
      contentMaxWidth: '720px',
    },
    decoration: {
      radius: '8px',
      borderWidth: '1px',
      shadowStyle: 'subtle',
      backgroundType: 'solid',
      backgroundValue: '#0a0a0a',
    },
    animation: {
      pageTransition: 'fade',
      entranceStagger: 80,
      hoverScale: 1.02,
    },
  },
  scroll: {
    id: 'scroll',
    name: 'scroll',
    displayName: '修仙卷轴',
    description: '国风 MMO · 古典风格',
    colors: {
      background: '#f5f0e8',
      foreground: '#2c2c2c',
      primary: '#8b4513',
      primaryForeground: '#f5f0e8',
      secondary: '#ede6db',
      secondaryForeground: '#2c2c2c',
      accent: '#4a6741',
      muted: '#e8e0d4',
      mutedForeground: '#6b5c4f',
      border: '#d4c9b8',
      card: '#faf6f0',
      cardForeground: '#2c2c2c',
    },
    typography: {
      headingFont: 'Noto Serif SC',
      bodyFont: 'Noto Sans SC',
      codeFont: 'JetBrains Mono',
      headingWeight: 700,
      bodyLineHeight: 1.7,
      scale: [2.5, 2, 1.5, 1.25, 1, 0.875],
    },
    spacing: {
      sectionGap: '4rem',
      paragraphGap: '1.75rem',
      contentMaxWidth: '680px',
    },
    decoration: {
      radius: '4px',
      borderWidth: '0px',
      shadowStyle: 'none',
      backgroundType: 'texture',
      backgroundValue: 'parchment',
    },
    animation: {
      pageTransition: 'fade',
      entranceStagger: 120,
      hoverScale: 1.01,
    },
  },
  wargame: {
    id: 'wargame',
    name: 'wargame',
    displayName: '战争沙盘',
    description: 'SLG · GVG · 战区设计',
    colors: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      primary: '#ff6b35',
      primaryForeground: '#0d1117',
      secondary: '#161b22',
      secondaryForeground: '#c9d1d9',
      accent: '#58a6ff',
      muted: '#21262d',
      mutedForeground: '#8b949e',
      border: '#30363d',
      card: '#161b22',
      cardForeground: '#c9d1d9',
    },
    typography: {
      headingFont: 'Rajdhani',
      bodyFont: 'Inter',
      codeFont: 'JetBrains Mono',
      headingWeight: 600,
      bodyLineHeight: 1.5,
      scale: [2.5, 2, 1.5, 1.25, 1, 0.875],
    },
    spacing: {
      sectionGap: '2.5rem',
      paragraphGap: '1.25rem',
      contentMaxWidth: '800px',
    },
    decoration: {
      radius: '2px',
      borderWidth: '1px',
      shadowStyle: 'none',
      backgroundType: 'solid',
      backgroundValue: '#0d1117',
    },
    animation: {
      pageTransition: 'slide',
      entranceStagger: 60,
      hoverScale: 1.01,
    },
  },
}
