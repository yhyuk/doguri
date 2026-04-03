/**
 * 나이 계산 유틸리티 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  calculateKoreanAge,
  calculateInternationalAge,
  calculateAgeInMonths,
  calculateAgeInDays,
  calculateDaysUntilBirthday,
  getNextBirthdayDate,
  isValidDateString,
  isFutureDate,
  calculateAllAges
} from './utils';

describe('calculateKoreanAge', () => {
  it('현재 연도 - 출생 연도 + 1을 반환해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-03-20');
    const age = calculateKoreanAge(birthDate, baseDate);
    expect(age).toBe(35); // 2024 - 1990 + 1 = 35
  });

  it('생일 전후에 상관없이 같은 연 나이를 반환해야 함', () => {
    const birthDate = new Date('1990-12-31');
    const beforeBirthday = new Date('2024-01-01');
    const afterBirthday = new Date('2024-12-31');

    expect(calculateKoreanAge(birthDate, beforeBirthday)).toBe(35);
    expect(calculateKoreanAge(birthDate, afterBirthday)).toBe(35);
  });

  it('동일 연도에 태어났으면 1세를 반환해야 함', () => {
    const birthDate = new Date('2024-01-01');
    const baseDate = new Date('2024-12-31');
    expect(calculateKoreanAge(birthDate, baseDate)).toBe(1);
  });
});

describe('calculateInternationalAge', () => {
  it('생일이 지난 경우 정확한 만 나이를 반환해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-06-20');
    const age = calculateInternationalAge(birthDate, baseDate);
    expect(age).toBe(34);
  });

  it('생일이 오지 않은 경우 이전 나이를 반환해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-03-10');
    const age = calculateInternationalAge(birthDate, baseDate);
    expect(age).toBe(33);
  });

  it('오늘이 생일인 경우 만 나이가 증가해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-05-15');
    const age = calculateInternationalAge(birthDate, baseDate);
    expect(age).toBe(34);
  });

  it('0세를 정확히 계산해야 함', () => {
    const birthDate = new Date('2024-01-01');
    const baseDate = new Date('2024-06-15');
    const age = calculateInternationalAge(birthDate, baseDate);
    expect(age).toBe(0);
  });

  it('생일 하루 전에는 이전 나이를 유지해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-05-14');
    const age = calculateInternationalAge(birthDate, baseDate);
    expect(age).toBe(33);
  });
});

describe('calculateAgeInMonths', () => {
  it('정확한 개월 수를 계산해야 함', () => {
    const birthDate = new Date('2020-01-15');
    const baseDate = new Date('2024-01-15');
    const months = calculateAgeInMonths(birthDate, baseDate);
    expect(months).toBe(48); // 4년 = 48개월
  });

  it('1년 미만의 개월 수를 정확히 계산해야 함', () => {
    const birthDate = new Date('2024-01-01');
    const baseDate = new Date('2024-07-01');
    const months = calculateAgeInMonths(birthDate, baseDate);
    expect(months).toBe(6);
  });

  it('0개월을 반환할 수 있어야 함', () => {
    const birthDate = new Date('2024-01-15');
    const baseDate = new Date('2024-01-20');
    const months = calculateAgeInMonths(birthDate, baseDate);
    expect(months).toBe(0);
  });
});

describe('calculateAgeInDays', () => {
  it('정확한 일 수를 계산해야 함', () => {
    const birthDate = new Date('2024-01-01');
    const baseDate = new Date('2024-01-11');
    const days = calculateAgeInDays(birthDate, baseDate);
    expect(days).toBe(10);
  });

  it('1년의 일 수를 정확히 계산해야 함', () => {
    const birthDate = new Date('2023-01-01');
    const baseDate = new Date('2024-01-01');
    const days = calculateAgeInDays(birthDate, baseDate);
    expect(days).toBe(365);
  });

  it('윤년을 고려해야 함', () => {
    const birthDate = new Date('2020-01-01');
    const baseDate = new Date('2021-01-01');
    const days = calculateAgeInDays(birthDate, baseDate);
    expect(days).toBe(366); // 2020년은 윤년
  });

  it('0일을 반환할 수 있어야 함', () => {
    const birthDate = new Date('2024-01-01');
    const baseDate = new Date('2024-01-01');
    const days = calculateAgeInDays(birthDate, baseDate);
    expect(days).toBe(0);
  });
});

describe('calculateDaysUntilBirthday', () => {
  it('생일이 지나면 내년 생일까지의 일수를 계산해야 함', () => {
    const birthDate = new Date('1990-01-15');
    const baseDate = new Date('2024-02-01');
    const days = calculateDaysUntilBirthday(birthDate, baseDate);
    expect(days).toBeGreaterThan(300); // 약 348일
  });

  it('생일이 오지 않았으면 올해 생일까지의 일수를 계산해야 함', () => {
    const birthDate = new Date('1990-12-31');
    const baseDate = new Date('2024-01-01');
    const days = calculateDaysUntilBirthday(birthDate, baseDate);
    expect(days).toBe(365); // 윤년이므로 366일 - 1일 = 365일
  });

  it('오늘이 생일이면 0을 반환해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-05-15');
    const days = calculateDaysUntilBirthday(birthDate, baseDate);
    expect(days).toBe(0);
  });

  it('생일 하루 전에는 1을 반환해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-05-14');
    const days = calculateDaysUntilBirthday(birthDate, baseDate);
    expect(days).toBe(1);
  });
});

describe('getNextBirthdayDate', () => {
  it('생일이 지났으면 내년 생일 날짜를 반환해야 함', () => {
    const birthDate = new Date('1990-01-15');
    const baseDate = new Date('2024-02-01');
    const nextBirthday = getNextBirthdayDate(birthDate, baseDate);
    expect(nextBirthday.getFullYear()).toBe(2025);
    expect(nextBirthday.getMonth()).toBe(0); // 1월 (0-indexed)
    expect(nextBirthday.getDate()).toBe(15);
  });

  it('생일이 오지 않았으면 올해 생일 날짜를 반환해야 함', () => {
    const birthDate = new Date('1990-12-31');
    const baseDate = new Date('2024-01-01');
    const nextBirthday = getNextBirthdayDate(birthDate, baseDate);
    expect(nextBirthday.getFullYear()).toBe(2024);
    expect(nextBirthday.getMonth()).toBe(11); // 12월 (0-indexed)
    expect(nextBirthday.getDate()).toBe(31);
  });

  it('오늘이 생일이면 내년 생일을 반환해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-05-15');
    const nextBirthday = getNextBirthdayDate(birthDate, baseDate);
    expect(nextBirthday.getFullYear()).toBe(2025);
    expect(nextBirthday.getMonth()).toBe(4); // 5월 (0-indexed)
    expect(nextBirthday.getDate()).toBe(15);
  });
});

describe('isValidDateString', () => {
  it('유효한 날짜 문자열에 대해 true를 반환해야 함', () => {
    expect(isValidDateString('2024-01-15')).toBe(true);
    expect(isValidDateString('1990-12-31')).toBe(true);
  });

  it('유효하지 않은 날짜 문자열에 대해 false를 반환해야 함', () => {
    expect(isValidDateString('invalid')).toBe(false);
    expect(isValidDateString('2024-13-01')).toBe(false);
    expect(isValidDateString('2024-02-30')).toBe(false);
  });

  it('빈 문자열에 대해 false를 반환해야 함', () => {
    expect(isValidDateString('')).toBe(false);
  });
});

describe('isFutureDate', () => {
  it('미래 날짜에 대해 true를 반환해야 함', () => {
    const birthDate = new Date('2025-01-01');
    const baseDate = new Date('2024-01-01');
    expect(isFutureDate(birthDate, baseDate)).toBe(true);
  });

  it('과거 날짜에 대해 false를 반환해야 함', () => {
    const birthDate = new Date('2023-01-01');
    const baseDate = new Date('2024-01-01');
    expect(isFutureDate(birthDate, baseDate)).toBe(false);
  });

  it('동일 날짜에 대해 false를 반환해야 함', () => {
    const birthDate = new Date('2024-01-01');
    const baseDate = new Date('2024-01-01');
    expect(isFutureDate(birthDate, baseDate)).toBe(false);
  });
});

describe('calculateAllAges', () => {
  it('모든 나이 정보를 포함한 객체를 반환해야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-03-20');
    const result = calculateAllAges(birthDate, baseDate);

    expect(result).toHaveProperty('koreanAge');
    expect(result).toHaveProperty('internationalAge');
    expect(result).toHaveProperty('ageInMonths');
    expect(result).toHaveProperty('ageInDays');
    expect(result).toHaveProperty('daysUntilBirthday');
    expect(result).toHaveProperty('nextBirthdayDate');
  });

  it('각 필드가 올바른 값을 가져야 함', () => {
    const birthDate = new Date('1990-05-15');
    const baseDate = new Date('2024-06-20');
    const result = calculateAllAges(birthDate, baseDate);

    expect(result.koreanAge).toBe(35);
    expect(result.internationalAge).toBe(34);
    expect(result.ageInMonths).toBeGreaterThan(400);
    expect(result.ageInDays).toBeGreaterThan(12000);
    expect(result.daysUntilBirthday).toBeGreaterThan(0);
    // 생일(05-15)이 지났으므로 내년 생일을 반환
    const nextBirthdayYear = new Date(result.nextBirthdayDate).getFullYear();
    expect(nextBirthdayYear).toBe(2025);
    expect(result.nextBirthdayDate).toContain('05-15');
  });
});
