import { describe, it, expect } from 'vitest';
import {
  unixToDateTime,
  dateTimeToUnix,
  formatUTCTime,
  parseISO8601,
  formatAsISO8601,
  isValidUnixTimestamp,
  isValidISO8601,
  formatUTCOffset,
  getCurrentUnixTimestamp
} from './utils';

describe('WorldTimeUTC utils', () => {
  describe('unixToDateTime', () => {
    it('should convert unix timestamp to datetime', () => {
      const timestamp = 1710504000;
      const result = unixToDateTime(timestamp);

      expect(result.timestamp).toBe(timestamp);
      expect(result.dateTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(result.iso8601).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should handle epoch time (0)', () => {
      const result = unixToDateTime(0);
      expect(result.timestamp).toBe(0);
      // The result will be in local timezone, not UTC
      expect(result.dateTime).toMatch(/^1970-01-01 \d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('dateTimeToUnix', () => {
    it('should convert date to unix timestamp', () => {
      const date = new Date('2024-03-15T12:00:00Z');
      const timestamp = dateTimeToUnix(date);

      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    it('should return 0 for epoch', () => {
      const date = new Date('1970-01-01T00:00:00Z');
      const timestamp = dateTimeToUnix(date);
      expect(timestamp).toBe(0);
    });
  });

  describe('formatUTCTime', () => {
    it('should return formatted UTC time with all fields', () => {
      const testDate = new Date('2024-03-15T12:00:00Z');
      const formatted = formatUTCTime(testDate);

      expect(formatted.timeString).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(formatted.dateString).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(formatted.iso8601).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('parseISO8601', () => {
    it('should parse valid ISO 8601 string', () => {
      const isoString = '2024-03-15T12:00:00Z';
      const date = parseISO8601(isoString);

      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBeGreaterThan(0);
    });

    it('should return null for invalid ISO string', () => {
      const result = parseISO8601('invalid-date');
      expect(result).toBeNull();
    });

    it('should handle ISO string without timezone', () => {
      const isoString = '2024-03-15T12:00:00';
      const date = parseISO8601(isoString);

      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('formatAsISO8601', () => {
    it('should format date as ISO 8601', () => {
      const date = new Date('2024-03-15T12:00:00Z');
      const iso = formatAsISO8601(date);

      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('isValidUnixTimestamp', () => {
    it('should validate valid unix timestamps', () => {
      expect(isValidUnixTimestamp('1710504000')).toBe(true);
      expect(isValidUnixTimestamp('0')).toBe(true);
    });

    it('should reject invalid timestamps', () => {
      expect(isValidUnixTimestamp('abc')).toBe(false);
      expect(isValidUnixTimestamp('')).toBe(false);
      expect(isValidUnixTimestamp('-1')).toBe(false);
      expect(isValidUnixTimestamp('9999999999999')).toBe(false);
    });
  });

  describe('isValidISO8601', () => {
    it('should validate valid ISO 8601 strings', () => {
      expect(isValidISO8601('2024-03-15T12:00:00Z')).toBe(true);
      expect(isValidISO8601('2024-03-15T12:00:00')).toBe(true);
    });

    it('should reject invalid ISO strings', () => {
      expect(isValidISO8601('invalid')).toBe(false);
      expect(isValidISO8601('')).toBe(false);
      expect(isValidISO8601('2024-13-45')).toBe(false);
    });
  });

  describe('formatUTCOffset', () => {
    it('should format positive offsets', () => {
      expect(formatUTCOffset(9)).toBe('+09:00');
      expect(formatUTCOffset(5.5)).toBe('+05:30');
    });

    it('should format negative offsets', () => {
      expect(formatUTCOffset(-5)).toBe('-05:00');
      expect(formatUTCOffset(-8)).toBe('-08:00');
    });

    it('should format zero offset', () => {
      expect(formatUTCOffset(0)).toBe('+00:00');
    });
  });

  describe('getCurrentUnixTimestamp', () => {
    it('should return current unix timestamp', () => {
      const timestamp = getCurrentUnixTimestamp();

      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
      expect(timestamp).toBeLessThan(Date.now() / 1000 + 1);
    });
  });
});
