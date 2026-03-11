import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import type { CityTime, CityTimeDisplay } from './types';
import { KST_TIMEZONE } from './constants';

/**
 * Get current time in Korean Standard Time (KST)
 */
export function getKSTTime(): Date {
  return toZonedTime(new Date(), KST_TIMEZONE);
}

/**
 * Format time in a specific timezone
 */
export function formatTimeInTimezone(date: Date, timezone: string, format: string): string {
  return formatInTimeZone(date, timezone, format);
}

/**
 * Calculate time difference in hours between KST and another timezone
 */
export function getOffsetFromKST(timezone: string, date: Date = new Date()): number {
  const kstTime = toZonedTime(date, KST_TIMEZONE);
  const targetTime = toZonedTime(date, timezone);

  // Get UTC offsets
  const kstOffset = kstTime.getTimezoneOffset();
  const targetOffset = targetTime.getTimezoneOffset();

  // Calculate difference (reverse sign because getTimezoneOffset is negative for ahead)
  const diffMinutes = kstOffset - targetOffset;
  return diffMinutes / 60;
}

/**
 * Format offset as a string (e.g., "+9시간", "-5시간")
 */
export function formatOffsetFromKST(offsetHours: number): string {
  if (offsetHours === 0) {
    return '동일';
  }

  const sign = offsetHours > 0 ? '+' : '';
  return `${sign}${offsetHours}시간`;
}

/**
 * Get display information for a city's current time
 */
export function getCityTimeDisplay(city: CityTime, currentDate: Date = new Date()): CityTimeDisplay {
  const cityTime = toZonedTime(currentDate, city.timezone);
  const offsetHours = getOffsetFromKST(city.timezone, currentDate);

  return {
    ...city,
    currentTime: cityTime,
    timeString: formatInTimeZone(currentDate, city.timezone, 'HH:mm:ss'),
    dateString: formatInTimeZone(currentDate, city.timezone, 'yyyy년 MM월 dd일'),
    offsetFromKST: formatOffsetFromKST(offsetHours),
    offsetHours
  };
}

/**
 * Get display information for multiple cities
 */
export function getCitiesTimeDisplay(cities: CityTime[], currentDate: Date = new Date()): CityTimeDisplay[] {
  return cities.map(city => getCityTimeDisplay(city, currentDate));
}

/**
 * Format KST time for display
 */
export function formatKSTTime(date: Date = new Date()): {
  timeString: string;
  dateString: string;
  dayOfWeek: string;
} {
  return {
    timeString: formatInTimeZone(date, KST_TIMEZONE, 'HH:mm:ss'),
    dateString: formatInTimeZone(date, KST_TIMEZONE, 'yyyy년 MM월 dd일'),
    dayOfWeek: formatInTimeZone(date, KST_TIMEZONE, 'EEEE')
  };
}
