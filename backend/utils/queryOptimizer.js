// Query optimization utilities and best practices
// backend/utils/queryOptimizer.js

/**
 * Build optimized database queries with query builder pattern
 */
class QueryBuilder {
  constructor() {
    this.query = '';
    this.values = [];
    this.joins = [];
    this.conditions = [];
    this.orderBy = [];
    this.limit = null;
    this.offset = null;
  }

  select(columns = ['*']) {
    this.query = `SELECT ${Array.isArray(columns) ? columns.join(', ') : columns}`;
    return this;
  }

  from(table) {
    this.query += ` FROM ${table}`;
    return this;
  }

  join(table, condition, type = 'INNER') {
    this.joins.push(`${type} JOIN ${table} ON ${condition}`);
    return this;
  }

  leftJoin(table, condition) {
    return this.join(table, condition, 'LEFT');
  }

  rightJoin(table, condition) {
    return this.join(table, condition, 'RIGHT');
  }

  where(condition, values = []) {
    this.conditions.push(condition);
    this.values.push(...(Array.isArray(values) ? values : [values]));
    return this;
  }

  andWhere(condition, values = []) {
    return this.where(condition, values);
  }

  orWhere(condition, values = []) {
    this.conditions[this.conditions.length - 1] = 
      `(${this.conditions[this.conditions.length - 1]}) OR (${condition})`;
    this.values.push(...(Array.isArray(values) ? values : [values]));
    return this;
  }

  orderBy(column, direction = 'ASC') {
    this.orderBy.push(`${column} ${direction}`);
    return this;
  }

  groupBy(columns) {
    this.query += ` GROUP BY ${Array.isArray(columns) ? columns.join(', ') : columns}`;
    return this;
  }

  limit(count) {
    this.limit = count;
    return this;
  }

  offset(count) {
    this.offset = count;
    return this;
  }

  paginate(page, pageSize) {
    this.limit = pageSize;
    this.offset = (page - 1) * pageSize;
    return this;
  }

  build() {
    let query = this.query;

    // Add joins
    if (this.joins.length > 0) {
      query += ' ' + this.joins.join(' ');
    }

    // Add conditions
    if (this.conditions.length > 0) {
      query += ` WHERE ${this.conditions.join(' AND ')}`;
    }

    // Add order by
    if (this.orderBy.length > 0) {
      query += ` ORDER BY ${this.orderBy.join(', ')}`;
    }

    // Add limit and offset
    if (this.limit !== null) {
      query += ` LIMIT ${this.limit}`;
      if (this.offset !== null) {
        query += ` OFFSET ${this.offset}`;
      }
    }

    return {
      query,
      values: this.values
    };
  }

  toString() {
    const { query, values } = this.build();
    // Simple parameter replacement for logging (not safe for production queries)
    let logQuery = query;
    values.forEach((val) => {
      logQuery = logQuery.replace('?', typeof val === 'string' ? `'${val}'` : val);
    });
    return logQuery;
  }
}

/**
 * Cache query results with TTL
 */
class QueryCache {
  constructor(ttl = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  generateKey(...args) {
    return args.join(':');
  }
}

/**
 * Batch queries for better performance
 */
const batchQueries = async (queries, db, batchSize = 10) => {
  const results = [];

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((query) => db.query(query.sql, query.values))
    );
    results.push(...batchResults);
  }

  return results;
};

/**
 * Optimize pagination with seek method instead of offset
 */
const seekPagination = (column = 'id', pageSize = 20, lastId = null) => {
  const query = new QueryBuilder();

  if (lastId !== null) {
    query.where(`${column} > ?`, lastId);
  }

  query.orderBy(column, 'ASC').limit(pageSize);

  return query.build();
};

/**
 * Index recommendations based on query patterns
 */
const indexRecommendations = {
  recommendations: [
    'CREATE INDEX idx_user_id ON media(user_id)',
    'CREATE INDEX idx_media_type ON media(media_type)',
    'CREATE INDEX idx_created_at ON media(created_at)',
    'CREATE INDEX idx_user_media ON media(user_id, media_type)',
    'CREATE INDEX idx_search ON media(title) USING FULLTEXT',
    'CREATE INDEX idx_rating ON media(rating) DESC',
    'CREATE INDEX idx_release_date ON media(release_date) DESC'
  ],

  apply: async (db) => {
    try {
      for (const indexSql of this.recommendations) {
        await db.query(indexSql).catch((err) => {
          // Index might already exist
          if (!err.message.includes('Duplicate key')) {
            console.warn(`Index creation failed: ${err.message}`);
          }
        });
      }
      console.log('Indexes applied successfully');
    } catch (error) {
      console.error('Error applying indexes:', error);
    }
  }
};

/**
 * Query execution with monitoring
 */
const executeMonitoredQuery = async (db, sql, values, options = {}) => {
  const startTime = performance.now();
  const { timeout = 30000, cache = null } = options;

  try {
    // Check cache first
    if (cache) {
      const cacheKey = cache.generateKey(sql, JSON.stringify(values));
      const cachedResult = cache.get(cacheKey);

      if (cachedResult) {
        return {
          result: cachedResult,
          cached: true,
          duration: 0
        };
      }
    }

    // Execute query with timeout
    const queryPromise = db.query(sql, values);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), timeout)
    );

    const result = await Promise.race([queryPromise, timeoutPromise]);

    const duration = performance.now() - startTime;

    // Cache successful result
    if (cache) {
      const cacheKey = cache.generateKey(sql, JSON.stringify(values));
      cache.set(cacheKey, result);
    }

    return {
      result,
      cached: false,
      duration: duration.toFixed(2)
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    throw {
      error: error.message,
      duration: duration.toFixed(2),
      sql,
      values
    };
  }
};

module.exports = {
  QueryBuilder,
  QueryCache,
  batchQueries,
  seekPagination,
  indexRecommendations,
  executeMonitoredQuery
};
