export default function WorkspaceLoading() {
  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-32 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="flex items-center gap-3">
          <div className="h-10 w-48 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
          <div className="h-10 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-[var(--radius-md)] animate-pulse"
            style={{ backgroundColor: 'var(--color-muted)' }}
          />
        ))}
      </div>
    </div>
  )
}
