'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { PresentationMode } from './presentation-mode'

interface PublicPresentationWrapperProps {
  slug: string
  content: string
  theme: string
}

/**
 * Client wrapper that detects `?mode=present` on public share pages
 * and renders the PresentationMode overlay.
 */
export function PublicPresentationWrapper({ slug, content, theme }: PublicPresentationWrapperProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isPresent = searchParams.get('mode') === 'present'

  if (!isPresent) return null

  return (
    <PresentationMode
      content={content}
      theme={theme}
      onExit={() => {
        router.push(`/p/${slug}`)
      }}
    />
  )
}
