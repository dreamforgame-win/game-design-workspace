export default function PublicLoading() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
        <div className="h-10 w-3/4 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="h-4 w-5/6 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="h-32 w-full rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="h-4 w-4/6 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
      </div>
    </main>
  )
}
