import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { generateHash, generateHashFromFile, type HashAlgorithm, toUpperCase, toLowerCase } from './utils';

const algorithms: { value: HashAlgorithm; label: string }[] = [
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-512', label: 'SHA-512' },
  { value: 'SHA-1', label: 'SHA-1' },
  { value: 'SHA-384', label: 'SHA-384' },
  { value: 'MD5', label: 'MD5 (레거시)' },
];

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [isUpperCase, setIsUpperCase] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  // 자동 생성
  useEffect(() => {
    if (autoGenerate && input) {
      handleGenerate();
    }
  }, [input, algorithm, isUpperCase, autoGenerate]);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError('텍스트를 입력해주세요.');
      setOutput('');
      return;
    }

    try {
      setError('');
      let hash = await generateHash(input, algorithm);
      if (isUpperCase) {
        hash = toUpperCase(hash);
      }
      setOutput(hash);
    } catch (err: any) {
      setError(err.message || '해시 생성 중 오류가 발생했습니다.');
      setOutput('');
    }
  }, [input, algorithm, isUpperCase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      let hash = await generateHashFromFile(file, algorithm);
      if (isUpperCase) {
        hash = toUpperCase(hash);
      }
      setOutput(hash);
      setToastMessage(`파일 "${file.name}"의 해시가 생성되었습니다!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err: any) {
      setError(err.message || '파일 해시 생성 중 오류가 발생했습니다.');
      setOutput('');
    }
  };

  const handleCopy = () => {
    if (!output) return;

    navigator.clipboard.writeText(output);
    setToastMessage('해시가 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleToggleCase = () => {
    if (output) {
      setOutput(isUpperCase ? toLowerCase(output) : toUpperCase(output));
      setIsUpperCase(!isUpperCase);
    }
  };

  const handleExample = () => {
    const examples = [
      'Hello, World!',
      'password123',
      'test@example.com',
      'The quick brown fox jumps over the lazy dog',
      '안녕하세요, 세계!',
      JSON.stringify({ name: 'John', age: 30 }),
    ];
    setInput(examples[Math.floor(Math.random() * examples.length)]);
  };

  const handleDownload = () => {
    if (!output) return;

    const content = `Algorithm: ${algorithm}\nInput: ${input}\nHash: ${output}\nTimestamp: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hash_${algorithm.toLowerCase()}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setToastMessage('파일이 다운로드되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const inputSize = new Blob([input]).size;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="해시 생성기"
        description="텍스트나 파일의 해시값을 생성합니다. MD5, SHA-1, SHA-256, SHA-384, SHA-512를 지원합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 알고리즘 선택 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">알고리즘</label>
                <div className="flex flex-wrap gap-2">
                  {algorithms.map((algo) => (
                    <button
                      key={algo.value}
                      onClick={() => setAlgorithm(algo.value)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        algorithm === algo.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {algo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 대소문자 옵션 */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUpperCase}
                    onChange={handleToggleCase}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">대문자 출력</span>
                </label>
              </div>

              {/* 자동 생성 */}
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoGenerate}
                    onChange={(e) => setAutoGenerate(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">자동 생성</span>
                </label>
              </div>
            </div>
          </div>

          {/* 입력/출력 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
            <div className="flex flex-col">
              <TextArea
                label="입력 텍스트"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="해시를 생성할 텍스트를 입력하세요..."
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleGenerate}>생성하기</Button>
                <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  파일 선택
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
              </div>
            </div>

            <div className="flex flex-col">
              <TextArea
                label={`생성된 해시 (${algorithm})`}
                value={output}
                readOnly
                placeholder="생성된 해시가 여기에 표시됩니다"
                className="font-mono"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleCopy} disabled={!output}>복사</Button>
                <Button variant="secondary" onClick={handleDownload} disabled={!output}>
                  다운로드
                </Button>
              </div>
            </div>
          </div>

          {/* 하단 정보 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* 상태 표시 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    error ? 'bg-red-500' : output ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    error ? 'text-red-600' : output ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {error || (output ? '✓ 해시 생성 완료' : '텍스트를 입력하세요')}
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
                  출력: <span className="font-medium">{output.length}</span> 문자
                </span>
              </div>
            </div>

            {/* 알고리즘 정보 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="text-sm text-gray-600">
                알고리즘: <span className="font-medium">{algorithm}</span> |
                길이: <span className="font-medium">
                  {algorithm === 'MD5' ? '128' :
                   algorithm === 'SHA-1' ? '160' :
                   algorithm === 'SHA-256' ? '256' :
                   algorithm === 'SHA-384' ? '384' : '512'} bits
                </span>
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
                <span>SHA-256은 가장 널리 사용되는 안전한 해시 알고리즘입니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>MD5와 SHA-1은 보안 목적으로는 사용하지 마세요 (레거시 시스템 호환용)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>파일을 드래그 앤 드롭하거나 파일 선택 버튼으로 파일 해시를 생성할 수 있습니다</span>
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