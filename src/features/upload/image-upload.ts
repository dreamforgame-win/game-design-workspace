/**
 * Image upload utility.
 *
 * Current implementation: reads file as base64 data URL (client-side only).
 * For production, replace with Vercel Blob or your preferred storage:
 *
 *   import { put } from '@vercel/blob'
 *   const blob = await put(filename, file, { access: 'public' })
 *   return blob.url
 *
 * Requires: npm install @vercel/blob
 * And BLOB_READ_WRITE_TOKEN in env.
 */

export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}
