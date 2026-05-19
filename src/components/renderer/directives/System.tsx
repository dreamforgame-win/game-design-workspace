'use client'

import { cn } from '@/lib/utils'
import { Settings } from 'lucide-react'

interface SystemProps {
  title?: string
  content: string
  className?: string
}

/**
 * :::system{title="..."}
 * System diagram card with structured key-value display.
 * Content format: - key: value
 */
export function SystemDirective({ title, content, className }: SystemProps) {
  const entries = content
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        return {
          key: line.slice(0, colonIndex).trim(),
          value: line.slice(colonIndex + 1).trim(),
        }
      }
      return { key: '', value: line }
    })

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border p-4',
        className
      )}
      style={{
        borderColor: 'var(--color-accent)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Settings
          size={16}
          style={{ color: 'var(--color-accent)' }}
        />
        {title && (
          <h4
            className="font-semibold text-sm uppercase tracking-wider"
            style={{ color: 'var(--color-accent)' }}
          >
            {title}
          </h4>
        )}
      </div>
      {/* Key-value entries */}
      {entries.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-baseline gap-2 text-sm">
              {entry.key && (
                <span
                  className="font-medium shrink-0"
                  style={{ color: 'var(--color-foreground)' }}
                >
                  {entry.key}:
                </span>
              )}
              <span style={{ color: 'var(--color-muted-foreground)' }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          添加系统定义（- 属性: 值）
        </p>
      )}
    </div>
  )
}
