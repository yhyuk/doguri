/**
 * 정규식 테스터 유틸리티
 */

export interface RegexMatch {
  match: string;
  index: number;
  groups?: Record<string, string>;
}

export interface RegexTestResult {
  isValid: boolean;
  matches: RegexMatch[];
  error?: string;
}

/**
 * 정규식 플래그
 */
export interface RegexFlags {
  global: boolean;      // g
  ignoreCase: boolean;  // i
  multiline: boolean;   // m
  dotAll: boolean;      // s
  unicode: boolean;     // u
  sticky: boolean;      // y
}

/**
 * 플래그 문자열 생성
 */
export function getFlagsString(flags: RegexFlags): string {
  let result = '';
  if (flags.global) result += 'g';
  if (flags.ignoreCase) result += 'i';
  if (flags.multiline) result += 'm';
  if (flags.dotAll) result += 's';
  if (flags.unicode) result += 'u';
  if (flags.sticky) result += 'y';
  return result;
}

/**
 * 정규식 테스트 실행
 */
export function testRegex(pattern: string, text: string, flags: RegexFlags): RegexTestResult {
  try {
    if (!pattern) {
      return {
        isValid: false,
        matches: [],
        error: '정규식 패턴을 입력해주세요.'
      };
    }

    const flagsString = getFlagsString(flags);
    const regex = new RegExp(pattern, flagsString);
    const matches: RegexMatch[] = [];

    if (flags.global) {
      // 전역 검색
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups
        });
      }
    } else {
      // 단일 검색
      const match = regex.exec(text);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.groups
        });
      }
    }

    return {
      isValid: true,
      matches
    };
  } catch (error) {
    return {
      isValid: false,
      matches: [],
      error: error instanceof Error ? error.message : '유효하지 않은 정규식입니다.'
    };
  }
}

/**
 * 정규식으로 텍스트 치환
 */
export function replaceWithRegex(
  pattern: string,
  text: string,
  replacement: string,
  flags: RegexFlags
): { result: string; count: number; error?: string } {
  try {
    if (!pattern) {
      return {
        result: text,
        count: 0,
        error: '정규식 패턴을 입력해주세요.'
      };
    }

    const flagsString = getFlagsString(flags);
    const regex = new RegExp(pattern, flagsString);

    let count = 0;
    const result = text.replace(regex, (_match) => {
      count++;
      return replacement;
    });

    return { result, count };
  } catch (error) {
    return {
      result: text,
      count: 0,
      error: error instanceof Error ? error.message : '유효하지 않은 정규식입니다.'
    };
  }
}

/**
 * 일반적인 정규식 패턴
 */
export const COMMON_PATTERNS = [
  { name: '이메일', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?://[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+' },
  { name: 'IPv4 주소', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
  { name: '전화번호 (한국)', pattern: '010-?\\d{4}-?\\d{4}' },
  { name: '우편번호 (한국)', pattern: '\\d{5}' },
  { name: '16진수 색상', pattern: '#[0-9A-Fa-f]{6}' },
  { name: 'HTML 태그', pattern: '<[^>]+>' },
  { name: '숫자만', pattern: '\\d+' },
  { name: '영문자만', pattern: '[a-zA-Z]+' },
  { name: '한글만', pattern: '[가-힣]+' },
  { name: '공백', pattern: '\\s+' },
  { name: '날짜 (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: '시간 (HH:MM)', pattern: '\\d{2}:\\d{2}' },
  { name: 'UUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' },
  { name: 'JSON 문자열', pattern: '"[^"]*"' },
];

/**
 * 정규식 이스케이프
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 하이라이트된 HTML 생성
 */
export function highlightMatches(text: string, matches: RegexMatch[]): string {
  if (matches.length === 0) return text;

  // 매치를 인덱스 역순으로 정렬 (뒤에서부터 치환하기 위해)
  const sortedMatches = [...matches].sort((a, b) => b.index - a.index);

  let result = text;
  for (const match of sortedMatches) {
    const before = result.substring(0, match.index);
    const after = result.substring(match.index + match.match.length);
    const highlighted = `<mark class="bg-yellow-200">${match.match}</mark>`;
    result = before + highlighted + after;
  }

  return result;
}