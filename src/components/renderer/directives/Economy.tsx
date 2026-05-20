'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, Database, TrendingDown } from 'lucide-react'

interface EconomyProps {
  title?: string
  content: string
  className?: string
}

/**
 * :::economy{title="..."}
 * Sink/Faucet diagram showing Sources → Pool → Drains.
 * Content format:
 *   [Sources] 任务, 副本, 交易所
 *   [Pool] 玩家金币
 *   [Sinks] 强化, 商店, 修理
 */
export function Economy({ title, content, className }: EconomyProps) {
  let sources: string[] = []
  let pool = ''
  let sinks: string[] = []

  const lines = content.split('\n').map((s) => s.trim())

  for (const line of lines) {
    if (line.toLowerCase().startsWith('[sources]')) {
      sources = line
        .replace(/\[sources\]/i, '')
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (line.toLowerCase().startsWith('[pool]')) {
      pool = line.replace(/\[pool\]/i, '').trim()
    } else if (line.toLowerCase().startsWith('[sinks]')) {
      sinks = line
        .replace(/\[sinks\]/i, '')
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }

  const hasData = sources.length > 0 || pool || sinks.length > 0

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
      <div className="flex items-center gap-2 mb-4">
        <Database size={16} style={{ color: 'var(--color-primary)' }} />
        {title && (
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--color-foreground)' }}
          >
            {title}
          </span>
        )}
      </div>

      {hasData ? (
        <div className="flex items-stretch gap-3">
          {/* Sources */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-success)' }}
              >
                来源 Sources
              </span>
            </div>
            {sources.length > 0 ? (
              sources.map((s, i) => (
                <div
                  key={i}
                  className="text-sm px-3 py-1.5 rounded-[var(--radius-sm)]"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {s}
                </div>
              ))
            ) : (
              <div
                className="text-sm px-3 py-1.5 rounded-[var(--radius-sm)]"
                style={{
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                —
              </div>
            )}
          </div>

          {/* Arrow to pool */}
          <div className="flex flex-col justify-center items-center gap-1 shrink-0 w-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h12M15 8l6 4-6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: 'var(--color-muted-foreground)' }}
              />
            </svg>
          </div>

          {/* Pool */}
          <div
            className="shrink-0 w-32 flex flex-col items-center justify-center rounded-[var(--radius-md)] border p-3"
            style={{
              borderColor: 'var(--color-primary)',
              backgroundColor: 'var(--color-secondary)',
            }}
          >
            <Database size={20} className="mb-1" style={{ color: 'var(--color-primary)' }} />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-primary)' }}
            >
              池 Pool
            </span>
            {pool && (
              <span className="text-sm mt-1 text-center" style={{ color: 'var(--color-foreground)' }}>
                {pool}
              </span>
            )}
          </div>

          {/* Arrow to sinks */}
          <div className="flex flex-col justify-center items-center gap-1 shrink-0 w-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h12M15 8l6 4-6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ color: 'var(--color-muted-foreground)' }}
              />
            </svg>
          </div>

          {/* Sinks */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} style={{ color: 'var(--color-destructive)' }} />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-destructive)' }}
              >
                消耗 Sinks
              </span>
            </div>
            {sinks.length > 0 ? (
              sinks.map((s, i) => (
                <div
                  key={i}
                  className="text-sm px-3 py-1.5 rounded-[var(--radius-sm)]"
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  {s}
                </div>
              ))
            ) : (
              <div
                className="text-sm px-3 py-1.5 rounded-[var(--radius-sm)]"
                style={{
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-muted-foreground)',
                }}
              >
                —
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-center py-4" style={{ color: 'var(--color-muted-foreground)' }}>
          添加经济系统（格式: [Sources] ... / [Pool] ... / [Sinks] ...）
        </p>
      )}
    </div>
  )
}
