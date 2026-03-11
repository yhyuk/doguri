import type { ConversionResult } from './types';

// Parse number input allowing negative and decimal numbers
export function parseNumberInput(value: string): number | null {
  if (!value || value === '-' || value === '.' || value === '-.') {
    return null;
  }

  // Validate format first to reject invalid inputs like '12.34.56'
  const regex = /^-?\d*\.?\d*$/;
  if (!regex.test(value)) {
    return null;
  }

  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    return null;
  }

  return parsed;
}

// Validate number format
export function isValidNumber(value: string): boolean {
  if (value === '' || value === '-' || value === '.' || value === '-.') {
    return true;
  }

  // Allow numbers with optional minus sign, digits, and one decimal point
  const regex = /^-?\d*\.?\d*$/;
  return regex.test(value);
}

// Format result with appropriate decimal places
export function formatResult(value: number): string {
  // For very small numbers, use more decimal places
  if (Math.abs(value) < 0.01 && value !== 0) {
    return value.toFixed(6);
  }

  // For normal numbers, use 2 decimal places
  if (Math.abs(value) < 1000000) {
    return value.toFixed(2);
  }

  // For large numbers, use comma separator
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Convert currency
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): ConversionResult {
  if (fromCurrency === toCurrency) {
    return {
      amount,
      from: fromCurrency,
      to: toCurrency,
      result: amount,
      rate: 1,
    };
  }

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) {
    throw new Error('Invalid currency code');
  }

  // Convert to USD first (base currency), then to target currency
  const result = (amount / fromRate) * toRate;
  const rate = toRate / fromRate;

  return {
    amount,
    from: fromCurrency,
    to: toCurrency,
    result,
    rate,
  };
}

// Format date from timestamp
export function formatLastUpdate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return '방금 전';
  }

  if (diffMins < 60) {
    return `${diffMins}분 전`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  return date.toLocaleDateString('ko-KR');
}
