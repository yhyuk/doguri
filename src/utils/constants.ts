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
  }
];

export const CATEGORIES = [
  { id: 'text', name: '텍스트' },
  { id: 'encoding', name: '인코딩' },
  { id: 'security', name: '보안' },
  { id: 'conversion', name: '변환' },
  { id: 'time', name: '시간' }
];