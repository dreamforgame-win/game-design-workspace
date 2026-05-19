'use client'

import { cn } from '@/lib/utils'

interface TimelineProps {
  content: string
  className?: string
}

/**
 * :::timeline
 * Renders a vertical timeline with dots + labels.
 * Format: - date: description
 */
export function Timeline({ content, className }: TimelineProps) {
  const entries = content
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        return {
          date: line.slice(0, colonIndex).trim(),
          description: line.slice(colonIndex + 1).trim(),
        }
      }
      return { date: '', description: line }
    })

  if (entries.length === 0) {
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
        添加时间线条目（- 日期: 描述）
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-0 py-2', className)}>
      {entries.map((entry, i) => (
        <div key={i} className="flex items-start gap-4">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center pt-1">
            <div
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            {i < entries.length - 1 && (
              <div
                className="w-px flex-1 min-h-[24px]"
                style={{ backgroundColor: 'var(--color-border)' }}
              />
            )}
          </div>
          {/* Content */}
          <div className="pb-6 flex-1">
            {entry.date && (
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-primary)' }}
              >
                {entry.date}
              </span>
            )}
            <p
              className="text-sm mt-0.5"
              style={{ color: 'var(--color-foreground)' }}
            >
              {entry.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
