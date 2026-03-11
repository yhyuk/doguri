import { describe, it, expect } from 'vitest';
import {
  addThousandSeparators,
  removeSeparators,
  isValidNumber,
  processLine,
  processBatch,
  countNumbers,
  getFormatStats
} from './utils';

describe('CommaFormatter utils', () => {
  describe('addThousandSeparators', () => {
    it('should add comma separators', () => {
      expect(addThousandSeparators('1234567')).toBe('1,234,567');
      expect(addThousandSeparators(1234567)).toBe('1,234,567');
    });

    it('should preserve decimal points', () => {
      expect(addThousandSeparators('1234567.89')).toBe('1,234,567.89');
      expect(addThousandSeparators('1234.5')).toBe('1,234.5');
    });

    it('should add space separators', () => {
      expect(addThousandSeparators('1234567', 'space')).toBe('1 234 567');
    });

    it('should add period separators', () => {
      expect(addThousandSeparators('1234567', 'period')).toBe('1.234.567');
    });

    it('should handle numbers less than 1000', () => {
      expect(addThousandSeparators('123')).toBe('123');
      expect(addThousandSeparators('999')).toBe('999');
    });

    it('should handle zero', () => {
      expect(addThousandSeparators('0')).toBe('0');
    });
  });

  describe('removeSeparators', () => {
    it('should remove comma separators', () => {
      expect(removeSeparators('1,234,567')).toBe('1234567');
    });

    it('should remove space separators', () => {
      expect(removeSeparators('1 234 567')).toBe('1234567');
    });

    it('should preserve decimal points', () => {
      expect(removeSeparators('1,234.56')).toBe('1234.56');
    });

    it('should handle mixed separators', () => {
      expect(removeSeparators('1,234 567')).toBe('1234567');
    });
  });

  describe('isValidNumber', () => {
    it('should validate integer numbers', () => {
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('1234567')).toBe(true);
    });

    it('should validate decimal numbers', () => {
      expect(isValidNumber('123.45')).toBe(true);
      expect(isValidNumber('0.5')).toBe(true);
    });

    it('should validate numbers with separators', () => {
      expect(isValidNumber('1,234,567')).toBe(true);
      expect(isValidNumber('1 234 567')).toBe(true);
    });

    it('should reject invalid input', () => {
      expect(isValidNumber('')).toBe(false);
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('12.34.56')).toBe(false);
    });

    it('should handle negative numbers', () => {
      expect(isValidNumber('-123')).toBe(true);
      expect(isValidNumber('-1234.56')).toBe(true);
    });
  });

  describe('processLine', () => {
    it('should format numbers in a line with commas', () => {
      expect(processLine('Total: 1234567', 'comma')).toBe('Total: 1,234,567');
      expect(processLine('Value is 1234.56', 'comma')).toBe('Value is 1,234.56');
    });

    it('should format multiple numbers in a line', () => {
      expect(processLine('1234 and 5678', 'comma')).toBe('1,234 and 5,678');
    });

    it('should handle different separators', () => {
      expect(processLine('Total: 1234567', 'space')).toBe('Total: 1 234 567');
    });

    it('should remove separators in remove mode', () => {
      expect(processLine('Total: 1,234,567', 'comma', true)).toBe('Total: 1234567');
    });

    it('should preserve already formatted numbers', () => {
      const line = 'Value: 1,234.56';
      expect(processLine(line, 'comma')).toBe('Value: 1,234.56');
    });

    it('should handle empty lines', () => {
      expect(processLine('', 'comma')).toBe('');
      expect(processLine('   ', 'comma')).toBe('   ');
    });
  });

  describe('processBatch', () => {
    it('should process multiple lines', () => {
      const input = '1234567\n890123\n456789';
      const expected = '1,234,567\n890,123\n456,789';
      expect(processBatch(input, 'comma')).toBe(expected);
    });

    it('should handle mixed content', () => {
      const input = 'Total: 1234567\nValue: 890123';
      const expected = 'Total: 1,234,567\nValue: 890,123';
      expect(processBatch(input, 'comma')).toBe(expected);
    });

    it('should remove separators in batch', () => {
      const input = '1,234,567\n890,123';
      const expected = '1234567\n890123';
      expect(processBatch(input, 'comma', true)).toBe(expected);
    });

    it('should handle empty input', () => {
      expect(processBatch('', 'comma')).toBe('');
    });
  });

  describe('countNumbers', () => {
    it('should count numbers in text', () => {
      expect(countNumbers('1234 and 5678')).toBe(2);
      expect(countNumbers('Total: 1234567')).toBe(1);
    });

    it('should count formatted numbers', () => {
      expect(countNumbers('1,234,567 and 890,123')).toBe(2);
    });

    it('should return 0 for no numbers', () => {
      expect(countNumbers('No numbers here')).toBe(0);
      expect(countNumbers('')).toBe(0);
    });

    it('should count decimal numbers', () => {
      expect(countNumbers('123.45 and 678.90')).toBe(2);
    });
  });

  describe('getFormatStats', () => {
    it('should return correct statistics', () => {
      const input = '1234567\n890123';
      const output = '1,234,567\n890,123';
      const stats = getFormatStats(input, output);

      expect(stats.inputNumbers).toBe(2);
      expect(stats.outputNumbers).toBe(2);
      expect(stats.lines).toBe(2);
      expect(stats.outputLength).toBeGreaterThan(stats.inputLength);
    });

    it('should handle empty input', () => {
      const stats = getFormatStats('', '');
      expect(stats.inputNumbers).toBe(0);
      expect(stats.outputNumbers).toBe(0);
      expect(stats.lines).toBe(1);
    });
  });
});
