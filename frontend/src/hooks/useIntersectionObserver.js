import { useEffect } from 'react';
import { getMobileRootMargin, getMobileThreshold } from '../utils/mobileOptimizations';

/**
 * useIntersectionObserver - Observes when an element enters/exits the viewport
 * @param {React.RefObject} ref - Reference to the element to observe
 * @param {Function} callback - Function to call when intersection changes
 * @param {Object} options - IntersectionObserver options (root, rootMargin, threshold)
 */
export const useIntersectionObserver = (ref, callback, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    // Merge mobile-optimized defaults with custom options
    const defaultOptions = {
      rootMargin: getMobileRootMargin(),
      threshold: getMobileThreshold(),
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry);
      });
    }, defaultOptions);

    const element = ref.current;
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [ref, callback, options]);
};

export default useIntersectionObserver;
