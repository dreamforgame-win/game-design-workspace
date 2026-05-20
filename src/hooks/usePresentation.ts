'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { splitSlides, type SlideData } from '@/lib/slide-splitter'

interface UsePresentationOptions {
  content: string
  onExit?: () => void
}

interface UsePresentationReturn {
  slides: SlideData[]
  currentIndex: number
  totalSlides: number
  goTo: (index: number) => void
  goNext: () => void
  goPrev: () => void
  isFirst: boolean
  isLast: boolean
  enterFullscreen: () => void
  exitFullscreen: () => void
  isFullscreen: boolean
  currentNotes: string
  currentTransition: 'slide' | 'fade' | 'zoom'
  touchStartX: React.MutableRefObject<number | null>
  touchEndX: React.MutableRefObject<number | null>
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchEnd: (e: React.TouchEvent) => void
}

/**
 * Presentation mode state + keyboard navigation + fullscreen + touch.
 */
export function usePresentation({ content, onExit }: UsePresentationOptions): UsePresentationReturn {
  const slides = splitSlides(content)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Touch state for swipe
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const totalSlides = slides.length
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalSlides - 1
  const currentNotes = slides[currentIndex]?.notes || ''
  const currentTransition = slides[currentIndex]?.transition || 'slide'

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)))
  }, [totalSlides])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1))
  }, [totalSlides])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const enterFullscreen = useCallback(() => {
    const el = containerRef.current || document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {
        // Fallback: CSS fullscreen via fixed positioning is handled by the component
      })
    }
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    if (touchStartX.current == null || touchEndX.current == null) return

    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (diff > threshold) {
      goNext()
    } else if (diff < -threshold) {
      goPrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }, [goNext, goPrev])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault()
          goNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          goPrev()
          break
        case 'Escape':
          e.preventDefault()
          onExit?.()
          break
        case 'Home':
          e.preventDefault()
          goTo(0)
          break
        case 'End':
          e.preventDefault()
          goTo(totalSlides - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, goTo, onExit, totalSlides])

  // Track fullscreen state
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  return {
    slides,
    currentIndex,
    totalSlides,
    goTo,
    goNext,
    goPrev,
    isFirst,
    isLast,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    currentNotes,
    currentTransition,
    touchStartX,
    touchEndX,
    handleTouchStart,
    handleTouchEnd,
  }
}

export type { UsePresentationReturn }
