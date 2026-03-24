/**
 * URL 인코딩/디코딩 유틸리티
 */

export type EncodingType = 'component' | 'full';

/**
 * URL 인코딩
 * @param text 인코딩할 텍스트
 * @param type 인코딩 타입 (component: 컴포넌트용, full: 전체 URL용)
 */
export function encodeUrl(text: string, type: EncodingType = 'component'): string {
  try {
    if (type === 'component') {
      // URL 컴포넌트용 인코딩 (더 엄격함)
      return encodeURIComponent(text);
    } else {
      // 전체 URL 인코딩 (프로토콜, 도메인 등은 유지)
      return encodeURI(text);
    }
  } catch (error) {
    throw new Error('인코딩 실패: 유효하지 않은 문자가 포함되어 있습니다.');
  }
}

/**
 * URL 디코딩
 * @param encodedText 디코딩할 텍스트
 * @param type 디코딩 타입 (component: 컴포넌트용, full: 전체 URL용)
 */
export function decodeUrl(encodedText: string, type: EncodingType = 'component'): string {
  try {
    if (type === 'component') {
      return decodeURIComponent(encodedText);
    } else {
      return decodeURI(encodedText);
    }
  } catch (error) {
    throw new Error('디코딩 실패: 유효한 URL 인코딩 형식이 아닙니다.');
  }
}

/**
 * 문자열이 URL 인코딩된 상태인지 확인
 */
export function isUrlEncoded(text: string): boolean {
  // URL 인코딩 패턴 확인 (%XX 형식)
  const encodedPattern = /%[0-9A-Fa-f]{2}/;

  if (!encodedPattern.test(text)) {
    return false;
  }

  try {
    // 디코딩 시도
    const decoded = decodeURIComponent(text);
    // 디코딩 후 다시 인코딩했을 때 원본과 같으면 인코딩된 상태
    return encodeURIComponent(decoded) === text;
  } catch {
    return false;
  }
}

/**
 * URL 쿼리 문자열을 파싱하여 객체로 변환
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};

  // ? 로 시작하면 제거
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  if (!query) return params;

  try {
    query.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    });
  } catch (error) {
    throw new Error('쿼리 문자열 파싱 실패: 유효하지 않은 형식입니다.');
  }

  return params;
}

/**
 * 객체를 URL 쿼리 문자열로 변환
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
  const pairs = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return pairs.length > 0 ? '?' + pairs.join('&') : '';
}

/**
 * URL을 파트별로 분석
 */
export function analyzeUrl(url: string) {
  try {
    const urlObj = new URL(url);

    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80'),
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin,
      href: urlObj.href,
      params: parseQueryString(urlObj.search)
    };
  } catch (error) {
    // 상대 URL이거나 유효하지 않은 URL
    return null;
  }
}

/**
 * 특수문자별 인코딩 결과 제공
 */
export function getEncodingChart(): Array<{ char: string; encoded: string; description: string }> {
  return [
    { char: ' ', encoded: '%20', description: '공백' },
    { char: '!', encoded: '%21', description: '느낌표' },
    { char: '#', encoded: '%23', description: '샵' },
    { char: '$', encoded: '%24', description: '달러' },
    { char: '%', encoded: '%25', description: '퍼센트' },
    { char: '&', encoded: '%26', description: '앰퍼샌드' },
    { char: '(', encoded: '%28', description: '여는 괄호' },
    { char: ')', encoded: '%29', description: '닫는 괄호' },
    { char: '+', encoded: '%2B', description: '더하기' },
    { char: '/', encoded: '%2F', description: '슬래시' },
    { char: ':', encoded: '%3A', description: '콜론' },
    { char: ';', encoded: '%3B', description: '세미콜론' },
    { char: '=', encoded: '%3D', description: '등호' },
    { char: '?', encoded: '%3F', description: '물음표' },
    { char: '@', encoded: '%40', description: '골뱅이' },
    { char: '[', encoded: '%5B', description: '여는 대괄호' },
    { char: ']', encoded: '%5D', description: '닫는 대괄호' },
  ];
}

/**
 * 인코딩 통계 계산
 */
export function calculateUrlEncodingStats(original: string, encoded: string) {
  const originalLength = original.length;
  const encodedLength = encoded.length;
  const difference = encodedLength - originalLength;
  const ratio = originalLength > 0 ? ((encodedLength / originalLength) * 100).toFixed(1) : '0';

  // 인코딩된 문자 수 계산
  const encodedChars = (encoded.match(/%[0-9A-Fa-f]{2}/g) || []).length;

  return {
    originalLength,
    encodedLength,
    difference,
    ratio,
    encodedChars
  };
}