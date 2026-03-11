import { describe, it, expect } from 'vitest';
import {
  removeAllSpaces,
  removeDuplicateSpaces,
  trimSpaces,
  removeLineBreaks,
  preserveSingleSpaces,
  processText,
  countSpaces,
  getTextStats
} from './utils';

describe('SpaceRemover utils', () => {
  describe('removeAllSpaces', () => {
    it('should remove all spaces', () => {
      expect(removeAllSpaces('hello world')).toBe('helloworld');
      expect(removeAllSpaces('  hello  world  ')).toBe('helloworld');
    });

    it('should remove tabs and newlines', () => {
      expect(removeAllSpaces('hello\tworld')).toBe('helloworld');
      expect(removeAllSpaces('hello\nworld')).toBe('helloworld');
    });

    it('should handle empty string', () => {
      expect(removeAllSpaces('')).toBe('');
    });
  });

  describe('removeDuplicateSpaces', () => {
    it('should replace multiple spaces with single space', () => {
      expect(removeDuplicateSpaces('hello  world')).toBe('hello world');
      expect(removeDuplicateSpaces('hello    world')).toBe('hello world');
    });

    it('should handle mixed whitespace', () => {
      expect(removeDuplicateSpaces('hello \t\n world')).toBe('hello world');
    });

    it('should preserve leading and trailing spaces', () => {
      expect(removeDuplicateSpaces('  hello  world  ')).toBe(' hello world ');
    });
  });

  describe('trimSpaces', () => {
    it('should remove leading and trailing spaces', () => {
      expect(trimSpaces('  hello world  ')).toBe('hello world');
      expect(trimSpaces('\thello world\n')).toBe('hello world');
    });

    it('should preserve internal spaces', () => {
      expect(trimSpaces('  hello  world  ')).toBe('hello  world');
    });
  });

  describe('removeLineBreaks', () => {
    it('should remove all line breaks', () => {
      expect(removeLineBreaks('hello\nworld')).toBe('helloworld');
      expect(removeLineBreaks('hello\r\nworld')).toBe('helloworld');
    });

    it('should handle multiple consecutive line breaks', () => {
      expect(removeLineBreaks('hello\n\n\nworld')).toBe('helloworld');
    });

    it('should preserve spaces', () => {
      expect(removeLineBreaks('hello world\ntest')).toBe('hello worldtest');
    });
  });

  describe('preserveSingleSpaces', () => {
    it('should trim and deduplicate spaces', () => {
      expect(preserveSingleSpaces('  hello  world  ')).toBe('hello world');
    });

    it('should handle multiple spaces between words', () => {
      expect(preserveSingleSpaces('hello    world    test')).toBe('hello world test');
    });

    it('should handle mixed whitespace', () => {
      expect(preserveSingleSpaces('hello \t\n world')).toBe('hello world');
    });
  });

  describe('processText', () => {
    const testText = '  hello  world  ';

    it('should process with all mode', () => {
      expect(processText(testText, 'all')).toBe('helloworld');
    });

    it('should process with duplicate mode', () => {
      expect(processText(testText, 'duplicate')).toBe(' hello world ');
    });

    it('should process with trim mode', () => {
      expect(processText(testText, 'trim')).toBe('hello  world');
    });

    it('should process with preserve mode', () => {
      expect(processText(testText, 'preserve')).toBe('hello world');
    });

    it('should handle empty text', () => {
      expect(processText('', 'all')).toBe('');
    });
  });

  describe('countSpaces', () => {
    it('should count all whitespace characters', () => {
      expect(countSpaces('hello world')).toBe(1);
      expect(countSpaces('  hello  world  ')).toBe(6);
    });

    it('should count tabs and newlines', () => {
      expect(countSpaces('hello\tworld\n')).toBe(2);
    });

    it('should return 0 for text without spaces', () => {
      expect(countSpaces('helloworld')).toBe(0);
    });
  });

  describe('getTextStats', () => {
    it('should return correct statistics', () => {
      const stats = getTextStats('hello world');
      expect(stats.total).toBe(11);
      expect(stats.spaces).toBe(1);
      expect(stats.nonSpaces).toBe(10);
      expect(stats.lines).toBe(1);
    });

    it('should count multiple lines', () => {
      const stats = getTextStats('hello\nworld');
      expect(stats.lines).toBe(2);
    });

    it('should handle empty string', () => {
      const stats = getTextStats('');
      expect(stats.total).toBe(0);
      expect(stats.spaces).toBe(0);
      expect(stats.nonSpaces).toBe(0);
      expect(stats.lines).toBe(1);
    });
  });
});
