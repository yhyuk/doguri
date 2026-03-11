import { describe, it, expect } from 'vitest';
import {
  convertTemperature,
  convertStandardUnit,
  convert,
  formatResult,
  isValidNumber,
  parseNumberInput
} from './utils';

describe('UnitConverter utils', () => {
  describe('convertTemperature', () => {
    it('should convert Celsius to Fahrenheit', () => {
      expect(convertTemperature(0, 'C', 'F')).toBeCloseTo(32, 5);
      expect(convertTemperature(100, 'C', 'F')).toBeCloseTo(212, 5);
      expect(convertTemperature(-40, 'C', 'F')).toBeCloseTo(-40, 5);
    });

    it('should convert Fahrenheit to Celsius', () => {
      expect(convertTemperature(32, 'F', 'C')).toBeCloseTo(0, 5);
      expect(convertTemperature(212, 'F', 'C')).toBeCloseTo(100, 5);
      expect(convertTemperature(-40, 'F', 'C')).toBeCloseTo(-40, 5);
    });

    it('should convert Celsius to Kelvin', () => {
      expect(convertTemperature(0, 'C', 'K')).toBeCloseTo(273.15, 5);
      expect(convertTemperature(100, 'C', 'K')).toBeCloseTo(373.15, 5);
      expect(convertTemperature(-273.15, 'C', 'K')).toBeCloseTo(0, 5);
    });

    it('should convert Kelvin to Celsius', () => {
      expect(convertTemperature(273.15, 'K', 'C')).toBeCloseTo(0, 5);
      expect(convertTemperature(373.15, 'K', 'C')).toBeCloseTo(100, 5);
    });

    it('should return same value for same units', () => {
      expect(convertTemperature(25, 'C', 'C')).toBe(25);
      expect(convertTemperature(77, 'F', 'F')).toBe(77);
    });

    it('should throw error for invalid units', () => {
      expect(() => convertTemperature(0, 'X', 'C')).toThrow();
      expect(() => convertTemperature(0, 'C', 'X')).toThrow();
    });
  });

  describe('convertStandardUnit', () => {
    it('should convert meters to centimeters', () => {
      expect(convertStandardUnit(1, 'm', 'cm')).toBeCloseTo(100, 5);
      expect(convertStandardUnit(2.5, 'm', 'cm')).toBeCloseTo(250, 5);
    });

    it('should convert kilometers to meters', () => {
      expect(convertStandardUnit(1, 'km', 'm')).toBeCloseTo(1000, 5);
      expect(convertStandardUnit(5, 'km', 'm')).toBeCloseTo(5000, 5);
    });

    it('should convert feet to meters', () => {
      expect(convertStandardUnit(1, 'ft', 'm')).toBeCloseTo(0.3048, 5);
      expect(convertStandardUnit(10, 'ft', 'm')).toBeCloseTo(3.048, 5);
    });

    it('should convert inches to centimeters', () => {
      expect(convertStandardUnit(1, 'in', 'cm')).toBeCloseTo(2.54, 5);
    });

    it('should convert kilograms to grams', () => {
      expect(convertStandardUnit(1, 'kg', 'g')).toBeCloseTo(1000, 5);
      expect(convertStandardUnit(2.5, 'kg', 'g')).toBeCloseTo(2500, 5);
    });

    it('should convert pounds to kilograms', () => {
      expect(convertStandardUnit(1, 'lb', 'kg')).toBeCloseTo(0.45359237, 5);
    });

    it('should convert liters to milliliters', () => {
      expect(convertStandardUnit(1, 'L', 'mL')).toBeCloseTo(1000, 5);
    });

    it('should convert gallons to liters', () => {
      expect(convertStandardUnit(1, 'gal', 'L')).toBeCloseTo(3.78541, 5);
    });

    it('should convert square meters to square feet', () => {
      expect(convertStandardUnit(1, 'm²', 'ft²')).toBeCloseTo(10.7639, 3);
    });

    it('should convert km/h to m/s', () => {
      expect(convertStandardUnit(1, 'km/h', 'm/s')).toBeCloseTo(0.277778, 5);
    });

    it('should return same value for same units', () => {
      expect(convertStandardUnit(100, 'm', 'm')).toBe(100);
      expect(convertStandardUnit(50, 'kg', 'kg')).toBe(50);
    });

    it('should throw error for invalid units', () => {
      expect(() => convertStandardUnit(1, 'invalid', 'm')).toThrow();
      expect(() => convertStandardUnit(1, 'm', 'invalid')).toThrow();
    });
  });

  describe('convert', () => {
    it('should handle length conversions', () => {
      const result = convert(1, 'm', 'cm');
      expect(result.value).toBeCloseTo(100, 5);
      expect(result.fromUnit).toBe('m');
      expect(result.toUnit).toBe('cm');
    });

    it('should handle temperature conversions', () => {
      const result = convert(0, 'C', 'F');
      expect(result.value).toBeCloseTo(32, 5);
      expect(result.fromUnit).toBe('C');
      expect(result.toUnit).toBe('F');
    });

    it('should handle weight conversions', () => {
      const result = convert(1, 'kg', 'lb');
      expect(result.value).toBeCloseTo(2.20462, 3);
    });

    it('should throw error for NaN input', () => {
      expect(() => convert(NaN, 'm', 'cm')).toThrow('Invalid input value');
    });
  });

  describe('formatResult', () => {
    it('should format decimal numbers', () => {
      expect(formatResult(1.23456789, 2)).toBe('1.23');
      expect(formatResult(1.23456789, 4)).toBe('1.2346');
    });

    it('should remove trailing zeros', () => {
      expect(formatResult(1.5000, 4)).toBe('1.5');
      expect(formatResult(2.0, 2)).toBe('2');
    });

    it('should handle integers', () => {
      expect(formatResult(100, 2)).toBe('100');
    });

    it('should use default precision of 6', () => {
      expect(formatResult(1.23456789)).toBe('1.234568');
    });

    it('should handle very small numbers', () => {
      expect(formatResult(0.00012345, 6)).toBe('0.000123');
    });
  });

  describe('isValidNumber', () => {
    it('should accept valid numbers', () => {
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('123.456')).toBe(true);
      expect(isValidNumber('-123')).toBe(true);
      expect(isValidNumber('-123.456')).toBe(true);
    });

    it('should accept partial input', () => {
      expect(isValidNumber('')).toBe(true);
      expect(isValidNumber('-')).toBe(true);
      expect(isValidNumber('.')).toBe(true);
    });

    it('should reject invalid input', () => {
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('12a34')).toBe(false);
      expect(isValidNumber('--123')).toBe(false);
    });

    it('should reject infinity', () => {
      expect(isValidNumber('Infinity')).toBe(false);
    });
  });

  describe('parseNumberInput', () => {
    it('should parse valid numbers', () => {
      expect(parseNumberInput('123')).toBe(123);
      expect(parseNumberInput('123.456')).toBe(123.456);
      expect(parseNumberInput('-123')).toBe(-123);
    });

    it('should return null for partial input', () => {
      expect(parseNumberInput('')).toBeNull();
      expect(parseNumberInput('-')).toBeNull();
      expect(parseNumberInput('.')).toBeNull();
    });

    it('should return null for invalid input', () => {
      expect(parseNumberInput('abc')).toBeNull();
      expect(parseNumberInput('12a34')).toBeNull();
    });

    it('should handle edge cases', () => {
      expect(parseNumberInput('0')).toBe(0);
      expect(parseNumberInput('-0')).toBe(0);
      expect(parseNumberInput('0.0')).toBe(0);
    });
  });
});
