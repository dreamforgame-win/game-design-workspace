import Link from 'next/link'

export default function PublicNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1
          className="text-4xl font-bold mb-4"
          style={{
            color: 'var(--color-foreground)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          404
        </h1>
        <p
          className="text-base mb-6"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          文档不存在或尚未公开
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-5 rounded-[var(--radius-md)] text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
          }}
        >
          返回首页
        </Link>
      </div>
    </main>
  )
}
