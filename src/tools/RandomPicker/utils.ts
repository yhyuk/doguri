/**
 * 랜덤 추첨 유틸리티
 * crypto.getRandomValues()를 사용하여 안전한 랜덤 선택 구현
 */

/**
 * 목록에서 랜덤하게 선택
 * @param items 선택할 항목 목록
 * @param count 선택할 개수
 * @param allowDuplicates 중복 허용 여부
 * @returns 선택된 항목 배열
 */
export function pickFromList(
  items: string[],
  count: number,
  allowDuplicates: boolean = false
): string[] {
  if (items.length === 0) {
    throw new Error('목록이 비어있습니다.');
  }

  if (count < 1) {
    throw new Error('선택 개수는 최소 1개 이상이어야 합니다.');
  }

  if (!allowDuplicates && count > items.length) {
    throw new Error('중복을 허용하지 않는 경우 선택 개수는 목록 크기를 초과할 수 없습니다.');
  }

  const results: string[] = [];
  const availableItems = [...items];

  if (allowDuplicates) {
    // 중복 허용: 매번 전체 목록에서 선택
    for (let i = 0; i < count; i++) {
      const randomIndex = getSecureRandomInt(0, items.length - 1);
      results.push(items[randomIndex]);
    }
  } else {
    // 중복 불허: Fisher-Yates shuffle 알고리즘 사용
    for (let i = availableItems.length - 1; i > 0; i--) {
      const j = getSecureRandomInt(0, i);
      [availableItems[i], availableItems[j]] = [availableItems[j], availableItems[i]];
    }
    results.push(...availableItems.slice(0, count));
  }

  return results;
}

/**
 * 숫자 범위에서 랜덤하게 선택
 * @param min 최소값 (포함)
 * @param max 최대값 (포함)
 * @param count 선택할 개수
 * @param allowDuplicates 중복 허용 여부
 * @returns 선택된 숫자 배열
 */
export function pickRandomNumbers(
  min: number,
  max: number,
  count: number,
  allowDuplicates: boolean = false
): number[] {
  if (min > max) {
    throw new Error('최소값은 최대값보다 작거나 같아야 합니다.');
  }

  if (count < 1) {
    throw new Error('선택 개수는 최소 1개 이상이어야 합니다.');
  }

  const range = max - min + 1;

  if (!allowDuplicates && count > range) {
    throw new Error('중복을 허용하지 않는 경우 선택 개수는 범위를 초과할 수 없습니다.');
  }

  const results: number[] = [];

  if (allowDuplicates) {
    // 중복 허용: 매번 범위에서 선택
    for (let i = 0; i < count; i++) {
      results.push(getSecureRandomInt(min, max));
    }
  } else {
    // 중복 불허: 사용 가능한 숫자 목록에서 Fisher-Yates shuffle
    const availableNumbers = Array.from({ length: range }, (_, i) => min + i);

    for (let i = availableNumbers.length - 1; i > 0; i--) {
      const j = getSecureRandomInt(0, i);
      [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
    }

    results.push(...availableNumbers.slice(0, count));
  }

  return results;
}

/**
 * 텍스트를 줄바꿈으로 구분하여 목록으로 변환
 * @param text 입력 텍스트
 * @returns 항목 배열 (빈 줄 제외)
 */
export function parseList(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * crypto.getRandomValues()를 사용하여 안전한 랜덤 정수 생성
 * @param min 최소값 (포함)
 * @param max 최대값 (포함)
 * @returns min과 max 사이의 랜덤 정수
 */
function getSecureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const maxUint32 = 0xFFFFFFFF;
  const limit = maxUint32 - (maxUint32 % range);

  let randomValue: number;

  do {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= limit); // 편향 제거

  return min + (randomValue % range);
}
