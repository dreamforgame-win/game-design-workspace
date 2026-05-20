import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { authConfig } from './auth.config'

const providers = [...authConfig.providers]

// Development-only: test account login (no email required)
if (process.env.NODE_ENV === 'development') {
  providers.push(
    CredentialsProvider({
      id: 'test',
      name: 'Test Account',
      credentials: {},
      async authorize() {
        const email = 'test@example.com'
        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: 'Test User' },
          })
        }
        return { id: user.id, email: user.email, name: user.name }
      },
    })
  )
}

/**
 * Full auth setup for API routes and server components (Node.js Runtime).
 * Extends the lightweight auth.config with the Prisma adapter.
 * In development, also adds a Credentials provider for instant test login.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers,
})
