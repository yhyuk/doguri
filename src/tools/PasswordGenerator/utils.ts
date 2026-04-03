/**
 * 비밀번호 생성 유틸리티
 */

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * 비밀번호 생성 옵션 검증
 */
export function validateOptions(options: PasswordOptions): void {
  if (options.length < 8 || options.length > 128) {
    throw new Error('비밀번호 길이는 8에서 128 사이여야 합니다.');
  }

  if (!options.includeUppercase && !options.includeLowercase &&
      !options.includeNumbers && !options.includeSymbols) {
    throw new Error('최소 하나의 문자 유형을 선택해야 합니다.');
  }
}

/**
 * 비밀번호 생성
 * @param options 비밀번호 생성 옵션
 */
export function generatePassword(options: PasswordOptions): string {
  validateOptions(options);

  let charset = '';
  const required: string[] = [];

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.includeUppercase) {
    charset += uppercase;
    required.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  }
  if (options.includeLowercase) {
    charset += lowercase;
    required.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  }
  if (options.includeNumbers) {
    charset += numbers;
    required.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (options.includeSymbols) {
    charset += symbols;
    required.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  // crypto.getRandomValues를 사용하여 안전한 랜덤 생성
  const remainingLength = options.length - required.length;
  const values = new Uint32Array(remainingLength);
  crypto.getRandomValues(values);

  let result = required.join('');
  for (let i = 0; i < remainingLength; i++) {
    result += charset[values[i] % charset.length];
  }

  // 결과를 섞어서 필수 문자들이 처음에 모이지 않도록 함
  return shuffleString(result);
}

/**
 * 문자열 섞기 (Fisher-Yates shuffle)
 */
function shuffleString(str: string): string {
  const arr = str.split('');
  const values = new Uint32Array(arr.length);
  crypto.getRandomValues(values);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = values[i] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join('');
}

/**
 * 비밀번호 강도 계산
 * @param password 검사할 비밀번호
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password || password.length < 8) {
    return 'weak';
  }

  let score = 0;

  // 길이 점수 (최대 4점)
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  // 문자 유형 점수 (각 1점)
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // 다양성 점수 (최대 2점)
  const uniqueChars = new Set(password.split('')).size;
  if (uniqueChars >= password.length * 0.6) score += 1;
  if (uniqueChars >= password.length * 0.8) score += 1;

  // 총 10점 만점
  if (score <= 3) return 'weak';
  if (score <= 5) return 'fair';
  if (score <= 7) return 'good';
  return 'strong';
}

/**
 * 비밀번호 강도에 따른 색상 클래스 반환
 */
export function getStrengthColor(strength: PasswordStrength): string {
  const colors = {
    weak: 'text-red-600 bg-red-50 border-red-200',
    fair: 'text-orange-600 bg-orange-50 border-orange-200',
    good: 'text-green-600 bg-green-50 border-green-200',
    strong: 'text-blue-600 bg-blue-50 border-blue-200'
  };
  return colors[strength];
}

/**
 * 비밀번호 강도에 따른 텍스트 반환
 */
export function getStrengthText(strength: PasswordStrength): string {
  const texts = {
    weak: '약함',
    fair: '보통',
    good: '강함',
    strong: '매우 강함'
  };
  return texts[strength];
}

/**
 * 비밀번호 강도에 따른 진행률 반환 (0-100)
 */
export function getStrengthProgress(strength: PasswordStrength): number {
  const progress = {
    weak: 25,
    fair: 50,
    good: 75,
    strong: 100
  };
  return progress[strength];
}
