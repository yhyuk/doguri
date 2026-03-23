/**
 * 대소문자 변환 유틸리티 함수들
 */

/**
 * 모든 문자를 대문자로 변환
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

/**
 * 모든 문자를 소문자로 변환
 */
export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

/**
 * 각 단어의 첫 글자를 대문자로 변환 (Title Case)
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map(word => {
      if (word.length === 0) return word;
      // 일반적인 전치사, 접속사는 소문자 유지 (첫 단어 제외)
      const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'nor', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'to', 'with'];
      return minorWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .replace(/^./, match => match.toUpperCase()); // 첫 글자는 항상 대문자
}

/**
 * 문장의 첫 글자만 대문자로 변환 (Sentence case)
 */
export function toSentenceCase(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * camelCase로 변환
 */
export function toCamelCase(text: string): string {
  // 특수문자와 공백을 기준으로 분리
  const words = text
    .replace(/[^a-zA-Z0-9가-힣]+/g, ' ')
    .trim()
    .split(/\s+/);

  if (words.length === 0) return '';

  return words
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * PascalCase로 변환
 */
export function toPascalCase(text: string): string {
  // 특수문자와 공백을 기준으로 분리
  const words = text
    .replace(/[^a-zA-Z0-9가-힣]+/g, ' ')
    .trim()
    .split(/\s+/);

  if (words.length === 0) return '';

  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * snake_case로 변환
 */
export function toSnakeCase(text: string): string {
  // camelCase, PascalCase 처리
  const processedText = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  return processedText
    .replace(/[^a-zA-Z0-9가-힣]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .join('_');
}

/**
 * kebab-case로 변환
 */
export function toKebabCase(text: string): string {
  // camelCase, PascalCase 처리
  const processedText = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  return processedText
    .replace(/[^a-zA-Z0-9가-힣]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .join('-');
}

/**
 * 대소문자 반전 (Toggle Case)
 */
export function toToggleCase(text: string): string {
  return text
    .split('')
    .map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    })
    .join('');
}

/**
 * 랜덤 대소문자 (Random Case) - 재미를 위한 기능
 */
export function toRandomCase(text: string): string {
  return text
    .split('')
    .map(char => {
      if (/[a-zA-Z]/.test(char)) {
        return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
      }
      return char;
    })
    .join('');
}

/**
 * 대체 대소문자 (Alternating Case) - 재미를 위한 기능
 */
export function toAlternatingCase(text: string): string {
  let shouldBeUpper = true;
  return text
    .split('')
    .map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const result = shouldBeUpper ? char.toUpperCase() : char.toLowerCase();
        shouldBeUpper = !shouldBeUpper;
        return result;
      }
      return char;
    })
    .join('');
}

// 변환 타입 정의
export type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab';

// 변환 함수 매핑
export const caseConverters: Record<CaseType, (text: string) => string> = {
  upper: toUpperCase,
  lower: toLowerCase,
  title: toTitleCase,
  sentence: toSentenceCase,
  camel: toCamelCase,
  pascal: toPascalCase,
  snake: toSnakeCase,
  kebab: toKebabCase,
};

/**
 * 텍스트를 지정된 케이스로 변환
 */
export function convertCase(text: string, caseType: CaseType): string {
  const converter = caseConverters[caseType];
  return converter ? converter(text) : text;
}