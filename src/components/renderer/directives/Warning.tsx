'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface WarningProps {
  title?: string
  content: string
  className?: string
}

/**
 * :::warning{title="..."}
 * Highlighted callout box with amber accent and warning icon.
 */
export function WarningDirective({ title, content, className }: WarningProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border-l-4 p-4',
        className
      )}
      style={{
        borderLeftColor: 'var(--color-warning)',
        backgroundColor: 'var(--color-secondary)',
      }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={18}
          className="shrink-0 mt-0.5"
          style={{ color: 'var(--color-warning)' }}
        />
        <div>
          {title && (
            <h4
              className="font-semibold text-sm mb-1"
              style={{ color: 'var(--color-foreground)' }}
            >
              {title}
            </h4>
          )}
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            {content || '添加警告内容'}
          </p>
        </div>
      </div>
    </div>
  )
}
