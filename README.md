<p align="center">
  <img src="https://raw.githubusercontent.com/dreamforgame-win/game-design-workspace/main/public/logo/logo_long.png" alt="Game Design Workspace" width="500" />
</p>

<h1 align="center">Game Design Workspace</h1>

<p align="center">
  <strong>把 Markdown 变成游戏设计演示。</strong>
</p>

用你最熟悉的方式写文档，自动生成精美的可视化页面和演示幻灯片。

---

## 它能做什么

专为游戏设计师打造的 Markdown 可视化工作台：

- **编写** — 用 Markdown + 自定义指令写 GDD、系统策划案、功能提案
- **可视化** — `:::battleflow`、`:::economy`、`:::timeline` 等 11 种指令自动渲染成图表
- **演示** — 一键进入全屏演示模式，键盘翻页，演讲者备注，进度条
- **分享** — 生成公开链接，任何人都能查看和演示
- **主题** — 极简黑金、修仙卷轴、战争沙盘三种主题，一键切换

---

## 快速预览

### 写 Markdown

```markdown
# 核心战斗系统

## 战斗流程

:::battleflow
玩家进入 → 匹配系统 → 战斗开始 → 胜负判定 → 奖励结算
:::

## 经济循环

:::economy{title="金币系统"}
[Sources] 每日任务, 副本, PvP
[Pool] 玩家持有金币
[Sinks] 装备强化, 商店消费, 拍卖行税
:::

## 关键指标

:::stats
- 日活: 12,500 (up)
- 留存: 42% (flat)
- ARPU: ¥18.5 (up)
:::

---

<!-- notes: 这里讲数值平衡的调整思路 -->

# 数值平衡方案

:::balance{left="开放经济" right="封闭经济"}
- 玩家自由度高 | 通货膨胀可控
- 交易活跃 | 数值稳定
- 金币贬值风险 | 社交动力弱
:::
```

### 自动生成

左侧编辑器实时编写，右侧自动渲染。点击「演示」按钮，全屏幻灯片即刻呈现。

---

## 11 种可视化指令

| 指令 | 用途 | 示例 |
|------|------|------|
| `:::battleflow` | 水平流程图 | 战斗流程、关卡流程 |
| `:::timeline` | 垂直时间线 | 版本迭代、开发排期 |
| `:::card` | 信息卡片 | 角色简介、道具说明 |
| `:::warning` | 警告框 | 风险提示、注意事项 |
| `:::system` | 系统定义 | 核心系统参数 |
| `:::feature` | 功能提案 | 功能概述、验收标准 |
| `:::loop` | 循环图 | 核心循环、反馈循环 |
| `:::balance` | 方案对比 | A/B 对比、决策分析 |
| `:::economy` | 经济系统 | 来源 → 池 → 消耗 |
| `:::matrix` | 矩阵分析 | 优先级、风险评估 |
| `:::stats` | 指标看板 | KPI、数据监控 |

---

## 功能特性

### 编辑器
- **实时预览** — 输入即渲染，无刷新
- **可拖拽面板** — 自由调整编辑/预览/侧栏宽度
- **滚动同步** — 编辑器与预览自动对齐
- **斜杠命令** — `/` 呼出菜单，快速插入指令
- **拖拽上传** — 直接拖图片进编辑器
- **专注模式** — 淡化非当前段落，减少干扰
- **自动保存** — 2 秒防抖，自动持久化

### 演示模式
- **全屏演示** — `---` 分隔幻灯片
- **多种转场** — 滑动 / 淡入 / 缩放
- **演讲备注** — `<!-- notes: ... -->` 仅演讲者可见
- **触控支持** — 手机端左右滑动翻页
- **幻灯片概览** — 网格缩略图，点击跳转
- **演讲者面板** — 当前页、下一页、备注、计时器

### 主题系统
- **极简黑金** — 默认深色主题，高端商务感
- **修仙卷轴** — 浅色纸纹，古风书卷气
- **战争沙盘** — HUD 网格，硬核数据感

---

## 技术栈

- **框架** [Next.js 15](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **样式** [TailwindCSS 4](https://tailwindcss.com/)
- **编辑器** [Milkdown](https://milkdown.dev/)（基于 ProseMirror）
- **渲染** [unified](https://unifiedjs.com/) / remark / rehype
- **动画** [Framer Motion](https://www.framer.com/motion/)
- **数据库** [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)
- **认证** [NextAuth v5](https://authjs.dev/)（Magic Link 邮箱登录）
- **状态** [Zustand](https://github.com/pmndrs/zustand)

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/dreamforgame-win/game-design-workspace.git
cd game-design-workspace
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local，填入数据库连接和邮件服务配置
```

### 4. 初始化数据库

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 部署

支持 [Vercel](https://vercel.com/) 一键部署。

详见 [DEPLOY.md](./DEPLOY.md)。

---

## 路线图

- [x] 编辑器 + 实时预览
- [x] 3 套主题
- [x] 11 种可视化指令
- [x] 演示模式（全屏 + 演讲者视图）
- [x] 公开分享 + 演示链接
- [x] 版本历史 + 恢复
- [x] 斜杠命令 + 专注模式
- [x] 可拖拽面板 + 滚动同步
- [ ] PDF / PPT 导出
- [ ] 多人协作 + 评论
- [ ] AI 布局建议 + 文档摘要

---

## 许可证

[MIT](./LICENSE)
