import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { formatJson, minifyJson, sortJsonKeys, validateJson } from './utils';

export default function JsonPrettier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [sortKeys, setSortKeys] = useState<'none' | 'asc' | 'desc'>('none');
  const [autoFormat, setAutoFormat] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'format' | 'minify'>('format');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [status, setStatus] = useState<{
    valid: boolean;
    message: string;
  }>({
    valid: true,
    message: 'JSON을 입력하세요'
  });

  // JSON 유효성 검증
  useEffect(() => {
    if (!input) {
      setStatus({ valid: true, message: 'JSON을 입력하세요' });
      setOutput('');
      return;
    }

    const validation = validateJson(input);
    if (validation.valid) {
      setStatus({ valid: true, message: '✓ 유효한 JSON' });
      if (autoFormat) {
        handleFormatAuto();
      }
    } else {
      setStatus({
        valid: false,
        message: validation.error || 'JSON 오류'
      });
      if (autoFormat) {
        setOutput('');
      }
    }
  }, [input, autoFormat, selectedFormat, indentSize, sortKeys]);

  const handleFormatAuto = useCallback(() => {
    if (!input) return;

    try {
      let formatted = input;

      if (selectedFormat === 'minify') {
        formatted = minifyJson(input);
      } else {
        // 정렬 적용
        if (sortKeys !== 'none') {
          formatted = sortJsonKeys(formatted, sortKeys);
        } else {
          const indent = indentSize === 'tab' ? '\t' : parseInt(indentSize);
          formatted = formatJson(formatted, indent);
        }
      }

      setOutput(formatted);
    } catch (error) {
      setOutput('');
    }
  }, [input, selectedFormat, indentSize, sortKeys]);

  const handleFormat = () => {
    setSelectedFormat('format');
    if (!input) return;

    try {
      let formatted = input;

      // 정렬 적용
      if (sortKeys !== 'none') {
        formatted = sortJsonKeys(formatted, sortKeys);
      } else {
        const indent = indentSize === 'tab' ? '\t' : parseInt(indentSize);
        formatted = formatJson(formatted, indent);
      }

      setOutput(formatted);
    } catch (error) {
      setOutput('');
      if (error instanceof Error) {
        setStatus({ valid: false, message: error.message });
      }
    }
  };

  const handleMinify = () => {
    setSelectedFormat('minify');
    if (!input) return;

    try {
      const minified = minifyJson(input);
      setOutput(minified);
    } catch (error) {
      setOutput('');
      if (error instanceof Error) {
        setStatus({ valid: false, message: error.message });
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStatus({ valid: true, message: 'JSON을 입력하세요' });
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setToastMessage('JSON이 복사되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExample = () => {
    const examples = [
      {
        name: "도구리",
        version: "1.0.0",
        tools: ["JSON 정리", "대소문자 변환", "단위 변환"],
        features: {
          autoFormat: true,
          realTimeValidation: true,
          syntaxHighlight: false
        },
        author: {
          name: "Doguri Team",
          email: "hello@doguri.kr"
        }
      },
      {
        users: [
          { id: 1, name: "김철수", role: "개발자", active: true },
          { id: 2, name: "이영희", role: "디자이너", active: false },
          { id: 3, name: "박민수", role: "PM", active: true }
        ],
        metadata: {
          total: 3,
          activeUsers: 2,
          lastUpdated: "2024-03-23"
        }
      },
      {
        api: {
          endpoint: "https://api.doguri.kr/v1",
          methods: ["GET", "POST", "PUT", "DELETE"],
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer token"
          }
        }
      }
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setInput(JSON.stringify(randomExample));
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    a.download = `formatted_${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMessage('파일이 다운로드되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const compressionRatio = inputSize > 0 && outputSize > 0
    ? Math.round((1 - outputSize / inputSize) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="JSON 정리"
        description="JSON 형식을 보기 좋게 정리하고 검증합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* 포맷 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 들여쓰기 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">들여쓰기</label>
                <div className="flex gap-2">
                  {(['2', '4', 'tab'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setIndentSize(size)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        indentSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size === 'tab' ? 'Tab' : `${size} spaces`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 정렬 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">키 정렬</label>
                <div className="flex gap-2">
                  {[
                    { value: 'none', label: '없음' },
                    { value: 'asc', label: '오름차순' },
                    { value: 'desc', label: '내림차순' }
                  ].map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => setSortKeys(sort.value as 'none' | 'asc' | 'desc')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        sortKeys === sort.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 자동 포맷 */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFormat}
                    onChange={(e) => setAutoFormat(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">자동 포맷팅</span>
                </label>
              </div>
            </div>
          </div>

          {/* 입력/출력 그리드 - 이전 스타일 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            <div className="flex flex-col">
              <TextArea
                label="입력"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name":"도구리","type":"utility"}를 입력하세요'
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleFormat}>정리하기</Button>
                <Button onClick={handleMinify}>압축하기</Button>
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
              </div>
            </div>

            <div className="flex flex-col">
              <TextArea
                label="결과"
                value={output}
                readOnly
                placeholder="정리된 JSON이 여기에 표시됩니다"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleCopy}>복사</Button>
                <Button variant="secondary" onClick={handleDownload}>다운로드</Button>
              </div>
            </div>
          </div>

          {/* 하단 정보 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* 상태 표시 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.valid ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className={`text-sm ${status.valid ? 'text-gray-700' : 'text-red-600'}`}>
                    {status.message}
                  </span>
                </div>
              </div>
            </div>

            {/* 통계 정보 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  입력: <span className="font-medium">{inputSize.toLocaleString()}</span> bytes
                </span>
                <span className="text-gray-600">
                  출력: <span className="font-medium">{outputSize.toLocaleString()}</span> bytes
                </span>
                {compressionRatio !== 0 && (
                  <span className={`font-medium ${compressionRatio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {compressionRatio > 0 ? '↓' : '↑'} {Math.abs(compressionRatio)}%
                  </span>
                )}
              </div>
            </div>

            {/* JSON 구조 간단 정보 */}
            {output && status.valid && (
              <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
                <div className="text-sm">
                  {(() => {
                    try {
                      const parsed = JSON.parse(input);
                      const type = Array.isArray(parsed) ? '배열' : '객체';
                      const itemCount = Array.isArray(parsed)
                        ? parsed.length
                        : Object.keys(parsed).length;

                      return (
                        <span className="text-gray-600">
                          타입: <span className="font-medium">{type}</span> |
                          {Array.isArray(parsed) ? ' 항목' : ' 키'}: <span className="font-medium">{itemCount}개</span>
                        </span>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>자동 포맷팅을 켜면 입력과 동시에 정리됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>잘못된 JSON은 빨간색으로 표시됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>키 정렬로 속성을 알파벳순으로 정렬할 수 있습니다</span>
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