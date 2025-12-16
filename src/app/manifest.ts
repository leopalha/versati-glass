import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Versati Glass - Vidraçaria de Luxo',
    short_name: 'Versati Glass',
    description: 'Vidraçaria de alto padrão especializada em projetos residenciais e comerciais',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0A',
    theme_color: '#C9A962',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
