/**
 * Document templates for new document creation.
 * Informed by game-designer skill: these match real game design workflows.
 */

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  content: string
}

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'blank',
    name: '空白文档',
    description: '从零开始',
    content: '',
  },
  {
    id: 'gdd-section',
    name: 'GDD 章节',
    description: '标准游戏设计文档结构',
    content: `# [系统名称]

## 概述

简要描述该系统的核心目的和玩家体验目标。

## 核心循环

:::battleflow
阶段1
阶段2
阶段3
阶段4
:::

## 机制设计

### 输入
- 玩家操作 1
- 玩家操作 2

### 输出
- 反馈 1
- 反馈 2

## 数值框架

| 参数 | 值 | 说明 |
|------|-----|------|
| 参数1 | - | - |

## 边界情况

:::warning{title="待验证"}
列出已知的边界情况和退化策略。
:::

## 参考

列出参考游戏和设计灵感来源。
`,
  },
  {
    id: 'system-design',
    name: '系统设计',
    description: '输入/输出/约束/边界',
    content: `# [系统名称] 设计文档

## 系统目标

:::card{title="设计目标"}
该系统的核心目标是什么？为玩家创造什么体验？
:::

## 系统结构

:::system{title="系统定义"}
- 输入: [列出所有输入]
- 处理: [核心逻辑]
- 输出: [列出所有输出]
- 约束: [系统限制]
:::

## 数据流

:::battleflow
输入源
处理逻辑
输出结果
反馈循环
:::

## 依赖关系

列出该系统依赖的其他系统，以及依赖该系统的下游系统。

## 边界情况

1. 当 X 发生时...
2. 如果 Y 超过阈值...
3. 并发场景下...

## 测试计划

:::feature{title="测试要点" status="design"}
列出关键测试场景和验收标准。
:::
`,
  },
  {
    id: 'feature-proposal',
    name: '功能提案',
    description: '问题/方案/范围/风险',
    content: `# [功能名称] 提案

## 问题

描述当前存在的问题或痛点。

## 方案

:::card{title="核心方案"}
提出的解决方案是什么？
:::

## 用户故事

作为 [角色]，我想要 [功能]，以便 [价值]。

## 范围

:::feature{title="Phase 1" status="design"}
MVP 最小可行范围。
:::

:::feature{title="Phase 2" status="design"}
扩展功能。
:::

## 风险

:::warning{title="风险评估"}
- 技术风险:
- 设计风险:
- 排期风险:
:::

## 成功指标

| 指标 | 目标值 | 衡量方式 |
|------|--------|----------|
| 指标1 | - | - |
`,
  },
  {
    id: 'presentation',
    name: '会议演示',
    description: '适合 Presentation 模式的幻灯片',
    content: `# [演示标题]

副标题 · 日期

---

## 背景

简述项目背景和当前状态。

---

## 核心问题

我们需要解决什么问题？

---

## 方案

:::battleflow
现状分析
方案设计
实施路径
预期效果
:::

---

## 下一步

:::timeline
- 本周: 方案确认
- 下周: 开始实施
- 月底: 阶段验收
:::

---

## Q&A

感谢关注，欢迎提问。
`,
  },
]
