import { useEffect } from 'react';

/**
 * useIntersectionObserver - Observes when an element enters/exits the viewport
 * @param {React.RefObject} ref - Reference to the element to observe
 * @param {Function} callback - Function to call when intersection changes
 * @param {Object} options - IntersectionObserver options (root, rootMargin, threshold)
 */
export const useIntersectionObserver = (ref, callback, options = {}) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry);
      });
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      observer.disconnect();
    };
  }, [ref, callback, options]);
};

export default useIntersectionObserver;
