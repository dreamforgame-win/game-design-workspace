import { notFound } from 'next/navigation'
import { getPublicDocument } from '@/features/documents/actions'

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
    <main
      className="min-h-screen py-16 px-4"
      data-theme={document.theme === 'black-gold' ? undefined : document.theme}
    >
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

        {/* Markdown renderer will replace this in Task 7 */}
        <div
          className="prose"
          style={{ color: 'var(--color-foreground)' }}
        >
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
            {document.content}
          </pre>
        </div>

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
