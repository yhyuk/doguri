export type Base = 2 | 8 | 10 | 16;

export interface BaseOption {
  value: Base;
  label: string;
  prefix: string;
}

export const BASES: BaseOption[] = [
  { value: 2, label: '2진수 (Binary)', prefix: '0b' },
  { value: 8, label: '8진수 (Octal)', prefix: '0o' },
  { value: 10, label: '10진수 (Decimal)', prefix: '' },
  { value: 16, label: '16진수 (Hex)', prefix: '0x' },
];

/**
 * 입력 문자열에서 접두사를 제거하고 유효한 값만 추출
 */
function stripPrefix(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) return trimmed.slice(2);
  if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) return trimmed.slice(2);
  if (trimmed.startsWith('0o') || trimmed.startsWith('0O')) return trimmed.slice(2);
  return trimmed;
}

/**
 * 주어진 진법에 유효한 문자인지 확인
 */
export function isValidForBase(value: string, base: Base): boolean {
  const stripped = stripPrefix(value);
  if (!stripped) return true;

  const validChars: Record<Base, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/,
  };

  return validChars[base].test(stripped);
}

/**
 * 진법 변환 수행
 */
export function convertBase(value: string, fromBase: Base, toBase: Base): string {
  const stripped = stripPrefix(value);
  if (!stripped) return '';

  if (!isValidForBase(stripped, fromBase)) {
    throw new Error(`${fromBase}진수에 유효하지 않은 값입니다.`);
  }

  // 10진수로 변환 후 목표 진법으로 변환
  const decimal = parseInt(stripped, fromBase);

  if (isNaN(decimal)) {
    throw new Error('변환할 수 없는 값입니다.');
  }

  const result = decimal.toString(toBase);
  return toBase === 16 ? result.toUpperCase() : result;
}

/**
 * 모든 진법으로 한번에 변환
 */
export function convertToAll(value: string, fromBase: Base): Record<Base, string> {
  const result: Record<Base, string> = { 2: '', 8: '', 10: '', 16: '' };

  if (!value.trim() || !isValidForBase(value, fromBase)) {
    return result;
  }

  const stripped = stripPrefix(value);
  if (!stripped) return result;

  const decimal = parseInt(stripped, fromBase);
  if (isNaN(decimal)) return result;

  result[2] = decimal.toString(2);
  result[8] = decimal.toString(8);
  result[10] = decimal.toString(10);
  result[16] = decimal.toString(16).toUpperCase();

  return result;
}

/**
 * 2진수를 4자리씩 그룹화
 */
export function formatBinary(value: string): string {
  if (!value) return '';
  // 4의 배수로 패딩
  const padded = value.padStart(Math.ceil(value.length / 4) * 4, '0');
  return padded.match(/.{4}/g)?.join(' ') || value;
}

/**
 * 16진수를 2자리씩 그룹화
 */
export function formatHex(value: string): string {
  if (!value) return '';
  const padded = value.length % 2 ? '0' + value : value;
  return padded.match(/.{2}/g)?.join(' ') || value;
}
