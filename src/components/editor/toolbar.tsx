'use client'

import { cn } from '@/lib/utils'

interface ToolbarProps {
  onSave?: () => void
  isDirty?: boolean
  isSaving?: boolean
  onTogglePreview?: () => void
  onToggleSidebar?: () => void
  showPreview?: boolean
  showSidebar?: boolean
}

export function EditorToolbar({
  onSave,
  isDirty,
  isSaving,
  onTogglePreview,
  onToggleSidebar,
  showPreview,
  showSidebar,
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
