import { prisma } from '@/lib/prisma'
import { encode } from 'next-auth/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Development-only: instant login without email.
 * Creates a test user (if not exists) and sets a valid NextAuth session cookie.
 *
 * Only available in NODE_ENV=development.
 */
export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  const email = 'test@example.com'

  // Find or create test user
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: { email, name: 'Test User' },
    })
  }

  // Generate NextAuth JWT session token
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'NEXTAUTH_SECRET not set' },
      { status: 500 }
    )
  }

  const token = await encode({
    token: {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: null,
    },
    secret,
    salt: 'next-auth.session-token',
    maxAge: 30 * 24 * 60 * 60,
  })

  const cookieStore = await cookies()
  cookieStore.set('next-auth.session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  return NextResponse.json({ success: true })
}
