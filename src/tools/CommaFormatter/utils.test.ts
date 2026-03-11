import { describe, it, expect } from 'vitest';
import {
  formatForSqlIn,
  getFormatStats,
  trimValues,
  removeDuplicates,
  sortValues,
  wrapInQuotes,
  type FormatOptions
} from './utils';

describe('CommaFormatter utils - SQL IN Query Support', () => {
  describe('formatForSqlIn', () => {
    it('should format newline-separated values for SQL IN query', () => {
      const input = 'user1\nuser2\nuser3';
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'inline',
        wrapInParentheses: true,
        removeDuplicates: false,
        sortOrder: 'none',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe("('user1', 'user2', 'user3')");
    });

    it('should format with newline output format', () => {
      const input = 'user1\nuser2\nuser3';
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'newline',
        wrapInParentheses: true,
        removeDuplicates: false,
        sortOrder: 'none',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe("(\n'user1',\n'user2',\n'user3'\n)");
    });

    it('should handle comma-separated input', () => {
      const input = 'value1, value2, value3';
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'inline',
        wrapInParentheses: false,
        removeDuplicates: false,
        sortOrder: 'none',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe("'value1', 'value2', 'value3'");
    });

    it('should format without quotes for numeric values', () => {
      const input = '1\n2\n3';
      const options: FormatOptions = {
        wrapInQuotes: false,
        outputFormat: 'inline',
        wrapInParentheses: true,
        removeDuplicates: false,
        sortOrder: 'none',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe('(1, 2, 3)');
    });

    it('should remove duplicates when enabled', () => {
      const input = 'user1\nuser2\nuser1\nuser3';
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'inline',
        wrapInParentheses: false,
        removeDuplicates: true,
        sortOrder: 'none',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe("'user1', 'user2', 'user3'");
    });

    it('should sort values alphabetically in ascending order', () => {
      const input = 'charlie\nalice\nbob';
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'inline',
        wrapInParentheses: false,
        removeDuplicates: false,
        sortOrder: 'asc',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe("'alice', 'bob', 'charlie'");
    });

    it('should sort values in descending order', () => {
      const input = 'alice\ncharlie\nbob';
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'inline',
        wrapInParentheses: false,
        removeDuplicates: false,
        sortOrder: 'desc',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe("'charlie', 'bob', 'alice'");
    });

    it('should sort numeric values numerically', () => {
      const input = '100\n20\n3';
      const options: FormatOptions = {
        wrapInQuotes: false,
        outputFormat: 'inline',
        wrapInParentheses: false,
        removeDuplicates: false,
        sortOrder: 'asc',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe('3, 20, 100');
    });

    it('should handle empty input', () => {
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'inline',
        wrapInParentheses: true,
        removeDuplicates: false,
        sortOrder: 'none',
        trimWhitespace: true
      };
      expect(formatForSqlIn('', options)).toBe('');
      expect(formatForSqlIn('   ', options)).toBe('');
    });

    it('should escape single quotes in values', () => {
      const input = "O'Connor\nD'Angelo";
      const options: FormatOptions = {
        wrapInQuotes: true,
        outputFormat: 'inline',
        wrapInParentheses: false,
        removeDuplicates: false,
        sortOrder: 'none',
        trimWhitespace: true
      };
      expect(formatForSqlIn(input, options)).toBe("'O''Connor', 'D''Angelo'");
    });
  });

  describe('trimValues', () => {
    it('should trim whitespace from values', () => {
      expect(trimValues(['  user1  ', 'user2', '  user3'])).toEqual(['user1', 'user2', 'user3']);
    });

    it('should filter empty values', () => {
      expect(trimValues(['user1', '   ', 'user2', ''])).toEqual(['user1', 'user2']);
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate values', () => {
      expect(removeDuplicates(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle array without duplicates', () => {
      expect(removeDuplicates(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('sortValues', () => {
    it('should sort alphabetically in ascending order', () => {
      expect(sortValues(['c', 'a', 'b'], 'asc')).toEqual(['a', 'b', 'c']);
    });

    it('should sort alphabetically in descending order', () => {
      expect(sortValues(['a', 'c', 'b'], 'desc')).toEqual(['c', 'b', 'a']);
    });

    it('should sort numbers numerically in ascending order', () => {
      expect(sortValues(['100', '20', '3'], 'asc')).toEqual(['3', '20', '100']);
    });

    it('should sort numbers numerically in descending order', () => {
      expect(sortValues(['3', '100', '20'], 'desc')).toEqual(['100', '20', '3']);
    });

    it('should not sort when order is none', () => {
      expect(sortValues(['c', 'a', 'b'], 'none')).toEqual(['c', 'a', 'b']);
    });
  });

  describe('wrapInQuotes', () => {
    it('should wrap value in single quotes', () => {
      expect(wrapInQuotes('test')).toBe("'test'");
    });

    it('should escape single quotes', () => {
      expect(wrapInQuotes("O'Connor")).toBe("'O''Connor'");
    });

    it('should handle multiple single quotes', () => {
      expect(wrapInQuotes("It's Mary's")).toBe("'It''s Mary''s'");
    });
  });

  describe('getFormatStats', () => {
    it('should return correct statistics', () => {
      const input = 'user1\nuser2\nuser3';
      const output = "('user1', 'user2', 'user3')";
      const stats = getFormatStats(input, output);

      expect(stats.inputCount).toBe(3);
      expect(stats.outputCount).toBe(3);
      expect(stats.hasDuplicates).toBe(false);
      expect(stats.outputLength).toBeGreaterThan(stats.inputLength);
    });

    it('should detect duplicates', () => {
      const input = 'user1\nuser2\nuser1';
      const output = "('user1', 'user2', 'user1')";
      const stats = getFormatStats(input, output);

      expect(stats.hasDuplicates).toBe(true);
      expect(stats.inputCount).toBe(3);
    });

    it('should handle empty input', () => {
      const stats = getFormatStats('', '');
      expect(stats.inputCount).toBe(0);
      expect(stats.outputCount).toBe(0);
      expect(stats.hasDuplicates).toBe(false);
    });

    it('should count comma-separated values', () => {
      const input = 'value1, value2, value3';
      const output = "('value1', 'value2', 'value3')";
      const stats = getFormatStats(input, output);

      expect(stats.inputCount).toBe(3);
      expect(stats.outputCount).toBe(3);
    });
  });
});
