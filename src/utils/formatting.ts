/**
 * Add thousand separators (commas) to a number or numeric string
 *
 * @param value - Number or numeric string to format
 * @returns Formatted string with commas
 *
 * @example
 * addCommas(1234567) // "1,234,567"
 * addCommas("1234567.89") // "1,234,567.89"
 */
export function addCommas(value: string | number): string {
  const stringValue = String(value);
  const parts = stringValue.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}

/**
 * Remove commas from a formatted number string
 *
 * @param value - String with commas to remove
 * @returns String without commas
 *
 * @example
 * removeCommas("1,234,567") // "1234567"
 * removeCommas("1,234,567.89") // "1234567.89"
 */
export function removeCommas(value: string): string {
  return value.replace(/,/g, '');
}

/**
 * Format a number as currency with the specified currency code
 *
 * @param amount - Amount to format
 * @param currency - ISO 4217 currency code (e.g., "USD", "EUR", "KRW")
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, "USD") // "$1,234.56"
 * formatCurrency(1234567, "KRW") // "₩1,234,567"
 */
export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    console.error(`Invalid currency code: ${currency}`, error);
    return `${currency} ${addCommas(amount.toFixed(2))}`;
  }
}
