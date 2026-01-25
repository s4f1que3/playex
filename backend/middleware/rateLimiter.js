// Rate limiting middleware for API protection
// backend/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip health checks and status endpoints
  skip: (req) => req.path === '/health' || req.path === '/'
});

/**
 * Strict rate limiter for authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per 15 minutes
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true // Don't count successful requests
});

/**
 * Create a custom rate limiter for specific endpoints
 */
const createCustomLimiter = (windowMs = 60000, max = 30, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false
  });
};

/**
 * Rate limiter with exponential backoff
 */
const createBackoffLimiter = (maxAttempts = 5, baseDelay = 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!attempts.has(key)) {
      attempts.set(key, []);
    }

    const userAttempts = attempts.get(key).filter((timestamp) => now - timestamp < 24 * 60 * 60 * 1000);
    userAttempts.push(now);
    attempts.set(key, userAttempts);

    if (userAttempts.length > maxAttempts) {
      const backoffTime = baseDelay * Math.pow(2, userAttempts.length - maxAttempts);
      return res.status(429).json({
        message: 'Too many requests',
        retryAfter: Math.ceil(backoffTime / 1000),
        backoffSeconds: Math.ceil(backoffTime / 1000)
      });
    }

    next();
  };
};

/**
 * Memory-efficient limiter that cleans up old entries
 */
const createMemoryEfficientLimiter = (windowMs = 60000, max = 100) => {
  const requests = new Map();

  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter((t) => now - t < windowMs);
      if (validTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, validTimestamps);
      }
    }
  }, 5 * 60 * 1000);

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const timestamps = requests.get(key);
    timestamps.push(now);

    if (timestamps.length > max) {
      return res.status(429).json({
        message: 'Too many requests',
        retryAfter: Math.ceil((timestamps[0] + windowMs - now) / 1000)
      });
    }

    next();
  };
};

module.exports = {
  apiLimiter,
  authLimiter,
  createCustomLimiter,
  createBackoffLimiter,
  createMemoryEfficientLimiter
};
