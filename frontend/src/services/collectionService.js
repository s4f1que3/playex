import { openDB } from 'idb';
import { tmdbApi } from '../utils/api';

const CACHE_KEY = 'collections_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class CollectionService {
  constructor() {
    this.dbPromise = openDB('playex-collections', 1, {
      upgrade(db) {
        db.createObjectStore('collections');
      }
    });
    this.memoryCache = new Map();
  }

  async fetchCollectionChunk(queries) {
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

  async getAllCollections(categoryKeywords) {
    try {
      // Check memory cache first
      if (this.memoryCache.has(CACHE_KEY)) {
        return this.memoryCache.get(CACHE_KEY);
      }

      // Then check IndexedDB cache
      const db = await this.dbPromise;
      const cache = await db.get('collections', CACHE_KEY);
      
      if (cache && cache.timestamp > Date.now() - CACHE_DURATION) {
        this.memoryCache.set(CACHE_KEY, cache.data);
        return cache.data;
      }

      // If no cache or expired, fetch fresh data
      const queries = Object.entries(categoryKeywords).flatMap(([category, keywords]) =>
        keywords.map(query => ({ category, query }))
      );

      const chunkSize = 5;
      let allResults = [];
      let processedIds = new Set();

      // Process in chunks
      for (let i = 0; i < queries.length; i += chunkSize) {
        const chunk = queries.slice(i, i + chunkSize);
        const responses = await this.fetchCollectionChunk(chunk);

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

        // Small delay between chunks to prevent rate limiting
        if (i + chunkSize < queries.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Cache the results
      const cacheData = {
        timestamp: Date.now(),
        data: allResults
      };

      await db.put('collections', cacheData, CACHE_KEY);
      this.memoryCache.set(CACHE_KEY, allResults);

      return allResults;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  async getCollectionsByCategory(category, keywords) {
    try {
      const collections = await this.getAllCollections();
      
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
        
        // Debug logging
        console.debug('Filtering collection:', {
          title: collection.title,
          category,
          keywords,
          searchText,
          genres: collection.genres,
          collectionKeywords: collection.keywords
        });
        
        return keywords.some(keyword => {
          const processedKeyword = keyword.toLowerCase().trim();
          // Check for exact matches first
          if (collection.genres?.some(g => g.name?.toLowerCase() === processedKeyword)) {
            return true;
          }
          if (collection.keywords?.some(k => k.name?.toLowerCase() === processedKeyword)) {
            return true;
          }
          // Then check for included terms
          return searchText.includes(processedKeyword);
        });
      });
    } catch (error) {
      console.error(`Error fetching collections for category ${category}:`, error);
      return [];
    }
  }

  clearCache() {
    this.memoryCache.delete(CACHE_KEY);
    return this.dbPromise.then(db => db.delete('collections', CACHE_KEY));
  }
}

export const collectionService = new CollectionService();