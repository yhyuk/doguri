import { describe, it, expect } from 'vitest';
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  convertCase,
} from './utils';

describe('TextCase Utils', () => {
  describe('toUpperCase', () => {
    it('should convert text to uppercase', () => {
      expect(toUpperCase('hello world')).toBe('HELLO WORLD');
      expect(toUpperCase('Hello World')).toBe('HELLO WORLD');
      expect(toUpperCase('123 abc')).toBe('123 ABC');
      expect(toUpperCase('안녕하세요')).toBe('안녕하세요');
    });
  });

  describe('toLowerCase', () => {
    it('should convert text to lowercase', () => {
      expect(toLowerCase('HELLO WORLD')).toBe('hello world');
      expect(toLowerCase('Hello World')).toBe('hello world');
      expect(toLowerCase('123 ABC')).toBe('123 abc');
      expect(toLowerCase('안녕하세요')).toBe('안녕하세요');
    });
  });

  describe('toTitleCase', () => {
    it('should convert text to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
      expect(toTitleCase('javascript is fun')).toBe('Javascript Is Fun');
    });

    it('should handle minor words correctly', () => {
      expect(toTitleCase('the cat and the dog')).toBe('The Cat and the Dog');
      expect(toTitleCase('from here to there')).toBe('From Here to There');
    });
  });

  describe('toSentenceCase', () => {
    it('should convert text to sentence case', () => {
      expect(toSentenceCase('hello world')).toBe('Hello world');
      expect(toSentenceCase('HELLO WORLD')).toBe('Hello world');
      expect(toSentenceCase('')).toBe('');
    });
  });

  describe('toCamelCase', () => {
    it('should convert text to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('Hello World')).toBe('helloWorld');
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('  hello   world  ')).toBe('helloWorld');
      expect(toCamelCase('hello world 123')).toBe('helloWorld123');
    });

    it('should handle special characters', () => {
      expect(toCamelCase('hello@world#test')).toBe('helloWorldTest');
      expect(toCamelCase('hello.world')).toBe('helloWorld');
    });
  });

  describe('toPascalCase', () => {
    it('should convert text to PascalCase', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
      expect(toPascalCase('  hello   world  ')).toBe('HelloWorld');
      expect(toPascalCase('hello world 123')).toBe('HelloWorld123');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert text to snake_case', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
      expect(toSnakeCase('Hello World')).toBe('hello_world');
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
      expect(toSnakeCase('hello-world')).toBe('hello_world');
      expect(toSnakeCase('  hello   world  ')).toBe('hello_world');
    });

    it('should handle camelCase and PascalCase', () => {
      expect(toSnakeCase('thisIsCamelCase')).toBe('this_is_camel_case');
      expect(toSnakeCase('ThisIsPascalCase')).toBe('this_is_pascal_case');
      expect(toSnakeCase('XMLHttpRequest')).toBe('xml_http_request');
    });
  });

  describe('toKebabCase', () => {
    it('should convert text to kebab-case', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
      expect(toKebabCase('Hello World')).toBe('hello-world');
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('hello_world')).toBe('hello-world');
      expect(toKebabCase('  hello   world  ')).toBe('hello-world');
    });

    it('should handle camelCase and PascalCase', () => {
      expect(toKebabCase('thisIsCamelCase')).toBe('this-is-camel-case');
      expect(toKebabCase('ThisIsPascalCase')).toBe('this-is-pascal-case');
    });
  });


  describe('convertCase', () => {
    const testText = 'Hello World';

    it('should convert to different cases using the generic function', () => {
      expect(convertCase(testText, 'upper')).toBe('HELLO WORLD');
      expect(convertCase(testText, 'lower')).toBe('hello world');
      expect(convertCase(testText, 'title')).toBe('Hello World');
      expect(convertCase(testText, 'sentence')).toBe('Hello world');
      expect(convertCase(testText, 'camel')).toBe('helloWorld');
      expect(convertCase(testText, 'pascal')).toBe('HelloWorld');
      expect(convertCase(testText, 'snake')).toBe('hello_world');
      expect(convertCase(testText, 'kebab')).toBe('hello-world');
    });
  });
});