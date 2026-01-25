# Playex Development Optimization Checklist

## Before Committing Code

### Performance
- [ ] No new console.log statements in production code
- [ ] All async operations properly handled with error catching
- [ ] No unnecessary re-renders (use React.memo if component receives props)
- [ ] useMemo used for expensive computations
- [ ] useCallback used for event handlers passed as props
- [ ] No inline object/array creation in render
- [ ] Image sizes optimized (use Next.js Image component)
- [ ] Large lists use virtualization or pagination
- [ ] API calls are debounced/throttled where appropriate

### Code Quality
- [ ] Code properly formatted (run prettier)
- [ ] No ESLint warnings
- [ ] Component props properly typed/validated
- [ ] Error boundaries implemented for error-prone sections
- [ ] No magic numbers (use constants)
- [ ] Comments added for complex logic
- [ ] Removed all debug code
- [ ] Dead code removed

### Testing
- [ ] Unit tests pass
- [ ] Component renders without errors
- [ ] No console errors in browser
- [ ] Performance audit score > 80 (Chrome DevTools)
- [ ] Tested in multiple browsers

### Accessibility
- [ ] All images have alt text
- [ ] Semantic HTML used
- [ ] Color contrast meets WCAG standards
- [ ] Keyboard navigation works
- [ ] ARIA labels where needed

---

## Frontend Development Guidelines

### Writing Performant Components

```javascript
// ❌ BAD: Creates new object every render
function MovieCard({ movie }) {
  const style = { padding: '10px', color: 'red' };
  return <div style={style}>{movie.title}</div>;
}

// ✅ GOOD: Style defined outside or memoized
const style = { padding: '10px', color: 'red' };

function MovieCard({ movie }) {
  return <div style={style}>{movie.title}</div>;
}
```

### Handling Props with Memoization

```javascript
// ❌ BAD: Will re-render even with same props
function MovieList({ movies, onSelect }) {
  return movies.map(m => <MovieCard key={m.id} movie={m} onSelect={onSelect} />);
}

// ✅ GOOD: Only re-renders when props change
const MovieCard = React.memo(({ movie, onSelect }) => {
  return <div onClick={() => onSelect(movie)}>{movie.title}</div>;
});

const MovieList = React.memo(({ movies, onSelect }) => {
  return movies.map(m => <MovieCard key={m.id} movie={m} onSelect={onSelect} />);
});
```

### API Call Best Practices

```javascript
// ❌ BAD: Fetches on every render
function MovieDetails({ movieId }) {
  const [movie, setMovie] = useState(null);
  
  const fetchMovie = async () => {
    const res = await api.get(`/movies/${movieId}`);
    setMovie(res.data);
  };
  
  fetchMovie(); // Called every render!
  
  return <div>{movie?.title}</div>;
}

// ✅ GOOD: Fetch once with proper caching
function MovieDetails({ movieId }) {
  const { data: movie } = useOptimizedData(
    `movie-${movieId}`,
    () => api.get(`/movies/${movieId}`),
    { staleTime: 5 * 60 * 1000 }
  );
  
  return <div>{movie?.title}</div>;
}
```

### Debouncing Search Input

```javascript
// ❌ BAD: Searches on every keystroke
function SearchMovies() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (query) {
      api.get(`/search?q=${query}`).then(res => setResults(res.data));
    }
  }, [query]); // Fires on every keystroke
  
  return (
    <>
      <input onChange={e => setQuery(e.target.value)} />
      <Results results={results} />
    </>
  );
}

// ✅ GOOD: Debounced search
function SearchMovies() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounceValue(query, 300);
  const { data: results } = useOptimizedData(
    `search-${debouncedQuery}`,
    () => api.get(`/search?q=${debouncedQuery}`),
    { enabled: debouncedQuery.length > 0 }
  );
  
  return (
    <>
      <input onChange={e => setQuery(e.target.value)} />
      <Results results={results} />
    </>
  );
}
```

### Lazy Loading Components

```javascript
// ✅ GOOD: Lazy load components not immediately visible
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

---

## Backend Development Guidelines

### Database Query Best Practices

```javascript
// ❌ BAD: N+1 query problem
const users = await query('SELECT * FROM users');
for (const user of users) {
  const movies = await query('SELECT * FROM movies WHERE user_id = ?', [user.id]);
  user.movies = movies;
}

// ✅ GOOD: Single query with join
const users = await query(`
  SELECT u.*, m.* FROM users u
  LEFT JOIN movies m ON u.id = m.user_id
  WHERE u.id IN (?)
`, [userIds]);
```

### Using Query Builder

```javascript
const { QueryBuilder } = require('./utils/queryOptimizer');

// ✅ GOOD: Type-safe, readable queries
const query = new QueryBuilder()
  .select(['id', 'title', 'rating'])
  .from('movies')
  .leftJoin('users', 'users.id = movies.user_id')
  .where('release_year > ?', 2020)
  .andWhere('rating > ?', 7.0)
  .orderBy('rating', 'DESC')
  .paginate(1, 20)
  .build();

const { result } = await executeMonitoredQuery(db, query.query, query.values);
```

### Error Handling

```javascript
// ❌ BAD: Silent failures
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    res.json(movie);
  } catch (error) {
    // No error handling!
  }
});

// ✅ GOOD: Proper error handling
app.get('/api/movies/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'ID required' });
    }
    
    const movie = await query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    console.error(`[${req.id}] Error fetching movie:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Rate Limiting

```javascript
// ✅ GOOD: Apply rate limiting to sensitive endpoints
const { authLimiter } = require('./middleware/rateLimiter');

app.post('/api/auth/login', authLimiter, async (req, res) => {
  // Handle login
});
```

---

## Performance Monitoring Checklist

### Daily Checks
- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Review cache hit rates
- [ ] Monitor database connection pool
- [ ] Check server CPU/memory usage

### Weekly Reviews
- [ ] Analyze user experience metrics
- [ ] Review slow queries
- [ ] Check for unused dependencies
- [ ] Update performance baseline

### Monthly Optimizations
- [ ] Analyze user behavior
- [ ] Profile critical paths
- [ ] Optimize slow queries
- [ ] Review and update caches
- [ ] Update dependencies

---

## Common Performance Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Slow initial load | Missing code splitting | Use React.lazy() and route-based splitting |
| High memory usage | Unbounded cache | Implement size limits with pruning |
| Slow API responses | N+1 queries | Use JOINs instead of multiple queries |
| Excessive re-renders | Missing memoization | Add React.memo and useMemo |
| Large bundle | Unused libraries | Tree-shake and remove unused code |
| Laggy interactions | Blocking main thread | Use Web Workers or async operations |
| Poor caching | Wrong cache headers | Set proper Cache-Control headers |
| DDoS vulnerability | No rate limiting | Implement request rate limits |

---

## Tools & Commands

### Performance Analysis
```bash
# Frontend bundle analysis
npm run build:analyze

# Chrome DevTools
F12 > Performance > Record > [interact] > Stop

# Lighthouse audit
Chrome > Ctrl+Shift+I > Lighthouse > Generate report
```

### Monitoring
```bash
# Check cache statistics
console.log(performanceMonitor.getMetrics());

# Check database pool stats
app.get('/api/debug/pool-stats', async (req, res) => {
  res.json(await getPoolStats());
});

# Monitor cache hit rate
console.log(`Cache hit rate: ${performanceMonitor.getCacheHitRate()}%`);
```

### Testing
```bash
# Unit tests
npm test

# Load testing
ab -n 10000 -c 100 http://localhost:5000/

# Memory profiling
node --inspect server.js
```

---

## Resources for Developers

- [React Performance Best Practices](https://react.dev/reference/react)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Node.js Performance](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Database Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

---

## Questions?

Refer to:
1. `PERFORMANCE_OPTIMIZATION.md` - Detailed optimization guide
2. `REFACTORING_SUMMARY.md` - Overview of all changes
3. Code comments in optimized files
4. Team documentation

**Last Updated**: January 24, 2026
