// Debounced Search Hook for Performance
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounceValue } from './usePerformance';

/**
 * Optimized search hook with debouncing and request cancellation
 * @param {Function} searchFn - Async function to perform search
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} - { query, setQuery, results, loading, error }
 */
export const useDebouncedSearch = (searchFn, delay = 300) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedQuery = useDebounceValue(query, delay);
  const abortControllerRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const data = await searchFn(searchQuery, abortControllerRef.current.signal);
      setResults(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Search failed');
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, [searchFn]);

  useEffect(() => {
    performSearch(debouncedQuery);

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, performSearch]);

  // Clear function
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clear,
  };
};

/**
 * Optimized infinite scroll hook
 * @param {Function} fetchFn - Function to fetch more data
 * @param {Object} options - { initialPage, hasMore }
 */
export const useInfiniteScroll = (fetchFn, options = {}) => {
  const { initialPage = 1, threshold = 0.8 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const { data, hasMore: moreAvailable } = await fetchFn(page);
      setItems(prev => [...prev, ...data]);
      setHasMore(moreAvailable);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, loading, hasMore]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: threshold,
    };

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    }, options);

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, threshold]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setItems([]);
    setHasMore(true);
  }, [initialPage]);

  return {
    items,
    loading,
    hasMore,
    loadMoreRef,
    reset,
  };
};

/**
 * Throttled scroll handler for performance
 * @param {Function} callback - Function to call on scroll
 * @param {number} delay - Throttle delay in milliseconds
 */
export const useThrottledScroll = (callback, delay = 100) => {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef(null);

  const throttledCallback = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback();
      lastRun.current = now;
    } else {
      // Schedule for next available slot
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback();
        lastRun.current = Date.now();
      }, delay - timeSinceLastRun);
    }
  }, [callback, delay]);

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledCallback);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [throttledCallback]);
};

export default useDebouncedSearch;
