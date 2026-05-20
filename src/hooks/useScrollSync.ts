'use client'

import { useEffect, useRef, useCallback } from 'react'

const SYNC_DEBOUNCE_MS = 50

function getHeadings(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
}

function findActiveHeadingIndex(
  headings: HTMLElement[],
  scrollTop: number,
  containerTop: number
): number {
  if (headings.length === 0) return -1

  let activeIndex = 0
  for (let i = 0; i < headings.length; i++) {
    const headingTop = headings[i].getBoundingClientRect().top - containerTop
    if (headingTop <= scrollTop + 20) {
      activeIndex = i
    } else {
      break
    }
  }
  return activeIndex
}

export function useScrollSync(
  editorWrapperRef: React.RefObject<HTMLElement | null>,
  previewRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const isSyncing = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastHeadingIndex = useRef<number>(-1)

  const syncPreviewToEditor = useCallback(() => {
    const editorWrapper = editorWrapperRef.current
    const preview = previewRef.current
    if (!editorWrapper || !preview || isSyncing.current) return

    // The actual scrollable editor element is the .milkdown-editor div
    const editor = editorWrapper.querySelector('.milkdown-editor') as HTMLElement | null
    if (!editor) return

    const editorHeadings = getHeadings(editor)
    const previewHeadings = getHeadings(preview)
    if (editorHeadings.length === 0 || previewHeadings.length === 0) return

    const activeIndex = findActiveHeadingIndex(
      editorHeadings,
      editor.scrollTop,
      editor.getBoundingClientRect().top
    )

    if (activeIndex === lastHeadingIndex.current) return
    lastHeadingIndex.current = activeIndex

    const targetHeading = previewHeadings[Math.min(activeIndex, previewHeadings.length - 1)]
    if (!targetHeading) return

    isSyncing.current = true

    // Calculate target scroll position:
    // Scroll preview so the target heading lines up with where it would be
    // relative to the editor's current scroll
    const editorHeading = editorHeadings[activeIndex]
    const editorHeadingOffset = editorHeading.offsetTop - editor.scrollTop
    const targetScroll = targetHeading.offsetTop - editorHeadingOffset

    preview.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'auto',
    })

    // Reset syncing flag after a short delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isSyncing.current = false
      })
    })
  }, [editorWrapperRef, previewRef])

  useEffect(() => {
    const editorWrapper = editorWrapperRef.current
    if (!editorWrapper || !enabled) return

    const editor = editorWrapper.querySelector('.milkdown-editor') as HTMLElement | null
    if (!editor) return

    const handleScroll = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(syncPreviewToEditor, SYNC_DEBOUNCE_MS)
    }

    editor.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      editor.removeEventListener('scroll', handleScroll)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [editorWrapperRef, enabled, syncPreviewToEditor])
}
