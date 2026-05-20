'use client'

import { cn } from '@/lib/utils'
import { Scale } from 'lucide-react'

interface BalanceProps {
  left?: string
  right?: string
  content: string
  className?: string
}

/**
 * :::balance{left="..." right="..."}
 * Two-column comparison (A vs B) with pros/cons.
 * Content format: - itemA | itemB
 */
export function Balance({ left, right, content, className }: BalanceProps) {
  const rows = content
    .split('\n')
    .map((s) => s.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((s) => s.trim())
      return {
        left: parts[0] || '',
        right: parts[1] || '',
      }
    })

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
        <Scale size={16} style={{ color: 'var(--color-primary)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-primary)' }}
        >
          方案对比
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div
          className="text-sm font-semibold px-3 py-2 rounded-[var(--radius-sm)] text-center"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-foreground)',
          }}
        >
          {left || '方案 A'}
        </div>
        <div
          className="text-sm font-semibold px-3 py-2 rounded-[var(--radius-sm)] text-center"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-foreground)',
          }}
        >
          {right || '方案 B'}
        </div>
      </div>

      {/* Rows */}
      {rows.length > 0 ? (
        <div className="flex flex-col gap-1">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <div
                className="px-3 py-2 rounded-[var(--radius-sm)] text-sm"
                style={{
                  backgroundColor: 'rgba(var(--color-primary-rgb, 212 175 55) / 0.06)',
                  color: 'var(--color-foreground)',
                }}
              >
                {row.left}
              </div>
              <div
                className="px-3 py-2 rounded-[var(--radius-sm)] text-sm"
                style={{
                  backgroundColor: 'rgba(var(--color-accent-rgb, 184 134 11) / 0.06)',
                  color: 'var(--color-foreground)',
                }}
              >
                {row.right}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-center py-4" style={{ color: 'var(--color-muted-foreground)' }}>
          添加对比项（格式: - 方案A内容 | 方案B内容）
        </p>
      )}
    </div>
  )
}
