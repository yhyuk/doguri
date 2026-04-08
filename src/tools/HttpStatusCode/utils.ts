export interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: StatusCategory;
  useCase: string;
}

export type StatusCategory = 'info' | 'success' | 'redirect' | 'client-error' | 'server-error';

export const CATEGORY_INFO: Record<StatusCategory, { label: string; color: string; bgColor: string; range: string }> = {
  'info': { label: '정보', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', range: '1xx' },
  'success': { label: '성공', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', range: '2xx' },
  'redirect': { label: '리다이렉션', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', range: '3xx' },
  'client-error': { label: '클라이언트 오류', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200', range: '4xx' },
  'server-error': { label: '서버 오류', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', range: '5xx' },
};

export const STATUS_CODES: StatusCode[] = [
  // 1xx 정보
  { code: 100, name: 'Continue', description: '서버가 요청 헤더를 수신했으며 클라이언트가 본문을 보내도 됩니다', category: 'info', useCase: '대용량 파일 업로드 전 서버 확인' },
  { code: 101, name: 'Switching Protocols', description: '서버가 프로토콜 전환 요청을 수락했습니다', category: 'info', useCase: 'HTTP에서 WebSocket으로 업그레이드' },
  { code: 102, name: 'Processing', description: '서버가 요청을 수신하여 처리 중이지만 아직 응답이 없습니다', category: 'info', useCase: 'WebDAV 긴 작업 처리 중 타임아웃 방지' },
  { code: 103, name: 'Early Hints', description: '최종 응답 전에 일부 헤더를 미리 전송합니다', category: 'info', useCase: '리소스 프리로드 힌트 (Link 헤더)' },

  // 2xx 성공
  { code: 200, name: 'OK', description: '요청이 성공적으로 처리되었습니다', category: 'success', useCase: 'GET 요청 성공, 데이터 조회 응답' },
  { code: 201, name: 'Created', description: '요청이 성공적으로 처리되어 새로운 리소스가 생성되었습니다', category: 'success', useCase: 'POST로 새 리소스 생성 (회원가입, 게시글 작성)' },
  { code: 202, name: 'Accepted', description: '요청이 수락되었지만 아직 처리가 완료되지 않았습니다', category: 'success', useCase: '비동기 작업 요청 (이메일 발송, 배치 처리)' },
  { code: 204, name: 'No Content', description: '요청이 성공했으나 반환할 콘텐츠가 없습니다', category: 'success', useCase: 'DELETE 성공, PUT 업데이트 후 본문 없이 응답' },
  { code: 206, name: 'Partial Content', description: '리소스의 일부분만 전송합니다', category: 'success', useCase: '대용량 파일 Range 요청 (동영상 스트리밍)' },

  // 3xx 리다이렉션
  { code: 301, name: 'Moved Permanently', description: '요청한 리소스가 새 URI로 영구 이동했습니다', category: 'redirect', useCase: '도메인 변경, URL 구조 변경 (SEO)' },
  { code: 302, name: 'Found', description: '요청한 리소스가 임시로 다른 URI에 있습니다', category: 'redirect', useCase: '로그인 후 원래 페이지로 이동' },
  { code: 303, name: 'See Other', description: 'GET 메서드로 다른 URI를 확인하세요', category: 'redirect', useCase: 'POST 처리 후 결과 페이지로 리다이렉트 (PRG 패턴)' },
  { code: 304, name: 'Not Modified', description: '리소스가 수정되지 않았으므로 캐시된 버전을 사용하세요', category: 'redirect', useCase: '브라우저 캐시 유효성 검증 (ETag, Last-Modified)' },
  { code: 307, name: 'Temporary Redirect', description: '임시 리다이렉트 (요청 메서드 유지)', category: 'redirect', useCase: 'HTTPS 리다이렉트, 메서드를 유지해야 할 때' },
  { code: 308, name: 'Permanent Redirect', description: '영구 리다이렉트 (요청 메서드 유지)', category: 'redirect', useCase: 'API 엔드포인트 영구 이동 (메서드 유지)' },

  // 4xx 클라이언트 오류
  { code: 400, name: 'Bad Request', description: '잘못된 요청입니다. 서버가 요청을 이해할 수 없습니다', category: 'client-error', useCase: '잘못된 JSON 형식, 필수 파라미터 누락, 유효성 검증 실패' },
  { code: 401, name: 'Unauthorized', description: '인증이 필요합니다', category: 'client-error', useCase: '로그인하지 않은 사용자의 보호된 리소스 접근' },
  { code: 403, name: 'Forbidden', description: '서버가 요청을 거부했습니다 (인증과 무관)', category: 'client-error', useCase: '권한 없는 리소스 접근 (관리자 전용 페이지)' },
  { code: 404, name: 'Not Found', description: '요청한 리소스를 찾을 수 없습니다', category: 'client-error', useCase: '존재하지 않는 URL, 삭제된 게시글 조회' },
  { code: 405, name: 'Method Not Allowed', description: '요청 메서드가 허용되지 않습니다', category: 'client-error', useCase: 'GET만 지원하는 엔드포인트에 POST 요청' },
  { code: 408, name: 'Request Timeout', description: '서버가 요청을 기다리다 시간이 초과했습니다', category: 'client-error', useCase: '클라이언트가 요청 전송을 너무 오래 걸린 경우' },
  { code: 409, name: 'Conflict', description: '요청이 현재 서버 상태와 충돌합니다', category: 'client-error', useCase: '동시 수정 충돌, 이미 존재하는 리소스 생성 시도' },
  { code: 410, name: 'Gone', description: '요청한 리소스가 영구적으로 삭제되었습니다', category: 'client-error', useCase: '404와 달리 리소스가 있었지만 의도적으로 삭제됨을 명시' },
  { code: 413, name: 'Payload Too Large', description: '요청 본문이 서버 허용 크기를 초과했습니다', category: 'client-error', useCase: '파일 업로드 크기 제한 초과' },
  { code: 415, name: 'Unsupported Media Type', description: '서버가 지원하지 않는 미디어 타입입니다', category: 'client-error', useCase: 'JSON API에 XML 전송, 지원하지 않는 파일 형식 업로드' },
  { code: 422, name: 'Unprocessable Entity', description: '요청 형식은 올바르나 의미적으로 처리할 수 없습니다', category: 'client-error', useCase: '유효성 검증 실패 (이메일 형식 오류, 범위 초과 등)' },
  { code: 429, name: 'Too Many Requests', description: '요청 횟수가 제한을 초과했습니다', category: 'client-error', useCase: 'API Rate Limiting, 로그인 시도 횟수 초과' },

  // 5xx 서버 오류
  { code: 500, name: 'Internal Server Error', description: '서버 내부 오류가 발생했습니다', category: 'server-error', useCase: '처리되지 않은 예외, 서버 버그' },
  { code: 501, name: 'Not Implemented', description: '서버가 요청 메서드를 인식하지만 구현하지 않았습니다', category: 'server-error', useCase: '아직 개발되지 않은 API 엔드포인트' },
  { code: 502, name: 'Bad Gateway', description: '게이트웨이/프록시가 상위 서버에서 잘못된 응답을 받았습니다', category: 'server-error', useCase: 'Nginx 뒤의 백엔드 서버 다운' },
  { code: 503, name: 'Service Unavailable', description: '서버가 일시적으로 요청을 처리할 수 없습니다', category: 'server-error', useCase: '서버 점검, 과부하, 배포 중' },
  { code: 504, name: 'Gateway Timeout', description: '게이트웨이/프록시가 상위 서버 응답을 기다리다 시간 초과했습니다', category: 'server-error', useCase: '백엔드 서버 응답 지연 (DB 쿼리 지연 등)' },
];

/**
 * 검색어로 상태 코드 필터링
 */
export function searchStatusCodes(codes: StatusCode[], query: string): StatusCode[] {
  if (!query.trim()) return codes;

  const q = query.toLowerCase().trim();
  return codes.filter(
    (sc) =>
      sc.code.toString().includes(q) ||
      sc.name.toLowerCase().includes(q) ||
      sc.description.includes(q) ||
      sc.useCase.includes(q)
  );
}

/**
 * 카테고리로 필터링
 */
export function filterByCategory(codes: StatusCode[], category: StatusCategory | 'all'): StatusCode[] {
  if (category === 'all') return codes;
  return codes.filter((sc) => sc.category === category);
}
