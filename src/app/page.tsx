import { Hero } from '@/components/marketing/hero'
import { DemoPreview } from '@/components/marketing/demo-preview'
import { Features } from '@/components/marketing/features'
import { Cta } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen relative z-10">
      <Hero />
      <DemoPreview />
      <Features />
      <Cta />
      <Footer />
    </main>
  )
}
