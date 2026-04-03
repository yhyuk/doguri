/**
 * 색상 변환 유틸리티
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * HEX 형식 검증
 * @param hex HEX 색상 문자열 (#RGB, #RRGGBB 형식)
 */
export function validateHex(hex: string): boolean {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
}

/**
 * HEX를 RGB로 변환
 * @param hex HEX 색상 문자열 (#RGB 또는 #RRGGBB)
 */
export function hexToRgb(hex: string): RGB | null {
  // # 제거
  const cleanHex = hex.replace('#', '');

  if (!validateHex(hex)) {
    return null;
  }

  // 3자리 HEX를 6자리로 확장 (#RGB -> #RRGGBB)
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * RGB를 HEX로 변환
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  // 값의 범위를 0-255로 제한
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

  const toHex = (value: number) => {
    const hex = clamp(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * RGB를 HSL로 변환
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  // RGB 값을 0-1 범위로 정규화
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * HSL을 RGB로 변환
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  // 정규화
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r: number, g: number, b: number;

  if (sNorm === 0) {
    // 채도가 0이면 회색
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = lNorm < 0.5
      ? lNorm * (1 + sNorm)
      : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;

    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * HEX를 HSL로 변환
 * @param hex HEX 색상 문자열
 */
export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return null;
  }
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/**
 * HSL을 HEX로 변환
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * 랜덤 HEX 색상 생성
 */
export function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}
