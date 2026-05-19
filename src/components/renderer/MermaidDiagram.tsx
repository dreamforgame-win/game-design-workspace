'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface MermaidDiagramProps {
  code: string
}

const MERMAID_THEMES: Record<string, string> = {
  'black-gold': 'dark',
  'scroll': 'default',
  'wargame': 'dark',
}

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = await import('mermaid')
        const mermaidTheme = MERMAID_THEMES[theme] || 'default'

        mermaid.default.initialize({
          startOnLoad: false,
          theme: mermaidTheme,
          securityLevel: 'strict',
        })

        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg } = await mermaid.default.render(id, code)

        if (!cancelled) {
          setSvg(svg)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError('图表渲染失败')
          console.error('Mermaid render error:', err)
        }
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [code, theme])

  if (error) {
    return (
      <div
        className="rounded-[var(--radius-md)] border border-dashed p-4 text-sm text-center"
        style={{
          borderColor: 'var(--color-destructive)',
          color: 'var(--color-destructive)',
          backgroundColor: 'var(--color-secondary)',
        }}
      >
        {error}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="rounded-[var(--radius-md)] border p-4 overflow-x-auto"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    >
      {!svg && (
        <div className="h-32 animate-pulse rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
      )}
    </div>
  )
}
