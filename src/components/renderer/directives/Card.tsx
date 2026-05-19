'use client'

import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

interface CardDirectiveProps {
  title?: string
  icon?: string
  content: string
  className?: string
}

/**
 * :::card{title="..." icon="..."}
 * Renders a bordered card with title, optional icon, and body text.
 */
export function CardDirective({ title, icon, content, className }: CardDirectiveProps) {
  // Dynamically get Lucide icon
  const IconComponent = icon
    ? (LucideIcons as any)[icon.charAt(0).toUpperCase() + icon.slice(1)]
    : null

  if (!content.trim() && !title) {
    return (
      <div
        className={cn(
          'rounded-[var(--radius-md)] border border-dashed p-4 text-center text-sm',
          className
        )}
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-muted-foreground)',
        }}
      >
        添加内容
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border p-4',
        className
      )}
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {(title || IconComponent) && (
        <div className="flex items-center gap-2 mb-2">
          {IconComponent && (
            <IconComponent
              size={18}
              style={{ color: 'var(--color-primary)' }}
            />
          )}
          {title && (
            <h4
              className="font-semibold text-base"
              style={{ color: 'var(--color-card-foreground)' }}
            >
              {title}
            </h4>
          )}
        </div>
      )}
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--color-muted-foreground)' }}
      >
        {content}
      </p>
    </div>
  )
}
