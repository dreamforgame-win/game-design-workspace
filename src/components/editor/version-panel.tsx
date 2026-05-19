'use client'

import { useState, useCallback, useEffect } from 'react'
import { listVersions, restoreVersion } from '@/features/documents/version-actions'
import { formatRelativeDate } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import { RotateCcw, Eye, X } from 'lucide-react'

interface Version {
  id: string
  content: string
  createdAt: Date
}

interface VersionPanelProps {
  slug: string
  onRestore?: (content: string) => void
}

export function VersionPanel({ slug, onRestore }: VersionPanelProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [previewVersion, setPreviewVersion] = useState<Version | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const loadVersions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await listVersions(slug)
      setVersions(data.map((v) => ({ ...v, createdAt: new Date(v.createdAt) })))
    } catch {
      // Silently fail — version history is non-critical
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadVersions()
  }, [loadVersions])

  const handleRestore = async (versionId: string) => {
    setIsRestoring(true)
    try {
      const restoredContent = await restoreVersion(slug, versionId)
      if (restoredContent) {
        onRestore?.(restoredContent)
        setPreviewVersion(null)
        // Refresh list after restore
        await loadVersions()
      }
    } catch {
      // Error handled silently
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            版本历史
          </h3>
          <button
            onClick={loadVersions}
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            刷新
          </button>
        </div>

        {isLoading && versions.length === 0 && (
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            加载中...
          </p>
        )}

        {versions.length === 0 && !isLoading && (
          <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
            编辑文档后将自动保存版本（每5分钟一次）
          </p>
        )}

        <div className="flex flex-col gap-1">
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] group"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <span
                className="text-xs flex-1 truncate"
                style={{ color: 'var(--color-muted-foreground)' }}
              >
                {formatRelativeDate(version.createdAt)}
              </span>
              <button
                onClick={() => setPreviewVersion(version)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded min-h-[28px] min-w-[28px] flex items-center justify-center"
                style={{ color: 'var(--color-primary)' }}
                aria-label="预览"
              >
                <Eye size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewVersion}
        onClose={() => setPreviewVersion(null)}
        title={previewVersion ? formatRelativeDate(new Date(previewVersion.createdAt)) : ''}
      >
        {previewVersion && (
          <div className="flex flex-col gap-4 max-h-[60vh]">
            <div
              className="overflow-auto rounded-[var(--radius-md)] border p-4 text-sm"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
              }}
            >
              <MarkdownRenderer content={previewVersion.content} />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewVersion(null)}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[var(--radius-md)] text-sm transition-colors"
                style={{
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              >
                <X size={14} />
                取消
              </button>
              <button
                onClick={() => handleRestore(previewVersion.id)}
                disabled={isRestoring}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[var(--radius-md)] text-sm transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-foreground)',
                }}
              >
                <RotateCcw size={14} />
                {isRestoring ? '恢复中...' : '恢复此版本'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
