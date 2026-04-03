import { describe, it, expect } from 'vitest';
import {
  countCharacters,
  countCharactersWithoutSpaces,
  countWords,
  countSentences,
  countParagraphs,
  checkTwitterLimit,
  getTextStats,
} from './utils';

describe('TextCounter utils', () => {
  describe('countCharacters', () => {
    it('공백을 포함한 전체 글자 수를 세야 함', () => {
      expect(countCharacters('Hello World')).toBe(11);
      expect(countCharacters('안녕하세요')).toBe(5);
    });

    it('빈 문자열은 0을 반환해야 함', () => {
      expect(countCharacters('')).toBe(0);
    });

    it('특수문자도 카운트해야 함', () => {
      expect(countCharacters('Hello! @#$')).toBe(10);
    });
  });

  describe('countCharactersWithoutSpaces', () => {
    it('공백을 제외한 글자 수를 세야 함', () => {
      expect(countCharactersWithoutSpaces('Hello World')).toBe(10);
      expect(countCharactersWithoutSpaces('안녕 하세요')).toBe(5);
    });

    it('여러 종류의 공백을 제거해야 함', () => {
      expect(countCharactersWithoutSpaces('Hello\tWorld\n!')).toBe(11);
    });

    it('빈 문자열은 0을 반환해야 함', () => {
      expect(countCharactersWithoutSpaces('')).toBe(0);
      expect(countCharactersWithoutSpaces('   ')).toBe(0);
    });
  });

  describe('countWords', () => {
    it('영문 단어를 세야 함', () => {
      expect(countWords('Hello World')).toBe(2);
      expect(countWords('The quick brown fox jumps')).toBe(5);
    });

    it('한글 단어를 세야 함', () => {
      expect(countWords('안녕하세요')).toBe(1);
      expect(countWords('안녕 하세요')).toBe(2);
      expect(countWords('오늘 날씨가 좋네요')).toBe(3);
    });

    it('한글과 영문 혼합 텍스트를 세야 함', () => {
      expect(countWords('Hello 안녕 World')).toBe(3);
      expect(countWords('React는 JavaScript 라이브러리입니다')).toBe(3);
    });

    it('숫자도 단어로 카운트해야 함', () => {
      expect(countWords('123 456')).toBe(2);
      expect(countWords('2024년 1월 1일')).toBe(3);
    });

    it('빈 문자열은 0을 반환해야 함', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('특수문자만 있으면 0을 반환해야 함', () => {
      expect(countWords('!@#$%')).toBe(0);
    });
  });

  describe('countSentences', () => {
    it('마침표로 끝나는 문장을 세야 함', () => {
      expect(countSentences('Hello. World.')).toBe(2);
      expect(countSentences('This is a sentence.')).toBe(1);
    });

    it('물음표와 느낌표도 문장 끝으로 인식해야 함', () => {
      expect(countSentences('Hello! How are you?')).toBe(2);
      expect(countSentences('정말요? 대단해요!')).toBe(2);
    });

    it('한글 문장 부호도 인식해야 함', () => {
      expect(countSentences('안녕하세요。반갑습니다。')).toBe(2);
    });

    it('문장 부호가 없어도 텍스트가 있으면 최소 1문장', () => {
      expect(countSentences('Hello World')).toBe(1);
      expect(countSentences('안녕하세요')).toBe(1);
    });

    it('빈 문자열은 0을 반환해야 함', () => {
      expect(countSentences('')).toBe(0);
      expect(countSentences('   ')).toBe(0);
    });

    it('연속된 문장 부호는 하나로 취급해야 함', () => {
      expect(countSentences('Really!!! Amazing??')).toBe(2);
    });
  });

  describe('countParagraphs', () => {
    it('단일 문단은 1을 반환해야 함', () => {
      expect(countParagraphs('Hello World')).toBe(1);
    });

    it('빈 줄로 구분된 문단을 세야 함', () => {
      const text = 'First paragraph.\n\nSecond paragraph.';
      expect(countParagraphs(text)).toBe(2);
    });

    it('여러 개의 빈 줄도 하나의 구분자로 취급해야 함', () => {
      const text = 'First paragraph.\n\n\n\nSecond paragraph.';
      expect(countParagraphs(text)).toBe(2);
    });

    it('단순 줄바꿈은 문단을 나누지 않아야 함', () => {
      const text = 'First line\nSecond line';
      expect(countParagraphs(text)).toBe(1);
    });

    it('빈 문자열은 0을 반환해야 함', () => {
      expect(countParagraphs('')).toBe(0);
      expect(countParagraphs('   ')).toBe(0);
      expect(countParagraphs('\n\n\n')).toBe(0);
    });
  });

  describe('checkTwitterLimit', () => {
    it('280자 이하면 true를 반환해야 함', () => {
      expect(checkTwitterLimit('Short text')).toBe(true);
      expect(checkTwitterLimit('a'.repeat(280))).toBe(true);
    });

    it('280자 초과면 false를 반환해야 함', () => {
      expect(checkTwitterLimit('a'.repeat(281))).toBe(false);
      expect(checkTwitterLimit('a'.repeat(500))).toBe(false);
    });

    it('빈 문자열은 true를 반환해야 함', () => {
      expect(checkTwitterLimit('')).toBe(true);
    });

    it('한글도 정확히 카운트해야 함', () => {
      expect(checkTwitterLimit('가'.repeat(280))).toBe(true);
      expect(checkTwitterLimit('가'.repeat(281))).toBe(false);
    });
  });

  describe('getTextStats', () => {
    it('모든 통계를 정확히 계산해야 함', () => {
      const text = 'Hello World! This is a test.\n\nNew paragraph here.';
      const stats = getTextStats(text);

      expect(stats.totalCharacters).toBeGreaterThan(0);
      expect(stats.charactersWithoutSpaces).toBeGreaterThan(0);
      expect(stats.words).toBeGreaterThan(0);
      expect(stats.sentences).toBeGreaterThan(0);
      expect(stats.paragraphs).toBe(2);
      expect(stats.withinTwitterLimit).toBe(true);
    });

    it('읽는 시간을 계산해야 함', () => {
      const text = 'word '.repeat(200); // 200 단어
      const stats = getTextStats(text);

      expect(stats.readingTimeMinutes).toBe(1);
    });

    it('빈 문자열은 모든 값이 0이어야 함', () => {
      const stats = getTextStats('');

      expect(stats.totalCharacters).toBe(0);
      expect(stats.charactersWithoutSpaces).toBe(0);
      expect(stats.words).toBe(0);
      expect(stats.sentences).toBe(0);
      expect(stats.paragraphs).toBe(0);
      expect(stats.withinTwitterLimit).toBe(true);
      expect(stats.readingTimeMinutes).toBe(0);
    });

    it('한글 텍스트도 정확히 분석해야 함', () => {
      const text = '안녕하세요. 반갑습니다.\n\n새로운 문단입니다.';
      const stats = getTextStats(text);

      expect(stats.totalCharacters).toBeGreaterThan(0);
      expect(stats.words).toBeGreaterThan(0);
      expect(stats.sentences).toBe(3);
      expect(stats.paragraphs).toBe(2);
    });
  });

  describe('엣지 케이스', () => {
    it('이모지도 카운트해야 함', () => {
      expect(countCharacters('Hello 👋 World')).toBeGreaterThan(10);
      expect(countWords('Hello 👋 World')).toBe(2);
    });

    it('매우 긴 텍스트도 처리해야 함', () => {
      const longText = 'word '.repeat(10000);
      const stats = getTextStats(longText);

      expect(stats.words).toBe(10000);
      expect(stats.readingTimeMinutes).toBe(50);
    });

    it('특수문자가 많은 코드도 처리해야 함', () => {
      const code = 'function test() { return 42; }';
      const stats = getTextStats(code);

      expect(stats.totalCharacters).toBe(code.length);
      expect(stats.words).toBeGreaterThan(0);
    });
  });
});
