'use client'

import { useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePresentation } from '@/hooks/usePresentation'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import { SlideControls } from './slide-controls'
import { X, Maximize } from 'lucide-react'

interface PresentationModeProps {
  content: string
  onExit: () => void
  theme?: string
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
}

export function PresentationMode({ content, onExit, theme }: PresentationModeProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
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
  } = usePresentation({ content, onExit })

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
        <div className="flex items-center gap-2">
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

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence initial={false} custom={1} mode="wait">
          <motion.div
            key={currentIndex}
            custom={prefersReducedMotion ? 0 : 1}
            variants={prefersReducedMotion ? undefined : slideVariants}
            initial={prefersReducedMotion ? { opacity: 0 } : 'enter'}
            animate={prefersReducedMotion ? { opacity: 1 } : 'center'}
            exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center px-8 py-12 overflow-auto"
          >
            <div className="w-full max-w-4xl">
              <SlideContent content={slides[currentIndex]} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <SlideControls
        current={currentIndex + 1}
        total={totalSlides}
        onPrev={goPrev}
        onNext={goNext}
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
