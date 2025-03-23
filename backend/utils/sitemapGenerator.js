const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const fs = require('fs').promises;
const path = require('path');
const { tmdbApi } = require('../config/tmdb');

const generateSitemap = async () => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://playex.vercel.app';
    const links = [];

    // Add static routes
    const staticRoutes = [
      '/',
      '/movies',
      '/tv-shows',
      '/trending',
      '/collections',
      '/fan-favorites',
      '/airing-shows'
    ];

    staticRoutes.forEach(route => {
      links.push({
        url: route,
        changefreq: 'daily',
        priority: route === '/' ? 1.0 : 0.8
      });
    });

    // Add dynamic routes from TMDB
    // Popular Movies
    const movies = await tmdbApi.get('/movie/popular');
    movies.data.results.forEach(movie => {
      links.push({
        url: `/movie/${movie.id}-${movie.title.toLowerCase().replace(/[^\w-]+/g, '-')}`,
        changefreq: 'weekly',
        priority: 0.7
      });
    });

    // Popular TV Shows
    const tvShows = await tmdbApi.get('/tv/popular');
    tvShows.data.results.forEach(show => {
      links.push({
        url: `/tv/${show.id}-${show.name.toLowerCase().replace(/[^\w-]+/g, '-')}`,
        changefreq: 'weekly',
        priority: 0.7
      });
    });

    // Create sitemap
    const stream = new SitemapStream({ hostname: baseUrl });
    const data = await streamToPromise(Readable.from(links).pipe(stream));

    // Save sitemap
    await fs.writeFile(
      path.join(__dirname, '../../frontend/public/sitemap.xml'),
      data.toString()
    );

    // Create robots.txt
    const robotsTxt = `
User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
    `.trim();

    await fs.writeFile(
      path.join(__dirname, '../../frontend/public/robots.txt'),
      robotsTxt
    );

    console.log('Sitemap and robots.txt generated successfully');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

module.exports = generateSitemap;
