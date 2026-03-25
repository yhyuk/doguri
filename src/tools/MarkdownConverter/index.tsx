import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  markdownToHtml,
  htmlToMarkdown,
  getPreviewStyles,
  MARKDOWN_SAMPLES,
  type MarkdownOptions
} from './utils';

type ConversionMode = 'md-to-html' | 'html-to-md';

export default function MarkdownConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('md-to-html');
  const [showPreview, setShowPreview] = useState(true);
  const [options, setOptions] = useState<MarkdownOptions>({
    breaks: true,
    gfm: true,
    tables: true,
    sanitize: true,
    smartypants: false,
    headerIds: true
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) {
      setToastMessage('변환할 내용을 입력해주세요.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      if (mode === 'md-to-html') {
        const html = await markdownToHtml(input, options);
        setOutput(html);
        setToastMessage('HTML로 변환되었습니다!');
      } else {
        const markdown = htmlToMarkdown(input);
        setOutput(markdown);
        setToastMessage('마크다운으로 변환되었습니다!');
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : '변환 중 오류가 발생했습니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleLoadSample = (sampleKey: keyof typeof MARKDOWN_SAMPLES) => {
    setInput(MARKDOWN_SAMPLES[sampleKey]);
    setMode('md-to-html');
    setToastMessage('샘플이 로드되었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setToastMessage('클립보드에 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDownload = () => {
    const extension = mode === 'md-to-html' ? 'html' : 'md';
    const mimeType = mode === 'md-to-html' ? 'text/html' : 'text/markdown';

    let content = output;
    if (mode === 'md-to-html') {
      // HTML 파일로 다운로드할 때는 완전한 HTML 문서로 만들기
      content = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>${getPreviewStyles()}</style>
</head>
<body>
  <div class="markdown-preview">
    ${output}
  </div>
</body>
</html>`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted.${extension}`;
    link.click();
    URL.revokeObjectURL(url);

    setToastMessage('파일이 다운로드되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'md-to-html' ? 'html-to-md' : 'md-to-html');
  };

  const modes = [
    { value: 'md-to-html', label: '마크다운 → HTML' },
    { value: 'html-to-md', label: 'HTML → 마크다운' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="마크다운 ↔ HTML 변환기"
        description="마크다운을 HTML로, HTML을 마크다운으로 변환합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 모드 선택 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">변환 모드</label>
                <div className="flex gap-2">
                  {modes.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value as ConversionMode)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        mode === m.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 샘플 선택 */}
              {mode === 'md-to-html' && (
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">샘플 로드</label>
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        handleLoadSample(value as keyof typeof MARKDOWN_SAMPLES);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">샘플 선택...</option>
                    <option value="basic">기본 마크다운</option>
                    <option value="code">코드 블록</option>
                    <option value="table">테이블</option>
                    <option value="advanced">고급 기능</option>
                  </select>
                </div>
              )}
            </div>

            {/* 변환 옵션 (마크다운 → HTML일 때만) */}
            {mode === 'md-to-html' && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">변환 옵션</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.breaks}
                      onChange={(e) => setOptions({ ...options, breaks: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">줄바꿈</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.gfm}
                      onChange={(e) => setOptions({ ...options, gfm: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">GitHub</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.tables}
                      onChange={(e) => setOptions({ ...options, tables: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">테이블</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.sanitize}
                      onChange={(e) => setOptions({ ...options, sanitize: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">XSS 방지</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.headerIds}
                      onChange={(e) => setOptions({ ...options, headerIds: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">헤더 ID</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* 입력/출력 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 overflow-hidden">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  입력 ({mode === 'md-to-html' ? '마크다운' : 'HTML'})
                </label>
                <div className="w-full">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      mode === 'md-to-html'
                        ? '마크다운을 입력하세요...\n\n# 제목\n**굵은 글씨**\n*기울임*'
                        : 'HTML을 입력하세요...\n\n<h1>제목</h1>\n<p>단락</p>'
                    }
                    rows={12}
                    className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleConvert}>변환하기</Button>
                <Button onClick={handleSwap} variant="secondary" disabled={!output}>
                  결과로 다시 변환
                </Button>
                <Button onClick={handleClear} variant="secondary">지우기</Button>
              </div>
            </div>

            <div className="flex flex-col">
              {output && (
                <>
                  {/* 미리보기 토글 (HTML 모드일 때만) */}
                  {mode === 'md-to-html' && (
                    <div className="mb-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showPreview}
                          onChange={(e) => setShowPreview(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">미리보기 표시</span>
                      </label>
                    </div>
                  )}

                  {/* HTML 미리보기 */}
                  {mode === 'md-to-html' && showPreview && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">HTML 미리보기</h3>
                      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                        <style dangerouslySetInnerHTML={{ __html: getPreviewStyles() }} />
                        <div
                          className="markdown-preview"
                          dangerouslySetInnerHTML={{ __html: output }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 코드 출력 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">
                        {mode === 'md-to-html' ? 'HTML 코드' : '마크다운 코드'}
                      </h3>
                      <div className="flex gap-2">
                        <Button onClick={handleDownload} variant="secondary">
                          다운로드
                        </Button>
                        <Button onClick={handleCopy} variant="secondary">
                          복사
                        </Button>
                      </div>
                    </div>
                    <div className="w-full">
                      <textarea
                        value={output}
                        readOnly
                        rows={10}
                        className="w-full px-3 py-2 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md resize-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 마크다운 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span># 제목은 헤딩 레벨을 나타냅니다 (# H1, ## H2, ### H3)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>**굵은 글씨**, *기울임*, `인라인 코드`로 텍스트를 꾸밀 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>[링크 텍스트](URL)로 링크를, ![대체 텍스트](이미지 URL)로 이미지를 삽입합니다</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast 메시지 */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse">
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}