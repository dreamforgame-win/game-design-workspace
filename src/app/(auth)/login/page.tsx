'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      await signIn('email', { email, redirect: false })
      setSent(true)
    } catch {
      // Error handled by NextAuth
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div
          className="w-full max-w-sm text-center p-8 rounded-[var(--radius-lg)] border"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          <h1 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>
            检查你的邮箱
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            登录链接已发送到 {email}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div
        className="w-full max-w-sm p-8 rounded-[var(--radius-lg)] border"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-foreground)' }}
          >
            Game Design Workspace
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            用邮箱登录你的工作台
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            label="邮箱地址"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            发送登录链接
          </Button>
        </form>
      </div>
    </main>
  )
}
