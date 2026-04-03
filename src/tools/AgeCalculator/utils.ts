/**
 * 나이 계산 유틸리티
 * date-fns를 활용한 다양한 나이 계산 기능 제공
 */

import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  startOfDay,
  addYears,
  isBefore,
  isAfter,
  parseISO,
  isValid,
  format
} from 'date-fns';

export interface AgeResult {
  koreanAge: number;
  internationalAge: number;
  ageInMonths: number;
  ageInDays: number;
  daysUntilBirthday: number;
  nextBirthdayDate: string;
}

/**
 * 연 나이 (한국식 나이) 계산
 * 현재 연도 - 출생 연도 + 1
 */
export function calculateKoreanAge(birthDate: Date, baseDate: Date = new Date()): number {
  const birthYear = birthDate.getFullYear();
  const baseYear = baseDate.getFullYear();
  return baseYear - birthYear + 1;
}

/**
 * 만 나이 (국제 나이) 계산
 * 생일이 지났는지 여부를 고려한 정확한 나이
 */
export function calculateInternationalAge(birthDate: Date, baseDate: Date = new Date()): number {
  return differenceInYears(startOfDay(baseDate), startOfDay(birthDate));
}

/**
 * 태어난 이후 총 개월 수 계산
 */
export function calculateAgeInMonths(birthDate: Date, baseDate: Date = new Date()): number {
  return differenceInMonths(startOfDay(baseDate), startOfDay(birthDate));
}

/**
 * 태어난 이후 총 일 수 계산
 */
export function calculateAgeInDays(birthDate: Date, baseDate: Date = new Date()): number {
  return differenceInDays(startOfDay(baseDate), startOfDay(birthDate));
}

/**
 * 다음 생일까지 남은 일수 계산
 */
export function calculateDaysUntilBirthday(birthDate: Date, baseDate: Date = new Date()): number {
  const birth = startOfDay(birthDate);
  const base = startOfDay(baseDate);

  // 올해 생일
  const thisYearBirthday = new Date(base.getFullYear(), birth.getMonth(), birth.getDate());

  // 올해 생일이 지났으면 내년 생일 기준
  let nextBirthday: Date;
  if (isBefore(thisYearBirthday, base)) {
    nextBirthday = addYears(thisYearBirthday, 1);
  } else {
    nextBirthday = thisYearBirthday;
  }

  return differenceInDays(nextBirthday, base);
}

/**
 * 다음 생일 날짜 반환
 */
export function getNextBirthdayDate(birthDate: Date, baseDate: Date = new Date()): Date {
  const birth = startOfDay(birthDate);
  const base = startOfDay(baseDate);

  // 올해 생일
  const thisYearBirthday = startOfDay(new Date(base.getFullYear(), birth.getMonth(), birth.getDate()));

  // 올해 생일이 지났거나 오늘이면 내년 생일 반환
  if (isBefore(thisYearBirthday, base) || thisYearBirthday.getTime() === base.getTime()) {
    return addYears(thisYearBirthday, 1);
  }

  return thisYearBirthday;
}

/**
 * 날짜 문자열 검증
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return isValid(date);
}

/**
 * 생년월일이 미래 날짜인지 확인
 */
export function isFutureDate(birthDate: Date, baseDate: Date = new Date()): boolean {
  return isAfter(startOfDay(birthDate), startOfDay(baseDate));
}

/**
 * 종합 나이 계산
 */
export function calculateAllAges(birthDate: Date, baseDate: Date = new Date()): AgeResult {
  const nextBirthday = getNextBirthdayDate(birthDate, baseDate);

  return {
    koreanAge: calculateKoreanAge(birthDate, baseDate),
    internationalAge: calculateInternationalAge(birthDate, baseDate),
    ageInMonths: calculateAgeInMonths(birthDate, baseDate),
    ageInDays: calculateAgeInDays(birthDate, baseDate),
    daysUntilBirthday: calculateDaysUntilBirthday(birthDate, baseDate),
    nextBirthdayDate: format(nextBirthday, 'yyyy-MM-dd')
  };
}
