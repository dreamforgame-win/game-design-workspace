'use client'

import { useState, useCallback } from 'react'
import { notFound } from 'next/navigation'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import { MilkdownEditor } from '@/components/editor/Editor'
import { EditorToolbar } from '@/components/editor/toolbar'
import { EditorSidebar } from '@/components/editor/sidebar'
import { useEditorStore } from '@/stores/editor-store'
import { useAutoSave } from '@/hooks/useAutoSave'

interface EditorLayoutProps {
  document: {
    id: string
    title: string
    slug: string
    content: string
    theme: string
    isPublic: boolean
  }
}

export function EditorLayout({ document }: EditorLayoutProps) {
  const {
    content,
    setContent,
    isDirty,
    isSaving,
    showPreview,
    showSidebar,
    togglePreview,
    toggleSidebar,
  } = useEditorStore()

  const [theme, setTheme] = useState(document.theme)

  // Initialize store with document content on first render
  const initialized = useState(() => {
    setContent(document.content)
    return true
  })[0]

  // Auto-save
  useAutoSave(document.slug)

  const handleContentChange = useCallback(
    (markdown: string) => {
      setContent(markdown)
    },
    [setContent]
  )

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <EditorToolbar
        isDirty={isDirty}
        isSaving={isSaving}
        onTogglePreview={togglePreview}
        onToggleSidebar={toggleSidebar}
        showPreview={showPreview}
        showSidebar={showSidebar}
      />

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor pane */}
        <div className="flex-1 overflow-hidden">
          <MilkdownEditor
            initialValue={document.content}
            onChange={handleContentChange}
          />
        </div>

        {/* Preview pane */}
        {showPreview && (
          <div
            className="flex-1 overflow-auto border-l p-6"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-background)',
            }}
            data-theme={theme === 'black-gold' ? undefined : theme}
          >
            <MarkdownRenderer content={content || document.content} />
          </div>
        )}

        {/* Sidebar */}
        {showSidebar && (
          <EditorSidebar
            theme={theme}
            onThemeChange={setTheme}
          />
        )}
      </div>
    </div>
  )
}
