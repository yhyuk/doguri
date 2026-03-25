/**
 * UUID 생성 유틸리티
 */

export type UuidVersion = 'v4' | 'custom';

/**
 * UUID v4 생성
 */
export function generateUUID(): string {
  // crypto.randomUUID가 있으면 사용
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: 수동으로 UUID v4 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 커스텀 길이의 랜덤 ID 생성
 * @param length 생성할 ID의 길이
 * @param includeUppercase 대문자 포함 여부
 * @param includeLowercase 소문자 포함 여부
 * @param includeNumbers 숫자 포함 여부
 * @param includeSymbols 특수문자 포함 여부
 */
export function generateCustomId(
  length: number = 8,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = false
): string {
  if (length < 1 || length > 128) {
    throw new Error('길이는 1에서 128 사이여야 합니다.');
  }

  let charset = '';

  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) charset += '0123456789';
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!charset) {
    throw new Error('최소 하나의 문자 유형을 선택해야 합니다.');
  }

  let result = '';
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);

  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }

  return result;
}

/**
 * UUID에서 하이픈 제거
 */
export function removeHyphens(uuid: string): string {
  return uuid.replace(/-/g, '');
}

/**
 * UUID를 대문자로 변환
 */
export function toUpperCase(uuid: string): string {
  return uuid.toUpperCase();
}

/**
 * UUID를 소문자로 변환
 */
export function toLowerCase(uuid: string): string {
  return uuid.toLowerCase();
}

/**
 * 여러 개의 UUID를 한 번에 생성
 */
export function generateMultipleUUIDs(count: number): string[] {
  if (count < 1 || count > 1000) {
    throw new Error('생성 개수는 1에서 1000 사이여야 합니다.');
  }

  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUID());
  }
  return uuids;
}

/**
 * 여러 개의 커스텀 ID를 한 번에 생성
 */
export function generateMultipleCustomIds(
  count: number,
  length: number,
  includeUppercase: boolean,
  includeLowercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): string[] {
  if (count < 1 || count > 1000) {
    throw new Error('생성 개수는 1에서 1000 사이여야 합니다.');
  }

  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(generateCustomId(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols));
  }
  return ids;
}

/**
 * UUID 검증
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Nano ID 스타일 ID 생성 (URL-safe)
 */
export function generateNanoId(length: number = 21): string {
  // URL-safe 문자셋
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

  let result = '';
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);

  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }

  return result;
}