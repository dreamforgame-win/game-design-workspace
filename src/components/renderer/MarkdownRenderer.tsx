'use client'

import { useMemo } from 'react'
import { parseMarkdown } from '@/lib/markdown'
import { directiveComponentMap } from './directives/directive-map'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * Core Markdown rendering component.
 * Takes raw Markdown, processes it through the unified pipeline,
 * and renders with custom directive components.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Parse markdown to React elements (memoized for performance)
  const elements = useMemo(() => {
    return renderMarkdown(content)
  }, [content])

  return (
    <div
      className={className}
      style={{ maxWidth: 'var(--content-max-width)' }}
    >
      {elements}
    </div>
  )
}

/**
 * Convert markdown string to React elements.
 * Uses the unified pipeline + custom directive components.
 */
function renderMarkdown(markdown: string): React.ReactNode[] {
  // For now, we do a synchronous-style rendering using a simpler approach
  // that doesn't require async/await in the render cycle.
  // The full pipeline will be async once we integrate rehype-react properly.

  const lines = markdown.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (line.trim() === '') {
      i++
      continue
    }

    // Horizontal rule (---) — presentation slide separator
    if (line.trim().match(/^---+$/)) {
      elements.push(
        <hr
          key={key++}
          className="my-8 border-0"
          style={{ borderTop: '1px solid var(--color-border)' }}
        />
      )
      i++
      continue
    }

    // Directive block (:::name ... :::)
    if (line.trim().startsWith(':::') && !line.trim().endsWith(':::')) {
      const match = line.trim().match(/^:::(\w+)(.*)/)
      if (match) {
        const directiveName = match[1]
        const attrsStr = match[2] || ''
        const attrs = parseAttributes(attrsStr)
        i++

        // Collect content until closing :::
        const contentLines: string[] = []
        while (i < lines.length && !lines[i].trim().match(/^:::\s*$/)) {
          contentLines.push(lines[i])
          i++
        }
        i++ // skip closing :::

        const directiveContent = contentLines.join('\n').trim()
        const Component = directiveComponentMap[`directive-${directiveName}`]

        if (Component) {
          elements.push(
            <Component
              key={key++}
              content={directiveContent}
              {...attrs}
            />
          )
        } else {
          // Unknown directive — render as code block
          elements.push(
            <pre
              key={key++}
              className="rounded-[var(--radius-md)] p-3 text-sm overflow-x-auto"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-muted-foreground)',
              }}
            >
              {directiveContent || `(空指令: ${directiveName})`}
            </pre>
          )
        }
        continue
      }
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      const sizes: Record<number, string> = {
        1: 'var(--font-size-h1)',
        2: 'var(--font-size-h2)',
        3: 'var(--font-size-h3)',
        4: 'var(--font-size-h4)',
        5: 'var(--font-size-h5)',
        6: 'var(--font-size-h6)',
      }
      const Tag = `h${level}` as React.ElementType
      elements.push(
        <Tag
          key={key++}
          className="font-bold mt-8 mb-3 first:mt-0"
          style={{
            fontSize: sizes[level],
            color: 'var(--color-foreground)',
            fontFamily: 'var(--font-heading)',
            lineHeight: 'var(--line-height-heading)',
          }}
        >
          {renderInlineMarkdown(text)}
        </Tag>
      )
      i++
      continue
    }

    // Code block (```lang ... ```)
    if (line.trim().startsWith('```')) {
      const lang = line.trim().replace(/^```/, '').trim()
      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      elements.push(
        <pre
          key={key++}
          className="rounded-[var(--radius-md)] p-4 text-sm overflow-x-auto my-4"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-foreground)',
            fontFamily: 'var(--font-code)',
          }}
        >
          {lang && (
            <span
              className="block text-xs mb-2"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              {lang}
            </span>
          )}
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      continue
    }

    // Table
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableResult = parseTable(lines, i)
      elements.push(tableResult.element)
      i = tableResult.nextIndex
      continue
    }

    // Unordered list
    if (line.match(/^[\s]*[-*]\s+/)) {
      const listResult = parseList(lines, i, 'ul')
      elements.push(listResult.element)
      i = listResult.nextIndex
      continue
    }

    // Ordered list
    if (line.match(/^[\s]*\d+\.\s+/)) {
      const listResult = parseList(lines, i, 'ol')
      elements.push(listResult.element)
      i = listResult.nextIndex
      continue
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      elements.push(
        <blockquote
          key={key++}
          className="border-l-4 pl-4 my-4 italic"
          style={{
            borderLeftColor: 'var(--color-primary)',
            color: 'var(--color-muted-foreground)',
          }}
        >
          {quoteLines.map((l, idx) => (
            <p key={idx} className="text-sm leading-relaxed">
              {renderInlineMarkdown(l)}
            </p>
          ))}
        </blockquote>
      )
      continue
    }

    // Paragraph (default)
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith(':::') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].match(/^[\s]*[-*]\s+/) &&
      !lines[i].match(/^[\s]*\d+\.\s+/) &&
      !lines[i].trim().match(/^---+$/)
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      elements.push(
        <p
          key={key++}
          className="text-sm leading-relaxed mb-4"
          style={{ color: 'var(--color-foreground)' }}
        >
          {renderInlineMarkdown(paraLines.join(' '))}
        </p>
      )
    }
  }

  return elements
}

/**
 * Parse inline markdown: **bold**, *italic*, `code`, [link](url)
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  // Simple regex-based inline parsing
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[2]) {
      // Bold
      parts.push(<strong key={key++} className="font-semibold">{match[2]}</strong>)
    } else if (match[3]) {
      // Italic
      parts.push(<em key={key++}>{match[3]}</em>)
    } else if (match[4]) {
      // Inline code
      parts.push(
        <code
          key={key++}
          className="rounded px-1.5 py-0.5 text-xs"
          style={{
            backgroundColor: 'var(--color-secondary)',
            fontFamily: 'var(--font-code)',
            color: 'var(--color-foreground)',
          }}
        >
          {match[4]}
        </code>
      )
    } else if (match[5] && match[6]) {
      // Link
      parts.push(
        <a
          key={key++}
          href={match[6]}
          className="underline underline-offset-2"
          style={{ color: 'var(--color-primary)' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[5]}
        </a>
      )
    }

    lastIndex = match.index + match[0].length
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

/**
 * Parse directive attributes from {title="..." icon="..."}
 */
function parseAttributes(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const regex = /(\w+)="([^"]*)"/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(attrStr)) !== null) {
    attrs[match[1]] = match[2]
  }
  return attrs
}

/**
 * Parse a markdown table
 */
function parseTable(lines: string[], startIndex: number) {
  const tableLines: string[] = []
  let i = startIndex
  while (i < lines.length && lines[i].includes('|')) {
    tableLines.push(lines[i])
    i++
  }

  // Filter out separator rows (|---|---|)
  const dataRows = tableLines.filter(
    (line) => !line.replace(/[\s|\-:]/g, '').match(/^$/)
  )

  if (dataRows.length === 0) {
    return { element: null, nextIndex: i }
  }

  const headerCells = splitTableRow(dataRows[0])
  const bodyRows = dataRows.slice(1).map(splitTableRow)

  const element = (
    <div key={Math.random()} className="overflow-x-auto my-4">
      <table
        className="w-full text-sm"
        style={{ borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            {headerCells.map((cell, idx) => (
              <th
                key={idx}
                className="text-left p-2 border-b font-semibold"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-foreground)',
                }}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="p-2 border-b"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-muted-foreground)',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return { element, nextIndex: i }
}

function splitTableRow(line: string): string[] {
  return line
    .split('|')
    .map((cell) => cell.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length) // skip first/last empty from leading/trailing |
}

/**
 * Parse a list (ul or ol)
 */
function parseList(lines: string[], startIndex: number, type: 'ul' | 'ol') {
  const items: string[] = []
  let i = startIndex
  const regex = type === 'ul' ? /^[\s]*[-*]\s+/ : /^[\s]*\d+\.\s+/

  while (i < lines.length && regex.test(lines[i])) {
    items.push(lines[i].replace(regex, '').trim())
    i++
  }

  const ListTag = type
  const element = (
    <ListTag
      key={Math.random()}
      className="my-2 pl-5 space-y-1"
      style={{ listStyleType: type === 'ul' ? 'disc' : 'decimal' }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--color-foreground)' }}
        >
          {renderInlineMarkdown(item)}
        </li>
      ))}
    </ListTag>
  )

  return { element, nextIndex: i }
}
