import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import {
  encodeBase64,
  decodeBase64,
  isValidBase64,
  fileToBase64,
  calculateBase64Stats
} from './utils';

type Mode = 'encode' | 'decode';

interface Stats {
  originalSize: number;
  encodedSize: number;
  ratio: string;
  increase: number;
}

export default function Base64() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [autoProcess, setAutoProcess] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 자동 처리
  useEffect(() => {
    if (autoProcess && input) {
      handleProcess();
    }
  }, [input, mode, autoProcess]);

  const handleProcess = useCallback(() => {
    if (!input) {
      setOutput('');
      setError('');
      setStats(null);
      return;
    }

    setError('');

    try {
      if (mode === 'encode') {
        const encoded = encodeBase64(input);
        setOutput(encoded);
        setStats(calculateBase64Stats(input, encoded));
      } else {
        if (!isValidBase64(input)) {
          throw new Error('유효한 Base64 형식이 아닙니다.');
        }
        const decoded = decodeBase64(input);
        setOutput(decoded);
        setStats(null);
      }
    } catch (err: any) {
      setError(err.message);
      setOutput('');
      setStats(null);
    }
  }, [input, mode]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setStats(null);
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
        'Hello, World! 안녕하세요!',
        '{"name":"John","age":30,"city":"Seoul"}',
        'user@example.com:password123',
        'The quick brown fox jumps over the lazy dog',
        '특수문자 테스트: !@#$%^&*()'
      ];
      setInput(samples[Math.floor(Math.random() * samples.length)]);
    } else {
      const samples = [
        'SGVsbG8sIFdvcmxkISDslYjrhZXtlZjshLjsmpQh',
        'eyJuYW1lIjoiSm9obiIsImFnZSI6MzAsImNpdHkiOiJTZW91bCJ9',
        'dXNlckBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw==',
        'VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw=='
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
    link.download = `base64_${mode}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 파일 업로드 처리 (인코딩 모드에서만)
  const handleFileUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setInput(base64);
      setToastMessage(`파일 "${file.name}"이 업로드되었습니다.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (mode === 'encode') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (mode === 'encode' && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileUpload(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="Base64 인코딩/디코딩"
        description="텍스트와 파일을 Base64 형식으로 인코딩하거나 디코딩합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 모드 선택 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="encode"
                    checked={mode === 'encode'}
                    onChange={(e) => setMode(e.target.value as Mode)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    인코딩 (텍스트 → Base64)
                  </span>
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
                  <span className="text-sm font-medium text-gray-700">
                    디코딩 (Base64 → 텍스트)
                  </span>
                </label>
              </div>

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

          {/* 입력/출력 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 영역 */}
            <div
              className={`flex flex-col transition-colors ${
                isDragging ? 'opacity-80' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-semibold text-gray-700">
                  {mode === 'encode' ? '입력 (텍스트/파일)' : '입력 (Base64)'}
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
                    ? '인코딩할 텍스트를 입력하거나 파일을 드래그하세요...'
                    : '디코딩할 Base64 문자열을 입력하세요...'
                }
                className="font-mono text-sm"
                rows={10}
              />

              {mode === 'encode' && (
                <div className="mt-4">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    파일 업로드
                  </label>
                  <span className="ml-3 text-xs text-gray-500">
                    또는 파일을 드래그 앤 드롭
                  </span>
                </div>
              )}

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
                  {mode === 'encode' ? '결과 (Base64)' : '결과 (텍스트)'}
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
                    ? '인코딩된 Base64 결과가 여기에 표시됩니다...'
                    : '디코딩된 텍스트가 여기에 표시됩니다...'
                }
                className="font-mono text-sm"
                rows={10}
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

          {/* 하단 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* 통계 정보 */}
            {stats && mode === 'encode' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">인코딩 통계</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">원본 크기</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.originalSize} bytes</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">인코딩 크기</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.encodedSize} bytes</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">크기 비율</p>
                    <p className="text-lg font-semibold text-blue-600">{stats.ratio}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">증가량</p>
                    <p className="text-lg font-semibold text-orange-600">+{stats.increase} bytes</p>
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
                  <span>Base64는 바이너리 데이터를 텍스트로 표현하는 인코딩 방식입니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>인코딩 시 데이터 크기가 약 33% 증가합니다</span>
                </li>
                {mode === 'encode' && (
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>이미지나 파일을 드래그 앤 드롭으로 쉽게 인코딩할 수 있습니다</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>JWT 토큰, API 키, 인증 정보 등을 안전하게 전송할 때 사용됩니다</span>
                </li>
              </ul>
            </div>
          </div>

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