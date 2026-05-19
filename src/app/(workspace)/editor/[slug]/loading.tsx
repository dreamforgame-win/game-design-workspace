export default function EditorLoading() {
  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar skeleton */}
      <div className="h-12 border-b flex items-center px-4 gap-3 shrink-0" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-5 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="flex-1" />
        <div className="h-8 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
        <div className="h-8 w-20 rounded animate-pulse" style={{ backgroundColor: 'var(--color-muted)' }} />
      </div>
      {/* Main area skeleton */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 space-y-3 animate-pulse">
          <div className="h-8 w-3/4 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
          <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
          <div className="h-4 w-5/6 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
          <div className="h-4 w-4/6 rounded" style={{ backgroundColor: 'var(--color-muted)' }} />
        </div>
      </div>
    </div>
  )
}
