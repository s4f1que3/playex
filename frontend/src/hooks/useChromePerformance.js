// Chrome-specific performance hook
import { useEffect, useState } from 'react';

/**
 * Hook to monitor and optimize Chrome performance
 */
export const useChromePerformance = () => {
  const [isChrome, setIsChrome] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memory: 0,
    networkQuality: 'unknown',
  });

  useEffect(() => {
    // Detect Chrome
    const chrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    setIsChrome(chrome);

    if (!chrome) return;

    // Monitor network quality
    if ('connection' in navigator) {
      const updateNetworkQuality = () => {
        setPerformanceMetrics(prev => ({
          ...prev,
          networkQuality: navigator.connection.effectiveType || 'unknown',
        }));
      };

      navigator.connection.addEventListener('change', updateNetworkQuality);
      updateNetworkQuality();

      return () => {
        navigator.connection.removeEventListener('change', updateNetworkQuality);
      };
    }
  }, []);

  // Use requestIdleCallback for non-critical updates
  const scheduleIdleTask = (callback) => {
    if (window.requestIdleCallback) {
      return window.requestIdleCallback(callback, { timeout: 2000 });
    }
    return setTimeout(callback, 1);
  };

  // Cancel idle tasks
  const cancelIdleTask = (id) => {
    if (window.cancelIdleCallback) {
      window.cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
  };

  return {
    isChrome,
    performanceMetrics,
    scheduleIdleTask,
    cancelIdleTask,
  };
};

/**
 * Hook to enable Chrome's content-visibility optimization
 */
export const useContentVisibility = (ref) => {
  useEffect(() => {
    if (!ref.current) return;
    
    // Disable on mobile to prevent content disappearing
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;
    
    // Check if content-visibility is supported
    if (CSS.supports('content-visibility', 'auto')) {
      ref.current.style.contentVisibility = 'auto';
      ref.current.style.containIntrinsicSize = '0 500px';
    }
    
    return () => {
      if (ref.current) {
        ref.current.style.contentVisibility = '';
        ref.current.style.containIntrinsicSize = '';
      }
    };
  }, [ref]);
};

/**
 * Hook to optimize animations for Chrome
 */
export const useChromeAnimation = (ref, shouldAnimate = true) => {
  useEffect(() => {
    if (!ref.current || !shouldAnimate) return;

    const element = ref.current;
    
    // Force GPU acceleration
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
    element.style.backfaceVisibility = 'hidden';

    // Cleanup
    return () => {
      element.style.transform = '';
      element.style.willChange = 'auto';
      element.style.backfaceVisibility = '';
    };
  }, [ref, shouldAnimate]);
};

/**
 * Hook to prefetch resources in Chrome
 */
export const useChromePrefetch = (urls = []) => {
  useEffect(() => {
    if (!urls.length) return;

    const links = [];

    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      links.push(link);
    });

    // Cleanup
    return () => {
      links.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [urls]);
};

/**
 * Hook to use Chrome's native lazy loading
 */
export const useChromeLazyLoad = (ref) => {
  useEffect(() => {
    if (!ref.current) return;

    const images = ref.current.querySelectorAll('img');
    
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      img.setAttribute('decoding', 'async');
    });
  }, [ref]);
};

/**
 * Hook to monitor Chrome memory usage
 */
export const useChromeMemory = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    if (!performance.memory) return;

    const updateMemory = () => {
      const info = {
        usedMB: Math.round(performance.memory.usedJSHeapSize / 1048576),
        totalMB: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
        percentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100),
      };
      setMemoryInfo(info);
    };

    // Update every 10 seconds
    const interval = setInterval(updateMemory, 10000);
    updateMemory();

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

/**
 * Hook to optimize scrolling in Chrome
 */
export const useSmoothScroll = (ref) => {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    // Enable smooth scrolling
    element.style.scrollBehavior = 'smooth';
    element.style.WebkitOverflowScrolling = 'touch';
    element.style.overscrollBehavior = 'contain';

    return () => {
      element.style.scrollBehavior = '';
      element.style.WebkitOverflowScrolling = '';
      element.style.overscrollBehavior = '';
    };
  }, [ref]);
};

export default useChromePerformance;
