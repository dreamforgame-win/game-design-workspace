'use client'

import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface SidebarProps {
  theme: string
  onThemeChange: (theme: string) => void
}

export function EditorSidebar({ theme, onThemeChange }: SidebarProps) {
  const { allThemes } = useTheme()

  return (
    <aside
      className="w-56 border-l p-4 shrink-0 overflow-auto"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Theme Selector */}
      <div className="mb-6">
        <h3
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          主题
        </h3>
        <div className="flex flex-col gap-1.5">
          {allThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={cn(
                'text-left px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors min-h-[44px]',
              )}
              style={{
                backgroundColor:
                  theme === t.id ? 'var(--color-muted)' : 'transparent',
                color:
                  theme === t.id ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
              }}
            >
              <span className="font-medium">{t.displayName}</span>
              <span className="block text-xs mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                {t.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* TOC placeholder */}
      <div>
        <h3
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          目录
        </h3>
        <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
          自动生成自标题
        </p>
      </div>
    </aside>
  )
}
