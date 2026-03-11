import { CONVERSION_FACTORS } from './constants';
import type { ConversionResult } from './types';

/**
 * Convert temperature between Celsius, Fahrenheit, and Kelvin
 */
export function convertTemperature(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;

  // Convert to Celsius first
  let celsius: number;
  if (fromUnit === 'C') {
    celsius = value;
  } else if (fromUnit === 'F') {
    celsius = (value - 32) * 5 / 9;
  } else if (fromUnit === 'K') {
    celsius = value - 273.15;
  } else {
    throw new Error(`Invalid temperature unit: ${fromUnit}`);
  }

  // Convert from Celsius to target unit
  if (toUnit === 'C') {
    return celsius;
  } else if (toUnit === 'F') {
    return celsius * 9 / 5 + 32;
  } else if (toUnit === 'K') {
    return celsius + 273.15;
  } else {
    throw new Error(`Invalid temperature unit: ${toUnit}`);
  }
}

/**
 * Convert standard units using conversion factors
 */
export function convertStandardUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;

  const fromFactor = CONVERSION_FACTORS[fromUnit];
  const toFactor = CONVERSION_FACTORS[toUnit];

  if (!fromFactor || !toFactor) {
    throw new Error(`Invalid units: ${fromUnit} or ${toUnit}`);
  }

  // Convert to base unit first, then to target unit
  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

/**
 * Main conversion function that handles all unit types
 */
export function convert(value: number, fromUnit: string, toUnit: string): ConversionResult {
  if (isNaN(value)) {
    throw new Error('Invalid input value');
  }

  let result: number;

  // Check if temperature conversion
  if (['C', 'F', 'K'].includes(fromUnit) && ['C', 'F', 'K'].includes(toUnit)) {
    result = convertTemperature(value, fromUnit, toUnit);
  } else {
    result = convertStandardUnit(value, fromUnit, toUnit);
  }

  return {
    value: result,
    fromUnit,
    toUnit
  };
}

/**
 * Format conversion result with appropriate precision
 */
export function formatResult(value: number, precision: number = 6): string {
  // Remove trailing zeros and unnecessary decimal point
  const formatted = value.toFixed(precision);
  return parseFloat(formatted).toString();
}

/**
 * Validate if value is a valid number input
 */
export function isValidNumber(value: string): boolean {
  if (value === '' || value === '-' || value === '.' || value === '-.') return true;
  // Check if the entire string is a valid number (not just the start)
  const regex = /^-?\d*\.?\d*$/;
  if (!regex.test(value)) return false;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Parse user input to number
 */
export function parseNumberInput(value: string): number | null {
  if (value === '' || value === '-' || value === '.' || value === '-.') return null;
  // Validate format before parsing
  const regex = /^-?\d*\.?\d*$/;
  if (!regex.test(value)) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  // Handle -0 edge case
  return num === 0 ? 0 : num;
}
