'use client'

import { SessionProvider } from 'next-auth/react'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Wraps the app with NextAuth SessionProvider.
 * Required for useSession, signIn, and signOut to work on the client.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
}
