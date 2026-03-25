import { describe, it, expect } from 'vitest';
import {
  testRegex,
  replaceWithRegex,
  getFlagsString,
  escapeRegex,
  highlightMatches,
  type RegexFlags
} from './utils';

describe('RegexTester utils', () => {
  const defaultFlags: RegexFlags = {
    global: false,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  };

  describe('getFlagsString', () => {
    it('플래그 문자열을 생성해야 함', () => {
      expect(getFlagsString(defaultFlags)).toBe('');
      expect(getFlagsString({ ...defaultFlags, global: true })).toBe('g');
      expect(getFlagsString({ ...defaultFlags, global: true, ignoreCase: true })).toBe('gi');
      expect(getFlagsString({
        global: true,
        ignoreCase: true,
        multiline: true,
        dotAll: true,
        unicode: true,
        sticky: false
      })).toBe('gimsu');
    });
  });

  describe('testRegex', () => {
    it('단일 매치를 찾아야 함', () => {
      const result = testRegex('test', 'This is a test string', defaultFlags);
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].match).toBe('test');
      expect(result.matches[0].index).toBe(10);
    });

    it('전역 매치를 찾아야 함', () => {
      const flags = { ...defaultFlags, global: true };
      const result = testRegex('\\d+', '123 abc 456 def 789', flags);
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(3);
      expect(result.matches.map(m => m.match)).toEqual(['123', '456', '789']);
    });

    it('대소문자 무시 옵션이 작동해야 함', () => {
      const flags = { ...defaultFlags, ignoreCase: true };
      const result = testRegex('TEST', 'This is a test string', flags);
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].match).toBe('test');
    });

    it('잘못된 패턴에 대해 에러를 반환해야 함', () => {
      const result = testRegex('[', 'test', defaultFlags);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('빈 패턴에 대해 에러를 반환해야 함', () => {
      const result = testRegex('', 'test', defaultFlags);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('정규식 패턴을 입력해주세요.');
    });
  });

  describe('replaceWithRegex', () => {
    it('텍스트를 치환해야 함', () => {
      const result = replaceWithRegex('\\d+', '123 abc 456', 'X', { ...defaultFlags, global: true });
      expect(result.result).toBe('X abc X');
      expect(result.count).toBe(2);
      expect(result.error).toBeUndefined();
    });

    it('단일 치환을 수행해야 함', () => {
      const result = replaceWithRegex('\\d+', '123 abc 456', 'X', defaultFlags);
      expect(result.result).toBe('X abc 456');
      expect(result.count).toBe(1);
    });

    it('잘못된 패턴에 대해 에러를 반환해야 함', () => {
      const result = replaceWithRegex('[', 'test', 'X', defaultFlags);
      expect(result.error).toBeDefined();
      expect(result.result).toBe('test');
      expect(result.count).toBe(0);
    });
  });

  describe('escapeRegex', () => {
    it('특수문자를 이스케이프해야 함', () => {
      expect(escapeRegex('.')).toBe('\\.');
      expect(escapeRegex('*')).toBe('\\*');
      expect(escapeRegex('[test]')).toBe('\\[test\\]');
      expect(escapeRegex('a.b*c[d]')).toBe('a\\.b\\*c\\[d\\]');
    });
  });

  describe('highlightMatches', () => {
    it('매치를 하이라이트해야 함', () => {
      const text = 'test string with test';
      const matches = [
        { match: 'test', index: 0 },
        { match: 'test', index: 17 }
      ];
      const result = highlightMatches(text, matches);
      expect(result).toContain('<mark class="bg-yellow-200">test</mark>');
      expect(result).toBe(
        '<mark class="bg-yellow-200">test</mark> string with <mark class="bg-yellow-200">test</mark>'
      );
    });

    it('빈 매치 배열에 대해 원본 텍스트를 반환해야 함', () => {
      const text = 'test string';
      const result = highlightMatches(text, []);
      expect(result).toBe(text);
    });
  });
});