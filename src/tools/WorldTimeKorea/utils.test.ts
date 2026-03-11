import { describe, it, expect } from 'vitest';
import {
  getOffsetFromKST,
  formatOffsetFromKST,
  getCityTimeDisplay,
  formatKSTTime
} from './utils';
import type { CityTime } from './types';

describe('WorldTimeKorea utils', () => {
  describe('formatOffsetFromKST', () => {
    it('should format positive offset', () => {
      expect(formatOffsetFromKST(1)).toBe('+1시간');
      expect(formatOffsetFromKST(5)).toBe('+5시간');
    });

    it('should format negative offset', () => {
      expect(formatOffsetFromKST(-1)).toBe('-1시간');
      expect(formatOffsetFromKST(-9)).toBe('-9시간');
    });

    it('should format zero offset', () => {
      expect(formatOffsetFromKST(0)).toBe('동일');
    });
  });

  describe('getOffsetFromKST', () => {
    it('should calculate offset for Tokyo (same as KST)', () => {
      const offset = getOffsetFromKST('Asia/Tokyo');
      expect(offset).toBe(0);
    });

    it('should calculate offset for different timezone', () => {
      // Test with a known timezone
      const offset = getOffsetFromKST('Asia/Shanghai');
      // Shanghai is UTC+8, KST is UTC+9, but they're in the same offset during standard time
      expect(typeof offset).toBe('number');
    });
  });

  describe('getCityTimeDisplay', () => {
    it('should return city time display with all fields', () => {
      const city: CityTime = {
        name: '도쿄',
        timezone: 'Asia/Tokyo',
        region: 'asia'
      };

      const testDate = new Date('2024-03-15T12:00:00Z');
      const display = getCityTimeDisplay(city, testDate);

      expect(display.name).toBe('도쿄');
      expect(display.timezone).toBe('Asia/Tokyo');
      expect(display.region).toBe('asia');
      expect(display.timeString).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(display.dateString).toMatch(/^\d{4}년 \d{2}월 \d{2}일$/);
      expect(display.offsetFromKST).toBe('동일');
      expect(display.offsetHours).toBe(0);
    });
  });

  describe('formatKSTTime', () => {
    it('should return formatted KST time with all fields', () => {
      const testDate = new Date('2024-03-15T12:00:00Z');
      const formatted = formatKSTTime(testDate);

      expect(formatted.timeString).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(formatted.dateString).toMatch(/^\d{4}년 \d{2}월 \d{2}일$/);
      expect(formatted.dayOfWeek).toBeTruthy();
      expect(typeof formatted.dayOfWeek).toBe('string');
    });
  });
});
