import { notFound } from 'next/navigation'
import { getDocument } from '@/features/documents/actions'
import { EditorLayout } from '@/components/editor/editor-layout'

interface EditorPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { slug } = await params
  const document = await getDocument(slug)

  if (!document) {
    notFound()
  }

  return <EditorLayout document={document} />
}
