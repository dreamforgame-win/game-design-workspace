'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]',
          'disabled:pointer-events-none disabled:opacity-50',
          'select-none whitespace-nowrap',
          // Minimum touch target (44px) per ui-ux-pro-max
          'min-h-[44px] min-w-[44px]',
          // Size
          size === 'sm' && 'h-9 px-3 text-sm rounded-[var(--radius-sm)]',
          size === 'md' && 'h-11 px-5 text-sm rounded-[var(--radius-md)]',
          size === 'lg' && 'h-12 px-8 text-base rounded-[var(--radius-md)]',
          // Variant
          variant === 'primary' &&
            'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90',
          variant === 'secondary' &&
            'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-muted)]',
          variant === 'ghost' &&
            'hover:bg-[var(--color-muted)] text-[var(--color-foreground)]',
          variant === 'danger' &&
            'bg-[var(--color-destructive)] text-white hover:opacity-90',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
