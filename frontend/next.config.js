/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['image.tmdb.org'],
    sizes: [320, 640, 750, 1080, 1920, 2560],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp', 'image/avif'],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
  },

  // Environment variables
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    SITE_URL: process.env.SITE_URL || 'https://playex.vercel.app',
  },

  // Compression and bundling optimizations
  compress: true,
  swcMinify: true,

  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tanstack/react-query', 'framer-motion'],
  },

  // Trailing slashes for better caching
  trailingSlash: false,

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)\\.(js|css|jpg|jpeg|png|gif|ico|svg|woff|woff2|eot|ttf)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  },

  // Redirects for old URLs if needed
  async redirects() {
    return [];
  },

  // Performance optimizations
  optimizeFonts: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

module.exports = nextConfig;
