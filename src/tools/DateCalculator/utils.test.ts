/**
 * 날짜 계산 유틸리티 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  calculateDDay,
  calculateDateDifference,
  addDays,
  subtractDays,
  formatDateResult,
  formatDateDifference,
  formatDDay,
  isValidDate,
  isFutureDate
} from './utils';

describe('calculateDDay', () => {
  it('미래 날짜에 대해 양수를 반환해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const targetDate = new Date('2024-01-11');
    const dday = calculateDDay(targetDate, baseDate);
    expect(dday).toBe(10);
  });

  it('과거 날짜에 대해 음수를 반환해야 함', () => {
    const baseDate = new Date('2024-01-11');
    const targetDate = new Date('2024-01-01');
    const dday = calculateDDay(targetDate, baseDate);
    expect(dday).toBe(-10);
  });

  it('동일 날짜에 대해 0을 반환해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const targetDate = new Date('2024-01-01');
    const dday = calculateDDay(targetDate, baseDate);
    expect(dday).toBe(0);
  });

  it('100일 후를 정확히 계산해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const targetDate = new Date('2024-04-10');
    const dday = calculateDDay(targetDate, baseDate);
    expect(dday).toBe(100);
  });

  it('윤년을 고려해야 함', () => {
    const baseDate = new Date('2024-02-01');
    const targetDate = new Date('2024-03-01');
    const dday = calculateDDay(targetDate, baseDate);
    expect(dday).toBe(29); // 2024년은 윤년
  });
});

describe('calculateDateDifference', () => {
  it('정확한 년, 월, 일을 계산해야 함', () => {
    const date1 = new Date('2020-01-01');
    const date2 = new Date('2024-06-15');
    const diff = calculateDateDifference(date1, date2);

    expect(diff.years).toBe(4);
    expect(diff.months).toBe(5);
    expect(diff.days).toBe(14);
  });

  it('1년 미만의 기간을 정확히 계산해야 함', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-06-15');
    const diff = calculateDateDifference(date1, date2);

    expect(diff.years).toBe(0);
    expect(diff.months).toBe(5);
    expect(diff.days).toBe(14);
  });

  it('1개월 미만의 기간을 정확히 계산해야 함', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-15');
    const diff = calculateDateDifference(date1, date2);

    expect(diff.years).toBe(0);
    expect(diff.months).toBe(0);
    expect(diff.days).toBe(14);
  });

  it('날짜 순서에 관계없이 동일한 결과를 반환해야 함', () => {
    const date1 = new Date('2020-01-01');
    const date2 = new Date('2024-06-15');
    const diff1 = calculateDateDifference(date1, date2);
    const diff2 = calculateDateDifference(date2, date1);

    expect(diff1).toEqual(diff2);
  });

  it('동일 날짜에 대해 0을 반환해야 함', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-01');
    const diff = calculateDateDifference(date1, date2);

    expect(diff.years).toBe(0);
    expect(diff.months).toBe(0);
    expect(diff.days).toBe(0);
  });

  it('윤년이 포함된 기간을 정확히 계산해야 함', () => {
    const date1 = new Date('2020-02-01');
    const date2 = new Date('2020-03-01');
    const diff = calculateDateDifference(date1, date2);

    expect(diff.years).toBe(0);
    expect(diff.months).toBe(1);
    expect(diff.days).toBe(0);
  });

  it('월말 처리를 정확히 해야 함', () => {
    const date1 = new Date('2024-01-31');
    const date2 = new Date('2024-02-29'); // 윤년
    const diff = calculateDateDifference(date1, date2);

    expect(diff.years).toBe(0);
    expect(diff.months).toBe(1); // 1월 31일 -> 2월 29일 = 1개월
    expect(diff.days).toBe(0); // date-fns는 1개월 정확히 차이로 계산
  });
});

describe('addDays', () => {
  it('N일 후의 날짜를 정확히 계산해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const result = addDays(baseDate, 10);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0); // 1월
    expect(result.getDate()).toBe(11);
  });

  it('0일 추가 시 동일 날짜를 반환해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const result = addDays(baseDate, 0);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });

  it('월말을 넘어가는 계산을 정확히 해야 함', () => {
    const baseDate = new Date('2024-01-25');
    const result = addDays(baseDate, 10);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1); // 2월
    expect(result.getDate()).toBe(4);
  });

  it('연말을 넘어가는 계산을 정확히 해야 함', () => {
    const baseDate = new Date('2024-12-25');
    const result = addDays(baseDate, 10);

    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0); // 1월
    expect(result.getDate()).toBe(4);
  });

  it('윤년 2월 말일을 고려해야 함', () => {
    const baseDate = new Date('2024-02-25');
    const result = addDays(baseDate, 10);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(2); // 3월
    expect(result.getDate()).toBe(6); // 2024-02-25 + 10일 = 2024-03-06
  });
});

describe('subtractDays', () => {
  it('N일 전의 날짜를 정확히 계산해야 함', () => {
    const baseDate = new Date('2024-01-11');
    const result = subtractDays(baseDate, 10);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0); // 1월
    expect(result.getDate()).toBe(1);
  });

  it('0일 빼기 시 동일 날짜를 반환해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const result = subtractDays(baseDate, 0);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });

  it('월초를 넘어가는 계산을 정확히 해야 함', () => {
    const baseDate = new Date('2024-02-05');
    const result = subtractDays(baseDate, 10);

    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0); // 1월
    expect(result.getDate()).toBe(26);
  });

  it('연초를 넘어가는 계산을 정확히 해야 함', () => {
    const baseDate = new Date('2024-01-05');
    const result = subtractDays(baseDate, 10);

    expect(result.getFullYear()).toBe(2023);
    expect(result.getMonth()).toBe(11); // 12월
    expect(result.getDate()).toBe(26);
  });
});

describe('formatDateResult', () => {
  it('날짜를 YYYY-MM-DD 형식으로 반환해야 함', () => {
    const date = new Date('2024-01-15');
    const result = formatDateResult(date);
    expect(result).toBe('2024-01-15');
  });

  it('한 자리 월과 일을 0으로 패딩해야 함', () => {
    const date = new Date('2024-03-05');
    const result = formatDateResult(date);
    expect(result).toBe('2024-03-05');
  });
});

describe('formatDateDifference', () => {
  it('년, 월, 일을 포함한 텍스트를 반환해야 함', () => {
    const diff = { years: 4, months: 5, days: 14 };
    const result = formatDateDifference(diff);
    expect(result).toBe('4년 5개월 14일');
  });

  it('년만 있을 때 정확히 표시해야 함', () => {
    const diff = { years: 4, months: 0, days: 0 };
    const result = formatDateDifference(diff);
    expect(result).toBe('4년');
  });

  it('월만 있을 때 정확히 표시해야 함', () => {
    const diff = { years: 0, months: 5, days: 0 };
    const result = formatDateDifference(diff);
    expect(result).toBe('5개월');
  });

  it('일만 있을 때 정확히 표시해야 함', () => {
    const diff = { years: 0, months: 0, days: 14 };
    const result = formatDateDifference(diff);
    expect(result).toBe('14일');
  });

  it('모두 0일 때 "0일"을 반환해야 함', () => {
    const diff = { years: 0, months: 0, days: 0 };
    const result = formatDateDifference(diff);
    expect(result).toBe('0일');
  });
});

describe('formatDDay', () => {
  it('양수에 대해 D-N 형식을 반환해야 함', () => {
    expect(formatDDay(10)).toBe('D-10');
    expect(formatDDay(100)).toBe('D-100');
  });

  it('음수에 대해 D+N 형식을 반환해야 함', () => {
    expect(formatDDay(-10)).toBe('D+10');
    expect(formatDDay(-100)).toBe('D+100');
  });

  it('0에 대해 "D-Day"를 반환해야 함', () => {
    expect(formatDDay(0)).toBe('D-Day');
  });
});

describe('isValidDate', () => {
  it('유효한 날짜에 대해 true를 반환해야 함', () => {
    expect(isValidDate(new Date('2024-01-01'))).toBe(true);
    expect(isValidDate(new Date())).toBe(true);
  });

  it('유효하지 않은 날짜에 대해 false를 반환해야 함', () => {
    expect(isValidDate(new Date('invalid'))).toBe(false);
    expect(isValidDate(new Date('2024-13-01'))).toBe(false);
  });
});

describe('isFutureDate', () => {
  it('미래 날짜에 대해 true를 반환해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const futureDate = new Date('2024-12-31');
    expect(isFutureDate(futureDate, baseDate)).toBe(true);
  });

  it('과거 날짜에 대해 false를 반환해야 함', () => {
    const baseDate = new Date('2024-12-31');
    const pastDate = new Date('2024-01-01');
    expect(isFutureDate(pastDate, baseDate)).toBe(false);
  });

  it('동일 날짜에 대해 false를 반환해야 함', () => {
    const baseDate = new Date('2024-01-01');
    const sameDate = new Date('2024-01-01');
    expect(isFutureDate(sameDate, baseDate)).toBe(false);
  });
});
