'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from 'react-resizable-panels'
import dynamic from 'next/dynamic'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import { MilkdownEditor } from '@/components/editor/Editor'
import { EditorToolbar } from '@/components/editor/toolbar'
import { EditorSidebar } from '@/components/editor/sidebar'
import { useEditorStore } from '@/stores/editor-store'

const PresentationMode = dynamic(
  () => import('@/components/presentation/presentation-mode').then((m) => m.PresentationMode),
  { ssr: false }
)
import { useAutoSave } from '@/hooks/useAutoSave'
import { useScrollSync } from '@/hooks/useScrollSync'
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
    setPreviewCollapsed,
    setSidebarCollapsed,
    panelSizes,
    setPanelSizes,
    wordCount,
    focusMode,
    toggleFocusMode,
  } = useEditorStore()

  const { setTheme: setGlobalTheme } = useTheme()
  const [activeTheme, setActiveTheme] = useState(document.theme)
  const [isPublic, setIsPublic] = useState(document.isPublic)
  const [isPresenting, setIsPresenting] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

  const editorPanelRef = useRef<ImperativePanelHandle>(null)
  const previewPanelRef = useRef<ImperativePanelHandle>(null)
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null)
  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const previewWrapperRef = useRef<HTMLDivElement>(null)

  // Initialize store with document content on mount (without marking dirty)
  useEffect(() => {
    initContent(document.content)
    setGlobalTheme(document.theme as any)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save
  useAutoSave(document.slug)

  // Scroll sync: editor → preview
  useScrollSync(editorWrapperRef, previewWrapperRef, showPreview)

  const handleContentChange = useCallback(
    (markdown: string) => {
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

  const handleRestore = useCallback(
    (restoredContent: string) => {
      initContent(restoredContent)
      setEditorKey((k) => k + 1)
    },
    [initContent]
  )

  // Toggle handlers that use imperative panel API
  const handleTogglePreview = useCallback(() => {
    const panel = previewPanelRef.current
    if (!panel) return
    if (panel.isCollapsed()) {
      panel.expand()
    } else {
      panel.collapse()
    }
  }, [])

  const handleToggleSidebar = useCallback(() => {
    const panel = sidebarPanelRef.current
    if (!panel) return
    if (panel.isCollapsed()) {
      panel.expand()
    } else {
      panel.collapse()
    }
  }, [])

  // When panel collapses/expands, update store (for toolbar highlight)
  const handlePreviewCollapse = useCallback(
    (collapsed: boolean) => {
      setPreviewCollapsed(collapsed)
    },
    [setPreviewCollapsed]
  )

  const handleSidebarCollapse = useCallback(
    (collapsed: boolean) => {
      setSidebarCollapsed(collapsed)
    },
    [setSidebarCollapsed]
  )

  const handleLayoutChange = useCallback(
    (sizes: number[]) => {
      setPanelSizes(sizes)
    },
    [setPanelSizes]
  )

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <EditorToolbar
        isDirty={isDirty}
        isSaving={isSaving}
        onTogglePreview={handleTogglePreview}
        onToggleSidebar={handleToggleSidebar}
        showPreview={showPreview}
        showSidebar={showSidebar}
        onPresent={() => setIsPresenting(true)}
        wordCount={wordCount}
        focusMode={focusMode}
        onToggleFocusMode={toggleFocusMode}
      />

      {/* Main area — resizable panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup
          direction="horizontal"
          onLayout={handleLayoutChange}
        >
          {/* Editor pane */}
          <Panel
            ref={editorPanelRef}
            defaultSize={panelSizes[0]}
            minSize={25}
          >
            <div ref={editorWrapperRef} className={`h-full overflow-hidden ${focusMode ? 'focus-mode' : ''}`}>
              <MilkdownEditor
                key={editorKey}
                initialValue={content || document.content}
                onChange={handleContentChange}
              />
            </div>
          </Panel>

          {/* Resize handle between editor and preview */}
          <PanelResizeHandle className="w-1.5 transition-colors hover:bg-[var(--color-primary)] focus:bg-[var(--color-primary)] focus:outline-none data-[resize-handle-state=drag]:bg-[var(--color-primary)] bg-[var(--color-border)]" />

          {/* Preview pane */}
          <Panel
            ref={previewPanelRef}
            defaultSize={panelSizes[1]}
            minSize={20}
            collapsible
            collapsedSize={0}
            onCollapse={() => handlePreviewCollapse(true)}
            onExpand={() => handlePreviewCollapse(false)}
          >
            <div
              ref={previewWrapperRef}
              className="h-full overflow-auto p-6 border-l"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-background)',
              }}
            >
              <MarkdownRenderer content={content || document.content} />
            </div>
          </Panel>

          {/* Resize handle between preview and sidebar */}
          <PanelResizeHandle className="w-1.5 transition-colors hover:bg-[var(--color-primary)] focus:bg-[var(--color-primary)] focus:outline-none data-[resize-handle-state=drag]:bg-[var(--color-primary)] bg-[var(--color-border)]" />

          {/* Sidebar pane */}
          <Panel
            ref={sidebarPanelRef}
            defaultSize={panelSizes[2]}
            minSize={15}
            maxSize={35}
            collapsible
            collapsedSize={0}
            onCollapse={() => handleSidebarCollapse(true)}
            onExpand={() => handleSidebarCollapse(false)}
          >
            <div
              className="h-full overflow-auto"
              style={{
                backgroundColor: 'var(--color-card)',
              }}
            >
              <EditorSidebar
                theme={activeTheme}
                onThemeChange={handleThemeChange}
                isPublic={isPublic}
                onTogglePublic={handleTogglePublic}
                slug={document.slug}
                onRestore={handleRestore}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Presentation overlay */}
      {isPresenting && (
        <PresentationMode
          content={content || document.content}
          theme={activeTheme}
          onExit={() => setIsPresenting(false)}
        />
      )}
    </div>
  )
}
