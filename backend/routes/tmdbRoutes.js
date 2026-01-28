const express = require('express');
const router = express.Router();
const tmdbClient = require('../config/tmdb');

// Error handler helper
const handleTmdbError = (error, res, context = '') => {
  console.error(`TMDB API Error (${context}):`, {
    status: error.response?.status,
    message: error.message,
    context
  });

  if (error.response?.status === 401) {
    return res.status(401).json({ error: 'Invalid TMDB API key' });
  }
  if (error.response?.status === 404) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  if (error.response?.status === 429) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  res.status(error.response?.status || 500).json({ 
    error: `Failed to fetch from TMDB: ${context}` 
  });
};

// Trending endpoints
router.get('/trending/:mediaType/:timeWindow', async (req, res) => {
  try {
    const { mediaType, timeWindow } = req.params;
    const { page = 1, language = 'en-US' } = req.query;

    if (!['movie', 'tv', 'person', 'all'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    if (!['day', 'week'].includes(timeWindow)) {
      return res.status(400).json({ error: 'Invalid time window' });
    }

    const response = await tmdbClient.get(`/trending/${mediaType}/${timeWindow}`, {
      params: { page, language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Trending');
  }
});

// Popular endpoints
router.get('/popular/:mediaType', async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { page = 1, language = 'en-US' } = req.query;

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/${mediaType}/popular`, {
      params: { page, language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Popular');
  }
});

// Top Rated endpoints
router.get('/top-rated/:mediaType', async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { page = 1, language = 'en-US' } = req.query;

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/${mediaType}/top_rated`, {
      params: { page, language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Top Rated');
  }
});

// Genres endpoint
router.get('/genres/:mediaType', async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { language = 'en-US' } = req.query;

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/genre/${mediaType}/list`, {
      params: { language }
    });

    res.set('Cache-Control', 'public, max-age=86400');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Genres');
  }
});

// Search endpoints
router.get('/search/:mediaType', async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page = 1, language = 'en-US', include_adult = false } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    if (!['movie', 'tv', 'person', 'collection', 'multi'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/search/${mediaType}`, {
      params: { query, page, language, include_adult }
    });

    res.set('Cache-Control', 'public, max-age=1800');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Search');
  }
});

// Movie/TV details endpoint
router.get('/:mediaType/:id', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const { append_to_response = '', language = 'en-US' } = req.query;

    if (!['movie', 'tv', 'person'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const params = { language };
    if (append_to_response) {
      params.append_to_response = append_to_response;
    }

    const response = await tmdbClient.get(`/${mediaType}/${id}`, { params });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Details');
  }
});

// Credits endpoint
router.get('/:mediaType/:id/credits', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const { language = 'en-US' } = req.query;

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/${mediaType}/${id}/credits`, {
      params: { language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Credits');
  }
});

// Similar endpoint
router.get('/:mediaType/:id/similar', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const { page = 1, language = 'en-US' } = req.query;

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/${mediaType}/${id}/similar`, {
      params: { page, language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Similar');
  }
});

// Recommendations endpoint
router.get('/:mediaType/:id/recommendations', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const { page = 1, language = 'en-US' } = req.query;

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/${mediaType}/${id}/recommendations`, {
      params: { page, language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Recommendations');
  }
});

// Videos endpoint
router.get('/:mediaType/:id/videos', async (req, res) => {
  try {
    const { mediaType, id } = req.params;
    const { language = 'en-US' } = req.query;

    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    const response = await tmdbClient.get(`/${mediaType}/${id}/videos`, {
      params: { language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Videos');
  }
});

// TV Seasons endpoint
router.get('/tv/:id/season/:seasonNumber', async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const { language = 'en-US' } = req.query;

    const response = await tmdbClient.get(`/tv/${id}/season/${seasonNumber}`, {
      params: { language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'TV Season');
  }
});

// Collections endpoint
router.get('/collection/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en-US' } = req.query;

    const response = await tmdbClient.get(`/collection/${id}`, {
      params: { language }
    });

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Collection');
  }
});

// Discover endpoint
router.get('/discover/:mediaType', async (req, res) => {
  try {
    const { mediaType } = req.params;
    
    if (!['movie', 'tv'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type' });
    }

    // Pass all query parameters to TMDB
    const response = await tmdbClient.get(`/discover/${mediaType}`, {
      params: req.query
    });

    res.set('Cache-Control', 'public, max-age=1800');
    res.json(response.data);
  } catch (error) {
    handleTmdbError(error, res, 'Discover');
  }
});

module.exports = router;
