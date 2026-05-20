'use client'

import { cn } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'

interface LoopProps {
  content: string
  className?: string
}

/**
 * :::loop
 * Renders a circular flow diagram for closed loops (core loops, feedback loops).
 * Each line = one node in the cycle.
 */
export function Loop({ content, className }: LoopProps) {
  const steps = content
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  if (steps.length === 0) {
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
        <RefreshCw size={20} className="mx-auto mb-2 opacity-50" />
        添加循环节点（每行一个）
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
        <RefreshCw size={16} style={{ color: 'var(--color-primary)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-primary)' }}
        >
          循环
        </span>
      </div>

      {/* Circular flow */}
      <div className="flex flex-wrap items-center gap-2 py-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* Node */}
            <div
              className="flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-secondary)',
              }}
            >
              {step}
            </div>
            {/* Arrow with curved indicator */}
            {i < steps.length - 1 ? (
              <div className="flex items-center">
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M2 8h18M16 3l6 5-6 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ color: 'var(--color-muted-foreground)' }}
                  />
                </svg>
              </div>
            ) : (
              /* Closing loop arrow back to start */
              <div className="flex items-center">
                <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                  <path
                    d="M2 8h22M22 3l6 5-6 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ color: 'var(--color-primary)' }}
                  />
                </svg>
                <span
                  className="ml-1 text-xs font-medium"
                  style={{ color: 'var(--color-primary)' }}
                >
                  循环
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
