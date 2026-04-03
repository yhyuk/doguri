import { describe, it, expect } from 'vitest';
import {
  generatePassword,
  calculatePasswordStrength,
  validateOptions,
  getStrengthColor,
  getStrengthText,
  getStrengthProgress,
  type PasswordOptions
} from './utils';

describe('PasswordGenerator utils', () => {
  describe('validateOptions', () => {
    it('유효한 옵션을 통과시켜야 함', () => {
      const options: PasswordOptions = {
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      expect(() => validateOptions(options)).not.toThrow();
    });

    it('길이가 8 미만이면 에러를 발생시켜야 함', () => {
      const options: PasswordOptions = {
        length: 7,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      expect(() => validateOptions(options)).toThrow('비밀번호 길이는 8에서 128 사이여야 합니다.');
    });

    it('길이가 128 초과이면 에러를 발생시켜야 함', () => {
      const options: PasswordOptions = {
        length: 129,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      expect(() => validateOptions(options)).toThrow('비밀번호 길이는 8에서 128 사이여야 합니다.');
    });

    it('모든 옵션이 false이면 에러를 발생시켜야 함', () => {
      const options: PasswordOptions = {
        length: 12,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false
      };
      expect(() => validateOptions(options)).toThrow('최소 하나의 문자 유형을 선택해야 합니다.');
    });
  });

  describe('generatePassword', () => {
    it('지정된 길이의 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(password).toHaveLength(16);
    });

    it('대문자만 포함된 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 12,
        includeUppercase: true,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(/^[A-Z]+$/.test(password)).toBe(true);
    });

    it('소문자만 포함된 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 12,
        includeUppercase: false,
        includeLowercase: true,
        includeNumbers: false,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(/^[a-z]+$/.test(password)).toBe(true);
    });

    it('숫자만 포함된 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 12,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: true,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(/^\d+$/.test(password)).toBe(true);
    });

    it('특수문자만 포함된 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 12,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: true
      };
      const password = generatePassword(options);
      expect(/^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/.test(password)).toBe(true);
    });

    it('대문자와 소문자를 모두 포함해야 함', () => {
      const options: PasswordOptions = {
        length: 20,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: false,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
    });

    it('모든 문자 유형을 포함해야 함', () => {
      const options: PasswordOptions = {
        length: 20,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      };
      const password = generatePassword(options);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/\d/.test(password)).toBe(true);
      expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(true);
    });

    it('매번 다른 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      };
      const password1 = generatePassword(options);
      const password2 = generatePassword(options);
      expect(password1).not.toBe(password2);
    });

    it('최소 길이 8의 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 8,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(password).toHaveLength(8);
    });

    it('최대 길이 128의 비밀번호를 생성해야 함', () => {
      const options: PasswordOptions = {
        length: 128,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      const password = generatePassword(options);
      expect(password).toHaveLength(128);
    });

    it('잘못된 옵션으로 에러를 발생시켜야 함', () => {
      const options: PasswordOptions = {
        length: 5,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      };
      expect(() => generatePassword(options)).toThrow();
    });
  });

  describe('calculatePasswordStrength', () => {
    it('짧은 비밀번호는 약함으로 판정해야 함', () => {
      expect(calculatePasswordStrength('abc')).toBe('weak');
      expect(calculatePasswordStrength('12345')).toBe('weak');
    });

    it('단순한 8자 비밀번호는 약함 또는 보통으로 판정해야 함', () => {
      const strength = calculatePasswordStrength('password');
      expect(['weak', 'fair'].includes(strength)).toBe(true);
    });

    it('중간 복잡도 비밀번호는 보통 또는 강함으로 판정해야 함', () => {
      const strength = calculatePasswordStrength('Pass1234');
      expect(['fair', 'good'].includes(strength)).toBe(true);
    });

    it('복잡한 비밀번호는 강함 또는 매우 강함으로 판정해야 함', () => {
      const strength = calculatePasswordStrength('P@ssw0rd123!');
      expect(['good', 'strong'].includes(strength)).toBe(true);
    });

    it('매우 복잡하고 긴 비밀번호는 매우 강함으로 판정해야 함', () => {
      const strength = calculatePasswordStrength('P@ssw0rd123!XyZ$AbC#987');
      expect(strength).toBe('strong');
    });

    it('빈 문자열은 약함으로 판정해야 함', () => {
      expect(calculatePasswordStrength('')).toBe('weak');
    });

    it('모든 문자 유형을 포함한 긴 비밀번호는 강함 이상으로 판정해야 함', () => {
      const strength = calculatePasswordStrength('AbC123!@#XyZ789$%^');
      expect(['good', 'strong'].includes(strength)).toBe(true);
    });
  });

  describe('getStrengthColor', () => {
    it('약함은 빨간색 클래스를 반환해야 함', () => {
      const color = getStrengthColor('weak');
      expect(color).toContain('red');
    });

    it('보통은 주황색 클래스를 반환해야 함', () => {
      const color = getStrengthColor('fair');
      expect(color).toContain('orange');
    });

    it('강함은 초록색 클래스를 반환해야 함', () => {
      const color = getStrengthColor('good');
      expect(color).toContain('green');
    });

    it('매우 강함은 파란색 클래스를 반환해야 함', () => {
      const color = getStrengthColor('strong');
      expect(color).toContain('blue');
    });
  });

  describe('getStrengthText', () => {
    it('약함 텍스트를 반환해야 함', () => {
      expect(getStrengthText('weak')).toBe('약함');
    });

    it('보통 텍스트를 반환해야 함', () => {
      expect(getStrengthText('fair')).toBe('보통');
    });

    it('강함 텍스트를 반환해야 함', () => {
      expect(getStrengthText('good')).toBe('강함');
    });

    it('매우 강함 텍스트를 반환해야 함', () => {
      expect(getStrengthText('strong')).toBe('매우 강함');
    });
  });

  describe('getStrengthProgress', () => {
    it('약함은 25% 진행률을 반환해야 함', () => {
      expect(getStrengthProgress('weak')).toBe(25);
    });

    it('보통은 50% 진행률을 반환해야 함', () => {
      expect(getStrengthProgress('fair')).toBe(50);
    });

    it('강함은 75% 진행률을 반환해야 함', () => {
      expect(getStrengthProgress('good')).toBe(75);
    });

    it('매우 강함은 100% 진행률을 반환해야 함', () => {
      expect(getStrengthProgress('strong')).toBe(100);
    });
  });
});
