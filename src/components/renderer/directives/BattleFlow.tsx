'use client'

import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface BattleFlowProps {
  content: string
  className?: string
}

/**
 * :::battleflow
 * Renders a horizontal flow chart with nodes connected by arrows.
 * Each line = one node.
 */
export function BattleFlow({ content, className }: BattleFlowProps) {
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
        添加流程步骤（每行一个）
      </div>
    )
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2 py-4', className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* Node */}
          <div
            className="flex items-center justify-center rounded-[var(--radius-md)] border px-4 py-2 text-sm font-medium whitespace-nowrap"
            style={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-secondary)',
            }}
          >
            {step}
          </div>
          {/* Arrow (except last) */}
          {i < steps.length - 1 && (
            <ArrowRight
              size={16}
              style={{ color: 'var(--color-muted-foreground)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
