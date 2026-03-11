/**
 * Storage item with expiry metadata
 */
interface StorageItem<T> {
  value: T;
  expiry: number;
}

/**
 * Set an item in localStorage with an expiry time
 *
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @param ttl - Time to live in milliseconds
 *
 * @example
 * setWithExpiry('userToken', 'abc123', 3600000) // Expires in 1 hour
 * setWithExpiry('userData', { name: 'John' }, 86400000) // Expires in 24 hours
 */
export function setWithExpiry<T>(key: string, value: T, ttl: number): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('localStorage is not available');
    return;
  }

  const now = new Date().getTime();
  const item: StorageItem<T> = {
    value,
    expiry: now + ttl,
  };

  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error(`Failed to set localStorage item '${key}':`, error);
  }
}

/**
 * Get an item from localStorage if it hasn't expired
 * Returns null if the item doesn't exist or has expired
 *
 * @param key - Storage key
 * @returns The stored value or null if expired/not found
 *
 * @example
 * const token = getWithExpiry<string>('userToken')
 * const userData = getWithExpiry<{ name: string }>('userData')
 */
export function getWithExpiry<T>(key: string): T | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.warn('localStorage is not available');
    return null;
  }

  try {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }

    const item: StorageItem<T> = JSON.parse(itemStr);
    const now = new Date().getTime();

    // Check if item has expired
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error(`Failed to get localStorage item '${key}':`, error);
    // Remove corrupted data
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail if we can't remove
    }
    return null;
  }
}
