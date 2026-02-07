// Enhanced SEO Sitemap Generator for Playex
const fs = require('fs');
const path = require('path');

// Base URL for production
const BASE_URL = 'https://playex.com';

// Generate sitemap.xml
const generateSitemap = () => {
  const currentDate = new Date().toISOString();
  
  // Define all routes with priority and change frequency
  const routes = [
    { loc: '/', priority: 1.0, changefreq: 'daily', lastmod: currentDate },
    { loc: '/movies', priority: 0.9, changefreq: 'daily', lastmod: currentDate },
    { loc: '/tv-shows', priority: 0.9, changefreq: 'daily', lastmod: currentDate },
    { loc: '/trending', priority: 0.9, changefreq: 'hourly', lastmod: currentDate },
    { loc: '/search', priority: 0.8, changefreq: 'daily', lastmod: currentDate },
    { loc: '/collections', priority: 0.8, changefreq: 'weekly', lastmod: currentDate },
    { loc: '/fan-favorites', priority: 0.8, changefreq: 'weekly', lastmod: currentDate },
    { loc: '/airing-shows', priority: 0.7, changefreq: 'daily', lastmod: currentDate },
    { loc: '/watchlist', priority: 0.6, changefreq: 'weekly', lastmod: currentDate },
    { loc: '/favorites', priority: 0.6, changefreq: 'weekly', lastmod: currentDate },
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate robots.txt
const generateRobots = () => {
  return `# Playex - Optimized for Search Engine Crawling
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-index.xml

# Crawl Rate
Crawl-delay: 1

# Google
User-agent: Googlebot
Allow: /
Disallow: /admin/

# Bing
User-agent: Bingbot
Allow: /
Disallow: /admin/
`;
};

// Write files
const outputDir = path.join(__dirname, '../build');

// Ensure build directory exists
if (!fs.existsSync(outputDir)) {
  console.log('⚠️  Build directory not found. Run npm run build first.');
  process.exit(1);
}

fs.writeFileSync(
  path.join(outputDir, 'sitemap.xml'),
  generateSitemap(),
  'utf8'
);

fs.writeFileSync(
  path.join(outputDir, 'robots.txt'),
  generateRobots(),
  'utf8'
);

console.log('✅ Sitemap and robots.txt generated successfully in build folder!');

module.exports = { generateSitemap, generateRobots };
