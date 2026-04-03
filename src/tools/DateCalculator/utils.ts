/**
 * 날짜 계산 유틸리티
 * date-fns를 활용한 다양한 날짜 계산 기능 제공
 */

import {
  differenceInDays,
  differenceInCalendarDays,
  differenceInYears,
  differenceInMonths,
  add,
  sub,
  format,
  startOfDay,
  isBefore,
  isAfter
} from 'date-fns';

export interface DateDifference {
  years: number;
  months: number;
  days: number;
}

/**
 * D-day 계산
 * 양수: 목표 날짜까지 남은 일수
 * 음수: 목표 날짜가 지난 일수
 * 0: 오늘이 목표 날짜
 */
export function calculateDDay(targetDate: Date, baseDate: Date = new Date()): number {
  const target = startOfDay(targetDate);
  const base = startOfDay(baseDate);
  return differenceInCalendarDays(target, base);
}

/**
 * 두 날짜 사이의 정확한 기간 계산
 * 년, 월, 일 단위로 분리하여 반환
 */
export function calculateDateDifference(date1: Date, date2: Date): DateDifference {
  // 시작 날짜와 종료 날짜 정렬 (항상 빠른 날짜가 start)
  const start = startOfDay(isBefore(date1, date2) ? date1 : date2);
  const end = startOfDay(isBefore(date1, date2) ? date2 : date1);

  // 년 단위 차이
  const years = differenceInYears(end, start);

  // 년 단위를 제외한 나머지에서 월 단위 차이 계산
  const afterYears = add(start, { years });
  const months = differenceInMonths(end, afterYears);

  // 년, 월 단위를 제외한 나머지 일 수 계산
  const afterMonths = add(afterYears, { months });
  const days = differenceInDays(end, afterMonths);

  return {
    years,
    months,
    days
  };
}

/**
 * N일 후의 날짜 계산
 */
export function addDays(baseDate: Date, days: number): Date {
  return add(startOfDay(baseDate), { days });
}

/**
 * N일 전의 날짜 계산
 */
export function subtractDays(baseDate: Date, days: number): Date {
  return sub(startOfDay(baseDate), { days });
}

/**
 * 날짜를 포맷팅하여 반환 (YYYY-MM-DD)
 */
export function formatDateResult(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 날짜 차이를 텍스트로 포맷팅
 */
export function formatDateDifference(diff: DateDifference): string {
  const parts: string[] = [];

  if (diff.years > 0) {
    parts.push(`${diff.years}년`);
  }
  if (diff.months > 0) {
    parts.push(`${diff.months}개월`);
  }
  if (diff.days > 0) {
    parts.push(`${diff.days}일`);
  }

  return parts.length > 0 ? parts.join(' ') : '0일';
}

/**
 * D-day를 텍스트로 포맷팅
 */
export function formatDDay(dday: number): string {
  if (dday > 0) {
    return `D-${dday}`;
  } else if (dday < 0) {
    return `D+${Math.abs(dday)}`;
  } else {
    return 'D-Day';
  }
}

/**
 * 날짜 유효성 검증
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 날짜 문자열이 미래인지 확인
 */
export function isFutureDate(date: Date, baseDate: Date = new Date()): boolean {
  return isAfter(startOfDay(date), startOfDay(baseDate));
}
