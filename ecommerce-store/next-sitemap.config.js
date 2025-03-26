/** @type {import('next-sitemap').IConfig} */
module.exports = {
     siteUrl: process.env.NEXT_PUBLIC_STORE_URL || 'https://store.admindashboardecom.vercel.app',
     generateRobotsTxt: true,
     sitemapSize: 7000,
     changefreq: 'daily',
     priority: 0.7,
     exclude: ['/api/*', '/404', '/500'],
     robotsTxtOptions: {
          policies: [
               {
                    userAgent: '*',
                    allow: '/',
                    disallow: ['/api', '/404', '/500'],
               },
          ],
          additionalSitemaps: [
               `${process.env.NEXT_PUBLIC_STORE_URL}/server-sitemap.xml`,
          ],
     },
     transform: async (config, path) => {
          // Custom transform function for dynamic routes
          return {
               loc: path,
               changefreq: config.changefreq,
               priority: path === '/' ? 1.0 :
                    path.startsWith('/category/') ? 0.8 :
                         path.startsWith('/product/') ? 0.9 :
                              0.7,
               lastmod: new Date().toISOString(),
          }
     },
} 