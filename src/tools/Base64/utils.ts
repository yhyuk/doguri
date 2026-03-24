/**
 * Base64 인코딩 유틸리티
 */

/**
 * 텍스트를 Base64로 인코딩
 */
export function encodeBase64(text: string): string {
  try {
    // UTF-8 문자열을 처리하기 위해 먼저 URI 컴포넌트로 인코딩한 후 Base64 변환
    const utf8 = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    });
    return btoa(utf8);
  } catch (error) {
    throw new Error('인코딩 실패: 유효하지 않은 문자가 포함되어 있습니다.');
  }
}

/**
 * Base64를 텍스트로 디코딩
 */
export function decodeBase64(base64: string): string {
  try {
    // Base64를 디코딩한 후 UTF-8 문자열로 변환
    const decoded = atob(base64);
    const utf8 = decodeURIComponent(
      decoded.split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return utf8;
  } catch (error) {
    throw new Error('디코딩 실패: 유효한 Base64 형식이 아닙니다.');
  }
}

/**
 * 문자열이 유효한 Base64 형식인지 검사
 */
export function isValidBase64(str: string): boolean {
  if (!str || str.trim() === '') return false;

  // Base64 정규식 패턴
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

  // 길이가 4의 배수인지 확인
  if (str.length % 4 !== 0) return false;

  // Base64 문자만 포함하는지 확인
  if (!base64Regex.test(str)) return false;

  try {
    // 실제 디코딩 시도
    atob(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 파일을 Base64로 변환 (이미지, 파일 등)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // data:image/png;base64,xxxxx 형식에서 base64 부분만 추출
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      }
    };

    reader.onerror = () => {
      reject(new Error('파일을 읽을 수 없습니다.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Data URL을 Base64로 변환
 */
export function dataUrlToBase64(dataUrl: string): string {
  const parts = dataUrl.split(',');
  if (parts.length !== 2) {
    throw new Error('유효한 Data URL 형식이 아닙니다.');
  }
  return parts[1];
}

/**
 * Base64를 Data URL로 변환
 */
export function base64ToDataUrl(base64: string, mimeType: string = 'text/plain'): string {
  return `data:${mimeType};base64,${base64}`;
}

/**
 * 인코딩 결과 통계 계산
 */
export function calculateBase64Stats(original: string, encoded: string) {
  const originalBytes = new Blob([original]).size;
  const encodedBytes = encoded.length;
  const ratio = ((encodedBytes / originalBytes) * 100).toFixed(1);

  return {
    originalSize: originalBytes,
    encodedSize: encodedBytes,
    ratio: ratio,
    increase: encodedBytes - originalBytes
  };
}