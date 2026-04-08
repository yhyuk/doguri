import type { Tool } from '../types';

export const TOOLS: Tool[] = [
  {
    id: 'json-prettier',
    name: 'JSON 정리',
    description: 'JSON 형식을 보기 좋게 정리하고 검증합니다',
    category: 'text',
    path: '/json-prettier'
  },
  {
    id: 'text-case',
    name: '대소문자 변환',
    description: '텍스트를 다양한 대소문자 형식으로 변환합니다',
    category: 'text',
    path: '/text-case'
  },
  {
    id: 'space-remover',
    name: '공백 제거',
    description: '텍스트에서 불필요한 공백을 제거합니다',
    category: 'text',
    path: '/space-remover'
  },
  {
    id: 'comma-formatter',
    name: '콤마 추가',
    description: '숫자에 천 단위 콤마를 추가합니다',
    category: 'text',
    path: '/comma-formatter'
  },
  {
    id: 'regex-tester',
    name: '정규식 테스터',
    description: '정규식을 테스트하고 텍스트를 검색하거나 치환합니다',
    category: 'text',
    path: '/regex-tester'
  },
  {
    id: 'diff-checker',
    name: 'Diff 비교',
    description: '두 텍스트의 차이점을 비교하고 시각화합니다',
    category: 'text',
    path: '/diff-checker'
  },
  {
    id: 'markdown-converter',
    name: '마크다운 ↔ HTML',
    description: '마크다운과 HTML을 상호 변환합니다',
    category: 'text',
    path: '/markdown-converter'
  },
  {
    id: 'text-counter',
    name: '글자수 계산',
    description: '글자 수, 단어 수, 문장 수, 문단 수를 실시간으로 계산합니다',
    category: 'text',
    path: '/text-counter'
  },
  {
    id: 'unit-converter',
    name: '단위 변환',
    description: '길이, 무게, 온도 등 다양한 단위를 변환합니다',
    category: 'conversion',
    path: '/unit-converter'
  },
  {
    id: 'currency-exchange',
    name: '환율 계산',
    description: '실시간 환율로 통화를 변환합니다',
    category: 'conversion',
    path: '/currency-exchange'
  },
  {
    id: 'base64',
    name: 'Base64',
    description: 'Base64 인코딩과 디코딩을 수행합니다',
    category: 'encoding',
    path: '/base64'
  },
  {
    id: 'url-encoder',
    name: 'URL 인코딩',
    description: 'URL을 안전하게 인코딩하거나 디코딩합니다',
    category: 'encoding',
    path: '/url-encoder'
  },
  {
    id: 'hash-generator',
    name: '해시 생성기',
    description: 'MD5, SHA-1, SHA-256, SHA-512 해시를 생성합니다',
    category: 'security',
    path: '/hash-generator'
  },
  {
    id: 'uuid-generator',
    name: 'UUID 생성기',
    description: 'UUID v4 및 커스텀 길이 ID를 생성합니다',
    category: 'security',
    path: '/uuid-generator'
  },
  {
    id: 'password-generator',
    name: '비밀번호 생성기',
    description: '안전하고 강력한 비밀번호를 생성합니다',
    category: 'security',
    path: '/password-generator'
  },
  {
    id: 'qr-generator',
    name: 'QR 코드 생성기',
    description: '텍스트나 URL을 QR 코드로 변환하고 다운로드합니다',
    category: 'developer',
    path: '/qr-generator'
  },
  {
    id: 'world-time-korea',
    name: '세계 시간 (한국 기준)',
    description: '한국 시간을 기준으로 전 세계 주요 도시의 현재 시간을 확인합니다',
    category: 'time',
    path: '/world-time-korea'
  },
  {
    id: 'world-time-utc',
    name: '세계 시간 (UTC 기준)',
    description: 'UTC 시간과 타임스탬프, ISO 8601 변환 도구',
    category: 'time',
    path: '/world-time-utc'
  },
  {
    id: 'cron-generator',
    name: 'Cron 생성기',
    description: 'Cron 작업 스케줄을 쉽게 생성하고 검증합니다',
    category: 'developer',
    path: '/cron-generator'
  },
  {
    id: 'color-picker',
    name: '색상 피커',
    description: 'HEX, RGB, HSL 형식 간 색상 변환 도구',
    category: 'developer',
    path: '/color-picker'
  },
  {
    id: 'date-calculator',
    name: '날짜 계산기',
    description: 'D-day 계산, 날짜 차이 계산, 날짜 더하기/빼기 기능을 제공합니다',
    category: 'calculator',
    path: '/date-calculator'
  },
  {
    id: 'age-calculator',
    name: '나이 계산기',
    description: '만 나이, 연 나이, 개월 수, 총 일수, 다음 생일까지 남은 일수를 계산합니다',
    category: 'calculator',
    path: '/age-calculator'
  },
  {
    id: 'random-picker',
    name: '랜덤 추첨기',
    description: '목록이나 숫자 범위에서 랜덤으로 선택합니다',
    category: 'daily',
    path: '/random-picker'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT 디코더',
    description: 'JWT 토큰을 디코딩하여 Header, Payload, 만료 정보를 확인합니다',
    category: 'encoding',
    path: '/jwt-decoder'
  },
  {
    id: 'base-converter',
    name: '진법 변환기',
    description: '2진수, 8진수, 10진수, 16진수 간 변환을 수행합니다',
    category: 'conversion',
    path: '/base-converter'
  },
  {
    id: 'image-converter',
    name: '이미지 형식 변환',
    description: 'PNG, JPG, WebP 간 이미지 형식을 변환합니다',
    category: 'conversion',
    path: '/image-converter'
  },
  {
    id: 'env-editor',
    name: '.env 편집기',
    description: '환경 변수 파일을 정리하고 중복 검사, 마스킹, 정렬 기능을 제공합니다',
    category: 'developer',
    path: '/env-editor'
  },
  {
    id: 'http-status-code',
    name: 'HTTP 상태 코드',
    description: 'HTTP 상태 코드의 의미와 사용 사례를 검색합니다',
    category: 'developer',
    path: '/http-status-code'
  }
];

export const CATEGORIES = [
  { id: 'text', name: '텍스트', icon: '📝', color: 'blue' },
  { id: 'encoding', name: '인코딩', icon: '🔐', color: 'purple' },
  { id: 'security', name: '보안', icon: '🛡️', color: 'red' },
  { id: 'conversion', name: '변환', icon: '🔄', color: 'green' },
  { id: 'time', name: '시간', icon: '⏰', color: 'amber' },
  { id: 'calculator', name: '계산기', icon: '🧮', color: 'teal' },
  { id: 'daily', name: '일상', icon: '🎲', color: 'pink' },
  { id: 'developer', name: '개발자', icon: '💻', color: 'indigo' }
];