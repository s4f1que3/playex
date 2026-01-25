// Custom hook to optimize component performance
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

/**
 * useOptimizedData - Fetches data with built-in caching, deduplication, and retry logic
 * @param {string} key - Query key for caching
 * @param {Function} fn - Async function to fetch data
 * @param {Object} options - Additional options
 */
export const useOptimizedData = (key, fn, options = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    staleTime = 3 * 60 * 1000, // 3 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    retries = 2,
    retryDelay = 1000,
    enabled = true
  } = options;

  return useQuery({
    queryKey: [key],
    queryFn: fn,
    staleTime,
    gcTime: cacheTime,
    retry: retries,
    retryDelay,
    enabled
  });
};

/**
 * useDebounceValue - Debounces a value to prevent excessive updates
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 */
export const useDebounceValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

/**
 * useIntersectionLazy - Lazy load content when it enters viewport
 * @param {React.RefObject} ref - Ref to the element
 * @param {Object} options - IntersectionObserver options
 */
export const useIntersectionLazy = (ref, options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggered.current) {
        setIsVisible(true);
        hasTriggered.current = true;
        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
};

/**
 * usePrefetch - Prefetch data before navigation
 * @param {string} key - Query key
 * @param {Function} fn - Async function to fetch
 */
export const usePrefetch = (key, fn) => {
  return useCallback(() => {
    useOptimizedData(key, fn, { enabled: false });
  }, [key, fn]);
};

/**
 * useThrottleCallback - Throttles a callback function
 * @param {Function} callback - Callback to throttle
 * @param {number} delay - Throttle delay
 * @param {Array} deps - Dependencies
 */
export const useThrottleCallback = (callback, delay, deps) => {
  const lastRunRef = useRef(Date.now());

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRunRef.current >= delay) {
      lastRunRef.current = now;
      callback(...args);
    }
  }, deps);
};

export default useOptimizedData;
