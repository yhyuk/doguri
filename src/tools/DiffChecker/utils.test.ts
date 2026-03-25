import { describe, it, expect } from 'vitest';
import {
  compareDiff,
  createUnifiedDiff,
  renderDiffAsHtml,
  renderSideBySide,
  getDiffWithLineNumbers
} from './utils';

describe('DiffChecker utils', () => {
  describe('compareDiff', () => {
    it('문자 단위로 비교해야 함', () => {
      const result = compareDiff('hello', 'hallo', 'chars');
      expect(result.changes.length).toBeGreaterThan(0);
      expect(result.added).toBe(1); // 'a'
      expect(result.removed).toBe(1); // 'e'
      expect(result.unchanged).toBe(4); // 'h', 'l', 'l', 'o'
    });

    it('단어 단위로 비교해야 함', () => {
      const result = compareDiff('hello world', 'hello earth', 'words');
      expect(result.added).toBe(1); // 'earth'
      expect(result.removed).toBe(1); // 'world'
      expect(result.unchanged).toBe(1); // 'hello'
    });

    it('줄 단위로 비교해야 함', () => {
      const text1 = 'line1\nline2\nline3';
      const text2 = 'line1\nmodified\nline3';
      const result = compareDiff(text1, text2, 'lines');
      expect(result.added).toBe(1);
      expect(result.removed).toBe(1);
      expect(result.unchanged).toBe(2);
    });

    it('유사도를 계산해야 함', () => {
      const result1 = compareDiff('hello', 'hello', 'chars');
      expect(result1.similarity).toBe(100);

      const result2 = compareDiff('hello', 'world', 'chars');
      expect(result2.similarity).toBeLessThan(50);
    });

    it('JSON을 비교해야 함', () => {
      const json1 = '{"a": 1, "b": 2}';
      const json2 = '{"a": 1, "b": 3}';
      const result = compareDiff(json1, json2, 'json');
      expect(result.changes.length).toBeGreaterThan(0);
    });
  });

  describe('createUnifiedDiff', () => {
    it('Unified diff 형식을 생성해야 함', () => {
      const text1 = 'line1\nline2\nline3';
      const text2 = 'line1\nmodified\nline3';
      const patch = createUnifiedDiff(text1, text2);
      expect(patch).toContain('---');
      expect(patch).toContain('+++');
      expect(patch).toContain('-line2');
      expect(patch).toContain('+modified');
    });
  });

  describe('renderDiffAsHtml', () => {
    it('변경 사항을 HTML로 렌더링해야 함', () => {
      const changes = [
        { value: 'unchanged', added: false, removed: false, count: 1 },
        { value: 'added', added: true, removed: false, count: 1 },
        { value: 'removed', added: false, removed: true, count: 1 }
      ];
      const html = renderDiffAsHtml(changes);
      expect(html).toContain('unchanged');
      expect(html).toContain('class="bg-green-100');
      expect(html).toContain('class="bg-red-100');
    });
  });

  describe('renderSideBySide', () => {
    it('나란히 비교 형식으로 렌더링해야 함', () => {
      const text1 = 'line1\nline2\nline3';
      const text2 = 'line1\nmodified\nline3\nline4';
      const { left, right } = renderSideBySide(text1, text2);
      expect(left).toContain('line1');
      expect(right).toContain('line1');
      expect(left).toContain('line2');
      expect(right).toContain('modified');
    });
  });

  describe('getDiffWithLineNumbers', () => {
    it('줄 번호와 함께 변경 사항을 반환해야 함', () => {
      const changes = [
        { value: 'line1\n', added: false, removed: false, count: 1 },
        { value: 'line2\n', added: false, removed: true, count: 1 },
        { value: 'modified\n', added: true, removed: false, count: 1 },
        { value: 'line3', added: false, removed: false, count: 1 }
      ];
      const result = getDiffWithLineNumbers(changes);
      expect(result).toHaveLength(4);
      expect(result[0].type).toBe('unchanged');
      expect(result[1].type).toBe('removed');
      expect(result[2].type).toBe('added');
      expect(result[3].type).toBe('unchanged');
    });
  });
});