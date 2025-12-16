/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://versatiglass.com.br',
  generateRobotsTxt: false, // We have a custom robots.ts
  generateIndexSitemap: false,
  exclude: ['/portal/*', '/admin/*', '/api/*'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom priority for specific routes
    const customPriorities = {
      '/': 1.0,
      '/produtos': 0.9,
      '/orcamento': 0.9,
      '/servicos': 0.8,
      '/contato': 0.8,
      '/portfolio': 0.7,
      '/sobre': 0.6,
    }

    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: customPriorities[path] || 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
