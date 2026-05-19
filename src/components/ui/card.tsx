'use client'

import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, className, onClick, hoverable = false }: CardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        'rounded-[var(--radius-md)] border p-4',
        'bg-[var(--color-card)] border-[var(--color-border)]',
        'text-[var(--color-card-foreground)]',
        hoverable && [
          'transition-all duration-[var(--transition-normal)]',
          '@media (pointer: fine) { &:hover { border-color: var(--color-primary); transform: scale(1.02); } }',
        ],
        onClick && 'cursor-pointer text-left w-full min-h-[44px]',
        className
      )}
    >
      {children}
    </Component>
  )
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3
      className={cn('font-semibold text-base', className)}
      style={{ color: 'var(--color-card-foreground)' }}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn('text-sm mt-1', className)}
      style={{ color: 'var(--color-muted-foreground)' }}
    >
      {children}
    </p>
  )
}
