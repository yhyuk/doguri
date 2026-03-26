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
  // Format both times to get the actual time strings
  const kstTimeStr = formatInTimeZone(date, KST_TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
  const targetTimeStr = formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ss');

  // Parse back to dates for comparison
  const kstDate = new Date(kstTimeStr);
  const targetDate = new Date(targetTimeStr);

  // Calculate difference in hours
  const diffMs = targetDate.getTime() - kstDate.getTime();
  return diffMs / (1000 * 60 * 60);
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
    offsetHours,
    isBusinessHours: isBusinessHours(currentDate, city.timezone),
    timePeriod: getTimePeriod(currentDate, city.timezone)
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

/**
 * Determine if a time is during business hours (9:00-18:00)
 */
export function isBusinessHours(date: Date, timezone: string): boolean {
  const hour = parseInt(formatInTimeZone(date, timezone, 'HH'), 10);
  return hour >= 9 && hour < 18;
}

/**
 * Get time period label (morning, afternoon, evening, night, dawn)
 */
export function getTimePeriod(date: Date, timezone: string): 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = parseInt(formatInTimeZone(date, timezone, 'HH'), 10);

  if (hour >= 0 && hour < 6) return 'dawn';
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}
