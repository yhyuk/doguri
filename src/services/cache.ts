// Caching mechanism using localStorage

const CACHE_PREFIX = 'doguri_cache_';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

class CacheService {
  // Set cache with optional TTL
  set<T>(key: string, value: T, options?: CacheOptions): void {
    const cacheKey = CACHE_PREFIX + key;
    const cacheData = {
      value,
      timestamp: Date.now(),
      ttl: options?.ttl,
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save to cache:', error);
    }
  }

  // Get cache if not expired
  get<T>(key: string): T | null {
    const cacheKey = CACHE_PREFIX + key;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache has expired
      if (cacheData.ttl && now - cacheData.timestamp > cacheData.ttl) {
        this.remove(key);
        return null;
      }

      return cacheData.value as T;
    } catch (error) {
      console.error('Failed to read from cache:', error);
      return null;
    }
  }

  // Remove specific cache
  remove(key: string): void {
    const cacheKey = CACHE_PREFIX + key;
    try {
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Failed to remove from cache:', error);
    }
  }

  // Clear all cache with prefix
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Get cache timestamp
  getTimestamp(key: string): number | null {
    const cacheKey = CACHE_PREFIX + key;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      return cacheData.timestamp;
    } catch (error) {
      console.error('Failed to get cache timestamp:', error);
      return null;
    }
  }
}

export default new CacheService();
