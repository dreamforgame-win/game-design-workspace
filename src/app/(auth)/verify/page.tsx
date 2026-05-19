export default function VerifyPage() {
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
          我们已向你发送了登录链接。请检查收件箱（或垃圾邮件文件夹）。
        </p>
      </div>
    </main>
  )
}
