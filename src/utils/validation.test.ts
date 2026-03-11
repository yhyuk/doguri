import { describe, it, expect } from 'vitest';
import { isValidNumber, isValidJSON, isValidURL } from './validation';

describe('isValidNumber', () => {
  it('should validate integer strings', () => {
    expect(isValidNumber('123')).toBe(true);
    expect(isValidNumber('0')).toBe(true);
    expect(isValidNumber('999999')).toBe(true);
  });

  it('should validate decimal strings', () => {
    expect(isValidNumber('123.45')).toBe(true);
    expect(isValidNumber('0.1')).toBe(true);
    expect(isValidNumber('999.999')).toBe(true);
  });

  it('should validate negative numbers', () => {
    expect(isValidNumber('-123')).toBe(true);
    expect(isValidNumber('-123.45')).toBe(true);
    expect(isValidNumber('-0.1')).toBe(true);
  });

  it('should validate formatted numbers with commas', () => {
    expect(isValidNumber('1,234')).toBe(true);
    expect(isValidNumber('1,234,567')).toBe(true);
    expect(isValidNumber('1,234.56')).toBe(true);
  });

  it('should reject invalid numbers', () => {
    expect(isValidNumber('abc')).toBe(false);
    expect(isValidNumber('12.34.56')).toBe(false);
    expect(isValidNumber('12a34')).toBe(false);
    expect(isValidNumber('--123')).toBe(false);
  });

  it('should reject empty and null values', () => {
    expect(isValidNumber('')).toBe(false);
    expect(isValidNumber(null as any)).toBe(false);
    expect(isValidNumber(undefined as any)).toBe(false);
  });

  it('should reject strings with only non-numeric characters', () => {
    expect(isValidNumber('   ')).toBe(false);
    expect(isValidNumber('$123')).toBe(false);
  });
});

describe('isValidJSON', () => {
  it('should validate JSON objects', () => {
    expect(isValidJSON('{}')).toBe(true);
    expect(isValidJSON('{"key": "value"}')).toBe(true);
    expect(isValidJSON('{"num": 123, "bool": true}')).toBe(true);
  });

  it('should validate JSON arrays', () => {
    expect(isValidJSON('[]')).toBe(true);
    expect(isValidJSON('[1, 2, 3]')).toBe(true);
    expect(isValidJSON('["a", "b", "c"]')).toBe(true);
  });

  it('should validate primitive JSON values', () => {
    expect(isValidJSON('123')).toBe(true);
    expect(isValidJSON('"string"')).toBe(true);
    expect(isValidJSON('true')).toBe(true);
    expect(isValidJSON('false')).toBe(true);
    expect(isValidJSON('null')).toBe(true);
  });

  it('should validate nested JSON structures', () => {
    expect(isValidJSON('{"nested": {"key": "value"}}')).toBe(true);
    expect(isValidJSON('[{"key": "value"}, {"key2": "value2"}]')).toBe(true);
  });

  it('should reject invalid JSON', () => {
    expect(isValidJSON('not json')).toBe(false);
    expect(isValidJSON('{key: value}')).toBe(false);
    expect(isValidJSON("{'key': 'value'}")).toBe(false);
    expect(isValidJSON('{incomplete')).toBe(false);
  });

  it('should reject empty and non-string values', () => {
    expect(isValidJSON('')).toBe(false);
    expect(isValidJSON(null as any)).toBe(false);
    expect(isValidJSON(undefined as any)).toBe(false);
    expect(isValidJSON(123 as any)).toBe(false);
  });
});

describe('isValidURL', () => {
  it('should validate HTTP URLs', () => {
    expect(isValidURL('http://example.com')).toBe(true);
    expect(isValidURL('http://www.example.com')).toBe(true);
    expect(isValidURL('http://example.com/path')).toBe(true);
    expect(isValidURL('http://example.com/path?query=value')).toBe(true);
  });

  it('should validate HTTPS URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true);
    expect(isValidURL('https://www.example.com')).toBe(true);
    expect(isValidURL('https://example.com:8080')).toBe(true);
    expect(isValidURL('https://sub.example.com/path#hash')).toBe(true);
  });

  it('should validate FTP URLs', () => {
    expect(isValidURL('ftp://example.com')).toBe(true);
    expect(isValidURL('ftp://ftp.example.com/file.txt')).toBe(true);
  });

  it('should validate localhost URLs', () => {
    expect(isValidURL('http://localhost')).toBe(true);
    expect(isValidURL('http://localhost:3000')).toBe(true);
    expect(isValidURL('https://localhost:8080/path')).toBe(true);
  });

  it('should validate IP address URLs', () => {
    expect(isValidURL('http://192.168.1.1')).toBe(true);
    expect(isValidURL('https://127.0.0.1:8080')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidURL('not a url')).toBe(false);
    expect(isValidURL('example.com')).toBe(false);
    expect(isValidURL('//example.com')).toBe(false);
    expect(isValidURL('ht tp://example.com')).toBe(false);
  });

  it('should reject invalid protocols', () => {
    expect(isValidURL('file:///path/to/file')).toBe(false);
    expect(isValidURL('javascript:alert(1)')).toBe(false);
    expect(isValidURL('data:text/html,<h1>test</h1>')).toBe(false);
  });

  it('should reject empty and non-string values', () => {
    expect(isValidURL('')).toBe(false);
    expect(isValidURL(null as any)).toBe(false);
    expect(isValidURL(undefined as any)).toBe(false);
    expect(isValidURL(123 as any)).toBe(false);
  });
});
