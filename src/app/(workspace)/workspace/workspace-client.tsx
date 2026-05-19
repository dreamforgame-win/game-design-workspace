'use client'

import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { createDocument } from '@/features/documents/actions'
import { TEMPLATES } from '@/features/documents/templates'
import { Modal } from '@/components/ui/modal'
import { formatRelativeDate } from '@/lib/utils'

interface DocumentItem {
  id: string
  title: string
  slug: string
  theme: string
  wordCount: number
  isPublic: boolean
  updatedAt: Date
  createdAt: Date
}

interface WorkspaceClientProps {
  documents: DocumentItem[]
}

export function WorkspaceClient({ documents }: WorkspaceClientProps) {
  const [search, setSearch] = useState('')
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleNewDocument = async (templateContent = '') => {
    setShowTemplateModal(false)
    await createDocument(templateContent)
  }

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
          Workspace
        </h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-muted-foreground)' }}
            />
            <input
              type="text"
              placeholder="搜索文档..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-48 rounded-[var(--radius-md)] border pl-9 pr-3 text-sm bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            />
          </div>

          {/* New */}
          <Button
            onClick={() => setShowTemplateModal(true)}
            variant="primary"
            size="md"
          >
            <Plus size={16} className="mr-1" />
            新建
          </Button>
        </div>
      </header>

      {/* Document Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title={documents.length === 0 ? '开始你的第一个设计文档' : '没有找到匹配的文档'}
          description={
            documents.length === 0
              ? '创建一个文档，将你的游戏设计想法可视化。'
              : '尝试不同的搜索关键词。'
          }
          action={
            documents.length === 0
              ? { label: '新建文档', onClick: () => setShowTemplateModal(true) }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <a
              key={doc.id}
              href={`/editor/${doc.slug}`}
              className="block rounded-[var(--radius-md)] border p-4 transition-all hover:border-[var(--color-primary)] min-h-[44px]"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
              }}
            >
              <h3 className="font-medium truncate" style={{ color: 'var(--color-card-foreground)' }}>
                {doc.title || 'Untitled'}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  {formatRelativeDate(new Date(doc.updatedAt))}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                  · {doc.wordCount} 字
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="选择模板"
      >
        <div className="flex flex-col gap-2">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleNewDocument(tpl.content)}
              className="text-left p-3 rounded-[var(--radius-md)] border hover:border-[var(--color-primary)] transition-colors min-h-[44px]"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-secondary)',
              }}
            >
              <span className="font-medium text-sm" style={{ color: 'var(--color-foreground)' }}>
                {tpl.name}
              </span>
              <span
                className="block text-xs mt-0.5"
                style={{ color: 'var(--color-muted-foreground)' }}
              >
                {tpl.description}
              </span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
