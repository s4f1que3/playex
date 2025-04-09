import { openDB } from 'idb';
import { tmdbApi } from '../utils/api';
import { categoryKeywords } from '../constants/categoryKeywords';

const CACHE_KEY = 'playex_collections_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

class CollectionService {
  constructor() {
    this.memoryCache = new Map();
    this.fetchPromise = null;
  }

  async getAllCollections() {
    // Return memory cache if available
    if (this.memoryCache.size > 0) {
      return {
        collections: Array.from(this.memoryCache.values()),
        isLoading: false,
      };
    }

    // Check localStorage cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        this.memoryCache = new Map(data.map(item => [item.id, item]));
        return {
          collections: data,
          isLoading: false,
        };
      }
    }

    // If already fetching, return the promise
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Start new fetch
    this.fetchPromise = (async () => {
      try {
        const collections = await this._fetchCollections(categoryKeywords);
        
        // Update caches
        this.memoryCache = new Map(collections.map(item => [item.id, item]));
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: collections,
          timestamp: Date.now()
        }));

        return {
          collections,
          isLoading: false,
        };
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  async _fetchCollections(keywords) {
    const queries = Object.entries(keywords).flatMap(([category, keywords]) =>
      keywords.map(query => ({ category, query }))
    );

    const chunkSize = 5;
    let allResults = [];
    let processedIds = new Set();

    for (let i = 0; i < queries.length; i += chunkSize) {
      const chunk = queries.slice(i, i + chunkSize);
      const responses = await this._fetchCollectionChunk(chunk);

      responses.forEach(response => {
        if (response.status === 'fulfilled') {
          const { category, results } = response.value;

          results.forEach(collection => {
            if (!processedIds.has(collection.id) && collection.poster_path) {
              processedIds.add(collection.id);
              allResults.push({
                ...collection,
                media_type: 'collection',
                title: collection.name,
                category,
                searchText: collection.name.toLowerCase(),
                vote_average: collection.vote_average || 0,
                popularity: collection.popularity || 0
              });
            }
          });
        }
      });

      if (i + chunkSize < queries.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return allResults;
  }

  async _fetchCollectionChunk(queries) {
    const chunkPromises = queries.map(({ category, query }) =>
      tmdbApi.get('/search/collection', {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1
        }
      }).then(response => ({
        category,
        results: response.data.results
      })).catch(() => ({ category, results: [] }))
    );

    return Promise.allSettled(chunkPromises);
  }

  async getCollectionsByCategory(category, keywords) {
    try {
      const { collections } = await this.getAllCollections();
      
      if (category === 'all' || !keywords || keywords.length === 0) {
        return collections;
      }
      
      return collections.filter(collection => {
        const searchText = [
          collection.title || '',
          collection.name || '',
          collection.overview || '',
          collection.searchText || '',
          ...(collection.genres || []).map(g => typeof g === 'object' ? (g.name || '') : g),
          ...(collection.keywords || []).map(k => typeof k === 'object' ? (k.name || '') : k)
        ].filter(Boolean).join(' ').toLowerCase();
        
        return keywords.some(keyword => {
          const processedKeyword = keyword.toLowerCase().trim();
          if (collection.genres?.some(g => g.name?.toLowerCase() === processedKeyword)) {
            return true;
          }
          if (collection.keywords?.some(k => k.name?.toLowerCase() === processedKeyword)) {
            return true;
          }
          return searchText.includes(processedKeyword);
        });
      });
    } catch (error) {
      console.error(`Error fetching collections for category ${category}:`, error);
      return [];
    }
  }

  clearCache() {
    this.memoryCache.clear();
    localStorage.removeItem(CACHE_KEY);
  }
}

export const collectionService = new CollectionService();