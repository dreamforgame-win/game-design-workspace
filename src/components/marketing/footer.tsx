export function Footer() {
  return (
    <footer
      className="border-t py-8 px-4"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-xs"
          style={{ color: 'var(--color-muted-foreground)' }}
        >
          Game Design Workspace
        </p>
        <div className="flex items-center gap-6">
          <a
            href="/login"
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            登录
          </a>
          <a
            href="/workspace"
            className="text-xs transition-colors hover:opacity-80"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            工作区
          </a>
        </div>
      </div>
    </footer>
  )
}
