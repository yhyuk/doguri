import { describe, it, expect } from 'vitest';
import {
  parseNumberInput,
  isValidNumber,
  formatResult,
  convertCurrency,
  formatLastUpdate,
} from './utils';

describe('CurrencyExchange Utils', () => {
  describe('parseNumberInput', () => {
    it('should parse valid numbers', () => {
      expect(parseNumberInput('123')).toBe(123);
      expect(parseNumberInput('123.45')).toBe(123.45);
      expect(parseNumberInput('-123')).toBe(-123);
      expect(parseNumberInput('-123.45')).toBe(-123.45);
      expect(parseNumberInput('0')).toBe(0);
      expect(parseNumberInput('0.5')).toBe(0.5);
    });

    it('should return null for incomplete inputs', () => {
      expect(parseNumberInput('')).toBeNull();
      expect(parseNumberInput('-')).toBeNull();
      expect(parseNumberInput('.')).toBeNull();
      expect(parseNumberInput('-.')).toBeNull();
    });

    it('should return null for invalid inputs', () => {
      expect(parseNumberInput('abc')).toBeNull();
      expect(parseNumberInput('12.34.56')).toBeNull();
      expect(parseNumberInput('--123')).toBeNull();
    });
  });

  describe('isValidNumber', () => {
    it('should validate correct number formats', () => {
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('123.45')).toBe(true);
      expect(isValidNumber('-123')).toBe(true);
      expect(isValidNumber('-123.45')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
      expect(isValidNumber('0.5')).toBe(true);
    });

    it('should allow incomplete inputs', () => {
      expect(isValidNumber('')).toBe(true);
      expect(isValidNumber('-')).toBe(true);
      expect(isValidNumber('.')).toBe(true);
      expect(isValidNumber('-.')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('12.34.56')).toBe(false);
      expect(isValidNumber('--123')).toBe(false);
      expect(isValidNumber('12a')).toBe(false);
    });
  });

  describe('formatResult', () => {
    it('should format normal numbers with 2 decimals', () => {
      expect(formatResult(123.456)).toBe('123.46');
      expect(formatResult(0.12)).toBe('0.12');
      expect(formatResult(100)).toBe('100.00');
    });

    it('should format very small numbers with 6 decimals', () => {
      expect(formatResult(0.000123)).toBe('0.000123');
      expect(formatResult(0.00001)).toBe('0.000010');
    });

    it('should format large numbers with comma separators', () => {
      expect(formatResult(1000000)).toBe('1,000,000.00');
      expect(formatResult(1234567.89)).toBe('1,234,567.89');
    });

    it('should handle zero', () => {
      expect(formatResult(0)).toBe('0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatResult(-123.45)).toBe('-123.45');
      expect(formatResult(-0.001)).toBe('-0.001000');
    });
  });

  describe('convertCurrency', () => {
    const mockRates = {
      USD: 1,
      EUR: 0.85,
      KRW: 1300,
      JPY: 110,
    };

    it('should convert between currencies correctly', () => {
      const result = convertCurrency(100, 'USD', 'KRW', mockRates);
      expect(result.result).toBe(130000);
      expect(result.rate).toBe(1300);
      expect(result.from).toBe('USD');
      expect(result.to).toBe('KRW');
    });

    it('should convert EUR to JPY', () => {
      const result = convertCurrency(100, 'EUR', 'JPY', mockRates);
      const expected = (100 / 0.85) * 110;
      expect(result.result).toBeCloseTo(expected, 2);
    });

    it('should return same amount for same currency', () => {
      const result = convertCurrency(100, 'USD', 'USD', mockRates);
      expect(result.result).toBe(100);
      expect(result.rate).toBe(1);
    });

    it('should throw error for invalid currency', () => {
      expect(() => convertCurrency(100, 'XXX', 'USD', mockRates)).toThrow(
        'Invalid currency code'
      );
    });

    it('should handle zero amount', () => {
      const result = convertCurrency(0, 'USD', 'KRW', mockRates);
      expect(result.result).toBe(0);
    });

    it('should handle negative amounts', () => {
      const result = convertCurrency(-100, 'USD', 'EUR', mockRates);
      expect(result.result).toBe(-85);
    });
  });

  describe('formatLastUpdate', () => {
    it('should show "방금 전" for very recent updates', () => {
      const now = Date.now();
      expect(formatLastUpdate(now)).toBe('방금 전');
      expect(formatLastUpdate(now - 30000)).toBe('방금 전'); // 30 seconds ago
    });

    it('should show minutes for recent updates', () => {
      const now = Date.now();
      expect(formatLastUpdate(now - 60000 * 5)).toBe('5분 전'); // 5 minutes ago
      expect(formatLastUpdate(now - 60000 * 30)).toBe('30분 전'); // 30 minutes ago
    });

    it('should show hours for updates within a day', () => {
      const now = Date.now();
      expect(formatLastUpdate(now - 60000 * 60 * 2)).toBe('2시간 전'); // 2 hours ago
      expect(formatLastUpdate(now - 60000 * 60 * 12)).toBe('12시간 전'); // 12 hours ago
    });

    it('should show days for updates within a week', () => {
      const now = Date.now();
      expect(formatLastUpdate(now - 60000 * 60 * 24 * 2)).toBe('2일 전'); // 2 days ago
      expect(formatLastUpdate(now - 60000 * 60 * 24 * 5)).toBe('5일 전'); // 5 days ago
    });

    it('should show date for older updates', () => {
      const now = Date.now();
      const oldDate = now - 60000 * 60 * 24 * 10; // 10 days ago
      const result = formatLastUpdate(oldDate);
      expect(result).toMatch(/\d{4}\. \d{1,2}\. \d{1,2}\./); // Korean date format
    });
  });
});
