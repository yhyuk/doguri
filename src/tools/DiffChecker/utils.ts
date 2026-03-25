/**
 * Diff 비교 유틸리티
 */
import * as Diff from 'diff';

export type DiffType = 'chars' | 'words' | 'lines' | 'sentences' | 'css' | 'json';

export interface DiffResult {
  changes: Diff.Change[];
  added: number;
  removed: number;
  unchanged: number;
  similarity: number;
}

/**
 * 두 텍스트 비교
 */
export function compareDiff(text1: string, text2: string, type: DiffType): DiffResult {
  let changes: Diff.Change[] = [];

  switch (type) {
    case 'chars':
      changes = Diff.diffChars(text1, text2);
      break;
    case 'words':
      changes = Diff.diffWords(text1, text2);
      break;
    case 'lines':
      changes = Diff.diffLines(text1, text2);
      break;
    case 'sentences':
      changes = Diff.diffSentences(text1, text2);
      break;
    case 'css':
      changes = Diff.diffCss(text1, text2);
      break;
    case 'json':
      try {
        const json1 = JSON.stringify(JSON.parse(text1), null, 2);
        const json2 = JSON.stringify(JSON.parse(text2), null, 2);
        changes = Diff.diffJson(json1, json2);
      } catch {
        // JSON 파싱 실패 시 일반 텍스트로 비교
        changes = Diff.diffLines(text1, text2);
      }
      break;
    default:
      changes = Diff.diffLines(text1, text2);
  }

  // 통계 계산
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  changes.forEach(change => {
    const count = change.count || 0;
    if (change.added) {
      added += count;
    } else if (change.removed) {
      removed += count;
    } else {
      unchanged += count;
    }
  });

  // 유사도 계산 (0-100%)
  const total = Math.max(added + removed + unchanged, 1);
  const similarity = Math.round((unchanged / total) * 100);

  return {
    changes,
    added,
    removed,
    unchanged,
    similarity
  };
}

/**
 * Unified Diff 형식으로 생성
 */
export function createUnifiedDiff(
  text1: string,
  text2: string,
  fileName1: string = 'Original',
  fileName2: string = 'Modified'
): string {
  return Diff.createTwoFilesPatch(
    fileName1,
    fileName2,
    text1,
    text2,
    '',
    '',
    { context: 3 }
  );
}

/**
 * 패치 적용
 */
export function applyPatch(text: string, patch: string): string | false {
  return Diff.applyPatch(text, patch);
}

/**
 * 변경 사항을 HTML로 렌더링
 */
export function renderDiffAsHtml(changes: Diff.Change[]): string {
  let html = '';

  changes.forEach(change => {
    const value = escapeHtml(change.value);
    if (change.added) {
      html += `<span class="bg-green-100 text-green-800">${value}</span>`;
    } else if (change.removed) {
      html += `<span class="bg-red-100 text-red-800 line-through">${value}</span>`;
    } else {
      html += value;
    }
  });

  return html;
}

/**
 * 변경 사항을 나란히 비교 형식으로 렌더링
 */
export function renderSideBySide(text1: string, text2: string): { left: string[], right: string[] } {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const changes = Diff.diffLines(text1, text2);

  const left: string[] = [];
  const right: string[] = [];
  let i1 = 0;
  let i2 = 0;

  changes.forEach(change => {
    const lines = change.value.split('\n').filter(line => line !== '');

    if (change.removed) {
      lines.forEach(() => {
        if (i1 < lines1.length) {
          left.push(lines1[i1++]);
          right.push('');
        }
      });
    } else if (change.added) {
      lines.forEach(() => {
        if (i2 < lines2.length) {
          left.push('');
          right.push(lines2[i2++]);
        }
      });
    } else {
      lines.forEach(() => {
        if (i1 < lines1.length && i2 < lines2.length) {
          left.push(lines1[i1++]);
          right.push(lines2[i2++]);
        }
      });
    }
  });

  return { left, right };
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 줄 번호와 함께 변경 사항 표시
 */
export function getDiffWithLineNumbers(changes: Diff.Change[]): Array<{
  lineNumber: number;
  type: 'added' | 'removed' | 'unchanged';
  content: string;
}> {
  const result: Array<{
    lineNumber: number;
    type: 'added' | 'removed' | 'unchanged';
    content: string;
  }> = [];

  let lineNumber = 1;

  changes.forEach(change => {
    const lines = change.value.split('\n').filter(line => line !== '');

    lines.forEach(line => {
      if (change.added) {
        result.push({ lineNumber, type: 'added', content: line });
      } else if (change.removed) {
        result.push({ lineNumber, type: 'removed', content: line });
      } else {
        result.push({ lineNumber, type: 'unchanged', content: line });
      }
      lineNumber++;
    });
  });

  return result;
}