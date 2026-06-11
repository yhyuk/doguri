export function formatJson(input: string, indent: number | string = 2): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function minifyJson(input: string): string {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

export function sortJsonKeys(input: string, order: 'asc' | 'desc' = 'asc'): string {
  try {
    const parsed = JSON.parse(input);
    const sorted = sortObject(parsed, order);
    return JSON.stringify(sorted, null, 2);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
}

function sortObject(obj: any, order: 'asc' | 'desc'): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sortObject(item, order));
  }

  const sortedKeys = Object.keys(obj).sort((a, b) => {
    return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });

  const sortedObj: any = {};
  sortedKeys.forEach(key => {
    sortedObj[key] = sortObject(obj[key], order);
  });

  return sortedObj;
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON'
    };
  }
}

export interface JsonErrorInfo {
  rawMessage: string;
  message: string;
  hint?: string;
  position?: number;
  line?: number;
  column?: number;
  excerpt?: {
    before: string;
    errorChar: string;
    after: string;
  };
}

// 발췌문에서 제어 문자를 눈에 보이는 기호로 치환
const CONTROL_CHAR_LABELS: Record<string, string> = {
  '\n': '⏎',
  '\r': '␍',
  '\t': '⇥'
};

function visualize(text: string): string {
  return text.replace(/[\n\r\t]/g, (ch) => CONTROL_CHAR_LABELS[ch] ?? ch);
}

function positionToLineCol(input: string, position: number): { line: number; column: number } {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === '\n') {
      line++;
      lastNewline = i;
    }
  }
  return { line, column: position - lastNewline };
}

function lineColToPosition(input: string, line: number, column: number): number {
  let pos = 0;
  let currentLine = 1;
  while (currentLine < line && pos < input.length) {
    if (input[pos] === '\n') currentLine++;
    pos++;
  }
  return Math.min(pos + column - 1, input.length);
}

function describeError(
  raw: string,
  input: string,
  position?: number
): { message: string; hint?: string } {
  const char = position !== undefined ? input[position] : undefined;

  if (/bad control character/i.test(raw)) {
    return {
      message: '문자열 안에 줄바꿈 등 제어 문자가 그대로 들어 있습니다',
      hint: 'JSON 문자열 안에서는 줄바꿈을 직접 입력할 수 없습니다. 줄바꿈은 \\n, 탭은 \\t 로 바꿔주세요.'
    };
  }
  if (/unterminated string/i.test(raw)) {
    return {
      message: '문자열이 닫히지 않았습니다',
      hint: '닫는 큰따옴표(")가 빠졌는지 확인해주세요.'
    };
  }
  if (/unexpected end|end of data|end of json/i.test(raw)) {
    return {
      message: 'JSON이 도중에 끝났습니다',
      hint: '닫는 괄호(} 또는 ])나 따옴표가 빠졌는지 확인해주세요.'
    };
  }
  if (/expected double-quoted property name/i.test(raw)) {
    return {
      message: '속성 이름(키)이 와야 할 자리에 다른 문자가 있습니다',
      hint: '마지막 항목 뒤에 쉼표(,)가 남아 있거나, 키를 큰따옴표(")로 감싸지 않았는지 확인해주세요.'
    };
  }
  if (char === "'") {
    return {
      message: "작은따옴표(')는 JSON에서 사용할 수 없습니다",
      hint: '문자열과 키는 모두 큰따옴표(")로 감싸야 합니다.'
    };
  }
  if (/expected ',' or '\}' after property value/i.test(raw)) {
    return {
      message: '값 뒤에 쉼표(,) 또는 닫는 중괄호(})가 와야 합니다',
      hint: '항목 사이 쉼표가 빠졌거나 닫는 중괄호(})가 누락되지 않았는지 확인해주세요.'
    };
  }
  if (/expected ',' or '\]' after array element/i.test(raw)) {
    return {
      message: '배열 요소 뒤에 쉼표(,) 또는 닫는 대괄호(])가 와야 합니다',
      hint: '요소 사이 쉼표가 빠졌거나 닫는 대괄호(])가 누락되지 않았는지 확인해주세요.'
    };
  }
  if (char !== undefined && char !== '') {
    return { message: `'${visualize(char)}' 문자가 올 수 없는 위치에 있습니다` };
  }
  return { message: 'JSON 구문 오류가 발생했습니다' };
}

// JSON 파싱 실패 시 오류 위치(행/열)와 한국어 설명, 주변 발췌를 생성. 유효하면 null
export function analyzeJsonError(input: string): JsonErrorInfo | null {
  try {
    JSON.parse(input);
    return null;
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);

    let position: number | undefined;
    let line: number | undefined;
    let column: number | undefined;

    // V8: "... at position 123 (line 4 column 5)" / Firefox: "... at line 4 column 5 of the JSON data"
    const posMatch = raw.match(/at position (\d+)/i);
    if (posMatch) position = parseInt(posMatch[1], 10);

    const lineColMatch = raw.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
      if (position === undefined) position = lineColToPosition(input, line, column);
    } else if (position !== undefined) {
      ({ line, column } = positionToLineCol(input, position));
    }

    const { message, hint } = describeError(raw, input, position);

    let excerpt: JsonErrorInfo['excerpt'];
    if (position !== undefined) {
      const RADIUS = 40;
      const start = Math.max(0, position - RADIUS);
      const end = Math.min(input.length, position + 1 + RADIUS);
      excerpt = {
        before: (start > 0 ? '…' : '') + visualize(input.slice(start, position)),
        errorChar: position < input.length ? visualize(input[position]) : '',
        after: visualize(input.slice(position + 1, end)) + (end < input.length ? '…' : '')
      };
    }

    return { rawMessage: raw, message, hint, position, line, column, excerpt };
  }
}