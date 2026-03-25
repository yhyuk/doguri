import { describe, it, expect } from 'vitest';
import {
  generateUUID,
  generateCustomId,
  removeHyphens,
  toUpperCase,
  toLowerCase,
  generateMultipleUUIDs,
  isValidUUID,
  generateNanoId
} from './utils';

describe('UuidGenerator utils', () => {
  describe('generateUUID', () => {
    it('유효한 UUID v4를 생성해야 함', () => {
      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it('매번 다른 UUID를 생성해야 함', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('generateCustomId', () => {
    it('지정된 길이의 ID를 생성해야 함', () => {
      const id = generateCustomId(10);
      expect(id).toHaveLength(10);
    });

    it('숫자만 포함된 ID를 생성해야 함', () => {
      const id = generateCustomId(8, false, false, true, false);
      expect(/^\d+$/.test(id)).toBe(true);
    });

    it('대문자만 포함된 ID를 생성해야 함', () => {
      const id = generateCustomId(8, true, false, false, false);
      expect(/^[A-Z]+$/.test(id)).toBe(true);
    });

    it('잘못된 길이에 대해 에러를 발생시켜야 함', () => {
      expect(() => generateCustomId(0)).toThrow('길이는 1에서 128 사이여야 합니다.');
      expect(() => generateCustomId(129)).toThrow('길이는 1에서 128 사이여야 합니다.');
    });

    it('문자 유형이 선택되지 않으면 에러를 발생시켜야 함', () => {
      expect(() => generateCustomId(8, false, false, false, false))
        .toThrow('최소 하나의 문자 유형을 선택해야 합니다.');
    });
  });

  describe('removeHyphens', () => {
    it('UUID에서 하이픈을 제거해야 함', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(removeHyphens(uuid)).toBe('123e4567e89b12d3a456426614174000');
    });
  });

  describe('toUpperCase', () => {
    it('UUID를 대문자로 변환해야 함', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(toUpperCase(uuid)).toBe('123E4567-E89B-12D3-A456-426614174000');
    });
  });

  describe('toLowerCase', () => {
    it('UUID를 소문자로 변환해야 함', () => {
      const uuid = '123E4567-E89B-12D3-A456-426614174000';
      expect(toLowerCase(uuid)).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('generateMultipleUUIDs', () => {
    it('지정된 개수의 UUID를 생성해야 함', () => {
      const uuids = generateMultipleUUIDs(5);
      expect(uuids).toHaveLength(5);
      uuids.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('모든 UUID가 고유해야 함', () => {
      const uuids = generateMultipleUUIDs(10);
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(10);
    });

    it('잘못된 개수에 대해 에러를 발생시켜야 함', () => {
      expect(() => generateMultipleUUIDs(0))
        .toThrow('생성 개수는 1에서 1000 사이여야 합니다.');
      expect(() => generateMultipleUUIDs(1001))
        .toThrow('생성 개수는 1에서 1000 사이여야 합니다.');
    });
  });

  describe('isValidUUID', () => {
    it('유효한 UUID를 검증해야 함', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('유효하지 않은 UUID를 거부해야 함', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false);
      expect(isValidUUID('')).toBe(false);
    });
  });

  describe('generateNanoId', () => {
    it('기본 길이 21의 Nano ID를 생성해야 함', () => {
      const id = generateNanoId();
      expect(id).toHaveLength(21);
    });

    it('지정된 길이의 Nano ID를 생성해야 함', () => {
      const id = generateNanoId(10);
      expect(id).toHaveLength(10);
    });

    it('URL-safe 문자만 포함해야 함', () => {
      const id = generateNanoId();
      expect(/^[0-9A-Za-z\-_]+$/.test(id)).toBe(true);
    });
  });
});