import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { formatForSqlIn, getFormatStats } from './utils';
import type { OutputFormat, SortOrder, FormatOptions } from './utils';

export default function CommaFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [wrapInQuotes, setWrapInQuotes] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('newline');
  const [wrapInParentheses, setWrapInParentheses] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const handleProcess = () => {
    if (!input) return;

    const options: FormatOptions = {
      wrapInQuotes,
      outputFormat,
      wrapInParentheses,
      removeDuplicates,
      sortOrder,
      trimWhitespace,
    };

    const result = formatForSqlIn(input, options);
    setOutput(result);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      const button = document.getElementById('copy-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '복사됨!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExample = () => {
    setInput(`user1@example.com
user2@example.com
user3@example.com
admin@example.com`);
  };

  const stats = getFormatStats(input, output);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="SQL IN 쿼리 생성기"
        description="값 목록을 SQL IN 절 형식으로 변환합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Options Panel */}
          <div className="bg-gray-50 rounded-lg p-5 mb-6 space-y-5">
            {/* SQL IN Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">SQL IN 옵션</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 min-w-[100px]">
                    출력 형식
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value="inline"
                        checked={outputFormat === 'inline'}
                        onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                        className="text-blue-600"
                      />
                      한 줄 (콤마+공백)
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value="newline"
                        checked={outputFormat === 'newline'}
                        onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                        className="text-blue-600"
                      />
                      여러 줄 (콤마+줄바꿈)
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wrapInQuotes}
                      onChange={(e) => setWrapInQuotes(e.target.checked)}
                      className="text-blue-600 rounded"
                    />
                    따옴표로 감싸기 (문자열)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wrapInParentheses}
                      onChange={(e) => setWrapInParentheses(e.target.checked)}
                      className="text-blue-600 rounded"
                    />
                    괄호로 감싸기 (IN절)
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">추가 옵션</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 min-w-[100px]">
                    정렬
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="none"
                        checked={sortOrder === 'none'}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="text-blue-600"
                      />
                      없음
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="asc"
                        checked={sortOrder === 'asc'}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="text-blue-600"
                      />
                      오름차순
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="desc"
                        checked={sortOrder === 'desc'}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="text-blue-600"
                      />
                      내림차순
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trimWhitespace}
                      onChange={(e) => setTrimWhitespace(e.target.checked)}
                      className="text-blue-600 rounded"
                    />
                    공백 제거
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removeDuplicates}
                      onChange={(e) => setRemoveDuplicates(e.target.checked)}
                      className="text-blue-600 rounded"
                    />
                    중복 제거
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Input/Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            <div className="flex flex-col">
              <TextArea
                label="입력"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="값을 입력하세요 (줄바꿈 또는 콤마로 구분)"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleProcess}>변환하기</Button>
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
              </div>
            </div>

            <div className="flex flex-col">
              <TextArea
                label="결과"
                value={output}
                readOnly
                placeholder="SQL IN 절 형식이 여기에 표시됩니다"
              />
              <div className="flex gap-3 mt-4">
                <Button id="copy-button" onClick={handleCopy}>복사</Button>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-6 bg-gray-50 rounded-md px-5 py-3 flex justify-between items-center text-sm">
            <div className="flex gap-6 text-gray-600">
              <span>입력 값: {stats.inputCount}개</span>
              <span>출력 값: {stats.outputCount}개</span>
              {stats.hasDuplicates && (
                <span className="text-yellow-600">중복 포함됨</span>
              )}
            </div>
            <div className="flex gap-6 text-gray-500">
              <span>입력: {stats.inputLength} 문자</span>
              <span>출력: {stats.outputLength} 문자</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
