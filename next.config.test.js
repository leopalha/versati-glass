/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizations for E2E testing
  reactStrictMode: false, // Disable strict mode in tests to avoid double renders
  swcMinify: false, // Disable minification for faster builds
  compiler: {
    removeConsole: false, // Keep console logs for debugging
  },
  experimental: {
    optimizeCss: false, // Disable CSS optimization for faster builds
  },
  // Disable image optimization in tests
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
