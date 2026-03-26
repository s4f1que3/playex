const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Video Scraper Service
 * Scrapes multiple sources to find video streams for movies and TV shows
 */

class VideoScraper {
  constructor() {
    this.sources = [
      'vidsrc',
      'embedsu',
      'autoembed',
      'multiembed'
    ];
    
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }

  /**
   * Get video sources for a movie
   * @param {string} tmdbId - TMDB ID of the movie
   * @returns {Promise<Array>} Array of video sources
   */
  async getMovieSources(tmdbId) {
    const sources = [];
    
    try {
      // VidSrc.me
      const vidsrcUrl = `https://vidsrc.me/embed/movie/${tmdbId}`;
      sources.push({
        source: 'vidsrc',
        url: vidsrcUrl,
        quality: 'auto',
        type: 'embed'
      });

      // VidSrc.to
      const vidsrcToUrl = `https://vidsrc.to/embed/movie/${tmdbId}`;
      sources.push({
        source: 'vidsrc.to',
        url: vidsrcToUrl,
        quality: 'auto',
        type: 'embed'
      });

      // 2Embed
      const embedUrl = `https://www.2embed.cc/embed/${tmdbId}`;
      sources.push({
        source: '2embed',
        url: embedUrl,
        quality: 'auto',
        type: 'embed'
      });

      // AutoEmbed
      const autoembedUrl = `https://autoembed.cc/movie/tmdb/${tmdbId}`;
      sources.push({
        source: 'autoembed',
        url: autoembedUrl,
        quality: 'auto',
        type: 'embed'
      });

      // MultiEmbed
      const multiembedUrl = `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
      sources.push({
        source: 'multiembed',
        url: multiembedUrl,
        quality: 'auto',
        type: 'embed'
      });

      // Non Embed
      const nonembedUrl = `https://nontonin.store/embed/movie/${tmdbId}`;
      sources.push({
        source: 'nonembed',
        url: nonembedUrl,
        quality: 'auto',
        type: 'embed'
      });

      return sources;
    } catch (error) {
      console.error('Error scraping movie sources:', error);
      throw new Error('Failed to fetch video sources');
    }
  }

  /**
   * Get video sources for a TV show episode
   * @param {string} tmdbId - TMDB ID of the TV show
   * @param {number} season - Season number
   * @param {number} episode - Episode number
   * @returns {Promise<Array>} Array of video sources
   */
  async getTvSources(tmdbId, season, episode) {
    const sources = [];
    
    try {
      // VidSrc.me
      const vidsrcUrl = `https://vidsrc.me/embed/tv/${tmdbId}/${season}/${episode}`;
      sources.push({
        source: 'vidsrc',
        url: vidsrcUrl,
        quality: 'auto',
        type: 'embed'
      });

      // VidSrc.to
      const vidsrcToUrl = `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      sources.push({
        source: 'vidsrc.to',
        url: vidsrcToUrl,
        quality: 'auto',
        type: 'embed'
      });

      // 2Embed
      const embedUrl = `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;
      sources.push({
        source: '2embed',
        url: embedUrl,
        quality: 'auto',
        type: 'embed'
      });

      // AutoEmbed
      const autoembedUrl = `https://autoembed.cc/tv/tmdb/${tmdbId}-${season}-${episode}`;
      sources.push({
        source: 'autoembed',
        url: autoembedUrl,
        quality: 'auto',
        type: 'embed'
      });

      // MultiEmbed
      const multiembedUrl = `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
      sources.push({
        source: 'multiembed',
        url: multiembedUrl,
        quality: 'auto',
        type: 'embed'
      });

      // Non Embed
      const nonembedUrl = `https://nontonin.store/embed/tv/${tmdbId}/${season}/${episode}`;
      sources.push({
        source: 'nonembed',
        url: nonembedUrl,
        quality: 'auto',
        type: 'embed'
      });

      return sources;
    } catch (error) {
      console.error('Error scraping TV sources:', error);
      throw new Error('Failed to fetch video sources');
    }
  }

  /**
   * Extract direct video URL from embed page
   * This is more advanced and may require additional parsing
   * @param {string} embedUrl - URL of the embed page
   * @returns {Promise<string|null>} Direct video URL or null
   */
  async extractDirectUrl(embedUrl) {
    try {
      const response = await axios.get(embedUrl, {
        headers: {
          'User-Agent': this.userAgent,
          'Referer': 'https://playex.cc/'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Try to find iframe src
      const iframe = $('iframe').first().attr('src');
      if (iframe) {
        return iframe;
      }

      // Try to find video source in script tags
      const scripts = $('script').toArray();
      for (const script of scripts) {
        const content = $(script).html();
        if (content) {
          // Look for common video URL patterns
          const m3u8Match = content.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/);
          if (m3u8Match) {
            return m3u8Match[1];
          }

          const mp4Match = content.match(/(https?:\/\/[^\s"']+\.mp4[^\s"']*)/);
          if (mp4Match) {
            return mp4Match[1];
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting direct URL:', error.message);
      return null;
    }
  }

  /**
   * Verify if a source is working
   * @param {string} url - URL to verify
   * @returns {Promise<boolean>} True if source is accessible
   */
  async verifySource(url) {
    try {
      const response = await axios.head(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Referer': 'https://playex.cc/'
        },
        timeout: 5000,
        maxRedirects: 5
      });

      return response.status >= 200 && response.status < 400;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new VideoScraper();
