import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/features/themes/theme-provider'
import { AuthProvider } from '@/features/auth/auth-provider'
import './globals.css'

// NOTE: Google Fonts are disabled to avoid gstatic.com connection issues
// in regions where Google Fonts is blocked. System fonts serve as fallbacks.
//
// If you want to re-enable Google Fonts later, uncomment the imports below
// and add the font variable classes to the <html> tag.
//
// import { Inter, Noto_Serif_SC, Noto_Sans_SC, Rajdhani } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
// const notoSerifSC = Noto_Serif_SC({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-noto-serif-sc', display: 'swap' })
// const notoSansSC = Noto_Sans_SC({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-noto-sans-sc', display: 'swap' })
// const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani', display: 'swap' })

export const metadata: Metadata = {
  title: 'Game Design Workspace',
  description: 'AI-driven game design visualization workbench. Transform Markdown into beautiful themed presentations.',
  keywords: ['game design', 'visualization', 'markdown', 'presentation', 'GDD'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
    >
      <body className="min-h-screen relative">
        <AuthProvider>
          <ThemeProvider defaultTheme="black-gold">
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--color-card)',
                  color: 'var(--color-card-foreground)',
                  border: '1px solid var(--color-border)',
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
