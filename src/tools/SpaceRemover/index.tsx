import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { processText, getTextStats } from './utils';
import type { SpaceRemoverMode } from './utils';

const modeOptions = [
  { value: 'all', label: '모든 공백', description: '모든 공백 제거' },
  { value: 'duplicate', label: '중복 공백', description: '연속된 공백만 제거' },
  { value: 'trim', label: '앞뒤 공백', description: '문장 앞뒤 공백만 제거' },
  { value: 'linebreaks', label: '줄바꿈', description: '줄바꿈 제거' },
  { value: 'preserve', label: '단어 유지', description: '단어 간 공백 하나만 유지' },
];

export default function SpaceRemover() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<SpaceRemoverMode>('all');
  const [autoProcess, setAutoProcess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 자동 처리
  useEffect(() => {
    if (autoProcess && input) {
      const result = processText(input, mode);
      setOutput(result);
    } else if (!input) {
      setOutput('');
    }
  }, [input, mode, autoProcess]);

  const handleProcess = () => {
    if (!input) return;
    const result = processText(input, mode);
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
      setToastMessage('텍스트가 복사되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleExample = () => {
    const examples = [
      '  안녕하세요    공백    제거    도구입니다.  \n\n  여러   공백을   처리합니다.  ',
      'JavaScript  는   프로그래밍   언어입니다.\n\n   React  는   라이브러리입니다.',
      '   데이터   분석   을   위한   Python   코드   작성하기   ',
      '  trim()    함수는    앞뒤    공백을    제거합니다   ',
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
    a.download = `cleaned_text_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMessage('파일이 다운로드되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const inputStats = getTextStats(input);
  const outputStats = getTextStats(output);
  const spacesRemoved = inputStats.spaces - outputStats.spaces;
  const reductionRate = inputStats.total > 0
    ? Math.round((1 - outputStats.total / inputStats.total) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header
        title="공백 제거"
        description="텍스트의 공백을 다양한 방법으로 제거합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* 처리 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="flex flex-wrap items-start gap-6">
              {/* 처리 방식 */}
              <div className="flex-1 min-w-[300px]">
                <label className="text-sm font-medium text-gray-700 mb-3 block">처리 방식</label>
                <div className="flex flex-wrap gap-2">
                  {modeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMode(option.value as SpaceRemoverMode)}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        mode === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={option.description}
                    >
                      <div className="font-medium">{option.label}</div>
                      {mode === option.value && (
                        <div className="text-xs mt-0.5 opacity-90">{option.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 자동 처리 */}
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoProcess}
                    onChange={(e) => setAutoProcess(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">자동 처리</span>
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
                placeholder="공백이 포함된 텍스트를 입력하세요"
              />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleProcess} disabled={!input || autoProcess}>
                  처리하기
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
                placeholder="처리된 텍스트가 여기에 표시됩니다"
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
            {/* 공백 통계 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">입력 공백:</span>
                  <span className="font-medium">{inputStats.spaces}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">출력 공백:</span>
                  <span className="font-medium">{outputStats.spaces}개</span>
                </div>
                {spacesRemoved > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-green-600 font-medium">
                      {spacesRemoved}개 제거됨
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
                  <span className="font-medium">{inputStats.total} 문자</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">출력:</span>
                  <span className="font-medium">{outputStats.total} 문자</span>
                </div>
                {reductionRate > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-green-600 font-medium">
                      {reductionRate}% 감소
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 줄 수 통계 */}
            <div className="bg-white rounded-lg border border-gray-200 px-5 py-3">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">입력 줄:</span>
                  <span className="font-medium">{inputStats.lines}줄</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">출력 줄:</span>
                  <span className="font-medium">{outputStats.lines}줄</span>
                </div>
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
                <span>자동 처리를 켜면 입력과 동시에 공백이 제거됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>'단어 유지' 모드는 가독성을 위해 단어 사이 공백 하나를 유지합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>처리된 결과는 복사하거나 텍스트 파일로 다운로드할 수 있습니다</span>
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