import { describe, it, expect } from 'vitest';
import {
  validateHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  generateRandomColor
} from './utils';

describe('ColorPicker utils', () => {
  describe('validateHex', () => {
    it('유효한 6자리 HEX를 검증해야 함', () => {
      expect(validateHex('#FF5733')).toBe(true);
      expect(validateHex('#000000')).toBe(true);
      expect(validateHex('#FFFFFF')).toBe(true);
      expect(validateHex('FF5733')).toBe(true); // # 없이도 가능
    });

    it('유효한 3자리 HEX를 검증해야 함', () => {
      expect(validateHex('#FFF')).toBe(true);
      expect(validateHex('#000')).toBe(true);
      expect(validateHex('ABC')).toBe(true);
    });

    it('유효하지 않은 HEX를 거부해야 함', () => {
      expect(validateHex('#GGGGGG')).toBe(false);
      expect(validateHex('#12345')).toBe(false); // 5자리
      expect(validateHex('#1234567')).toBe(false); // 7자리
      expect(validateHex('not-a-color')).toBe(false);
      expect(validateHex('')).toBe(false);
    });
  });

  describe('hexToRgb', () => {
    it('6자리 HEX를 RGB로 변환해야 함', () => {
      expect(hexToRgb('#FF5733')).toEqual({ r: 255, g: 87, b: 51 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('FF5733')).toEqual({ r: 255, g: 87, b: 51 }); // # 없이
    });

    it('3자리 HEX를 RGB로 변환해야 함', () => {
      expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#F53')).toEqual({ r: 255, g: 85, b: 51 });
    });

    it('유효하지 않은 HEX에 대해 null을 반환해야 함', () => {
      expect(hexToRgb('invalid')).toBe(null);
      expect(hexToRgb('#GGGGGG')).toBe(null);
      expect(hexToRgb('')).toBe(null);
    });

    it('대소문자 구분 없이 변환해야 함', () => {
      expect(hexToRgb('#ff5733')).toEqual({ r: 255, g: 87, b: 51 });
      expect(hexToRgb('#FF5733')).toEqual({ r: 255, g: 87, b: 51 });
    });
  });

  describe('rgbToHex', () => {
    it('RGB를 HEX로 변환해야 함', () => {
      expect(rgbToHex(255, 87, 51)).toBe('#FF5733');
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
    });

    it('범위를 벗어난 값을 클램핑해야 함', () => {
      expect(rgbToHex(300, 87, 51)).toBe('#FF5733'); // 300 -> 255
      expect(rgbToHex(-10, 87, 51)).toBe('#005733'); // -10 -> 0
      expect(rgbToHex(255, 300, -10)).toBe('#FFFF00'); // 300 -> 255, -10 -> 0
    });

    it('소수점 값을 반올림해야 함', () => {
      expect(rgbToHex(255.7, 87.3, 51.5)).toBe('#FF5734');
    });
  });

  describe('rgbToHsl', () => {
    it('RGB를 HSL로 변환해야 함', () => {
      const result = rgbToHsl(255, 87, 51);
      expect(result.h).toBeCloseTo(11, 0); // 허용 오차 내에서
      expect(result.s).toBeGreaterThan(90);
      expect(result.l).toBeGreaterThan(50);
    });

    it('흰색을 변환해야 함', () => {
      const result = rgbToHsl(255, 255, 255);
      expect(result).toEqual({ h: 0, s: 0, l: 100 });
    });

    it('검은색을 변환해야 함', () => {
      const result = rgbToHsl(0, 0, 0);
      expect(result).toEqual({ h: 0, s: 0, l: 0 });
    });

    it('회색을 변환해야 함', () => {
      const result = rgbToHsl(128, 128, 128);
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBeCloseTo(50, 0);
    });

    it('순수 빨강을 변환해야 함', () => {
      const result = rgbToHsl(255, 0, 0);
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('순수 녹색을 변환해야 함', () => {
      const result = rgbToHsl(0, 255, 0);
      expect(result.h).toBe(120);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('순수 파랑을 변환해야 함', () => {
      const result = rgbToHsl(0, 0, 255);
      expect(result.h).toBe(240);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });
  });

  describe('hslToRgb', () => {
    it('HSL을 RGB로 변환해야 함', () => {
      const result = hslToRgb(11, 100, 60);
      expect(result.r).toBeGreaterThan(250);
      expect(result.g).toBeGreaterThan(70);
      expect(result.g).toBeLessThan(100);
      expect(result.b).toBeGreaterThan(45);
      expect(result.b).toBeLessThan(65);
    });

    it('흰색을 변환해야 함', () => {
      const result = hslToRgb(0, 0, 100);
      expect(result).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('검은색을 변환해야 함', () => {
      const result = hslToRgb(0, 0, 0);
      expect(result).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('회색을 변환해야 함', () => {
      const result = hslToRgb(0, 0, 50);
      expect(result.r).toBeCloseTo(128, 1);
      expect(result.g).toBeCloseTo(128, 1);
      expect(result.b).toBeCloseTo(128, 1);
    });

    it('순수 빨강을 변환해야 함', () => {
      const result = hslToRgb(0, 100, 50);
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('순수 녹색을 변환해야 함', () => {
      const result = hslToRgb(120, 100, 50);
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('순수 파랑을 변환해야 함', () => {
      const result = hslToRgb(240, 100, 50);
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });
  });

  describe('hexToHsl', () => {
    it('HEX를 HSL로 변환해야 함', () => {
      const result = hexToHsl('#FF5733');
      expect(result).not.toBe(null);
      expect(result!.h).toBeCloseTo(11, 0);
      expect(result!.s).toBeGreaterThan(90);
    });

    it('유효하지 않은 HEX에 대해 null을 반환해야 함', () => {
      expect(hexToHsl('invalid')).toBe(null);
    });
  });

  describe('hslToHex', () => {
    it('HSL을 HEX로 변환해야 함', () => {
      const result = hslToHex(0, 100, 50);
      expect(result).toBe('#FF0000');
    });

    it('흰색을 변환해야 함', () => {
      expect(hslToHex(0, 0, 100)).toBe('#FFFFFF');
    });

    it('검은색을 변환해야 함', () => {
      expect(hslToHex(0, 0, 0)).toBe('#000000');
    });
  });

  describe('색상 변환 왕복 테스트', () => {
    it('HEX -> RGB -> HEX 변환이 일관성 있어야 함', () => {
      const originalHex = '#FF5733';
      const rgb = hexToRgb(originalHex);
      expect(rgb).not.toBe(null);
      const convertedHex = rgbToHex(rgb!.r, rgb!.g, rgb!.b);
      expect(convertedHex).toBe(originalHex);
    });

    it('RGB -> HSL -> RGB 변환이 근사적으로 일관성 있어야 함', () => {
      const originalRgb = { r: 255, g: 87, b: 51 };
      const hsl = rgbToHsl(originalRgb.r, originalRgb.g, originalRgb.b);
      const convertedRgb = hslToRgb(hsl.h, hsl.s, hsl.l);

      // 반올림 오차를 고려하여 근사값 비교 (±2 허용)
      expect(convertedRgb.r).toBeCloseTo(originalRgb.r, -1);
      expect(convertedRgb.g).toBeCloseTo(originalRgb.g, -1);
      expect(convertedRgb.b).toBeCloseTo(originalRgb.b, -1);
    });

    it('HEX -> HSL -> HEX 변환이 근사적으로 일관성 있어야 함', () => {
      const originalHex = '#FF5733';
      const hsl = hexToHsl(originalHex);
      expect(hsl).not.toBe(null);
      const convertedHex = hslToHex(hsl!.h, hsl!.s, hsl!.l);

      // 색상 값이 거의 동일해야 함 (반올림 오차 ±2 허용)
      const originalRgb = hexToRgb(originalHex);
      const convertedRgb = hexToRgb(convertedHex);
      expect(convertedRgb!.r).toBeCloseTo(originalRgb!.r, -1);
      expect(convertedRgb!.g).toBeCloseTo(originalRgb!.g, -1);
      expect(convertedRgb!.b).toBeCloseTo(originalRgb!.b, -1);
    });
  });

  describe('generateRandomColor', () => {
    it('유효한 HEX 색상을 생성해야 함', () => {
      const color = generateRandomColor();
      expect(validateHex(color)).toBe(true);
    });

    it('# 기호로 시작해야 함', () => {
      const color = generateRandomColor();
      expect(color.startsWith('#')).toBe(true);
    });

    it('7자리여야 함 (#RRGGBB)', () => {
      const color = generateRandomColor();
      expect(color).toHaveLength(7);
    });

    it('매번 다른 색상을 생성할 수 있어야 함', () => {
      const colors = new Set();
      for (let i = 0; i < 10; i++) {
        colors.add(generateRandomColor());
      }
      // 10개 중 최소 5개는 달라야 함 (충돌 가능성 고려)
      expect(colors.size).toBeGreaterThanOrEqual(5);
    });

    it('생성된 색상이 RGB로 변환 가능해야 함', () => {
      const color = generateRandomColor();
      const rgb = hexToRgb(color);
      expect(rgb).not.toBe(null);
      expect(rgb!.r).toBeGreaterThanOrEqual(0);
      expect(rgb!.r).toBeLessThanOrEqual(255);
      expect(rgb!.g).toBeGreaterThanOrEqual(0);
      expect(rgb!.g).toBeLessThanOrEqual(255);
      expect(rgb!.b).toBeGreaterThanOrEqual(0);
      expect(rgb!.b).toBeLessThanOrEqual(255);
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열을 처리해야 함', () => {
      expect(validateHex('')).toBe(false);
      expect(hexToRgb('')).toBe(null);
      expect(hexToHsl('')).toBe(null);
    });

    it('# 기호만 있는 경우를 처리해야 함', () => {
      expect(validateHex('#')).toBe(false);
      expect(hexToRgb('#')).toBe(null);
    });

    it('극단적인 RGB 값을 처리해야 함', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
    });

    it('극단적인 HSL 값을 처리해야 함', () => {
      const rgb1 = hslToRgb(0, 0, 0);
      expect(rgb1).toEqual({ r: 0, g: 0, b: 0 });

      const rgb2 = hslToRgb(360, 100, 100);
      expect(rgb2).toEqual({ r: 255, g: 255, b: 255 });
    });
  });
});
