/**
 * Check if a string represents a valid number
 * Accepts integers, decimals, and negative numbers
 *
 * @param value - String to validate
 * @returns true if the string is a valid number
 *
 * @example
 * isValidNumber("123") // true
 * isValidNumber("123.45") // true
 * isValidNumber("-123.45") // true
 * isValidNumber("abc") // false
 */
export function isValidNumber(value: string): boolean {
  if (value === '' || value === null || value === undefined) {
    return false;
  }

  // Remove commas for validation (support formatted numbers)
  const cleanedValue = value.replace(/,/g, '');

  // Check if it's a valid number using parseFloat and regex
  const num = parseFloat(cleanedValue);
  return !isNaN(num) && /^-?\d+(\.\d+)?$/.test(cleanedValue);
}

/**
 * Check if a string is valid JSON
 *
 * @param text - String to validate
 * @returns true if the string is valid JSON
 *
 * @example
 * isValidJSON('{"key": "value"}') // true
 * isValidJSON('[1, 2, 3]') // true
 * isValidJSON('not json') // false
 */
export function isValidJSON(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid URL
 * Supports http, https, ftp protocols
 *
 * @param text - String to validate
 * @returns true if the string is a valid URL
 *
 * @example
 * isValidURL('https://example.com') // true
 * isValidURL('http://localhost:3000') // true
 * isValidURL('not a url') // false
 */
export function isValidURL(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  try {
    const url = new URL(text);
    // Check for valid protocols
    return ['http:', 'https:', 'ftp:'].includes(url.protocol);
  } catch {
    return false;
  }
}
