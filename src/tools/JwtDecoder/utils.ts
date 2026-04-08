export interface JwtHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
}

function base64UrlDecode(str: string): string {
  // Base64URL -> Base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // 패딩 추가
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  const parts = trimmed.split('.');

  if (parts.length !== 3) {
    throw new Error('유효하지 않은 JWT 형식입니다. JWT는 3개의 부분(Header.Payload.Signature)으로 구성되어야 합니다.');
  }

  let header: JwtHeader;
  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
  } catch {
    throw new Error('Header를 디코딩할 수 없습니다. 유효한 Base64URL JSON이 아닙니다.');
  }

  let payload: JwtPayload;
  try {
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new Error('Payload를 디코딩할 수 없습니다. 유효한 Base64URL JSON이 아닙니다.');
  }

  return {
    header,
    payload,
    signature: parts[2],
  };
}

export function formatTimestamp(ts: number): string {
  const date = new Date(ts * 1000);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function getExpirationStatus(exp?: number): { label: string; color: string } {
  if (exp === undefined) {
    return { label: '만료 시간 없음', color: 'text-gray-500' };
  }
  const now = Math.floor(Date.now() / 1000);
  if (exp < now) {
    return { label: '만료됨', color: 'text-red-600' };
  }
  const diff = exp - now;
  if (diff < 3600) {
    return { label: `${Math.floor(diff / 60)}분 후 만료`, color: 'text-yellow-600' };
  }
  if (diff < 86400) {
    return { label: `${Math.floor(diff / 3600)}시간 후 만료`, color: 'text-green-600' };
  }
  return { label: `${Math.floor(diff / 86400)}일 후 만료`, color: 'text-green-600' };
}

export const EXAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';

export const CLAIM_DESCRIPTIONS: Record<string, string> = {
  iss: '발급자 (Issuer)',
  sub: '주제 (Subject)',
  aud: '대상 (Audience)',
  exp: '만료 시간 (Expiration Time)',
  nbf: '활성 시작 시간 (Not Before)',
  iat: '발급 시간 (Issued At)',
  jti: '고유 식별자 (JWT ID)',
};
