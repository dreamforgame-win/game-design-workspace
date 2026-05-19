'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { generateSlug, countWords } from '@/lib/utils'

/**
 * Get the current authenticated user's ID
 */
async function getCurrentUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }
  return session.user.id
}

/**
 * Create a new document with optional template content
 */
export async function createDocument(templateContent = '') {
  const userId = await getCurrentUserId()
  const slug = generateSlug()

  const doc = await prisma.document.create({
    data: {
      title: 'Untitled',
      slug,
      content: templateContent,
      wordCount: countWords(templateContent),
      userId,
    },
  })

  redirect(`/editor/${doc.slug}`)
}

/**
 * Get all documents for the current user
 */
export async function listDocuments() {
  const userId = await getCurrentUserId()

  return prisma.document.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      slug: true,
      theme: true,
      wordCount: true,
      isPublic: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

/**
 * Get a single document by slug (for editor)
 */
export async function getDocument(slug: string) {
  const userId = await getCurrentUserId()

  const doc = await prisma.document.findUnique({
    where: {
      userId_slug: { userId, slug },
    },
  })

  if (!doc) {
    return null
  }

  return doc
}

/**
 * Get a public document by slug (no auth required)
 */
export async function getPublicDocument(slug: string) {
  const doc = await prisma.document.findFirst({
    where: {
      slug,
      isPublic: true,
    },
    include: {
      user: {
        select: { name: true },
      },
    },
  })

  return doc
}

/**
 * Update document content (auto-save)
 */
export async function updateDocument(
  slug: string,
  data: { title?: string; content?: string; theme?: string; isPublic?: boolean }
) {
  const userId = await getCurrentUserId()

  const updateData: Record<string, unknown> = { ...data }

  if (data.content !== undefined) {
    updateData.wordCount = countWords(data.content)
  }

  return prisma.document.update({
    where: {
      userId_slug: { userId, slug },
    },
    data: updateData,
  })
}

/**
 * Delete a document
 */
export async function deleteDocument(slug: string) {
  const userId = await getCurrentUserId()

  await prisma.document.delete({
    where: {
      userId_slug: { userId, slug },
    },
  })
}

/**
 * Toggle document public/private
 */
export async function togglePublic(slug: string) {
  const userId = await getCurrentUserId()

  const doc = await prisma.document.findUnique({
    where: { userId_slug: { userId, slug } },
    select: { isPublic: true },
  })

  if (!doc) return null

  return prisma.document.update({
    where: { userId_slug: { userId, slug } },
    data: {
      isPublic: !doc.isPublic,
      publishedAt: !doc.isPublic ? new Date() : null,
    },
  })
}
