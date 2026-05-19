import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

/**
 * Middleware runs in Edge Runtime — must NOT import Prisma.
 * We use the lightweight authConfig (no adapter) instead of the full auth.ts.
 */
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  // Protect workspace and editor routes
  matcher: ['/workspace/:path*', '/editor/:path*'],
}
