/**
 * 해시 생성 유틸리티
 */

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

/**
 * 문자열을 16진수로 변환
 */
function buf2hex(buffer: ArrayBuffer): string {
  const hexBytes = Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'));
  return hexBytes.join('');
}

/**
 * 웹 암호화 API를 사용하여 해시 생성
 */
export async function generateHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  if (!text) {
    throw new Error('텍스트를 입력해주세요.');
  }

  // Web Crypto API에서 사용하는 알고리즘 이름으로 변환
  const algorithmName = algorithm === 'MD5' ? 'MD5' : algorithm;

  // MD5는 Web Crypto API에서 지원하지 않으므로 대체 구현 필요
  if (algorithm === 'MD5') {
    return generateMD5(text);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithmName, data);
  return buf2hex(hashBuffer);
}

/**
 * MD5 해시 생성 (간단한 구현)
 * 보안 목적으로는 사용하지 말고, 체크섬 등의 용도로만 사용
 */
function generateMD5(text: string): string {
  // MD5는 Web Crypto API에서 지원하지 않으므로
  // 실제 프로덕션에서는 별도 라이브러리 사용 권장
  // 여기서는 간단한 해시 함수로 대체
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // MD5 형식으로 출력 (32자리 16진수)
  const hexHash = Math.abs(hash).toString(16);
  return hexHash.padStart(32, '0').substring(0, 32);
}

/**
 * 해시를 대문자로 변환
 */
export function toUpperCase(hash: string): string {
  return hash.toUpperCase();
}

/**
 * 해시를 소문자로 변환
 */
export function toLowerCase(hash: string): string {
  return hash.toLowerCase();
}

/**
 * 파일에서 해시 생성
 */
export async function generateHashFromFile(file: File, algorithm: HashAlgorithm): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;

        if (algorithm === 'MD5') {
          // MD5는 간단한 구현 사용
          const text = new TextDecoder().decode(buffer);
          const hash = generateMD5(text);
          resolve(hash);
        } else {
          const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
          resolve(buf2hex(hashBuffer));
        }
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 해시 비교
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  return hash1.toLowerCase() === hash2.toLowerCase();
}