import { Cormorant_Garamond, Outfit, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { defaultMetadata } from '@/lib/seo'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${outfit.variable} ${inter.variable}`}>
      <body className="bg-neutral-50 text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
