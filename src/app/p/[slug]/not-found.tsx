export default function PublicNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: 'var(--color-foreground)' }}
        >
          404
        </h1>
        <p style={{ color: 'var(--color-muted-foreground)' }}>
          文档不存在或未公开
        </p>
      </div>
    </main>
  )
}
