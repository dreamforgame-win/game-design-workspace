'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SlideControlsProps {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
  onExit: () => void
  isFirst: boolean
  isLast: boolean
}

export function SlideControls({
  current,
  total,
  onPrev,
  onNext,
  onExit,
  isFirst,
  isLast,
}: SlideControlsProps) {
  return (
    <div
      className="h-14 flex items-center justify-between px-6 shrink-0"
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
        style={{ color: 'var(--color-foreground)' }}
        aria-label="上一页"
      >
        <ChevronLeft size={16} />
        上一页
      </button>

      {/* Page indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--color-foreground)' }}>
          {current}
        </span>
        <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          /
        </span>
        <span className="text-sm tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>
          {total}
        </span>
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={isLast}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px]"
        style={{ color: 'var(--color-foreground)' }}
        aria-label="下一页"
      >
        下一页
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
