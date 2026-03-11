export type OutputFormat = 'inline' | 'newline';
export type SortOrder = 'none' | 'asc' | 'desc';

export interface FormatOptions {
  wrapInQuotes: boolean;
  outputFormat: OutputFormat;
  wrapInParentheses: boolean;
  removeDuplicates: boolean;
  sortOrder: SortOrder;
  trimWhitespace: boolean;
}

/**
 * Convert newline-separated values to comma-separated
 */
export function convertToCommaSeparated(input: string): string {
  if (!input.trim()) return '';

  return input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join(', ');
}

/**
 * Trim whitespace from each value
 */
export function trimValues(values: string[]): string[] {
  return values.map(v => v.trim()).filter(v => v.length > 0);
}

/**
 * Remove duplicate values
 */
export function removeDuplicates(values: string[]): string[] {
  return Array.from(new Set(values));
}

/**
 * Sort values based on order
 */
export function sortValues(values: string[], order: SortOrder): string[] {
  if (order === 'none') return values;

  const sorted = [...values];

  // Check if all values are numbers
  const allNumbers = sorted.every(v => !isNaN(Number(v)));

  if (allNumbers) {
    // Numeric sort
    sorted.sort((a, b) => {
      const numA = Number(a);
      const numB = Number(b);
      return order === 'asc' ? numA - numB : numB - numA;
    });
  } else {
    // Alphabetic sort
    sorted.sort((a, b) => {
      return order === 'asc'
        ? a.localeCompare(b)
        : b.localeCompare(a);
    });
  }

  return sorted;
}

/**
 * Wrap value in single quotes
 */
export function wrapInQuotes(value: string): string {
  // Escape single quotes in the value
  const escaped = value.replace(/'/g, "''");
  return `'${escaped}'`;
}

/**
 * Format values for SQL IN query
 */
export function formatForSqlIn(input: string, options: FormatOptions): string {
  if (!input.trim()) return '';

  // Split by newlines or commas
  let values = input.split(/[\n,]/).map(v => v.trim()).filter(v => v.length > 0);

  // Apply transformations
  if (options.trimWhitespace) {
    values = trimValues(values);
  }

  if (options.removeDuplicates) {
    values = removeDuplicates(values);
  }

  if (options.sortOrder !== 'none') {
    values = sortValues(values, options.sortOrder);
  }

  // Wrap in quotes if needed
  if (options.wrapInQuotes) {
    values = values.map(wrapInQuotes);
  }

  // Join based on format
  const separator = options.outputFormat === 'newline' ? ',\n' : ', ';
  let result = values.join(separator);

  // Wrap in parentheses if needed
  if (options.wrapInParentheses) {
    if (options.outputFormat === 'newline') {
      result = `(\n${result}\n)`;
    } else {
      result = `(${result})`;
    }
  }

  return result;
}

/**
 * Get formatting statistics
 */
export function getFormatStats(input: string, output: string) {
  const inputValues = input.split(/[\n,]/).map(v => v.trim()).filter(v => v.length > 0);
  const outputValues = output.split(/[\n,]/).map(v => v.trim()).filter(v => v.length > 0);

  return {
    inputCount: inputValues.length,
    outputCount: outputValues.length,
    inputLength: input.length,
    outputLength: output.length,
    hasDuplicates: inputValues.length !== new Set(inputValues).size
  };
}
