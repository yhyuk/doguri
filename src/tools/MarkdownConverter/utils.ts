/**
 * 마크다운 변환 유틸리티
 */
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface MarkdownOptions {
  breaks: boolean;      // 줄바꿈을 <br>로 변환
  gfm: boolean;         // GitHub Flavored Markdown
  tables: boolean;      // 테이블 지원
  sanitize: boolean;    // HTML 정화
  smartypants: boolean; // 스마트 따옴표
  headerIds: boolean;   // 헤더에 ID 추가
}

/**
 * 마크다운을 HTML로 변환
 */
export async function markdownToHtml(markdown: string, options: MarkdownOptions): Promise<string> {
  // marked 설정
  marked.setOptions({
    breaks: options.breaks,
    gfm: options.gfm,
  });

  // 마크다운을 HTML로 변환
  let html = await marked.parse(markdown);

  // HTML 정화 (XSS 방지)
  if (options.sanitize) {
    html = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'code', 'pre', 'blockquote',
        'ul', 'ol', 'li',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'del', 's', 'mark', 'ins', 'u'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
    });
  }

  return html;
}

/**
 * HTML을 마크다운으로 변환 (간단한 구현)
 */
export function htmlToMarkdown(html: string): string {
  let markdown = html;

  // 기본 HTML 태그를 마크다운으로 변환
  const conversions: Array<[RegExp, string | ((match: string, ...args: any[]) => string)]> = [
    // 헤더
    [/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n'],
    [/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n'],
    [/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n'],
    [/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n'],
    [/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n'],
    [/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n'],

    // 강조
    [/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**'],
    [/<b[^>]*>(.*?)<\/b>/gi, '**$1**'],
    [/<em[^>]*>(.*?)<\/em>/gi, '*$1*'],
    [/<i[^>]*>(.*?)<\/i>/gi, '*$1*'],

    // 코드
    [/<code[^>]*>(.*?)<\/code>/gi, '`$1`'],
    [/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n'],

    // 링크와 이미지
    [/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)'],
    [/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)'],

    // 리스트
    [/<ul[^>]*>(.*?)<\/ul>/gis, (_match: string, content: string) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
    }],
    [/<ol[^>]*>(.*?)<\/ol>/gis, (_match: string, content: string) => {
      let index = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gi, (_match: string, item: string) => {
        return `${index++}. ${item}\n`;
      }) + '\n';
    }],

    // 줄바꿈과 단락
    [/<br[^>]*>/gi, '  \n'],
    [/<hr[^>]*>/gi, '\n---\n\n'],
    [/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n'],

    // 인용
    [/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_match: string, content: string) => {
      return content.split('\n').map((line: string) => `> ${line}`).join('\n') + '\n\n';
    }],

    // 나머지 HTML 태그 제거
    [/<[^>]+>/g, '']
  ];

  conversions.forEach(([regex, replacement]) => {
    if (typeof replacement === 'string') {
      markdown = markdown.replace(regex, replacement);
    } else {
      markdown = markdown.replace(regex, replacement);
    }
  });

  // 연속된 줄바꿈 정리
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();

  return markdown;
}

/**
 * 미리보기용 CSS 스타일
 */
export function getPreviewStyles(): string {
  return `
    .markdown-preview {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .markdown-preview h1 { font-size: 2em; margin: 0.67em 0; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    .markdown-preview h2 { font-size: 1.5em; margin: 0.83em 0; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    .markdown-preview h3 { font-size: 1.17em; margin: 1em 0; font-weight: 600; }
    .markdown-preview h4 { font-size: 1em; margin: 1.33em 0; font-weight: 600; }
    .markdown-preview h5 { font-size: 0.83em; margin: 1.67em 0; font-weight: 600; }
    .markdown-preview h6 { font-size: 0.67em; margin: 2.33em 0; font-weight: 600; }
    .markdown-preview p { margin: 1em 0; }
    .markdown-preview blockquote { margin: 1em 0; padding-left: 1em; border-left: 4px solid #ddd; color: #666; }
    .markdown-preview code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
    .markdown-preview pre { background: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; }
    .markdown-preview pre code { background: none; padding: 0; }
    .markdown-preview ul, .markdown-preview ol { margin: 1em 0; padding-left: 2em; }
    .markdown-preview li { margin: 0.5em 0; }
    .markdown-preview a { color: #4078c0; text-decoration: none; }
    .markdown-preview a:hover { text-decoration: underline; }
    .markdown-preview img { max-width: 100%; height: auto; }
    .markdown-preview table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    .markdown-preview th, .markdown-preview td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .markdown-preview th { background: #f4f4f4; font-weight: 600; }
    .markdown-preview hr { border: none; border-top: 1px solid #ddd; margin: 2em 0; }
  `;
}

/**
 * 일반적인 마크다운 샘플
 */
export const MARKDOWN_SAMPLES = {
  basic: `# 제목 1
## 제목 2
### 제목 3

일반 텍스트와 **굵은 글씨**, *기울임 글씨*, \`인라인 코드\`

> 인용구 예제
> 여러 줄의 인용구

- 순서 없는 목록 1
- 순서 없는 목록 2
  - 중첩된 목록
  - 또 다른 중첩

1. 순서 있는 목록 1
2. 순서 있는 목록 2
3. 순서 있는 목록 3

[링크 텍스트](https://example.com)
![이미지 대체 텍스트](https://via.placeholder.com/150)`,

  code: `# 코드 예제

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

인라인 코드: \`const x = 42;\``,

  table: `# 테이블 예제

| 헤더 1 | 헤더 2 | 헤더 3 |
|--------|--------|--------|
| 셀 1   | 셀 2   | 셀 3   |
| 셀 4   | 셀 5   | 셀 6   |
| 셀 7   | 셀 8   | 셀 9   |

| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |
|:----------|:-----------:|------------:|
| 내용 1    | 내용 2      | 내용 3      |
| 내용 4    | 내용 5      | 내용 6      |`,

  advanced: `# 고급 마크다운 예제

## 체크리스트
- [x] 완료된 항목
- [ ] 미완료 항목
- [ ] 또 다른 미완료 항목

## 수평선

---

## 이스케이프 문자
\\*이것은 기울임이 아닙니다\\*

## HTML 태그
<mark>하이라이트된 텍스트</mark>
<del>취소선 텍스트</del>

## 각주
텍스트에 각주[^1]를 추가할 수 있습니다.

[^1]: 이것은 각주입니다.`
};