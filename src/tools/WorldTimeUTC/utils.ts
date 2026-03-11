import { format, formatISO, fromUnixTime, getUnixTime, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import type { UnixTimestampResult, LocalToUTCResult } from './types';

const UTC_TIMEZONE = 'UTC';

/**
 * Get current UTC time
 */
export function getCurrentUTC(): Date {
  return toZonedTime(new Date(), UTC_TIMEZONE);
}

/**
 * Format UTC time as string
 */
export function formatUTCTime(date: Date = new Date()): {
  timeString: string;
  dateString: string;
  iso8601: string;
} {
  return {
    timeString: formatInTimeZone(date, UTC_TIMEZONE, 'HH:mm:ss'),
    dateString: formatInTimeZone(date, UTC_TIMEZONE, 'yyyy-MM-dd'),
    iso8601: formatISO(date)
  };
}

/**
 * Convert unix timestamp to datetime
 */
export function unixToDateTime(timestamp: number): UnixTimestampResult {
  const date = fromUnixTime(timestamp);
  return {
    timestamp,
    dateTime: format(date, 'yyyy-MM-dd HH:mm:ss'),
    iso8601: formatISO(date)
  };
}

/**
 * Convert datetime to unix timestamp
 */
export function dateTimeToUnix(dateTime: Date): number {
  return getUnixTime(dateTime);
}

/**
 * Parse ISO 8601 string to Date
 */
export function parseISO8601(isoString: string): Date | null {
  try {
    const date = parseISO(isoString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

/**
 * Format date as ISO 8601 string
 */
export function formatAsISO8601(date: Date): string {
  return formatISO(date);
}

/**
 * Convert local time to UTC
 */
export function localToUTC(localDate: Date, timezone: string): LocalToUTCResult {
  const utcDate = toZonedTime(localDate, UTC_TIMEZONE);

  return {
    localTime: formatInTimeZone(localDate, timezone, 'yyyy-MM-dd HH:mm:ss'),
    utcTime: formatInTimeZone(utcDate, UTC_TIMEZONE, 'yyyy-MM-dd HH:mm:ss'),
    iso8601: formatISO(utcDate)
  };
}

/**
 * Get time difference in hours between UTC and a timezone
 */
export function getUTCOffset(timezone: string, date: Date = new Date()): number {
  const localTime = toZonedTime(date, timezone);
  const offset = localTime.getTimezoneOffset();
  return -offset / 60; // Reverse sign because getTimezoneOffset is negative for ahead
}

/**
 * Format UTC offset as string (e.g., "+09:00", "-05:00")
 */
export function formatUTCOffset(offsetHours: number): string {
  const sign = offsetHours >= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetHours);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);

  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Validate if a string is a valid unix timestamp
 */
export function isValidUnixTimestamp(value: string): boolean {
  if (!value || value.trim() === '') return false;

  const num = Number(value);
  if (isNaN(num)) return false;

  // Check if timestamp is in reasonable range (1970-2100)
  const minTimestamp = 0;
  const maxTimestamp = 4102444800; // 2100-01-01

  return num >= minTimestamp && num <= maxTimestamp;
}

/**
 * Validate if a string is a valid ISO 8601 format
 */
export function isValidISO8601(value: string): boolean {
  try {
    const date = parseISO(value);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Get current unix timestamp
 */
export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
