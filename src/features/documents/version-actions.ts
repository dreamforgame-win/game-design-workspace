'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const MAX_VERSIONS = 50
const MIN_VERSION_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

async function getCurrentUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }
  return session.user.id
}

/**
 * Create a version snapshot if enough time has passed since the last one.
 */
export async function createVersion(slug: string, content: string) {
  const userId = await getCurrentUserId()

  const document = await prisma.document.findUnique({
    where: { userId_slug: { userId, slug } },
    include: {
      versions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!document) return null

  // Throttle: min 5 minutes between versions
  const lastVersion = document.versions[0]
  if (lastVersion) {
    const elapsed = Date.now() - lastVersion.createdAt.getTime()
    if (elapsed < MIN_VERSION_INTERVAL_MS) return null
  }

  // Create version
  const version = await prisma.documentVersion.create({
    data: {
      documentId: document.id,
      content,
    },
  })

  // Prune old versions (keep max 50)
  const versionsToDelete = await prisma.documentVersion.findMany({
    where: { documentId: document.id },
    orderBy: { createdAt: 'desc' },
    skip: MAX_VERSIONS,
  })

  if (versionsToDelete.length > 0) {
    await prisma.documentVersion.deleteMany({
      where: { id: { in: versionsToDelete.map((v) => v.id) } },
    })
  }

  return version
}

/**
 * List last 20 versions for a document.
 */
export async function listVersions(slug: string) {
  const userId = await getCurrentUserId()

  const document = await prisma.document.findUnique({
    where: { userId_slug: { userId, slug } },
    include: {
      versions: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  })

  return document?.versions || []
}

/**
 * Restore a version. Current content is first saved as a new version,
 * then the selected version content replaces the document.
 */
export async function restoreVersion(slug: string, versionId: string) {
  const userId = await getCurrentUserId()

  const document = await prisma.document.findUnique({
    where: { userId_slug: { userId, slug } },
    include: {
      versions: {
        where: { id: versionId },
        take: 1,
      },
    },
  })

  if (!document || document.versions.length === 0) return null

  // Save current content as a new version before restoring
  await prisma.documentVersion.create({
    data: {
      documentId: document.id,
      content: document.content,
    },
  })

  // Restore
  const versionContent = document.versions[0].content
  await prisma.document.update({
    where: { userId_slug: { userId, slug } },
    data: { content: versionContent },
  })

  return versionContent
}

/**
 * Get a single version by ID (for preview).
 */
export async function getVersion(versionId: string) {
  const userId = await getCurrentUserId()

  const version = await prisma.documentVersion.findFirst({
    where: {
      id: versionId,
      document: { userId },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  })

  return version
}
