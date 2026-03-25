import { describe, it, expect } from 'vitest';
import { markdownToHtml, htmlToMarkdown, type MarkdownOptions } from './utils';

describe('MarkdownConverter utils', () => {
  const defaultOptions: MarkdownOptions = {
    breaks: false,
    gfm: true,
    tables: true,
    sanitize: true,
    smartypants: false,
    headerIds: true
  };

  describe('markdownToHtml', () => {
    it('헤더를 변환해야 함', async () => {
      const markdown = '# Header 1\n## Header 2';
      const html = await markdownToHtml(markdown, defaultOptions);
      expect(html).toContain('<h1');
      expect(html).toContain('Header 1');
      expect(html).toContain('<h2');
      expect(html).toContain('Header 2');
    });

    it('강조 텍스트를 변환해야 함', async () => {
      const markdown = '**bold** and *italic*';
      const html = await markdownToHtml(markdown, defaultOptions);
      expect(html).toContain('<strong>bold</strong>');
      expect(html).toContain('<em>italic</em>');
    });

    it('링크를 변환해야 함', async () => {
      const markdown = '[Example](https://example.com)';
      const html = await markdownToHtml(markdown, defaultOptions);
      expect(html).toContain('<a href="https://example.com"');
      expect(html).toContain('Example</a>');
    });

    it('코드 블록을 변환해야 함', async () => {
      const markdown = '```javascript\nconst x = 42;\n```';
      const html = await markdownToHtml(markdown, defaultOptions);
      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('const x = 42;');
    });

    it('리스트를 변환해야 함', async () => {
      const markdown = '- Item 1\n- Item 2';
      const html = await markdownToHtml(markdown, defaultOptions);
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Item 1</li>');
      expect(html).toContain('<li>Item 2</li>');
    });

    it('테이블을 변환해야 함 (GFM)', async () => {
      const markdown = '| Header |\n|--------|\n| Cell |';
      const html = await markdownToHtml(markdown, { ...defaultOptions, gfm: true });
      expect(html).toContain('<table>');
      expect(html).toContain('<th>Header</th>');
      expect(html).toContain('<td>Cell</td>');
    });

    it('악성 스크립트를 정화해야 함', async () => {
      const markdown = '<script>alert("XSS")</script>';
      const html = await markdownToHtml(markdown, { ...defaultOptions, sanitize: true });
      expect(html).not.toContain('<script>');
      expect(html).not.toContain('alert');
    });
  });

  describe('htmlToMarkdown', () => {
    it('헤더를 마크다운으로 변환해야 함', () => {
      const html = '<h1>Header 1</h1><h2>Header 2</h2>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain('# Header 1');
      expect(markdown).toContain('## Header 2');
    });

    it('강조 텍스트를 마크다운으로 변환해야 함', () => {
      const html = '<strong>bold</strong> and <em>italic</em>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain('**bold**');
      expect(markdown).toContain('*italic*');
    });

    it('링크를 마크다운으로 변환해야 함', () => {
      const html = '<a href="https://example.com">Example</a>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe('[Example](https://example.com)');
    });

    it('이미지를 마크다운으로 변환해야 함', () => {
      const html = '<img src="image.jpg" alt="Alt text">';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe('![Alt text](image.jpg)');
    });

    it('순서 없는 리스트를 마크다운으로 변환해야 함', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain('- Item 1');
      expect(markdown).toContain('- Item 2');
    });

    it('순서 있는 리스트를 마크다운으로 변환해야 함', () => {
      const html = '<ol><li>Item 1</li><li>Item 2</li></ol>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain('1. Item 1');
      expect(markdown).toContain('2. Item 2');
    });

    it('인라인 코드를 마크다운으로 변환해야 함', () => {
      const html = '<code>const x = 42;</code>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toBe('`const x = 42;`');
    });

    it('단락을 마크다운으로 변환해야 함', () => {
      const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
      const markdown = htmlToMarkdown(html);
      expect(markdown).toContain('Paragraph 1\n\n');
      expect(markdown).toContain('Paragraph 2');
    });
  });
});