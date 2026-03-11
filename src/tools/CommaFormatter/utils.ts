export type SeparatorType = 'comma' | 'space' | 'period';

/**
 * Add thousand separators to a number
 */
export function addThousandSeparators(
  value: string | number,
  separator: SeparatorType = 'comma'
): string {
  const stringValue = String(value);
  const separatorChar = getSeparatorChar(separator);

  // Split by decimal point
  const parts = stringValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : '';

  // Add thousand separators to integer part
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separatorChar);

  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
}

/**
 * Remove thousand separators (commas and spaces within numbers) from a number string
 */
export function removeSeparators(value: string): string {
  return value.replace(/,/g, '').replace(/\s/g, '');
}

/**
 * Get separator character based on type
 */
function getSeparatorChar(separator: SeparatorType): string {
  switch (separator) {
    case 'comma':
      return ',';
    case 'space':
      return ' ';
    case 'period':
      return '.';
    default:
      return ',';
  }
}

/**
 * Check if a string is a valid number
 */
export function isValidNumber(value: string): boolean {
  if (!value.trim()) return false;

  // Remove separators first
  const cleaned = removeSeparators(value);

  // Check if it's a valid number (including decimals)
  return /^-?\d+(\.\d+)?$/.test(cleaned);
}

/**
 * Process a single line with potential multiple numbers
 */
export function processLine(
  line: string,
  separator: SeparatorType,
  removeMode: boolean = false
): string {
  if (!line.trim()) return line;

  // Find all numbers in the line and format them
  // Match: digits, optionally followed by (comma/space (not newline) + digits)*, optionally followed by decimal
  // Use [ \t] instead of \s to avoid matching newlines
  return line.replace(/\d+(?:[, \t]\d+)*(?:\.\d+)?/g, (match) => {
    const cleaned = removeSeparators(match);
    if (isValidNumber(cleaned)) {
      if (removeMode) {
        // Remove separators - return just the cleaned number
        return cleaned;
      } else {
        // Add separators
        return addThousandSeparators(cleaned, separator);
      }
    }
    return match;
  });
}

/**
 * Process multiple lines of text
 */
export function processBatch(
  text: string,
  separator: SeparatorType,
  removeMode: boolean = false
): string {
  if (!text) return '';

  const lines = text.split('\n');
  const processed = lines.map(line => processLine(line, separator, removeMode));
  return processed.join('\n');
}

/**
 * Count numbers in text
 */
export function countNumbers(text: string): number {
  const matches = text.match(/\d+(?:[, \t]\d+)*(?:\.\d+)?/g);
  if (!matches) return 0;

  return matches.filter(match => {
    const cleaned = removeSeparators(match);
    return isValidNumber(cleaned);
  }).length;
}

/**
 * Get formatting statistics
 */
export function getFormatStats(input: string, output: string) {
  return {
    inputNumbers: countNumbers(input),
    outputNumbers: countNumbers(output),
    inputLength: input.length,
    outputLength: output.length,
    lines: input.split('\n').length
  };
}
