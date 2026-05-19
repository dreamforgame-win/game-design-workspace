import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { nanoid } from 'nanoid'

/**
 * Merge Tailwind classes with clsx support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a unique slug
 */
export function generateSlug(length = 10): string {
  return nanoid(length)
}

/**
 * Format a date relative to now
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return '刚刚'
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Count words in a string (handles CJK characters)
 */
export function countWords(text: string): number {
  // CJK characters count as 1 word each
  const cjkCount = (text.match(/[一-鿿㐀-䶿]/g) || []).length
  // Latin words
  const latinWords = text
    .replace(/[一-鿿㐀-䶿]/g, '')
    .split(/\s+/)
    .filter(Boolean).length

  return cjkCount + latinWords
}
