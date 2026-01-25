class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timeouts = new Map();
    this.sizes = new Map(); // Track size of each cached value
    this.maxSize = 50 * 1024 * 1024; // 50MB max cache size
    this.currentSize = 0;
  }

  set(key, value, ttl = 5 * 60 * 1000) { // Default TTL: 5 minutes
    // Calculate approximate size
    const valueSize = JSON.stringify(value).length * 2; // Rough estimate
    
    // Remove existing if size limits exceeded
    if (this.currentSize + valueSize > this.maxSize) {
      this.prune();
    }

    // Clear any existing timeout for this key
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.currentSize -= this.sizes.get(key) || 0;
    }

    // Set the value in cache
    this.cache.set(key, value);
    this.sizes.set(key, valueSize);
    this.currentSize += valueSize;

    // Set expiration timeout
    const timeout = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timeouts.set(key, timeout);
  }

  get(key) {
    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
    const size = this.sizes.get(key) || 0;
    this.currentSize -= size;
    this.sizes.delete(key);
    return this.cache.delete(key);
  }

  clear() {
    // Clear all timeouts
    for (const timeout of this.timeouts.values()) {
      clearTimeout(timeout);
    }
    this.timeouts.clear();
    this.sizes.clear();
    this.cache.clear();
    this.currentSize = 0;
  }

  // Remove oldest entries when cache is full
  prune() {
    const entriesToDelete = Math.ceil(this.cache.size * 0.2); // Delete 20%
    const entries = Array.from(this.cache.entries());
    
    for (let i = 0; i < entriesToDelete && entries.length > 0; i++) {
      const [key] = entries.shift();
      this.delete(key);
    }
  }
}

export default new CacheManager();