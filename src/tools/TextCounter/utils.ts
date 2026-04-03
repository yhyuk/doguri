/**
 * 텍스트 카운팅 유틸리티
 */

/**
 * 총 글자 수 (공백 포함)
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * 글자 수 (공백 제외)
 */
export function countCharactersWithoutSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

/**
 * 단어 수 (한글, 영문 모두 지원)
 */
export function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  // 공백으로 어절 분리
  const words = text.split(/\s+/).filter(word => word.trim().length > 0);

  let count = 0;

  for (const word of words) {
    // 한글이 포함된 어절은 1개로 카운트
    if (/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(word)) {
      count++;
    } else {
      // 한글이 없는 경우, 영문과 숫자를 별도로 카운트
      const englishWords = word.match(/[a-zA-Z]+/g) || [];
      const numberWords = word.match(/\d+/g) || [];
      count += englishWords.length + numberWords.length;
    }
  }

  return count;
}

/**
 * 문장 수
 */
export function countSentences(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  // 한글: ., !, ?, ㄱ, ㄴ 등
  // 영문: ., !, ?
  const sentenceEndings = /[.!?。!?]+/g;
  const matches = text.match(sentenceEndings);

  // 최소 1문장 (문장 부호가 없어도)
  return matches ? matches.length : (text.trim() ? 1 : 0);
}

/**
 * 문단 수
 */
export function countParagraphs(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  // 연속된 줄바꿈을 문단 구분자로 간주
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter(para => para.trim().length > 0);

  return paragraphs.length;
}

/**
 * 트위터 제한 체크 (280자)
 */
export function checkTwitterLimit(text: string): boolean {
  return text.length <= 280;
}

/**
 * 텍스트 통계 정보를 한번에 반환
 */
export interface TextStats {
  totalCharacters: number;
  charactersWithoutSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  withinTwitterLimit: boolean;
  readingTimeMinutes: number; // 읽는 시간 (분)
}

/**
 * 전체 텍스트 통계 계산
 */
export function getTextStats(text: string): TextStats {
  const totalCharacters = countCharacters(text);
  const charactersWithoutSpaces = countCharactersWithoutSpaces(text);
  const words = countWords(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const withinTwitterLimit = checkTwitterLimit(text);

  // 읽는 시간 계산 (평균 200단어/분)
  const readingTimeMinutes = words > 0 ? Math.ceil(words / 200) : 0;

  return {
    totalCharacters,
    charactersWithoutSpaces,
    words,
    sentences,
    paragraphs,
    withinTwitterLimit,
    readingTimeMinutes,
  };
}
