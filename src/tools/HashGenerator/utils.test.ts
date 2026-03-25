import { describe, it, expect } from 'vitest';
import { generateHash, toUpperCase, toLowerCase, compareHashes } from './utils';

describe('HashGenerator utils', () => {
  describe('generateHash', () => {
    it('SHA-256 해시를 생성해야 함', async () => {
      const text = 'hello';
      const hash = await generateHash(text, 'SHA-256');
      expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    it('SHA-1 해시를 생성해야 함', async () => {
      const text = 'hello';
      const hash = await generateHash(text, 'SHA-1');
      expect(hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });

    it('SHA-512 해시를 생성해야 함', async () => {
      const text = 'hello';
      const hash = await generateHash(text, 'SHA-512');
      expect(hash).toHaveLength(128); // SHA-512는 128자 16진수
    });

    it('빈 문자열에 대해 에러를 발생시켜야 함', async () => {
      await expect(generateHash('', 'SHA-256')).rejects.toThrow('텍스트를 입력해주세요.');
    });
  });

  describe('toUpperCase', () => {
    it('해시를 대문자로 변환해야 함', () => {
      const hash = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';
      expect(toUpperCase(hash)).toBe('AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D');
    });
  });

  describe('toLowerCase', () => {
    it('해시를 소문자로 변환해야 함', () => {
      const hash = 'AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D';
      expect(toLowerCase(hash)).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    });
  });

  describe('compareHashes', () => {
    it('같은 해시를 비교해야 함', () => {
      const hash1 = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';
      const hash2 = 'AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D';
      expect(compareHashes(hash1, hash2)).toBe(true);
    });

    it('다른 해시를 구별해야 함', () => {
      const hash1 = 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d';
      const hash2 = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
      expect(compareHashes(hash1, hash2)).toBe(false);
    });
  });
});