import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import type { Plugin } from 'unified'
import type { Root } from 'hast'

/**
 * Custom remark plugin that transforms directive nodes into hast elements
 * that rehype-react can map to React components.
 *
 * :::battleflow  →  <directive-battleflow>
 * :::timeline    →  <directive-timeline>
 * etc.
 */
export const remarkDirectiveToHast: Plugin<[], Root> = function () {
  return (tree: any) => {
    visitDirectives(tree)
  }
}

function visitDirectives(tree: any) {
  if (!tree.children) return

  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i]

    // Handle container directives (:::name ... :::)
    if (node.type === 'containerDirective') {
      tree.children[i] = transformDirective(node, 'container')
    }
    // Handle leaf directives (:::name[attr])
    else if (node.type === 'leafDirective') {
      tree.children[i] = transformDirective(node, 'leaf')
    }
    // Handle text directives (:name[content]{attr})
    else if (node.type === 'textDirective') {
      tree.children[i] = transformDirective(node, 'text')
    }
    else {
      visitDirectives(node)
    }
  }
}

function transformDirective(node: any, kind: string) {
  const name = node.name || 'unknown'
  const attributes = node.attributes || {}
  const children = node.children || []

  // Recurse into children to handle nested directives
  visitDirectives(node)

  // Serialize content as text for the component to parse
  const textContent = extractTextContent(children)

  return {
    type: 'element',
    tagName: `directive-${name}`,
    properties: {
      ...attributes,
      'data-directive-kind': kind,
      'data-text-content': textContent,
    },
    children: children,
  }
}

function extractTextContent(children: any[]): string {
  let text = ''
  for (const child of children) {
    if (child.type === 'text') {
      text += child.value
    } else if (child.children) {
      text += extractTextContent(child.children)
    }
  }
  return text.trim()
}

/**
 * Create the unified Markdown processing pipeline.
 */
export function createMarkdownProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkDirectiveToHast)
    .use(remarkRehype, { allowDangerousHtml: true })
}

/**
 * Parse markdown string to hast (HTML AST).
 * Used by MarkdownRenderer to convert to React elements.
 */
export async function parseMarkdown(markdown: string) {
  const processor = createMarkdownProcessor()
  const ast = processor.parse(markdown)
  const hast = await processor.run(ast)
  return hast
}
