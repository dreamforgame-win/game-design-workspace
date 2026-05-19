'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  const scrollToDemo = () => {
    const el = document.getElementById('demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 md:pt-40 md:pb-28 text-center overflow-hidden">
      {/* Subtle radial glow behind hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.08), transparent)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            AI 驱动的游戏设计可视化
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="font-bold tracking-tight mb-5"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.1,
              color: 'var(--color-foreground)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            游戏设计可视化引擎
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-base md:text-lg max-w-xl mb-10 leading-relaxed"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            把 Markdown 变成精美的游戏设计演示。
            <br className="hidden md:block" />
            无需设计技能，专注创作本身。
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 font-medium transition-opacity hover:opacity-90 min-h-[44px] min-w-[44px] h-12 px-8 text-base rounded-[var(--radius-md)]"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-foreground)',
              }}
            >
              开始使用
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToDemo}
              className="inline-flex items-center justify-center font-medium transition-colors min-h-[44px] min-w-[44px] h-12 px-8 text-base rounded-[var(--radius-md)] border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-foreground)',
                backgroundColor: 'var(--color-secondary)',
              }}
            >
              查看演示
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
