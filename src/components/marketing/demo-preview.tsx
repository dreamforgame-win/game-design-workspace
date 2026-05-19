'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import {
  Type,
  Image as ImageIcon,
  List,
  Table,
  Code,
  Eye,
  Palette,
  MonitorPlay,
} from 'lucide-react'

export function DemoPreview() {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [40, -40]
  )

  return (
    <section id="demo" ref={containerRef} className="relative px-4 py-16 md:py-24">
      <motion.div style={{ y }} className="max-w-5xl mx-auto">
        {/* Browser chrome */}
        <div
          className="rounded-[var(--radius-lg)] border overflow-hidden"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-card)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div
              className="flex-1 mx-4 px-3 py-1 rounded text-xs truncate"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-muted-foreground)',
              }}
            >
              游戏设计工作区 / 战区系统.md
            </div>
            <div className="flex items-center gap-2">
              <MockIcon icon={Eye} />
              <MockIcon icon={Palette} />
              <MockIcon icon={MonitorPlay} />
            </div>
          </div>

          {/* Editor + Preview layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[320px] md:min-h-[420px]">
            {/* Editor pane */}
            <div
              className="p-4 md:p-5 border-b md:border-b-0 md:border-r text-sm leading-relaxed font-mono"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-muted-foreground)',
              }}
            >
              <div className="space-y-3">
                <MockLine>
                  <span style={{ color: 'var(--color-primary)' }}>#</span>{' '}
                  战区系统设计
                </MockLine>
                <MockLine />
                <MockLine>
                  <span style={{ color: 'var(--color-primary)' }}>##</span> 核心循环
                </MockLine>
                <MockLine />
                <MockLine
                  className="rounded px-3 py-2 border border-dashed"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  :::battleflow
                </MockLine>
                <MockLine className="pl-4">玩家成长</MockLine>
                <MockLine className="pl-4">资源争夺</MockLine>
                <MockLine className="pl-4">联盟战争</MockLine>
                <MockLine
                  className="rounded px-3 py-2 border border-dashed"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                  }}
                >
                  :::
                </MockLine>
                <MockLine />
                <MockLine>
                  <span style={{ color: 'var(--color-primary)' }}>##</span> 经济系统
                </MockLine>
                <MockLine />
                <MockLine className="pl-2">- 货币: 金币, 钻石</MockLine>
                <MockLine className="pl-2">- 产出: 任务, 副本</MockLine>
                <MockLine className="pl-2">- 消耗: 强化, 商店</MockLine>
              </div>
            </div>

            {/* Preview pane */}
            <div className="p-4 md:p-5">
              <h2
                className="font-bold text-lg mb-4"
                style={{
                  color: 'var(--color-foreground)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                核心循环
              </h2>

              {/* Battleflow mock */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <FlowNode>玩家成长</FlowNode>
                <FlowArrow />
                <FlowNode>资源争夺</FlowNode>
                <FlowArrow />
                <FlowNode>联盟战争</FlowNode>
                <FlowArrow />
                <FlowNode>赛季结算</FlowNode>
              </div>

              <h2
                className="font-bold text-lg mb-3"
                style={{
                  color: 'var(--color-foreground)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                经济系统
              </h2>
              <ul className="space-y-1.5 text-sm" style={{ color: 'var(--color-foreground)' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--color-primary)' }}>•</span>
                  货币: 金币, 钻石
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--color-primary)' }}>•</span>
                  产出: 任务, 副本
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--color-primary)' }}>•</span>
                  消耗: 强化, 商店
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          左侧编辑 Markdown，右侧实时渲染为可视化组件
        </p>
      </motion.div>
    </section>
  )
}

function MockIcon({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div
      className="w-8 h-8 rounded flex items-center justify-center"
      style={{
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-muted-foreground)',
      }}
    >
      <Icon className="w-4 h-4" />
    </div>
  )
}

function MockLine({
  children,
  className,
  style,
}: {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

function FlowNode({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-foreground)',
        border: '1px solid var(--color-border)',
      }}
    >
      {children}
    </div>
  )
}

function FlowArrow() {
  return (
    <div className="flex items-center">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ color: 'var(--color-muted-foreground)' }}
      >
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
