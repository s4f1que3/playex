/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'],
  },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    SITE_URL: process.env.SITE_URL || 'https://playex.vercel.app',
  }
};

module.exports = nextConfig;
