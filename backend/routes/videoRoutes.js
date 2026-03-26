const express = require('express');
const router = express.Router();
const videoScraper = require('../services/videoScraper');

/**
 * Get video sources for a movie
 * GET /api/video/movie/:tmdbId
 */
router.get('/movie/:tmdbId', async (req, res) => {
  try {
    const { tmdbId } = req.params;
    
    if (!tmdbId) {
      return res.status(400).json({
        success: false,
        error: 'TMDB ID is required'
      });
    }

    const sources = await videoScraper.getMovieSources(tmdbId);
    
    res.json({
      success: true,
      tmdbId,
      mediaType: 'movie',
      sources,
      totalSources: sources.length
    });

  } catch (error) {
    console.error('Error fetching movie sources:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch video sources'
    });
  }
});

/**
 * Get video sources for a TV show episode
 * GET /api/video/tv/:tmdbId/:season/:episode
 */
router.get('/tv/:tmdbId/:season/:episode', async (req, res) => {
  try {
    const { tmdbId, season, episode } = req.params;
    
    if (!tmdbId || !season || !episode) {
      return res.status(400).json({
        success: false,
        error: 'TMDB ID, season, and episode are required'
      });
    }

    const sources = await videoScraper.getTvSources(
      tmdbId,
      parseInt(season),
      parseInt(episode)
    );
    
    res.json({
      success: true,
      tmdbId,
      mediaType: 'tv',
      season: parseInt(season),
      episode: parseInt(episode),
      sources,
      totalSources: sources.length
    });

  } catch (error) {
    console.error('Error fetching TV sources:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch video sources'
    });
  }
});

/**
 * Extract direct video URL from embed
 * POST /api/video/extract
 * Body: { url: string }
 */
router.post('/extract', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    const directUrl = await videoScraper.extractDirectUrl(url);
    
    if (directUrl) {
      res.json({
        success: true,
        directUrl
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Could not extract direct video URL'
      });
    }

  } catch (error) {
    console.error('Error extracting direct URL:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to extract video URL'
    });
  }
});

/**
 * Verify if a source is working
 * POST /api/video/verify
 * Body: { url: string }
 */
router.post('/verify', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    const isWorking = await videoScraper.verifySource(url);
    
    res.json({
      success: true,
      url,
      isWorking
    });

  } catch (error) {
    console.error('Error verifying source:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify source'
    });
  }
});

module.exports = router;
