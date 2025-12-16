import { Cormorant_Garamond, Outfit, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { defaultMetadata } from '@/lib/seo'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { GoogleTagManager } from '@/components/analytics/google-tag-manager'
import { MetaPixel } from '@/components/analytics/meta-pixel'

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = defaultMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || ''
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || ''

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${outfit.variable} ${inter.variable}`}>
      <body className="bg-theme-primary text-theme-primary min-h-screen antialiased">
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
        <Providers>{children}</Providers>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        {metaPixelId && <MetaPixel pixelId={metaPixelId} />}
      </body>
    </html>
  )
}
