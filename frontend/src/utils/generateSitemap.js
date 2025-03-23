import { tmdbApi } from './api';

const baseUrl = 'https://playex.com'; // Replace with your domain

const generateSitemap = async () => {
  try {
    // Fetch dynamic content
    const [trendingMovies, trendingTv, popularMovies, popularTv] = await Promise.all([
      tmdbApi.get('/trending/movie/week'),
      tmdbApi.get('/trending/tv/week'),
      tmdbApi.get('/movie/popular'),
      tmdbApi.get('/tv/popular')
    ]);

    // Static routes
    const staticRoutes = [
      '/',
      '/movies',
      '/tv-shows',
      '/trending',
      '/fan-favorites',
      '/collections',
      '/terms',
      '/privacy',
      '/cookies',
      '/FAQ'
    ].map(route => ({
      url: `${baseUrl}${route}`,
      lastmod: new Date().toISOString(),
      priority: route === '/' ? '1.0' : '0.8',
      changefreq: 'daily'
    }));

    // Dynamic movie routes
    const movieRoutes = trendingMovies.data.results.map(movie => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastmod: new Date(movie.release_date || movie.first_air_date).toISOString(),
      priority: '0.7',
      changefreq: 'weekly'
    }));

    // Dynamic TV show routes
    const tvRoutes = trendingTv.data.results.map(show => ({
      url: `${baseUrl}/tv/${show.id}`,
      lastmod: new Date(show.first_air_date || show.release_date).toISOString(),
      priority: '0.7',
      changefreq: 'weekly'
    }));

    // Combine all routes
    const routes = [...staticRoutes, ...movieRoutes, ...tvRoutes];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
  `).join('')}
</urlset>`;

    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};

export default generateSitemap;
