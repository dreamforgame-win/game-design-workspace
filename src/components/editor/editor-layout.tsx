'use client'

import { useState, useCallback, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import { MilkdownEditor } from '@/components/editor/Editor'
import { EditorToolbar } from '@/components/editor/toolbar'
import { EditorSidebar } from '@/components/editor/sidebar'
import { useEditorStore } from '@/stores/editor-store'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useTheme } from '@/hooks/useTheme'
import { updateDocument, togglePublic } from '@/features/documents/actions'

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
    initContent,
    isDirty,
    isSaving,
    showPreview,
    showSidebar,
    togglePreview,
    toggleSidebar,
  } = useEditorStore()

  const { setTheme: setGlobalTheme } = useTheme()
  const [activeTheme, setActiveTheme] = useState(document.theme)
  const [isPublic, setIsPublic] = useState(document.isPublic)

  // Initialize store with document content on mount (without marking dirty)
  useEffect(() => {
    initContent(document.content)
    setGlobalTheme(document.theme as any)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save
  useAutoSave(document.slug)

  const handleContentChange = useCallback(
    (markdown: string) => {
      // Only mark dirty if content actually changed from original
      if (markdown !== document.content) {
        setContent(markdown)
      }
    },
    [setContent, document.content]
  )

  const handleThemeChange = useCallback(
    async (newTheme: string) => {
      setActiveTheme(newTheme)
      setGlobalTheme(newTheme as any)
      // Persist theme to document
      await updateDocument(document.slug, { theme: newTheme })
    },
    [document.slug, setGlobalTheme]
  )

  const handleTogglePublic = useCallback(async () => {
    const result = await togglePublic(document.slug)
    if (result) {
      setIsPublic(result.isPublic)
    }
  }, [document.slug])

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
          >
            <MarkdownRenderer content={content || document.content} />
          </div>
        )}

        {/* Sidebar */}
        {showSidebar && (
          <EditorSidebar
            theme={activeTheme}
            onThemeChange={handleThemeChange}
            isPublic={isPublic}
            onTogglePublic={handleTogglePublic}
            slug={document.slug}
          />
        )}
      </div>
    </div>
  )
}
