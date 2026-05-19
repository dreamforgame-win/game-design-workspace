'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useEditorStore } from '@/stores/editor-store'
import { updateDocument } from '@/features/documents/actions'
import { toast } from 'sonner'

const SAVE_DEBOUNCE_MS = 2000

/**
 * Auto-save hook: debounces saves after content changes.
 * Fires 2000ms after last edit. Shows status indicator.
 */
export function useAutoSave(slug: string) {
  const { content, isDirty, setIsSaving, markSaved } = useEditorStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentRef = useRef(content)

  // Keep content ref in sync
  contentRef.current = content

  const save = useCallback(async () => {
    if (!contentRef.current && contentRef.current !== '') return

    setIsSaving(true)
    try {
      await updateDocument(slug, { content: contentRef.current })
      markSaved()
    } catch (error) {
      console.error('Auto-save failed:', error)
      toast.error('保存失败，请重试')
      setIsSaving(false)
    }
  }, [slug, setIsSaving, markSaved])

  // Debounced save on content change
  useEffect(() => {
    if (!isDirty) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(save, SAVE_DEBOUNCE_MS)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [content, isDirty, save])

  // Warn on unsaved changes before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  return { save }
}
