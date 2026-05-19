import type { ThemeId } from './theme'

export type DocumentLayout = 'reading' | 'document' | 'presentation'

export interface DocumentMeta {
  id: string
  title: string
  slug: string
  theme: ThemeId
  layout: DocumentLayout
  isPublic: boolean
  wordCount: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface DocumentFull extends DocumentMeta {
  content: string
  metadata: Record<string, unknown>
}

export interface DocumentVersion {
  id: string
  content: string
  createdAt: string
}
