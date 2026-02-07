# Performance Optimization Quick Reference

## 🚀 Quick Wins (Immediate Impact)

### 1. Enable All Optimizations
```bash
# Build with optimizations
npm run build

# The build automatically includes:
# ✓ Minification
# ✓ Tree shaking
# ✓ Code splitting
# ✓ Dead code elimination
```

### 2. Check Bundle Size
```bash
# Install analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build

# Opens bundle-report.html showing what's in your bundle
```

### 3. Lighthouse Audit
```bash
# Run Lighthouse in Chrome DevTools
# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 90
```

## 📦 Package.json Optimizations

### Add to scripts:
```json
{
  "scripts": {
    "build": "cross-env GENERATE_SOURCEMAP=false CI=false react-scripts build",
    "build:analyze": "cross-env ANALYZE=true npm run build",
    "build:profile": "react-scripts --profile build"
  }
}
```

### Optional: Reduce dependencies
```bash
# Check for duplicate packages
npm dedupe

# Find unused dependencies
npx depcheck

# Update to latest versions
npm update
```

## 🎨 CSS Optimization

### PurgeCSS (for Tailwind)
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  // This removes unused CSS classes
}
```

## 🖼️ Image Optimization Tips

### 1. Use Modern Formats
- **WebP**: 25-35% smaller than JPEG
- **AVIF**: Even smaller but limited support
- Fallback to JPEG/PNG for older browsers

### 2. Proper Sizing
```javascript
// Use responsive sizes attribute
<OptimizedImage
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
/>

// This tells browser to download appropriate size
```

### 3. TMDB Image Sizes
```javascript
// Use appropriate TMDB image sizes
const sizes = {
  poster: 'w342',    // Default: 342px wide
  backdrop: 'w780',  // Default: 780px wide
  profile: 'w185',   // Actor photos: 185px wide
};

// For high-DPI screens, use w500 or w780
```

## 🔄 API Optimization

### 1. Current Cache Strategy
- **TTL**: 1 hour (adjustable in api.js)
- **Deduplication**: 500ms window
- **Storage**: In-memory Map

### 2. Consider IndexedDB for Large Data
```javascript
// For large datasets, use IndexedDB instead of localStorage
import { useIndexedDB } from './hooks/useIndexedDB';

const { get, set } = useIndexedDB('media-cache');
```

### 3. Request Batching
```javascript
// Batch multiple requests
const results = await Promise.all([
  tmdbApi.getMovies(page1),
  tmdbApi.getMovies(page2),
  tmdbApi.getMovies(page3),
]);
```

## ⚡ Runtime Performance

### 1. Enable Concurrent Features (React 18)
```javascript
// index.js - Already using createRoot
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. Use Web Workers for Heavy Computations
```javascript
// For filtering, sorting large arrays
const worker = new Worker('/filterWorker.js');
worker.postMessage({ items, filter });
worker.onmessage = (e) => setFilteredItems(e.data);
```

### 3. Optimize Animations
```javascript
// Use transform and opacity (GPU-accelerated)
// ✓ Good
transform: 'translateX(100px)'
opacity: 0.5

// ✗ Bad (triggers layout)
left: '100px'
visibility: 'hidden'
```

## 🗂️ Code Splitting Best Practices

### 1. Route-based splitting (Already implemented)
```javascript
const HomePage = lazy(() => import('./pages/HomePage'));
const MoviesPage = lazy(() => import('./pages/MoviesPage'));
```

### 2. Component-based splitting
```javascript
// For large components not immediately visible
const HeavyChart = lazy(() => import('./components/HeavyChart'));

<Suspense fallback={<Loader />}>
  {showChart && <HeavyChart />}
</Suspense>
```

### 3. Library splitting
```javascript
// Import only what you need
import { motion } from 'framer-motion';  // ✓ Good
import everything from 'library';        // ✗ Bad
```

## 📊 Monitoring in Production

### 1. Web Vitals
```javascript
// reportWebVitals.js - sends to analytics
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  // Send to your analytics service
  console.log({ name, value, id });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2. Error Tracking
```javascript
// Use Error Boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

## 🎯 Performance Checklist

### Before Deployment
- [ ] Run `npm run build` and check bundle size
- [ ] Test on slow 3G network (DevTools)
- [ ] Check Lighthouse scores
- [ ] Verify images lazy load properly
- [ ] Test with React DevTools Profiler
- [ ] Check for memory leaks (Chrome Task Manager)
- [ ] Verify no console errors in production
- [ ] Test on low-end devices

### After Deployment
- [ ] Monitor Core Web Vitals
- [ ] Check real user metrics (RUM)
- [ ] Monitor error rates
- [ ] Track load times
- [ ] Watch memory usage trends

## 🛠️ Tools

### Development
- **React DevTools Profiler**: Identify slow components
- **Chrome Performance Tab**: Record and analyze
- **Lighthouse**: Audit and recommendations
- **Network Tab**: Check waterfall, cache hits

### Build Analysis
- **webpack-bundle-analyzer**: Visualize bundle
- **source-map-explorer**: Analyze code in chunks
- **bundlephobia.com**: Check package sizes before installing

### Monitoring
- **web-vitals**: Core metrics
- **PerformanceObserver**: Browser performance API
- **Custom hooks**: usePerformanceMonitoring

## 🎁 Bonus Optimizations

### 1. Preconnect to External Domains
```html
<!-- public/index.html -->
<link rel="preconnect" href="https://image.tmdb.org">
<link rel="dns-prefetch" href="https://api.themoviedb.org">
```

### 2. Service Worker Caching Strategy
```javascript
// Stale-while-revalidate for images
// Network-first for API calls
// Cache-first for static assets
```

### 3. Resource Hints
```html
<!-- Preload critical resources -->
<link rel="preload" as="font" href="/fonts/main.woff2" crossorigin>
<link rel="preload" as="image" href="/logo.webp">
```

## 📈 Expected Results

After implementing all optimizations:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

**Last Updated**: Performance optimizations completed
**Version**: 2.0 (Ultra-Fast Edition)
