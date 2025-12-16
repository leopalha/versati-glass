import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://versatiglass.com.br'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Versati Glass - Vidraçaria de Luxo e Esquadrias de Alta Performance',
    template: '%s | Versati Glass',
  },
  description:
    'Vidraçaria de alto padrão especializada em projetos residenciais e comerciais. Box, espelhos, divisórias, fachadas e soluções personalizadas com excelência.',
  keywords: [
    'vidraçaria',
    'vidraçaria Rio de Janeiro',
    'box de vidro',
    'espelhos',
    'guarda-corpo de vidro',
    'fachada de vidro',
    'divisória de vidro',
    'esquadrias',
    'vidros temperados',
    'vidros laminados',
    'vidraçaria zona sul',
    'vidraçaria barra',
  ],
  authors: [{ name: 'Versati Glass' }],
  creator: 'Versati Glass',
  publisher: 'Versati Glass',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: baseUrl,
    siteName: 'Versati Glass',
    title: 'Versati Glass - Vidraçaria de Luxo',
    description: 'Soluções em vidro de alto padrão para seu projeto',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Versati Glass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Versati Glass - Vidraçaria de Luxo',
    description: 'Soluções em vidro de alto padrão para seu projeto',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

type SeoPageConfig = {
  title: string
  description: string
  path: string
  image?: string
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
}: SeoPageConfig): Metadata {
  const url = `${baseUrl}${path}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
