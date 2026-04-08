export interface EnvEntry {
  key: string;
  value: string;
  line: number;
  isComment: boolean;
  isEmpty: boolean;
  isDuplicate: boolean;
  raw: string;
}

export interface ParseResult {
  entries: EnvEntry[];
  duplicates: string[];
  totalKeys: number;
  commentCount: number;
  emptyCount: number;
}

/**
 * .env 텍스트를 파싱하여 구조화된 데이터로 변환
 */
export function parseEnv(text: string): ParseResult {
  const lines = text.split('\n');
  const entries: EnvEntry[] = [];
  const keyCount: Record<string, number> = {};
  let commentCount = 0;
  let emptyCount = 0;

  // 1차: 키 개수 카운트
  lines.forEach((raw) => {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)(?:\s*=)/);
    if (match) {
      keyCount[match[1]] = (keyCount[match[1]] || 0) + 1;
    }
  });

  const duplicateKeys = Object.keys(keyCount).filter((k) => keyCount[k] > 1);

  // 2차: 엔트리 생성
  lines.forEach((raw, index) => {
    const trimmed = raw.trim();

    if (!trimmed) {
      entries.push({
        key: '',
        value: '',
        line: index + 1,
        isComment: false,
        isEmpty: true,
        isDuplicate: false,
        raw,
      });
      emptyCount++;
      return;
    }

    if (trimmed.startsWith('#')) {
      entries.push({
        key: '',
        value: trimmed,
        line: index + 1,
        isComment: true,
        isEmpty: false,
        isDuplicate: false,
        raw,
      });
      commentCount++;
      return;
    }

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) {
      entries.push({
        key: trimmed,
        value: '',
        line: index + 1,
        isComment: false,
        isEmpty: false,
        isDuplicate: false,
        raw,
      });
      return;
    }

    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();

    // 따옴표 제거
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    entries.push({
      key,
      value,
      line: index + 1,
      isComment: false,
      isEmpty: false,
      isDuplicate: duplicateKeys.includes(key),
      raw,
    });
  });

  return {
    entries,
    duplicates: duplicateKeys,
    totalKeys: Object.keys(keyCount).length,
    commentCount,
    emptyCount,
  };
}

/**
 * 키를 알파벳 순으로 정렬 (주석과 빈 줄 유지)
 */
export function sortEnv(text: string): string {
  const lines = text.split('\n');
  const groups: { comments: string[]; entries: { key: string; line: string }[] }[] = [];
  let currentGroup: { comments: string[]; entries: { key: string; line: string }[] } = {
    comments: [],
    entries: [],
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentGroup.entries.length > 0 || currentGroup.comments.length > 0) {
        groups.push(currentGroup);
        currentGroup = { comments: [], entries: [] };
      }
      continue;
    }
    if (trimmed.startsWith('#')) {
      currentGroup.comments.push(line);
    } else {
      const eqIdx = trimmed.indexOf('=');
      const key = eqIdx >= 0 ? trimmed.slice(0, eqIdx).trim() : trimmed;
      currentGroup.entries.push({ key, line });
    }
  }

  if (currentGroup.entries.length > 0 || currentGroup.comments.length > 0) {
    groups.push(currentGroup);
  }

  return groups
    .map((group) => {
      const sorted = [...group.entries].sort((a, b) => a.key.localeCompare(b.key));
      return [...group.comments, ...sorted.map((e) => e.line)].join('\n');
    })
    .join('\n\n');
}

/**
 * 값 마스킹 (보안용)
 */
export function maskValue(value: string): string {
  if (!value) return '';
  if (value.length <= 4) return '*'.repeat(value.length);
  return value.slice(0, 2) + '*'.repeat(Math.min(value.length - 4, 20)) + value.slice(-2);
}

/**
 * .env.example 형식 생성 (값을 빈칸으로)
 */
export function generateExample(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return line;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) return line;
      const key = trimmed.slice(0, eqIdx).trim();
      return `${key}=`;
    })
    .join('\n');
}

/**
 * 중복 키 제거 (마지막 값 유지)
 */
export function removeDuplicates(text: string): string {
  const lines = text.split('\n');
  const seenKeys = new Map<string, number>();
  const keepLines = new Set<number>();

  // 마지막 등장 인덱스 기록
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      keepLines.add(idx);
      return;
    }
    const eqIdx = trimmed.indexOf('=');
    const key = eqIdx >= 0 ? trimmed.slice(0, eqIdx).trim() : trimmed;
    seenKeys.set(key, idx);
  });

  // 마지막 등장 라인만 유지
  seenKeys.forEach((idx) => keepLines.add(idx));

  return lines.filter((_, idx) => keepLines.has(idx)).join('\n');
}

export const EXAMPLE_ENV = `# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASSWORD=super_secret_password_123

# API 설정
API_KEY=sk-1234567890abcdef
API_SECRET=my-api-secret-key
API_URL=https://api.example.com

# 서버 설정
PORT=3000
NODE_ENV=development
DEBUG=true

# 중복 키 예시
DB_HOST=192.168.1.100`;
