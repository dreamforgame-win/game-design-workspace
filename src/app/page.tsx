'use client'

import { useState } from 'react'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import { useTheme } from '@/hooks/useTheme'

const DEMO_MARKDOWN = `# 战区系统设计

## 核心循环

:::battleflow
玩家成长
资源争夺
联盟战争
赛季结算
:::

## 经济系统

:::system{title="金币系统"}
- 货币: 金币, 钻石
- 产出: 任务, 副本, 交易
- 消耗: 强化, 商店, 拍卖
:::

## 开发时间线

:::timeline
- 2024 Q1: 系统设计阶段
- 2024 Q2: 原型开发
- 2024 Q3: Alpha 测试
- 2024 Q4: 正式上线
:::

## 关键功能

:::feature{title="PvP 竞技场" status="dev"}
5v5 实时竞技场，匹配系统基于 ELO 评分。
:::

:::feature{title="公会系统" status="design"}
支持公会创建、管理、等级和领地争夺。
:::

## 注意事项

:::warning{title="性能风险"}
大规模 GVG 战斗可能出现帧率下降，需提前做压力测试。
:::

## 战斗系统说明

战斗系统采用**实时动作**模式，支持*连招*和\`闪避\`机制。详细设计参考[战斗文档](https://example.com)。

| 参数 | 值 | 说明 |
|------|-----|------|
| 基础攻击 | 100 | 1级角色 |
| 暴击率 | 15% | 默认值 |
| 攻击速度 | 1.2s | 单次攻击间隔 |

- 支持最多 5 人组队
- PVE 副本每日重置
- 排行榜每周结算
`

export default function HomePage() {
  const { theme, setTheme, allThemes } = useTheme()
  const [showDemo, setShowDemo] = useState(false)

  return (
    <main className="min-h-screen relative z-10">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1
          className="font-bold tracking-tight mb-4"
          style={{
            fontSize: 'var(--font-size-h1)',
            color: 'var(--color-foreground)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          游戏设计可视化引擎
        </h1>
        <p
          className="text-lg max-w-xl mb-8"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          Markdown → 自动视觉化 → 演示化 → AI 增强
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="h-11 px-6 rounded-[var(--radius-md)] font-medium text-sm transition-colors"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            {showDemo ? '隐藏演示' : '查看演示'}
          </button>
          <a
            href="/login"
            className="h-11 px-6 rounded-[var(--radius-md)] font-medium text-sm border flex items-center transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          >
            开始使用
          </a>
        </div>

        {/* Theme switcher */}
        <div className="flex gap-2 mt-8">
          {allThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="h-9 px-4 rounded-full text-xs font-medium transition-colors border min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{
                backgroundColor: theme === t.id ? 'var(--color-primary)' : 'transparent',
                color: theme === t.id ? 'var(--color-primary-foreground)' : 'var(--color-muted-foreground)',
                borderColor: theme === t.id ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              {t.displayName}
            </button>
          ))}
        </div>
      </section>

      {/* Demo */}
      {showDemo && (
        <section className="px-4 pb-24">
          <div
            className="mx-auto rounded-[var(--radius-lg)] border p-8 md:p-12"
            style={{
              maxWidth: '900px',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-card)',
            }}
          >
            <MarkdownRenderer content={DEMO_MARKDOWN} />
          </div>
        </section>
      )}
    </main>
  )
}
