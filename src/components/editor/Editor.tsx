'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { gfm } from '@milkdown/preset-gfm'
import { nord } from '@milkdown/theme-nord'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { history } from '@milkdown/plugin-history'
import { useEditor } from '@milkdown/react'
import '@milkdown/theme-nord/style.css'

interface MilkdownEditorProps {
  initialValue: string
  onChange: (markdown: string) => void
}

export function MilkdownEditor({ initialValue, onChange }: MilkdownEditorProps) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, initialValue)
        ctx.set(listenerCtx, {
          markdown: [...(ctx.get(listenerCtx).markdown ?? []), (md: string) => {
            onChangeRef.current(md)
          }],
        })
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(listener)
      .use(history)
  )

  return (
    <div
      className="milkdown-editor h-full overflow-auto p-4"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
      }}
    >
      <div ref={get} className="prose-editor" />
    </div>
  )
}
