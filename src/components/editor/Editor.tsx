'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { Editor, rootCtx, defaultValueCtx, editorViewCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { nord } from '@milkdown/theme-nord'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { history } from '@milkdown/plugin-history'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { EditorView } from 'prosemirror-view'
import { uploadImage } from '@/features/upload/image-upload'
import { cn } from '@/lib/utils'
import {
  Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Code, Minus, Swords, Clock, Square, AlertTriangle,
  Settings, Star, RefreshCw, Scale, Database, Grid3X3,
  BarChart3, Type
} from 'lucide-react'
import '@milkdown/theme-nord/style.css'

interface MilkdownEditorProps {
  initialValue: string
  onChange: (markdown: string) => void
  focusMode?: boolean
}

/* ============================================
   Slash Command Menu Items
   ============================================ */

interface SlashItem {
  label: string
  icon: React.ReactNode
  insert: string
  keywords: string[]
}

const SLASH_ITEMS: SlashItem[] = [
  { label: '标题 1', icon: <Heading1 size={14} />, insert: '# ', keywords: ['h1', 'heading'] },
  { label: '标题 2', icon: <Heading2 size={14} />, insert: '## ', keywords: ['h2'] },
  { label: '标题 3', icon: <Heading3 size={14} />, insert: '### ', keywords: ['h3'] },
  { label: '无序列表', icon: <List size={14} />, insert: '- ', keywords: ['ul', 'list'] },
  { label: '有序列表', icon: <ListOrdered size={14} />, insert: '1. ', keywords: ['ol'] },
  { label: '引用', icon: <Quote size={14} />, insert: '> ', keywords: ['quote', 'blockquote'] },
  { label: '代码块', icon: <Code size={14} />, insert: '```\n\n```\n', keywords: ['code'] },
  { label: '分割线', icon: <Minus size={14} />, insert: '---\n', keywords: ['hr', 'divider'] },
  { label: '战斗流程', icon: <Swords size={14} />, insert: ':::battleflow\n步骤1\n步骤2\n:::\n', keywords: ['battle', 'flow'] },
  { label: '时间线', icon: <Clock size={14} />, insert: ':::timeline\n- 事件1\n- 事件2\n:::\n', keywords: ['timeline'] },
  { label: '卡片', icon: <Square size={14} />, insert: ':::card{title="标题"}\n内容\n:::\n', keywords: ['card'] },
  { label: '警告', icon: <AlertTriangle size={14} />, insert: ':::warning\n内容\n:::\n', keywords: ['warning', 'alert'] },
  { label: '系统', icon: <Settings size={14} />, insert: ':::system{title="系统名"}\n- 属性: 值\n:::\n', keywords: ['system'] },
  { label: '功能', icon: <Star size={14} />, insert: ':::feature{title="功能名"}\n内容\n:::\n', keywords: ['feature'] },
  { label: '循环', icon: <RefreshCw size={14} />, insert: ':::loop\n节点1\n节点2\n:::\n', keywords: ['loop'] },
  { label: '对比', icon: <Scale size={14} />, insert: ':::balance{left="方案A" right="方案B"}\n- A优势 | B优势\n:::\n', keywords: ['balance', 'compare'] },
  { label: '经济', icon: <Database size={14} />, insert: ':::economy{title="金币系统"}\n[Sources] 来源1, 来源2\n[Pool] 资源池\n[Sinks] 消耗1, 消耗2\n:::\n', keywords: ['economy'] },
  { label: '矩阵', icon: <Grid3X3 size={14} />, insert: ':::matrix{x="X轴" y="Y轴"}\n- 高/高: 内容\n- 高/低: 内容\n- 低/高: 内容\n- 低/低: 内容\n:::\n', keywords: ['matrix'] },
  { label: '统计', icon: <BarChart3 size={14} />, insert: ':::stats\n- 指标1: 100 (up)\n- 指标2: 50 (down)\n:::\n', keywords: ['stats'] },
]

/* ============================================
   Focus Mode ProseMirror Plugin
   ============================================ */

const focusModeKey = new PluginKey('focus-mode')

function createFocusModePlugin() {
  return new Plugin({
    key: focusModeKey,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc)
        const { from, to } = tr.selection
        const decorations: Decoration[] = []

        tr.doc.nodesBetween(from, to, (node, pos) => {
          if (node.type.name === 'paragraph') {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: 'active-paragraph',
              })
            )
          }
        })

        return DecorationSet.create(tr.doc, decorations)
      },
    },
    props: {
      decorations(state) {
        return this.getState(state)
      },
    },
  })
}

/* ============================================
   Component
   ============================================ */

export function MilkdownEditor({ initialValue, onChange, focusMode = false }: MilkdownEditorProps) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const initialValueRef = useRef(initialValue)
  initialValueRef.current = initialValue

  const hasCreated = useRef(false)
  const editorInstanceRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Slash command state
  const [slashOpen, setSlashOpen] = useState(false)
  const [slashQuery, setSlashQuery] = useState('')
  const [slashPos, setSlashPos] = useState<{ from: number; to: number } | null>(null)
  const [slashIndex, setSlashIndex] = useState(0)
  const [menuCoords, setMenuCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const slashIndexRef = useRef(slashIndex)
  slashIndexRef.current = slashIndex

  // Insert text into editor at current selection
  const insertText = useCallback((text: string, replaceFrom?: number, replaceTo?: number) => {
    const editor = editorInstanceRef.current
    if (!editor) return

    const view = editor.ctx.get(editorViewCtx) as EditorView | undefined
    if (!view) return

    const tr = view.state.tr
    const from = replaceFrom ?? view.state.selection.from
    const to = replaceTo ?? view.state.selection.to

    tr.replaceWith(from, to, view.state.schema.text(text))
    view.dispatch(tr)
    view.focus()
  }, [])

  // Check if slash command should be active
  const checkSlashCommand = useCallback(() => {
    const editor = editorInstanceRef.current
    if (!editor) return

    const view = editor.ctx.get(editorViewCtx) as EditorView | undefined
    if (!view) return

    const { from } = view.state.selection
    const lineStart = view.state.doc.resolve(from).start()
    const textBefore = view.state.doc.textBetween(lineStart, from)
    const match = textBefore.match(/^\/(\w*)$/)

    if (match) {
      const coords = view.coordsAtPos(from)
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        setMenuCoords({
          x: coords.left - containerRect.left,
          y: coords.bottom - containerRect.top + 4,
        })
      }
      setSlashQuery(match[1])
      setSlashPos({ from: lineStart, to: from })
      setSlashOpen(true)
      setSlashIndex(0)
    } else {
      setSlashOpen(false)
      setSlashQuery('')
      setSlashPos(null)
    }
  }, [])

  // Handle keyboard for slash menu navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!slashOpen) return

      const filtered = SLASH_ITEMS.filter(
        (item) =>
          item.label.includes(slashQuery) ||
          item.keywords.some((k) => k.includes(slashQuery))
      )

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSlashIndex((prev) => (prev + 1) % filtered.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSlashIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
          break
        case 'Enter':
          e.preventDefault()
          if (filtered[slashIndexRef.current] && slashPos) {
            insertText(filtered[slashIndexRef.current].insert, slashPos.from, slashPos.to)
            setSlashOpen(false)
          }
          break
        case 'Escape':
          e.preventDefault()
          setSlashOpen(false)
          break
      }
    },
    [slashOpen, slashQuery, slashPos, insertText]
  )

  // Handle drag-and-drop image upload
  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = Array.from(e.dataTransfer?.files || [])
      const images = files.filter((f) => f.type.startsWith('image/'))

      if (images.length === 0) return

      const editor = editorInstanceRef.current
      if (!editor) return
      const view = editor.ctx.get(editorViewCtx) as EditorView | undefined
      if (!view) return

      // Get drop position
      const pos = view.posAtCoords({ left: e.clientX, top: e.clientY })
      const insertPos = pos?.pos ?? view.state.selection.from

      for (const file of images) {
        try {
          const url = await uploadImage(file)
          const markdown = `\n![${file.name}](${url})\n`
          const tr = view.state.tr
          tr.insertText(markdown, insertPos)
          view.dispatch(tr)
        } catch {
          // Silent fail — could show toast here
        }
      }
    },
    []
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
  }, [])

  // Create editor
  const editorRef = useCallback(
    (root: HTMLDivElement | null) => {
      if (!root || hasCreated.current) return
      hasCreated.current = true

      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root)
          ctx.set(defaultValueCtx, initialValueRef.current)
          const listener = ctx.get(listenerCtx)
          listener.markdownUpdated((_ctx, markdown) => {
            onChangeRef.current(markdown)
          })
        })
        .config(nord)
        .use(commonmark)
        .use(gfm)
        .use(listener)
        .use(history)
        .use(createFocusModePlugin())
        .create()
        .then((editor) => {
          editorInstanceRef.current = editor
        })
    },
    []
  )

  // Attach global keyboard listener for slash menu
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Attach input listener for slash command detection
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleInput = () => {
      // Defer to let ProseMirror update its state
      requestAnimationFrame(checkSlashCommand)
    }

    container.addEventListener('input', handleInput)
    container.addEventListener('drop', handleDrop)
    container.addEventListener('dragover', handleDragOver)

    return () => {
      container.removeEventListener('input', handleInput)
      container.removeEventListener('drop', handleDrop)
      container.removeEventListener('dragover', handleDragOver)
    }
  }, [checkSlashCommand, handleDrop, handleDragOver])

  // Filtered slash items
  const filteredItems = SLASH_ITEMS.filter(
    (item) =>
      item.label.includes(slashQuery) ||
      item.keywords.some((k) => k.includes(slashQuery))
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'milkdown-editor h-full overflow-auto p-4 relative',
        focusMode && 'focus-mode'
      )}
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
      }}
    >
      <div ref={editorRef} className="prose-editor" />

      {/* Slash command menu */}
      {slashOpen && filteredItems.length > 0 && (
        <div
          className="absolute z-50 w-56 rounded-[var(--radius-md)] border overflow-hidden shadow-lg"
          style={{
            left: menuCoords.x,
            top: menuCoords.y,
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div
            className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider border-b"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            插入
          </div>
          <div className="max-h-64 overflow-auto">
            {filteredItems.map((item, i) => (
              <button
                key={item.label}
                onClick={() => {
                  if (slashPos) {
                    insertText(item.insert, slashPos.from, slashPos.to)
                    setSlashOpen(false)
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                  i === slashIndex && 'bg-[var(--color-muted)]'
                )}
                style={{ color: 'var(--color-foreground)' }}
              >
                <span style={{ color: 'var(--color-primary)' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
