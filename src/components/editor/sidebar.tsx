'use client'

import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { Globe, Lock, ExternalLink } from 'lucide-react'

interface SidebarProps {
  theme: string
  onThemeChange: (theme: string) => void
  isPublic: boolean
  onTogglePublic: () => void
  slug: string
}

export function EditorSidebar({
  theme,
  onThemeChange,
  isPublic,
  onTogglePublic,
  slug,
}: SidebarProps) {
  const { allThemes } = useTheme()

  return (
    <aside
      className="w-56 border-l p-4 shrink-0 overflow-auto"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
      }}
    >
      {/* Public Toggle */}
      <div className="mb-6">
        <h3
          className="text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          分享
        </h3>
        <button
          onClick={onTogglePublic}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors min-h-[44px]"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-foreground)',
          }}
        >
          {isPublic ? (
            <>
              <Globe className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
              <span>已公开</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" style={{ color: 'var(--color-muted-foreground)' }} />
              <span>未公开</span>
            </>
          )}
        </button>
        {isPublic && (
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            <ExternalLink className="w-3 h-3" />
            查看公开页
          </a>
        )}
      </div>

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
