import { describe, it, expect } from 'vitest';
import { pickFromList, pickRandomNumbers, parseList } from './utils';

describe('RandomPicker utils', () => {
  describe('pickFromList', () => {
    it('목록에서 지정된 개수를 선택해야 함', () => {
      const items = ['사과', '바나나', '오렌지', '포도', '딸기'];
      const result = pickFromList(items, 3, false);
      expect(result).toHaveLength(3);
      result.forEach(item => {
        expect(items).toContain(item);
      });
    });

    it('중복 허용 시 같은 항목이 여러 번 선택될 수 있음', () => {
      const items = ['A', 'B'];
      const result = pickFromList(items, 10, true);
      expect(result).toHaveLength(10);
      result.forEach(item => {
        expect(['A', 'B']).toContain(item);
      });
    });

    it('중복 불허 시 모든 선택된 항목이 고유해야 함', () => {
      const items = ['A', 'B', 'C', 'D', 'E'];
      const result = pickFromList(items, 5, false);
      const uniqueItems = new Set(result);
      expect(uniqueItems.size).toBe(5);
    });

    it('빈 목록에 대해 에러를 발생시켜야 함', () => {
      expect(() => pickFromList([], 1, false)).toThrow('목록이 비어있습니다.');
    });

    it('선택 개수가 0 이하일 때 에러를 발생시켜야 함', () => {
      expect(() => pickFromList(['A'], 0, false)).toThrow('선택 개수는 최소 1개 이상이어야 합니다.');
      expect(() => pickFromList(['A'], -1, false)).toThrow('선택 개수는 최소 1개 이상이어야 합니다.');
    });

    it('중복 불허 시 선택 개수가 목록 크기를 초과하면 에러를 발생시켜야 함', () => {
      const items = ['A', 'B', 'C'];
      expect(() => pickFromList(items, 4, false))
        .toThrow('중복을 허용하지 않는 경우 선택 개수는 목록 크기를 초과할 수 없습니다.');
    });

    it('중복 허용 시 선택 개수가 목록 크기를 초과해도 동작해야 함', () => {
      const items = ['A', 'B'];
      const result = pickFromList(items, 5, true);
      expect(result).toHaveLength(5);
    });
  });

  describe('pickRandomNumbers', () => {
    it('숫자 범위에서 지정된 개수를 선택해야 함', () => {
      const result = pickRandomNumbers(1, 10, 5, false);
      expect(result).toHaveLength(5);
      result.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(10);
      });
    });

    it('중복 허용 시 같은 숫자가 여러 번 선택될 수 있음', () => {
      const result = pickRandomNumbers(1, 2, 10, true);
      expect(result).toHaveLength(10);
      result.forEach(num => {
        expect([1, 2]).toContain(num);
      });
    });

    it('중복 불허 시 모든 선택된 숫자가 고유해야 함', () => {
      const result = pickRandomNumbers(1, 10, 10, false);
      const uniqueNumbers = new Set(result);
      expect(uniqueNumbers.size).toBe(10);
    });

    it('최소값이 최대값보다 크면 에러를 발생시켜야 함', () => {
      expect(() => pickRandomNumbers(10, 5, 1, false))
        .toThrow('최소값은 최대값보다 작거나 같아야 합니다.');
    });

    it('선택 개수가 0 이하일 때 에러를 발생시켜야 함', () => {
      expect(() => pickRandomNumbers(1, 10, 0, false))
        .toThrow('선택 개수는 최소 1개 이상이어야 합니다.');
    });

    it('중복 불허 시 선택 개수가 범위를 초과하면 에러를 발생시켜야 함', () => {
      expect(() => pickRandomNumbers(1, 5, 6, false))
        .toThrow('중복을 허용하지 않는 경우 선택 개수는 범위를 초과할 수 없습니다.');
    });

    it('중복 허용 시 선택 개수가 범위를 초과해도 동작해야 함', () => {
      const result = pickRandomNumbers(1, 3, 10, true);
      expect(result).toHaveLength(10);
    });

    it('음수 범위에서도 정상 동작해야 함', () => {
      const result = pickRandomNumbers(-5, 5, 3, false);
      expect(result).toHaveLength(3);
      result.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(-5);
        expect(num).toBeLessThanOrEqual(5);
      });
    });

    it('최소값과 최대값이 같을 때 해당 값만 반환해야 함', () => {
      const result = pickRandomNumbers(42, 42, 1, false);
      expect(result).toEqual([42]);
    });
  });

  describe('parseList', () => {
    it('줄바꿈으로 구분된 텍스트를 배열로 변환해야 함', () => {
      const text = '사과\n바나나\n오렌지';
      const result = parseList(text);
      expect(result).toEqual(['사과', '바나나', '오렌지']);
    });

    it('빈 줄을 제외해야 함', () => {
      const text = '사과\n\n바나나\n\n\n오렌지';
      const result = parseList(text);
      expect(result).toEqual(['사과', '바나나', '오렌지']);
    });

    it('앞뒤 공백을 제거해야 함', () => {
      const text = '  사과  \n  바나나  \n  오렌지  ';
      const result = parseList(text);
      expect(result).toEqual(['사과', '바나나', '오렌지']);
    });

    it('빈 텍스트는 빈 배열을 반환해야 함', () => {
      expect(parseList('')).toEqual([]);
      expect(parseList('\n\n\n')).toEqual([]);
      expect(parseList('   \n   \n   ')).toEqual([]);
    });

    it('한 줄 텍스트를 처리해야 함', () => {
      const result = parseList('단일 항목');
      expect(result).toEqual(['단일 항목']);
    });
  });

  describe('랜덤성 검증', () => {
    it('pickFromList는 충분히 랜덤해야 함 (통계적 검증)', () => {
      const items = ['A', 'B', 'C', 'D', 'E'];
      const counts = new Map<string, number>();
      items.forEach(item => counts.set(item, 0));

      // 1000번 선택 (각각 1개씩)
      for (let i = 0; i < 1000; i++) {
        const [selected] = pickFromList(items, 1, true);
        counts.set(selected, (counts.get(selected) || 0) + 1);
      }

      // 각 항목이 최소 100번 이상 선택되어야 함 (기댓값 200, 여유 50%)
      items.forEach(item => {
        expect(counts.get(item)).toBeGreaterThan(100);
      });
    });

    it('pickRandomNumbers는 충분히 랜덤해야 함 (통계적 검증)', () => {
      const min = 1;
      const max = 5;
      const counts = new Map<number, number>();

      for (let i = min; i <= max; i++) {
        counts.set(i, 0);
      }

      // 1000번 선택 (각각 1개씩)
      for (let i = 0; i < 1000; i++) {
        const [selected] = pickRandomNumbers(min, max, 1, true);
        counts.set(selected, (counts.get(selected) || 0) + 1);
      }

      // 각 숫자가 최소 100번 이상 선택되어야 함 (기댓값 200, 여유 50%)
      for (let i = min; i <= max; i++) {
        expect(counts.get(i)).toBeGreaterThan(100);
      }
    });
  });
});
