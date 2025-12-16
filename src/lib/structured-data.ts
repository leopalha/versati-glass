import { Organization, WithContext, LocalBusiness } from 'schema-dts'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://versatiglass.com.br'

export const organizationStructuredData: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Versati Glass',
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description:
    'Vidraçaria de alto padrão especializada em projetos residenciais e comerciais',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+55-21-98253-6229',
      contactType: 'customer service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
  ],
  sameAs: [
    'https://instagram.com/versatiglass',
    'https://facebook.com/versatiglass',
  ],
}

export const localBusinessStructuredData: WithContext<LocalBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Versati Glass',
  image: `${baseUrl}/logo.png`,
  '@id': baseUrl,
  url: baseUrl,
  telephone: '+55-21-98253-6229',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Exemplo, 123',
    addressLocality: 'Rio de Janeiro',
    addressRegion: 'RJ',
    postalCode: '22000-000',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -22.9068,
    longitude: -43.1729,
  },
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
      closes: '13:00',
    },
  ],
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '127',
  },
}

export function getProductStructuredData(product: {
  name: string
  description: string
  image: string
  price?: string
  sku?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `${baseUrl}${product.image}`,
    sku: product.sku || product.name.toLowerCase().replace(/\s+/g, '-'),
    brand: {
      '@type': 'Brand',
      name: 'Versati Glass',
    },
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        url: baseUrl,
        priceCurrency: 'BRL',
        price: product.price.replace(/[^\d]/g, ''),
        availability: 'https://schema.org/InStock',
      },
    }),
  }
}
