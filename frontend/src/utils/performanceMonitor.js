// Performance monitoring and analytics utility
// frontend/src/utils/performanceMonitor.js

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      timeToFirstContentfulPaint: 0,
      timeToInteractive: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      apiResponseTimes: [],
      componentRenderTimes: {},
      cacheHits: 0,
      cacheMisses: 0,
      totalRequests: 0
    };
    this.initializeMetrics();
  }

  initializeMetrics() {
    // Get page load time
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    }

    // Observe Web Vitals
    this.observeWebVitals();

    // Monitor API calls
    this.monitorAPIRequests();
  }

  observeWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              this.metrics.cumulativeLayoutShift += entry.value;
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('CLS observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            this.metrics.firstInputDelay = entry.processingDuration;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.log('FID observer not supported');
      }
    }

    // Paint timing
    if (window.performance && window.performance.getEntriesByType) {
      const paintEntries = window.performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.timeToFirstContentfulPaint = entry.startTime;
        }
      });
    }
  }

  monitorAPIRequests() {
    // Intercept fetch requests
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();

        const url = typeof args[0] === 'string' ? args[0] : args[0].url;

        // Track metrics
        this.metrics.apiResponseTimes.push({
          url,
          duration: endTime - startTime,
          status: response.status
        });
        this.metrics.totalRequests++;

        return response;
      } catch (error) {
        const endTime = performance.now();
        const url = typeof args[0] === 'string' ? args[0] : args[0].url;

        this.metrics.apiResponseTimes.push({
          url,
          duration: endTime - startTime,
          error: true
        });
        this.metrics.totalRequests++;

        throw error;
      }
    };
  }

  trackComponentRender(componentName, startTime, endTime) {
    const duration = endTime - startTime;

    if (!this.metrics.componentRenderTimes[componentName]) {
      this.metrics.componentRenderTimes[componentName] = {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        maxTime: 0,
        minTime: Infinity
      };
    }

    const stats = this.metrics.componentRenderTimes[componentName];
    stats.count++;
    stats.totalTime += duration;
    stats.avgTime = stats.totalTime / stats.count;
    stats.maxTime = Math.max(stats.maxTime, duration);
    stats.minTime = Math.min(stats.minTime, duration);
  }

  recordCacheHit() {
    this.metrics.cacheHits++;
  }

  recordCacheMiss() {
    this.metrics.cacheMisses++;
  }

  getCacheHitRate() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total === 0 ? 0 : ((this.metrics.cacheHits / total) * 100).toFixed(2);
  }

  getMetrics() {
    return {
      ...this.metrics,
      avgApiResponseTime: this.getAverageAPIResponseTime(),
      cacheHitRate: this.getCacheHitRate(),
      slowestAPIEndpoint: this.getSlowestAPIEndpoint()
    };
  }

  getAverageAPIResponseTime() {
    if (this.metrics.apiResponseTimes.length === 0) return 0;

    const total = this.metrics.apiResponseTimes.reduce(
      (sum, metric) => sum + metric.duration,
      0
    );

    return (total / this.metrics.apiResponseTimes.length).toFixed(2);
  }

  getSlowestAPIEndpoint() {
    if (this.metrics.apiResponseTimes.length === 0) return null;

    return this.metrics.apiResponseTimes.reduce((max, current) =>
      current.duration > max.duration ? current : max
    );
  }

  printMetrics() {
    const metrics = this.getMetrics();

    console.group('📊 Performance Metrics');
    console.log('Page Load Time:', `${metrics.pageLoadTime.toFixed(2)}ms`);
    console.log('First Contentful Paint:', `${metrics.timeToFirstContentfulPaint.toFixed(2)}ms`);
    console.log('Largest Contentful Paint:', `${metrics.largestContentfulPaint.toFixed(2)}ms`);
    console.log('Cumulative Layout Shift:', metrics.cumulativeLayoutShift.toFixed(4));
    console.log('First Input Delay:', `${metrics.firstInputDelay.toFixed(2)}ms`);
    console.log('Average API Response Time:', `${metrics.avgApiResponseTime}ms`);
    console.log('Total Requests:', metrics.totalRequests);
    console.log('Cache Hit Rate:', `${metrics.cacheHitRate}%`);
    console.log('Slowest Endpoint:', metrics.slowestAPIEndpoint);
    console.log('Component Render Times:', metrics.componentRenderTimes);
    console.groupEnd();
  }

  exportMetrics() {
    return JSON.stringify(this.getMetrics(), null, 2);
  }

  sendMetricsToServer(endpoint = '/api/metrics') {
    const metrics = this.getMetrics();

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metrics,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch((error) => {
      console.error('Error sending metrics to server:', error);
    });
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for React components
export const usePerformanceTracking = (componentName) => {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      performanceMonitor.trackComponentRender(componentName, startTime, endTime);
    };
  }, [componentName]);
};

export default performanceMonitor;
