import { useState, useEffect } from 'react';
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
  const [autoProcess, setAutoProcess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 자동 처리
  useEffect(() => {
    if (autoProcess && input) {
      handleProcess();
    } else if (!input) {
      setOutput('');
    }
  }, [input, wrapInQuotes, outputFormat, wrapInParentheses, removeDuplicates, sortOrder, trimWhitespace, autoProcess]);

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
      setToastMessage('SQL 쿼리가 복사되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExample = () => {
    const examples = [
      `user1@example.com
user2@example.com
user3@example.com
admin@example.com`,
      `100
200
300
400
500`,
      `apple
banana
cherry
apple
grape`,
      `John Doe
Jane Smith
Bob Johnson
Alice Brown`,
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setInput(randomExample);
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    a.download = `sql_in_query_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMessage('파일이 다운로드되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const stats = getFormatStats(input, output);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="콤마 추가"
        description="값 목록을 SQL IN 절 또는 콤마 구분 형식으로 변환합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* 포맷 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 출력 형식 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">출력 형식</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOutputFormat('inline')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      outputFormat === 'inline'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    한 줄
                  </button>
                  <button
                    onClick={() => setOutputFormat('newline')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      outputFormat === 'newline'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    여러 줄
                  </button>
                </div>
              </div>

              {/* 정렬 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">정렬</label>
                <div className="flex gap-2">
                  {[
                    { value: 'none', label: '없음' },
                    { value: 'asc', label: '오름차순' },
                    { value: 'desc', label: '내림차순' }
                  ].map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => setSortOrder(sort.value as SortOrder)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        sortOrder === sort.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 자동 처리 */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoProcess}
                    onChange={(e) => setAutoProcess(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">자동 변환</span>
                </label>
              </div>
            </div>

            {/* 추가 옵션 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wrapInQuotes}
                    onChange={(e) => setWrapInQuotes(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">따옴표로 감싸기</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wrapInParentheses}
                    onChange={(e) => setWrapInParentheses(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">괄호로 감싸기 (IN절)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trimWhitespace}
                    onChange={(e) => setTrimWhitespace(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">공백 제거</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">중복 제거</span>
                </label>
              </div>
            </div>
          </div>

          {/* 입력/출력 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            <div className="flex flex-col">
              <TextArea
                label="입력"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="값을 입력하세요 (줄바꿈 또는 콤마로 구분)"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleProcess} disabled={!input || autoProcess}>
                  변환하기
                </Button>
                <Button variant="secondary" onClick={handleClear}>
                  지우기
                </Button>
                <Button variant="secondary" onClick={handleExample}>
                  예제
                </Button>
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
                <Button onClick={handleCopy} disabled={!output}>
                  복사
                </Button>
                <Button variant="secondary" onClick={handleDownload} disabled={!output}>
                  다운로드
                </Button>
              </div>
            </div>
          </div>

          {/* 하단 정보 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* 값 통계 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">입력 값:</span>
                  <span className="font-medium">{stats.inputCount}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">출력 값:</span>
                  <span className="font-medium">{stats.outputCount}개</span>
                </div>
                {stats.hasDuplicates && removeDuplicates && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-yellow-600 text-xs">
                      {stats.inputCount - stats.outputCount}개 중복 제거됨
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 문자 통계 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">입력:</span>
                  <span className="font-medium">{stats.inputLength} 문자</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">출력:</span>
                  <span className="font-medium">{stats.outputLength} 문자</span>
                </div>
              </div>
            </div>

            {/* SQL 예시 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="text-sm">
                <span className="text-gray-600">SQL 사용 예:</span>
                <code className="block mt-1 text-xs bg-gray-50 p-1 rounded text-gray-700">
                  WHERE id IN {wrapInParentheses ? '(...)' : '...'}
                </code>
              </div>
            </div>
          </div>

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>자동 변환을 켜면 입력과 동시에 SQL IN 절 형식으로 변환됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>문자열 데이터는 '따옴표로 감싸기'를, 숫자는 체크 해제하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>중복 제거 옵션으로 DISTINCT 효과를 낼 수 있습니다</span>
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