import { listDocuments } from '@/features/documents/actions'
import { WorkspaceClient } from './workspace-client'

export default async function WorkspacePage() {
  const documents = await listDocuments()

  return <WorkspaceClient documents={documents} />
}
