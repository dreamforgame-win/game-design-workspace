'use client'

import { cn } from '@/lib/utils'
import { MonitorPlay, Focus, FocusOff } from 'lucide-react'

interface ToolbarProps {
  onSave?: () => void
  isDirty?: boolean
  isSaving?: boolean
  onTogglePreview?: () => void
  onToggleSidebar?: () => void
  showPreview?: boolean
  showSidebar?: boolean
  onPresent?: () => void
  wordCount?: number
  focusMode?: boolean
  onToggleFocusMode?: () => void
}

export function EditorToolbar({
  onSave,
  isDirty,
  isSaving,
  onTogglePreview,
  onToggleSidebar,
  showPreview,
  showSidebar,
  onPresent,
  wordCount = 0,
  focusMode = false,
  onToggleFocusMode,
}: ToolbarProps) {
  return (
    <div
      className="h-12 border-b flex items-center px-4 gap-3 shrink-0"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Left: navigation */}
      <a
        href="/workspace"
        className="text-sm hover:underline"
        style={{ color: 'var(--color-muted-foreground)' }}
      >
        ← Workspace
      </a>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Word count */}
      {wordCount > 0 && (
        <span
          className="text-xs tabular-nums hidden sm:inline"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          {wordCount} 字
        </span>
      )}

      {/* Save indicator */}
      <div className="flex items-center gap-2">
        {isSaving && (
          <span className="text-xs" style={{ color: 'var(--color-warning)' }}>
            保存中...
          </span>
        )}
        {!isSaving && isDirty && (
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--color-warning)' }}
          />
        )}
        {!isSaving && !isDirty && (
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--color-success)' }}
          />
        )}
      </div>

      {/* Focus mode toggle */}
      {onToggleFocusMode && (
        <button
          onClick={onToggleFocusMode}
          className="p-2 rounded-[var(--radius-sm)] transition-colors min-h-[44px] min-w-[44px]"
          style={{
            color: focusMode ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
          }}
          aria-label={focusMode ? '退出专注模式' : '专注模式'}
        >
          {focusMode ? <FocusOff size={16} /> : <Focus size={16} />}
        </button>
      )}

      {/* Present */}
      {onPresent && (
        <button
          onClick={onPresent}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[var(--radius-sm)] text-xs transition-colors min-h-[44px]"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
          }}
        >
          <MonitorPlay size={14} />
          演示
        </button>
      )}

      {/* Toggle buttons */}
      <button
        onClick={onTogglePreview}
        className={cn(
          'h-8 px-3 rounded-[var(--radius-sm)] text-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center',
        )}
        style={{
          backgroundColor: showPreview ? 'var(--color-muted)' : 'transparent',
          color: showPreview ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
        }}
      >
        预览
      </button>
      <button
        onClick={onToggleSidebar}
        className={cn(
          'h-8 px-3 rounded-[var(--radius-sm)] text-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center',
        )}
        style={{
          backgroundColor: showSidebar ? 'var(--color-muted)' : 'transparent',
          color: showSidebar ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
        }}
      >
        侧栏
      </button>
    </div>
  )
}
