/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL FIX: Desabilita Turbopack para evitar erro de symlink (Windows privilege issue)
  // Turbopack erro: "O cliente não tem o privilégio necessário. (os error 1314)"
  // Solution: Força uso do Webpack tradicional
  webpack: (config) => {
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Desabilita Turbopack explicitamente
    turbo: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
