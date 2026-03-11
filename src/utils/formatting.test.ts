import { describe, it, expect } from 'vitest';
import { addCommas, removeCommas, formatCurrency } from './formatting';

describe('addCommas', () => {
  it('should add commas to integers', () => {
    expect(addCommas(1234567)).toBe('1,234,567');
    expect(addCommas(1000)).toBe('1,000');
    expect(addCommas(100)).toBe('100');
    expect(addCommas(0)).toBe('0');
  });

  it('should add commas to decimal numbers', () => {
    expect(addCommas(1234567.89)).toBe('1,234,567.89');
    expect(addCommas(1000.5)).toBe('1,000.5');
    expect(addCommas(123.456789)).toBe('123.456789');
  });

  it('should handle string inputs', () => {
    expect(addCommas('1234567')).toBe('1,234,567');
    expect(addCommas('1234567.89')).toBe('1,234,567.89');
  });

  it('should handle negative numbers', () => {
    expect(addCommas(-1234567)).toBe('-1,234,567');
    expect(addCommas(-1000.5)).toBe('-1,000.5');
  });

  it('should handle edge cases', () => {
    expect(addCommas(0)).toBe('0');
    expect(addCommas('')).toBe('');
  });
});

describe('removeCommas', () => {
  it('should remove all commas from string', () => {
    expect(removeCommas('1,234,567')).toBe('1234567');
    expect(removeCommas('1,234,567.89')).toBe('1234567.89');
  });

  it('should handle strings without commas', () => {
    expect(removeCommas('1234567')).toBe('1234567');
    expect(removeCommas('123.45')).toBe('123.45');
  });

  it('should handle empty string', () => {
    expect(removeCommas('')).toBe('');
  });

  it('should handle multiple consecutive commas', () => {
    expect(removeCommas('1,,234,,567')).toBe('1234567');
  });
});

describe('formatCurrency', () => {
  it('should format USD currency', () => {
    const result = formatCurrency(1234.56, 'USD');
    expect(result).toMatch(/1,234\.56/);
    expect(result).toMatch(/\$/);
  });

  it('should format KRW currency (no decimals)', () => {
    const result = formatCurrency(1234567, 'KRW');
    expect(result).toMatch(/1,234,567/);
    expect(result).toMatch(/₩/);
  });

  it('should format EUR currency', () => {
    const result = formatCurrency(1234.56, 'EUR');
    expect(result).toMatch(/1,234\.56/);
    expect(result).toMatch(/€/);
  });

  it('should handle zero amount', () => {
    const result = formatCurrency(0, 'USD');
    expect(result).toMatch(/0/);
  });

  it('should handle negative amounts', () => {
    const result = formatCurrency(-1234.56, 'USD');
    expect(result).toMatch(/-/);
    expect(result).toMatch(/1,234\.56/);
  });

  it('should fallback gracefully for invalid currency codes', () => {
    const result = formatCurrency(1234.56, 'INVALID');
    expect(result).toContain('INVALID');
    expect(result).toContain('1,234.56');
  });

  it('should handle large numbers', () => {
    const result = formatCurrency(1234567890.12, 'USD');
    expect(result).toMatch(/1,234,567,890/);
  });
});
