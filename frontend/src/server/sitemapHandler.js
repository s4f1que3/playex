import generateSitemap from '../utils/generateSitemap';
import fs from 'fs/promises';
import path from 'path';

const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export const handleSitemapRequest = async (req, res) => {
  try {
    // Check if sitemap exists and is recent
    let sitemap;
    try {
      const stats = await fs.stat(SITEMAP_PATH);
      const age = Date.now() - stats.mtime.getTime();
      
      if (age < UPDATE_INTERVAL) {
        sitemap = await fs.readFile(SITEMAP_PATH, 'utf-8');
      }
    } catch (error) {
      // File doesn't exist or other error, generate new sitemap
    }

    if (!sitemap) {
      sitemap = await generateSitemap();
      await fs.writeFile(SITEMAP_PATH, sitemap);
    }

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};

export const updateSitemap = async () => {
  try {
    const sitemap = await generateSitemap();
    await fs.writeFile(SITEMAP_PATH, sitemap);
    console.log('Sitemap updated successfully');
  } catch (error) {
    console.error('Error updating sitemap:', error);
  }
};

// Schedule automatic updates
setInterval(updateSitemap, UPDATE_INTERVAL);
