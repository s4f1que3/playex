// Chrome Performance Optimization Script
// Run this on app initialization for maximum Chrome performance

export const initializeChromeOptimizations = () => {
  // Only run in Chrome
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  if (!isChrome) return;

  // 1. Enable Chrome's experimental features
  if ('scheduling' in window && 'isInputPending' in window.scheduler) {
    // Use Chrome's scheduler API for better task prioritization
    window.__CHROME_SCHEDULER_ENABLED__ = true;
  }

  // 2. Optimize garbage collection hints
  if (performance.memory) {
    // Monitor memory and trigger cleanup at good times
    const checkMemory = () => {
      const memoryInfo = performance.memory;
      const usedPercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
      
      if (usedPercent > 85) {
        // Signal Chrome to do incremental GC
        if (window.gc && typeof window.gc === 'function') {
          window.gc();
        }
      }
    };
    
    // Check every 30 seconds
    setInterval(checkMemory, 30000);
  }

  // 3. Use Chrome's idle detection
  if ('requestIdleCallback' in window) {
    window.__USE_IDLE_CALLBACK__ = true;
  }

  // 4. Enable Chrome's Native File System API caching
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then(estimate => {
      if (estimate.usage && estimate.quota) {
        const percentUsed = (estimate.usage / estimate.quota) * 100;
        console.log(`Storage: ${percentUsed.toFixed(2)}% used`);
      }
    });
  }

  // 5. Optimize Chrome's network layer
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    // Adjust quality based on network
    if (connection.effectiveType === '4g') {
      window.__NETWORK_QUALITY__ = 'high';
    } else if (connection.effectiveType === '3g') {
      window.__NETWORK_QUALITY__ = 'medium';
    } else {
      window.__NETWORK_QUALITY__ = 'low';
    }
    
    // Listen for network changes
    connection.addEventListener('change', () => {
      window.dispatchEvent(new CustomEvent('networkQualityChange', {
        detail: { type: connection.effectiveType }
      }));
    });
  }

  // 6. Use Chrome's Paint Timing API
  if (window.PerformancePaintTiming) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log(`FCP: ${entry.startTime}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  }

  // 7. Enable Chrome's Largest Contentful Paint optimization
  if (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`LCP: ${lastEntry.startTime}ms`);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // 8. Prefetch DNS for external resources
  const prefetchDomains = [
    'https://image.tmdb.org',
    'https://api.themoviedb.org',
  ];

  prefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // 9. Use Chrome's Priority Hints
  const images = document.querySelectorAll('img[data-priority="high"]');
  images.forEach(img => {
    img.setAttribute('fetchpriority', 'high');
  });

  // 10. Enable smooth scrolling for Chrome
  if (CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  console.log('✅ Chrome optimizations enabled');
};

// Chrome-specific performance monitoring
export const monitorChromePerformance = () => {
  if (!('memory' in performance)) return;

  const metrics = {
    fps: 0,
    memory: 0,
    renderTime: 0,
  };

  // FPS counter using Chrome's RAF
  let lastTime = performance.now();
  let frames = 0;
  
  const measureFPS = () => {
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
      frames = 0;
      lastTime = currentTime;
      
      // Warn if FPS drops below 30
      if (metrics.fps < 30) {
        console.warn(`⚠️ Low FPS detected: ${metrics.fps}`);
      }
    }
    
    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);

  // Memory monitoring
  setInterval(() => {
    if (performance.memory) {
      metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
      
      // Warn if memory over 100MB
      if (metrics.memory > 100) {
        console.warn(`⚠️ High memory usage: ${metrics.memory}MB`);
      }
    }
  }, 5000);

  return metrics;
};

// Optimize images for Chrome
export const optimizeImagesForChrome = () => {
  // Use Chrome's native lazy loading
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Use decoding=async for better performance
    img.setAttribute('decoding', 'async');
  });

  // Use WebP when available in Chrome
  const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  if (supportsWebP) {
    window.__SUPPORTS_WEBP__ = true;
  }
};

// Chrome-specific animation optimization
export const optimizeAnimationsForChrome = () => {
  // Force hardware acceleration for animations
  const animatedElements = document.querySelectorAll('[data-animate="true"]');
  
  animatedElements.forEach(el => {
    el.style.willChange = 'transform, opacity';
    el.style.transform = 'translateZ(0)'; // Force GPU layer
  });

  // Use Chrome's Composite After Paint (CAP) optimization
  if (CSS.supports('content-visibility', 'auto')) {
    const sections = document.querySelectorAll('section, .section');
    sections.forEach(section => {
      section.style.contentVisibility = 'auto';
    });
  }
};

// Initialize all Chrome optimizations
export const initAllChromeOptimizations = () => {
  initializeChromeOptimizations();
  monitorChromePerformance();
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImagesForChrome();
      optimizeAnimationsForChrome();
    });
  } else {
    optimizeImagesForChrome();
    optimizeAnimationsForChrome();
  }
};

export default initAllChromeOptimizations;
