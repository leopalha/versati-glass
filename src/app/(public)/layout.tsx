import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactHub } from '@/components/shared/contact-hub'
import { LocalBusinessSchema } from '@/components/seo/local-business-schema'

// Dynamic import for ConsentBanner (loads after page is interactive)
const ConsentBanner = dynamic(
  () => import('@/components/gdpr/consent-banner').then((m) => ({ default: m.ConsentBanner })),
  {
    ssr: false, // Only load on client side
  }
)

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-theme-primary flex min-h-screen flex-col">
      <LocalBusinessSchema />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ContactHub showOnPages="all" />
      <ConsentBanner />
    </div>
  )
}
