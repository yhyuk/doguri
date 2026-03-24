import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import {
  encodeUrl,
  decodeUrl,
  parseQueryString,
  analyzeUrl,
  getEncodingChart,
  calculateUrlEncodingStats
} from './utils';
import type { EncodingType } from './utils';

type Mode = 'encode' | 'decode';

interface Stats {
  originalLength: number;
  encodedLength: number;
  difference: number;
  ratio: string;
  encodedChars: number;
}

export default function UrlEncoder() {
  const [mode, setMode] = useState<Mode>('encode');
  const [encodingType, setEncodingType] = useState<EncodingType>('component');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [autoProcess, setAutoProcess] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [urlAnalysis, setUrlAnalysis] = useState<any>(null);
  const [showChart, setShowChart] = useState(false);

  // 자동 처리
  useEffect(() => {
    if (autoProcess && input) {
      handleProcess();
    }
  }, [input, mode, encodingType, autoProcess]);

  const handleProcess = useCallback(() => {
    if (!input) {
      setOutput('');
      setError('');
      setStats(null);
      setUrlAnalysis(null);
      return;
    }

    setError('');

    try {
      if (mode === 'encode') {
        const encoded = encodeUrl(input, encodingType);
        setOutput(encoded);
        setStats(calculateUrlEncodingStats(input, encoded));

        // URL 분석 (전체 URL인 경우)
        const analysis = analyzeUrl(input);
        setUrlAnalysis(analysis);
      } else {
        const decoded = decodeUrl(input, encodingType);
        setOutput(decoded);
        setStats(null);

        // 디코딩된 URL 분석
        const analysis = analyzeUrl(decoded);
        setUrlAnalysis(analysis);
      }
    } catch (err: any) {
      setError(err.message);
      setOutput('');
      setStats(null);
      setUrlAnalysis(null);
    }
  }, [input, mode, encodingType]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setStats(null);
    setUrlAnalysis(null);
  };

  const handleCopy = () => {
    if (!output) return;

    navigator.clipboard.writeText(output);
    setToastMessage('결과가 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSwap = () => {
    if (output && !error) {
      setInput(output);
      setOutput('');
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleSample = () => {
    if (mode === 'encode') {
      const samples = [
        'https://example.com/search?q=hello world&lang=한국어',
        'name=홍길동&email=user@example.com&message=안녕하세요!',
        'https://api.example.com/users/profile?id=123&filter=active&sort=name',
        '/api/v1/products?category=전자제품&price=10000-50000',
        'Hello World! 특수문자: @#$%^&*()'
      ];
      setInput(samples[Math.floor(Math.random() * samples.length)]);
    } else {
      const samples = [
        'https://example.com/search?q=hello%20world&lang=%ED%95%9C%EA%B5%AD%EC%96%B4',
        'name=%ED%99%8D%EA%B8%B8%EB%8F%99&email=user%40example.com',
        '%2Fapi%2Fv1%2Fproducts%3Fcategory%3D%EC%A0%84%EC%9E%90%EC%A0%9C%ED%92%88',
        'Hello%20World%21%20%ED%8A%B9%EC%88%98%EB%AC%B8%EC%9E%90%3A%20%40%23%24%25'
      ];
      setInput(samples[Math.floor(Math.random() * samples.length)]);
    }
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `url_${mode}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleQueryStringParse = () => {
    try {
      const params = parseQueryString(input);
      const formatted = JSON.stringify(params, null, 2);
      setOutput(formatted);
      setToastMessage('쿼리 문자열이 파싱되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="URL 인코딩/디코딩"
        description="URL과 쿼리 파라미터를 안전하게 인코딩하거나 디코딩합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 모드 선택 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">모드</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="encode"
                      checked={mode === 'encode'}
                      onChange={(e) => setMode(e.target.value as Mode)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">인코딩</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="decode"
                      checked={mode === 'decode'}
                      onChange={(e) => setMode(e.target.value as Mode)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">디코딩</span>
                  </label>
                </div>
              </div>

              {/* 인코딩 타입 선택 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">인코딩 타입</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="encodingType"
                      value="component"
                      checked={encodingType === 'component'}
                      onChange={(e) => setEncodingType(e.target.value as EncodingType)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Component</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="encodingType"
                      value="full"
                      checked={encodingType === 'full'}
                      onChange={(e) => setEncodingType(e.target.value as EncodingType)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Full URL</span>
                  </label>
                </div>
              </div>

              {/* 실시간 처리 */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoProcess}
                    onChange={(e) => setAutoProcess(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">실시간 처리</span>
                </label>
              </div>
            </div>

            {/* 인코딩 타입 설명 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Component:</strong> 쿼리 파라미터나 경로 세그먼트에 사용 (더 엄격한 인코딩)<br />
                <strong>Full URL:</strong> 전체 URL에 사용 (프로토콜, 도메인은 유지)
              </p>
            </div>
          </div>

          {/* 입력/출력 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 영역 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-gray-700">
                  입력 ({mode === 'encode' ? 'URL/텍스트' : '인코딩된 URL'})
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {input.length}자
                  </span>
                  <button
                    onClick={handleSample}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    예시 데이터
                  </button>
                </div>
              </div>

              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'encode'
                    ? 'URL이나 텍스트를 입력하세요...\n예: https://example.com?name=홍길동'
                    : '인코딩된 URL을 입력하세요...\n예: https://example.com?name=%ED%99%8D%EA%B8%B8%EB%8F%99'
                }
                className="font-mono text-sm"
                rows={8}
              />

              {/* 추가 도구 */}
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleQueryStringParse}
                  variant="secondary"
                  size="sm"
                  disabled={!input}
                >
                  쿼리 파싱
                </Button>
                <Button
                  onClick={() => setShowChart(!showChart)}
                  variant="secondary"
                  size="sm"
                >
                  인코딩 차트
                </Button>
              </div>

              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* 출력 영역 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-gray-700">
                  결과 ({mode === 'encode' ? '인코딩됨' : '디코딩됨'})
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {output.length}자
                  </span>
                </div>
              </div>

              <TextArea
                value={output}
                readOnly
                placeholder={
                  mode === 'encode'
                    ? '인코딩된 결과가 여기에 표시됩니다...'
                    : '디코딩된 결과가 여기에 표시됩니다...'
                }
                className="font-mono text-sm"
                rows={8}
              />

              {/* 액션 버튼들 */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleCopy}
                  variant="primary"
                  size="sm"
                  disabled={!output}
                >
                  복사
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="sm"
                  disabled={!output}
                >
                  다운로드
                </Button>
                <Button
                  onClick={handleSwap}
                  variant="secondary"
                  size="sm"
                  disabled={!output || !!error}
                >
                  입력↔출력 전환
                </Button>
              </div>
            </div>
          </div>

          {/* 하단 정보 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* URL 분석 */}
            {urlAnalysis && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">URL 분석</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">프로토콜</span>
                    <span className="text-xs font-mono">{urlAnalysis.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">호스트</span>
                    <span className="text-xs font-mono">{urlAnalysis.hostname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">경로</span>
                    <span className="text-xs font-mono truncate">{urlAnalysis.pathname}</span>
                  </div>
                  {urlAnalysis.search && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">쿼리</span>
                      <span className="text-xs font-mono truncate">{urlAnalysis.search}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 인코딩 통계 */}
            {stats && mode === 'encode' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">인코딩 통계</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">원본 길이</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.originalLength}자</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">인코딩 길이</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.encodedLength}자</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">크기 비율</p>
                    <p className="text-lg font-semibold text-blue-600">{stats.ratio}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">인코딩된 문자</p>
                    <p className="text-lg font-semibold text-orange-600">{stats.encodedChars}개</p>
                  </div>
                </div>
              </div>
            )}

            {/* 사용 팁 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span> 사용 팁
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>URL에 한글이나 특수문자가 포함된 경우 인코딩이 필요합니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>Component는 파라미터값, Full은 전체 URL에 사용하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>API 호출 시 쿼리 파라미터는 항상 인코딩해야 합니다</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 인코딩 차트 모달 */}
          {showChart && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700">특수문자 인코딩 차트</h3>
                <button
                  onClick={() => setShowChart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getEncodingChart().map((item) => (
                  <div key={item.char} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-gray-900">{item.char}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                    <span className="font-mono text-sm text-blue-600">{item.encoded}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 컨트롤 버튼들 */}
          <div className="flex justify-center gap-3 mt-6">
            {!autoProcess && (
              <Button
                onClick={handleProcess}
                variant="primary"
                disabled={!input}
              >
                {mode === 'encode' ? '인코딩하기' : '디코딩하기'}
              </Button>
            )}
            <Button
              onClick={handleClear}
              variant="secondary"
              disabled={!input && !output}
            >
              모두 지우기
            </Button>
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