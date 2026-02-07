// Performance Monitoring and Reporting
import { useEffect, useRef, useCallback } from 'react';

// Web Vitals monitoring
export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return;
    }

    // Monitor Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }, []);
};

// Component performance monitoring
export const useComponentPerformance = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      const renderTime = Date.now() - startTime.current;
      if (renderTime > 16) { // Flag components that take >16ms (1 frame)
        console.warn(
          `⚠️ ${componentName} took ${renderTime}ms to render (render #${renderCount.current})`
        );
      }
    }
    
    startTime.current = Date.now();
  });

  return renderCount.current;
};

// Memory leak detection
export const useMemoryLeakDetection = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !performance.memory) {
      return;
    }

    const checkMemory = () => {
      const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const percentUsed = (usedJSHeapSize / jsHeapSizeLimit) * 100;

      if (percentUsed > 90) {
        console.warn(
          `⚠️ High memory usage: ${percentUsed.toFixed(1)}% (${(usedJSHeapSize / 1048576).toFixed(2)}MB / ${(jsHeapSizeLimit / 1048576).toFixed(2)}MB)`
        );
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
};

// FPS monitoring
export const useFPSMonitoring = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());
  const fps = useRef(60);

  const measure = useCallback(() => {
    frameCount.current++;
    const currentTime = Date.now();
    
    if (currentTime >= lastTime.current + 1000) {
      fps.current = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
      
      if (fps.current < 30 && process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Low FPS detected: ${fps.current}`);
      }
      
      frameCount.current = 0;
      lastTime.current = currentTime;
    }

    requestAnimationFrame(measure);
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [measure]);

  return fps.current;
};

// Long task detection
export const useLongTaskDetection = () => {
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(
              `⚠️ Long task detected: ${entry.duration.toFixed(2)}ms at ${entry.startTime.toFixed(2)}ms`
            );
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    } catch (e) {
      // PerformanceObserver not supported or longtask not available
    }
  }, []);
};

// Resource timing
export const useResourceTiming = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    const logSlowResources = () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(r => r.duration > 1000); // > 1 second

      if (slowResources.length > 0) {
        console.group('⚠️ Slow resources detected:');
        slowResources.forEach(r => {
          console.log(`${r.name}: ${r.duration.toFixed(2)}ms`);
        });
        console.groupEnd();
      }
    };

    // Check after page load
    if (document.readyState === 'complete') {
      setTimeout(logSlowResources, 2000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(logSlowResources, 2000);
      });
    }
  }, []);
};

// Combine all monitoring hooks
export const usePerformanceMonitoring = (componentName) => {
  useWebVitals();
  useMemoryLeakDetection();
  useLongTaskDetection();
  useResourceTiming();
  const renderCount = useComponentPerformance(componentName);
  const fps = useFPSMonitoring();

  return { renderCount, fps };
};
