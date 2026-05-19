'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function Cta() {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative px-4 py-20 md:py-28">
      <div
        ref={ref}
        className="max-w-3xl mx-auto text-center rounded-[var(--radius-lg)] border p-10 md:p-14"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-card)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-bold tracking-tight mb-3"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--color-foreground)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            准备好开始了吗？
          </h2>
          <p
            className="text-base mb-8 max-w-md mx-auto"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            免费开始使用，无需信用卡。你的第一份游戏设计文档，从这里开始。
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-90 min-h-[44px] min-w-[44px] h-12 px-8 text-base rounded-[var(--radius-md)]"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            免费开始使用
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
