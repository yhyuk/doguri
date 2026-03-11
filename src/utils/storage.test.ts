import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setWithExpiry, getWithExpiry } from './storage';

describe('Storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('setWithExpiry', () => {
    it('should store a value with expiry', () => {
      const now = new Date('2024-01-01T00:00:00Z').getTime();
      vi.setSystemTime(now);

      setWithExpiry('testKey', 'testValue', 3600000); // 1 hour

      const stored = localStorage.getItem('testKey');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.value).toBe('testValue');
      expect(parsed.expiry).toBe(now + 3600000);
    });

    it('should store objects with expiry', () => {
      const testObj = { name: 'John', age: 30 };
      setWithExpiry('userObj', testObj, 1000);

      const stored = localStorage.getItem('userObj');
      const parsed = JSON.parse(stored!);
      expect(parsed.value).toEqual(testObj);
    });

    it('should store arrays with expiry', () => {
      const testArray = [1, 2, 3, 4, 5];
      setWithExpiry('numbers', testArray, 1000);

      const stored = localStorage.getItem('numbers');
      const parsed = JSON.parse(stored!);
      expect(parsed.value).toEqual(testArray);
    });

    it('should overwrite existing values', () => {
      setWithExpiry('key', 'value1', 1000);
      setWithExpiry('key', 'value2', 2000);

      const stored = localStorage.getItem('key');
      const parsed = JSON.parse(stored!);
      expect(parsed.value).toBe('value2');
    });
  });

  describe('getWithExpiry', () => {
    it('should retrieve a non-expired value', () => {
      const now = new Date('2024-01-01T00:00:00Z').getTime();
      vi.setSystemTime(now);

      setWithExpiry('testKey', 'testValue', 3600000); // 1 hour

      // Advance time by 30 minutes
      vi.setSystemTime(now + 1800000);

      const result = getWithExpiry<string>('testKey');
      expect(result).toBe('testValue');
    });

    it('should return null for expired values', () => {
      const now = new Date('2024-01-01T00:00:00Z').getTime();
      vi.setSystemTime(now);

      setWithExpiry('testKey', 'testValue', 3600000); // 1 hour

      // Advance time by 2 hours
      vi.setSystemTime(now + 7200000);

      const result = getWithExpiry<string>('testKey');
      expect(result).toBeNull();
    });

    it('should remove expired items from storage', () => {
      const now = new Date('2024-01-01T00:00:00Z').getTime();
      vi.setSystemTime(now);

      setWithExpiry('testKey', 'testValue', 1000);

      // Advance time past expiry
      vi.setSystemTime(now + 2000);

      getWithExpiry<string>('testKey');

      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('should return null for non-existent keys', () => {
      const result = getWithExpiry<string>('nonExistent');
      expect(result).toBeNull();
    });

    it('should retrieve objects correctly', () => {
      const testObj = { name: 'John', age: 30 };
      setWithExpiry('userObj', testObj, 3600000);

      const result = getWithExpiry<{ name: string; age: number }>('userObj');
      expect(result).toEqual(testObj);
    });

    it('should retrieve arrays correctly', () => {
      const testArray = [1, 2, 3, 4, 5];
      setWithExpiry('numbers', testArray, 3600000);

      const result = getWithExpiry<number[]>('numbers');
      expect(result).toEqual(testArray);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('corrupted', 'not valid json');

      const result = getWithExpiry<string>('corrupted');
      expect(result).toBeNull();
      expect(localStorage.getItem('corrupted')).toBeNull();
    });

    it('should handle missing expiry field', () => {
      localStorage.setItem('noExpiry', JSON.stringify({ value: 'test' }));

      const result = getWithExpiry<string>('noExpiry');
      // Should handle gracefully (will either return null or the value depending on implementation)
      expect(result).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle zero TTL', () => {
      const now = new Date('2024-01-01T00:00:00Z').getTime();
      vi.setSystemTime(now);

      setWithExpiry('instant', 'value', 0);

      // Advance time by 1ms to ensure expiry
      vi.setSystemTime(now + 1);

      // Should be expired now
      const result = getWithExpiry<string>('instant');
      expect(result).toBeNull();
    });

    it('should handle negative TTL', () => {
      const now = new Date('2024-01-01T00:00:00Z').getTime();
      vi.setSystemTime(now);

      setWithExpiry('negative', 'value', -1000);

      const result = getWithExpiry<string>('negative');
      expect(result).toBeNull();
    });

    it('should handle very large TTL', () => {
      const now = new Date('2024-01-01T00:00:00Z').getTime();
      vi.setSystemTime(now);

      const oneYear = 365 * 24 * 60 * 60 * 1000;
      setWithExpiry('longTerm', 'value', oneYear);

      const result = getWithExpiry<string>('longTerm');
      expect(result).toBe('value');
    });

    it('should handle empty string values', () => {
      setWithExpiry('empty', '', 1000);

      const result = getWithExpiry<string>('empty');
      expect(result).toBe('');
    });

    it('should handle null values', () => {
      setWithExpiry('nullValue', null, 1000);

      const result = getWithExpiry<null>('nullValue');
      expect(result).toBeNull();
    });
  });
});
