import { memo } from 'react'
import Script from 'next/script'

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://versatiglass.com.br/#business',
  name: 'Versati Glass',
  alternateName: 'Versati Glass Vidracaria',
  description:
    'Vidracaria premium no Rio de Janeiro especializada em box para banheiro, espelhos, vidros temperados, portas e janelas de vidro. Atendimento personalizado e instalacao profissional.',
  url: 'https://versatiglass.com.br',
  telephone: '+55-21-98253-6229',
  email: 'contato@versatiglass.com.br',
  image: 'https://versatiglass.com.br/images/logo.png',
  logo: {
    '@type': 'ImageObject',
    url: 'https://versatiglass.com.br/images/logo.png',
    width: 200,
    height: 60,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rio de Janeiro',
    addressLocality: 'Rio de Janeiro',
    addressRegion: 'RJ',
    postalCode: '20000-000',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -22.9068,
    longitude: -43.1729,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Rio de Janeiro',
      sameAs: 'https://www.wikidata.org/wiki/Q8678',
    },
    {
      '@type': 'City',
      name: 'Niteroi',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Grande Rio',
    },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00',
    },
  ],
  priceRange: '$$',
  currenciesAccepted: 'BRL',
  paymentAccepted: 'Cash, Credit Card, Debit Card, PIX',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicos de Vidracaria',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Box para Banheiro',
          description: 'Box de vidro temperado para banheiro - correr, abrir, Elegance',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Espelhos',
          description: 'Espelhos sob medida, com LED, bisote e lapidados',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Vidros Temperados',
          description: 'Vidros temperados para mesas, prateleiras e divisorias',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Portas e Janelas',
          description: 'Portas de vidro, janelas blindex e fechamento de varanda',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://www.facebook.com/versatiglass',
    'https://www.instagram.com/versatiglass',
    'https://wa.me/5521982536229',
  ],
}

export const LocalBusinessSchema = memo(function LocalBusinessSchema() {
  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  )
})
