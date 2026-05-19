'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, Code, Pencil, XCircle } from 'lucide-react'
import type { FeatureStatus } from '@/types/directive'

interface FeatureProps {
  title?: string
  status?: string
  content: string
  className?: string
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  design: { label: '设计', icon: <Pencil size={12} />, color: 'var(--color-accent)' },
  dev: { label: '开发', icon: <Code size={12} />, color: 'var(--color-primary)' },
  done: { label: '完成', icon: <CheckCircle size={12} />, color: 'var(--color-success)' },
  cut: { label: '砍掉', icon: <XCircle size={12} />, color: 'var(--color-destructive)' },
}

/**
 * :::feature{title="..." status="design|dev|done|cut"}
 * Feature card with status badge.
 */
export function FeatureDirective({ title, status, content, className }: FeatureProps) {
  const statusConfig = status ? STATUS_CONFIG[status] : null

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] border p-4',
        className
      )}
      style={{
        borderColor: statusConfig ? statusConfig.color : 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Header: title + status badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {title && (
          <h4
            className="font-semibold text-base"
            style={{ color: 'var(--color-card-foreground)' }}
          >
            {title}
          </h4>
        )}
        {statusConfig && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            style={{
              color: statusConfig.color,
              backgroundColor: `color-mix(in srgb, ${statusConfig.color} 15%, transparent)`,
            }}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        )}
      </div>
      {/* Body */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--color-muted-foreground)' }}
      >
        {content || '添加功能描述'}
      </p>
    </div>
  )
}
