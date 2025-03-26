/** @type {import('next').NextConfig} */
const nextConfig = {
     // Disable ESLint during builds
     eslint: {
          // This setting will completely disable ESLint during builds
          ignoreDuringBuilds: true,
     },
     async headers() {
          return [
               {
                    // matching all API routes
                    source: "/api/:path*",
                    headers: [
                         { key: "Access-Control-Allow-Credentials", value: "true" },
                         { key: "Access-Control-Allow-Origin", value: "*" },
                         { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                    ]
               },
               {
                    source: '/:path*',
                    headers: [
                         {
                              key: 'Cache-Control',
                              value: 'public, max-age=31536000, immutable',
                         },
                    ],
               },
          ];
     },
     images: {
          domains: ['res.cloudinary.com'],
          remotePatterns: [
               {
                    protocol: 'https',
                    hostname: 'res.cloudinary.com',
                    pathname: '**',
               },
          ],
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
          imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
          formats: ['image/webp'],
          minimumCacheTTL: 60,
     },
     async rewrites() {
          return [
               {
                    source: '/api/:path*',
                    destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
               },
          ];
     },
     // Performance optimizations
     swcMinify: true,
     compress: true,
     poweredByHeader: false,
     reactStrictMode: true,
     experimental: {
          optimizeFonts: true,
          optimizeImages: true,
          scrollRestoration: true,
     },
     // Production build optimizations
     compiler: {
          removeConsole: process.env.NODE_ENV === 'production',
     },
     // Redirect from root to store
     async redirects() {
          return [
               {
                    source: '/',
                    destination: '/store',
                    permanent: true,
               },
          ];
     },
};

module.exports = nextConfig; 