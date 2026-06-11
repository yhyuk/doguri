import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { formatJson, minifyJson, sortJsonKeys, analyzeJsonError } from './utils';
import type { JsonErrorInfo } from './utils';
import JsonTreeView from './JsonTreeView';

export default function JsonPrettier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [sortKeys, setSortKeys] = useState<'none' | 'asc' | 'desc'>('none');
  const [autoFormat, setAutoFormat] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'format' | 'minify'>('format');
  // 트리 전체 펼침/접힘 제어 (null이면 depth<2 기본 펼침)
  const [treeForceOpen, setTreeForceOpen] = useState<boolean | null>(null);
  const [treeRemountKey, setTreeRemountKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorInfo, setErrorInfo] = useState<JsonErrorInfo | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
      setErrorInfo(null);
      setOutput('');
      return;
    }

    const info = analyzeJsonError(input);
    setErrorInfo(info);
    if (!info) {
      setStatus({ valid: true, message: '✓ 유효한 JSON' });
      if (autoFormat) {
        handleFormatAuto();
      }
    } else {
      setStatus({
        valid: false,
        message:
          info.line !== undefined
            ? `${info.line}행 ${info.column}열 · ${info.message}`
            : info.message
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
    } catch {
      // 상세 오류는 입력 검증 useEffect에서 errorInfo로 표시됨
      setOutput('');
    }
  };

  const handleMinify = () => {
    setSelectedFormat('minify');
    if (!input) return;

    try {
      const minified = minifyJson(input);
      setOutput(minified);
    } catch {
      setOutput('');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setErrorInfo(null);
    setStatus({ valid: true, message: 'JSON을 입력하세요' });
  };

  const handleGoToError = () => {
    const el = inputRef.current;
    if (!el || !errorInfo || errorInfo.position === undefined) return;
    el.focus();
    el.setSelectionRange(errorInfo.position, Math.min(errorInfo.position + 1, input.length));
    if (errorInfo.line !== undefined) {
      // 대략적인 줄 높이 기준으로 오류 줄이 보이도록 스크롤
      const lineHeight = 20;
      el.scrollTop = Math.max(0, (errorInfo.line - 3) * lineHeight);
    }
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

  const applyTreeOpen = (value: boolean) => {
    setTreeForceOpen(value);
    setTreeRemountKey((k) => k + 1);
  };

  // 트리 뷰용 파싱 (output 우선, 없으면 input)
  const parsedData = (() => {
    const source = output || input;
    if (!source) return null;
    try {
      return JSON.parse(source);
    } catch {
      return null;
    }
  })();

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
            <div className="flex flex-col min-h-0">
              <div className="flex items-center mb-2 h-[26px]">
                <span className="text-sm font-medium text-gray-700">입력</span>
              </div>
              <div className="flex-1 min-h-0">
                <TextArea
                  ref={inputRef}
                  className="h-full"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='{"name":"도구리","type":"utility"}를 입력하세요'
                />
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleFormat}>정리하기</Button>
                <Button onClick={handleMinify}>압축하기</Button>
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
              </div>
            </div>

            <div className="flex flex-col min-h-0">
              {/* 결과 라벨 + 전체 펼치기/접기 (between 배치) */}
              <div className="flex items-center justify-between mb-2 h-[26px]">
                <span className="text-sm font-medium text-gray-700">결과</span>
                {parsedData !== null && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => applyTreeOpen(true)}
                      className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      전체 펼치기
                    </button>
                    <button
                      onClick={() => applyTreeOpen(false)}
                      className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      전체 접기
                    </button>
                  </div>
                )}
              </div>

              {/* 결과 본문 — 트리 뷰 (유효한 JSON일 때), 아니면 텍스트 폴백 */}
              <div className="flex-1 min-h-0">
                {parsedData !== null ? (
                  <JsonTreeView
                    data={parsedData}
                    forceOpen={treeForceOpen}
                    remountKey={treeRemountKey}
                  />
                ) : errorInfo && input ? (
                  <div className="w-full h-full p-4 border border-red-200 rounded-lg bg-red-50 overflow-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-red-700">JSON 구문 오류</span>
                      {errorInfo.line !== undefined && (
                        <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 font-mono">
                          {errorInfo.line}행 {errorInfo.column}열
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-red-800 mb-3">{errorInfo.message}</p>
                    {errorInfo.excerpt && (
                      <pre className="p-3 bg-white border border-red-200 rounded-md text-xs font-mono whitespace-pre-wrap break-all mb-3 leading-relaxed">
                        <span className="text-gray-500">{errorInfo.excerpt.before}</span>
                        <span className="bg-red-200 text-red-900 font-bold rounded px-0.5">
                          {errorInfo.excerpt.errorChar || ' '}
                        </span>
                        <span className="text-gray-500">{errorInfo.excerpt.after}</span>
                      </pre>
                    )}
                    {errorInfo.hint && (
                      <p className="text-xs text-gray-600 mb-3">{errorInfo.hint}</p>
                    )}
                    {errorInfo.position !== undefined && (
                      <button
                        onClick={handleGoToError}
                        className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        입력에서 오류 위치 선택
                      </button>
                    )}
                  </div>
                ) : (
                  <textarea
                    className="w-full h-full p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    value={output}
                    readOnly
                    placeholder="정리된 JSON이 여기에 표시됩니다"
                  />
                )}
              </div>

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
                <span>잘못된 JSON은 오류 위치(행/열)와 원인이 결과 영역에 표시됩니다</span>
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