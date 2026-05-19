'use client'

import { cn } from '@/lib/utils'
import { FileText } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--color-muted)' }}
      >
        {icon || <FileText size={24} style={{ color: 'var(--color-muted-foreground)' }} />}
      </div>
      <h3
        className="text-lg font-medium mb-2"
        style={{ color: 'var(--color-foreground)' }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm max-w-sm mb-6"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  )
}
