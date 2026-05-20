'use client'

import { cn } from '@/lib/utils'
import { Grid3X3 } from 'lucide-react'

interface MatrixProps {
  x?: string
  y?: string
  content: string
  className?: string
}

/**
 * :::matrix{x="..." y="..."}
 * 2x2 or NxN matrix/grid with labeled axes.
 * Content format: - label: quadrant
 *   or: - 高/高: PvP系统
 */
export function Matrix({ x, y, content, className }: MatrixProps) {
  const items = content
    .split('\n')
    .map((s) => s.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        return {
          label: line.slice(0, colonIndex).trim(),
          value: line.slice(colonIndex + 1).trim(),
        }
      }
      return { label: line, value: '' }
    })

  // Determine grid size: default to 2x2 if 4 items, otherwise auto
  const cols = items.length === 4 ? 2 : Math.min(items.length, 3)

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border p-4 my-4',
        className
      )}
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Grid3X3 size={16} style={{ color: 'var(--color-primary)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-primary)' }}
        >
          矩阵分析
        </span>
      </div>

      {/* Axes labels */}
      {(x || y) && (
        <div className="flex items-center justify-between mb-3 text-xs">
          {x && (
            <span style={{ color: 'var(--color-muted-foreground)' }}>
              X轴: {x}
            </span>
          )}
          {y && (
            <span style={{ color: 'var(--color-muted-foreground)' }}>
              Y轴: {y}
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {items.length > 0 ? (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-sm)] border p-3 text-center"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
              }}
            >
              {item.label && (
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {item.label}
                </div>
              )}
              {item.value && (
                <div className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                  {item.value}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-center py-4" style={{ color: 'var(--color-muted-foreground)' }}>
          添加矩阵项（格式: - 标签: 内容）
        </p>
      )}
    </div>
  )
}
