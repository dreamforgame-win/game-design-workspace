import { notFound } from 'next/navigation'
import { getPublicDocument } from '@/features/documents/actions'
import { MarkdownRenderer } from '@/components/renderer/MarkdownRenderer'
import { PublicThemeWrapper } from '@/components/renderer/public-theme-wrapper'

interface PublicPageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = await params
  const document = await getPublicDocument(slug)

  if (!document) {
    notFound()
  }

  return (
    <PublicThemeWrapper theme={document.theme}>
      <main className="min-h-screen py-16 px-4">
        <article className="mx-auto" style={{ maxWidth: 'var(--content-max-width)' }}>
          <h1
            className="font-bold mb-8"
            style={{
              fontSize: 'var(--font-size-h1)',
              color: 'var(--color-foreground)',
              fontFamily: 'var(--font-heading)',
              lineHeight: 'var(--line-height-heading)',
            }}
          >
            {document.title}
          </h1>

          <MarkdownRenderer content={document.content} />

          {/* Footer */}
          <footer
            className="mt-16 pt-8 border-t text-center text-sm"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-muted-foreground)',
            }}
          >
            Made with Game Design Workspace
          </footer>
        </article>
      </main>
    </PublicThemeWrapper>
  )
}

export async function generateMetadata({ params }: PublicPageProps) {
  const { slug } = await params
  const document = await getPublicDocument(slug)

  if (!document) {
    return { title: 'Not Found' }
  }

  return {
    title: document.title,
    description: document.content.slice(0, 160),
    openGraph: {
      title: document.title,
      description: document.content.slice(0, 160),
      type: 'article',
    },
  }
}
