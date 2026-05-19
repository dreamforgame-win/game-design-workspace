'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  FileCode,
  Palette,
  Presentation,
  Share2,
} from 'lucide-react'

const FEATURES = [
  {
    icon: FileCode,
    title: 'Markdown 可视化',
    description:
      '使用自定义指令（:::battleflow、:::timeline 等）在 Markdown 中直接嵌入可视化组件，所见即所得。',
  },
  {
    icon: Palette,
    title: '多主题系统',
    description:
      '一键切换极简黑金、修仙卷轴、战争沙盘三种视觉风格，每种主题都有独特的配色与排版气质。',
  },
  {
    icon: Presentation,
    title: '演示模式',
    description:
      '以 --- 分隔幻灯片，一键进入全屏演示。支持键盘导航、平滑转场和逐元素动画。',
  },
  {
    icon: Share2,
    title: '即时分享',
    description:
      '生成公开链接，团队成员无需登录即可查看。随时切换公开/私有状态，控制访问权限。',
  },
]

export function Features() {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative px-4 py-20 md:py-28">
      <div ref={ref} className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 md:mb-18"
        >
          <h2
            className="font-bold tracking-tight mb-3"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--color-foreground)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            为游戏设计师打造
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            从构思到演示，一条链路完成
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                }}
                className="group relative rounded-[var(--radius-lg)] border p-5 md:p-6 transition-colors"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-card)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text */}
                <h3
                  className="font-semibold text-base mb-2"
                  style={{
                    color: 'var(--color-foreground)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
