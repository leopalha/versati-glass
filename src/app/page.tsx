// Homepage wrapper with public layout
// This is needed because route groups (public) don't automatically map to /
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { LocalBusinessSchema } from '@/components/seo/local-business-schema'
import { ConsentBanner } from '@/components/gdpr/consent-banner'
import PublicHomePage from './(public)/page'

export { metadata } from './(public)/page'

export default function HomePage() {
  return (
    <div className="bg-theme-primary flex min-h-screen flex-col">
      <LocalBusinessSchema />
      <Header />
      <main className="flex-1">
        <PublicHomePage />
      </main>
      <Footer />
      <WhatsAppButton />
      <ConsentBanner />
    </div>
  )
}
