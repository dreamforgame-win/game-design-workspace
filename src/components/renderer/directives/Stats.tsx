'use client'

import { cn } from '@/lib/utils'
import { BarChart3, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

interface StatsProps {
  content: string
  className?: string
}

interface StatItem {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
}

/**
 * :::stats
 * Key metric cards in a horizontal row (number + label + trend arrow).
 * Content format: - label: value (up|down|flat)
 *   or: - 玩家留存: 42% (up)
 */
export function Stats({ content, className }: StatsProps) {
  const items: StatItem[] = content
    .split('\n')
    .map((s) => s.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      // Parse: label: value (trend)
      const match = line.match(/^(.+?):\s*(.+?)\s*(?:\((up|down|flat)\))?$/i)
      if (match) {
        return {
          label: match[1].trim(),
          value: match[2].trim(),
          trend: (match[3]?.toLowerCase() as 'up' | 'down' | 'flat') || undefined,
        }
      }
      // Fallback: just label
      return { label: line, value: '' }
    })

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'rounded-[var(--radius-md)] border border-dashed p-6 text-center text-sm',
          className
        )}
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-muted-foreground)',
        }}
      >
        <BarChart3 size={20} className="mx-auto mb-2 opacity-50" />
        添加统计数据（格式: - 标签: 数值 (up/down/flat)）
      </div>
    )
  }

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
        <BarChart3 size={16} style={{ color: 'var(--color-primary)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-primary)' }}
        >
          关键指标
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-sm)] border p-3"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)',
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--color-muted-foreground)' }}
              >
                {item.label}
              </span>
              {item.trend && (
                <TrendIcon trend={item.trend} />
              )}
            </div>
            <div
              className="text-lg font-bold tabular-nums"
              style={{ color: 'var(--color-foreground)' }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  const colors = {
    up: 'var(--color-success)',
    down: 'var(--color-destructive)',
    flat: 'var(--color-muted-foreground)',
  }

  const icons = {
    up: <ArrowUpRight size={14} style={{ color: colors.up }} />,
    down: <ArrowDownRight size={14} style={{ color: colors.down }} />,
    flat: <Minus size={14} style={{ color: colors.flat }} />,
  }

  return (
    <span className="inline-flex items-center justify-center">
      {icons[trend]}
    </span>
  )
}
