'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePresentation } from '@/hooks/usePresentation'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import type { SlideData } from '@/lib/slide-splitter'
import { SlideControls } from './slide-controls'
import { X, Maximize, Grid3X3, Monitor, StickyNote, Clock } from 'lucide-react'

interface PresentationModeProps {
  content: string
  onExit: () => void
  theme?: string
}

const transitionVariants = {
  slide: {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  },
  fade: {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    enter: { scale: 0.8, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
}

export function PresentationMode({ content, onExit, theme }: PresentationModeProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showOverview, setShowOverview] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [direction, setDirection] = useState(1)

  const {
    slides,
    currentIndex,
    totalSlides,
    goNext,
    goPrev,
    goTo,
    isFirst,
    isLast,
    enterFullscreen,
    isFullscreen,
    currentNotes,
    currentTransition,
    handleTouchStart,
    handleTouchEnd,
  } = usePresentation({ content, onExit })

  const [showPresenterPanel, setShowPresenterPanel] = useState(false)

  const handleGoNext = () => {
    setDirection(1)
    goNext()
  }

  const handleGoPrev = () => {
    setDirection(-1)
    goPrev()
  }

  const handleGoTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    goTo(index)
    setShowOverview(false)
  }

  const progress = totalSlides > 0 ? ((currentIndex + 1) / totalSlides) * 100 : 0
  const variants = transitionVariants[currentTransition]

  if (slides.length === 0) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <p style={{ color: 'var(--color-muted-foreground)' }}>
          没有可展示的幻灯片。在 Markdown 中使用 `---` 分隔幻灯片。
        </p>
        <button
          onClick={onExit}
          className="absolute top-4 right-4 p-2 rounded-[var(--radius-md)] min-h-[44px] min-w-[44px]"
          style={{ color: 'var(--color-muted-foreground)' }}
          aria-label="退出演示"
        >
          <X size={20} />
        </button>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'var(--color-background)' }}
      data-theme={theme === 'black-gold' ? undefined : theme}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div
        className="h-12 flex items-center justify-between px-4 shrink-0"
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-card)',
        }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
          演示模式
        </span>
        <div className="flex items-center gap-1">
          {/* Notes toggle */}
          {currentNotes && (
            <button
              onClick={() => setShowNotes((v) => !v)}
              className="p-2 rounded-[var(--radius-sm)] transition-colors min-h-[44px] min-w-[44px]"
              style={{
                color: showNotes ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
              }}
              aria-label="演讲备注"
            >
              <StickyNote size={16} />
            </button>
          )}
          {/* Overview toggle */}
          <button
            onClick={() => setShowOverview((v) => !v)}
            className="p-2 rounded-[var(--radius-sm)] transition-colors min-h-[44px] min-w-[44px]"
            style={{
              color: showOverview ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
            }}
            aria-label="幻灯片概览"
          >
            <Grid3X3 size={16} />
          </button>
          {/* Presenter view */}
          <button
            onClick={() => setShowPresenterPanel((v) => !v)}
            className="p-2 rounded-[var(--radius-sm)] transition-colors min-h-[44px] min-w-[44px]"
            style={{
              color: showPresenterPanel ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
            }}
            aria-label="演讲者视图"
          >
            <Monitor size={16} />
          </button>
          {/* Fullscreen */}
          {!isFullscreen && (
            <button
              onClick={enterFullscreen}
              className="p-2 rounded-[var(--radius-sm)] transition-colors min-h-[44px] min-w-[44px]"
              style={{ color: 'var(--color-muted-foreground)' }}
              aria-label="全屏"
            >
              <Maximize size={16} />
            </button>
          )}
          {/* Exit */}
          <button
            onClick={onExit}
            className="p-2 rounded-[var(--radius-sm)] transition-colors min-h-[44px] min-w-[44px]"
            style={{ color: 'var(--color-muted-foreground)' }}
            aria-label="退出演示"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 w-full shrink-0"
        style={{ backgroundColor: 'var(--color-muted)' }}
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: 'var(--color-primary)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={prefersReducedMotion ? 0 : direction}
            variants={prefersReducedMotion ? undefined : variants}
            initial={prefersReducedMotion ? { opacity: 0 } : 'enter'}
            animate={prefersReducedMotion ? { opacity: 1 } : 'center'}
            exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center px-8 py-12 overflow-auto"
          >
            <div className="w-full max-w-4xl">
              <SlideContent content={slides[currentIndex].content} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Speaker notes overlay */}
        <AnimatePresence>
          {showNotes && currentNotes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 p-4 mx-4 mb-4 rounded-[var(--radius-md)] max-h-40 overflow-auto"
              style={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted-foreground)' }}>
                演讲备注
              </p>
              <p className="text-sm" style={{ color: 'var(--color-foreground)' }}>
                {currentNotes}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide overview overlay */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex items-center justify-center p-8"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={() => setShowOverview(false)}
          >
            <div
              className="grid gap-4 max-w-6xl w-full max-h-full overflow-auto p-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {slides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => handleGoTo(i)}
                  className="relative rounded-[var(--radius-md)] border p-3 text-left transition-all hover:scale-[1.02] min-h-[44px]"
                  style={{
                    backgroundColor: i === currentIndex ? 'var(--color-primary)' : 'var(--color-card)',
                    borderColor: i === currentIndex ? 'var(--color-primary)' : 'var(--color-border)',
                    color: i === currentIndex ? 'var(--color-primary-foreground)' : 'var(--color-foreground)',
                    aspectRatio: '16/9',
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: i === currentIndex ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)' }}>
                    {i + 1}
                  </span>
                  <div className="mt-1 text-xs line-clamp-3 opacity-80">
                    {slide.content.slice(0, 120).replace(/[#*`]/g, '')}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presenter panel */}
      <AnimatePresence>
        {showPresenterPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 overflow-hidden border-t"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-card)',
            }}
          >
            <PresenterPanel
              slides={slides}
              currentIndex={currentIndex}
              currentNotes={currentNotes}
              totalSlides={totalSlides}
              onGoTo={handleGoTo}
              onNext={handleGoNext}
              onPrev={handleGoPrev}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <SlideControls
        current={currentIndex + 1}
        total={totalSlides}
        onPrev={handleGoPrev}
        onNext={handleGoNext}
        onExit={onExit}
        isFirst={isFirst}
        isLast={isLast}
      />
    </div>
  )
}

/**
 * Render a single slide's markdown content with stagger animation.
 */
function SlideContent({ content }: { content: string }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.08,
          },
        },
      }}
    >
      <motion.div
        variants={
          prefersReducedMotion
            ? undefined
            : {
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }
        }
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <MarkdownRenderer content={content} />
      </motion.div>
    </motion.div>
  )
}

/**
 * Presenter panel: current slide, next slide, notes, timer, progress.
 */
function PresenterPanel({
  slides,
  currentIndex,
  currentNotes,
  totalSlides,
  onGoTo,
  onNext,
  onPrev,
}: {
  slides: SlideData[]
  currentIndex: number
  currentNotes: string
  totalSlides: number
  onGoTo: (i: number) => void
  onNext: () => void
  onPrev: () => void
}) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const nextSlide = slides[currentIndex + 1]

  return (
    <div className="flex items-stretch gap-4 p-4 h-48">
      {/* Current slide thumbnail */}
      <div className="flex-1 flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted-foreground)' }}>
          当前
        </span>
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex-1 rounded-[var(--radius-md)] border p-2 text-left overflow-hidden transition-all hover:opacity-90 disabled:opacity-30"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-foreground)',
          }}
        >
          <div className="text-xs line-clamp-6 opacity-80">
            {slides[currentIndex].content.slice(0, 200).replace(/[#*`]/g, '')}
          </div>
        </button>
      </div>

      {/* Next slide thumbnail */}
      <div className="flex-1 flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted-foreground)' }}>
          下一张
        </span>
        <button
          onClick={onNext}
          disabled={!nextSlide}
          className="flex-1 rounded-[var(--radius-md)] border p-2 text-left overflow-hidden transition-all hover:opacity-90 disabled:opacity-30"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-foreground)',
          }}
        >
          {nextSlide ? (
            <div className="text-xs line-clamp-6 opacity-80">
              {nextSlide.content.slice(0, 200).replace(/[#*`]/g, '')}
            </div>
          ) : (
            <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>已是最后</span>
          )}
        </button>
      </div>

      {/* Notes */}
      <div className="flex-[1.5] flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted-foreground)' }}>
          备注
        </span>
        <div
          className="flex-1 rounded-[var(--radius-md)] border p-3 overflow-auto text-sm"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-foreground)',
          }}
        >
          {currentNotes || (
            <span style={{ color: 'var(--color-muted-foreground)' }}>无备注</span>
          )}
        </div>
      </div>

      {/* Timer + progress */}
      <div className="w-32 flex flex-col justify-between">
        <div className="text-center">
          <Clock size={16} className="mx-auto mb-1" style={{ color: 'var(--color-muted-foreground)' }} />
          <span className="text-xl font-mono font-bold tabular-nums" style={{ color: 'var(--color-foreground)' }}>
            {formatTime(elapsed)}
          </span>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {currentIndex + 1}
          </span>
          <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {' '}/ {totalSlides}
          </span>
        </div>
        <div
          className="h-1.5 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-muted)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / totalSlides) * 100}%`,
              backgroundColor: 'var(--color-primary)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
