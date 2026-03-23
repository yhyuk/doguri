import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { convertCase } from './utils';
import type { CaseType } from './utils';

interface CaseOption {
  value: CaseType;
  label: string;
  description: string;
  example: string;
  icon?: string;
  category: 'basic' | 'developer';
}

const caseOptions: CaseOption[] = [
  // 기본 변환
  {
    value: 'upper',
    label: 'UPPERCASE',
    description: '모든 문자를 대문자로',
    example: 'HELLO WORLD',
    icon: '🔠',
    category: 'basic',
  },
  {
    value: 'lower',
    label: 'lowercase',
    description: '모든 문자를 소문자로',
    example: 'hello world',
    icon: '🔡',
    category: 'basic',
  },
  {
    value: 'title',
    label: 'Title Case',
    description: '각 단어의 첫 글자를 대문자로',
    example: 'Hello World',
    icon: '📝',
    category: 'basic',
  },
  {
    value: 'sentence',
    label: 'Sentence case',
    description: '문장의 첫 글자만 대문자로',
    example: 'Hello world',
    icon: '✍️',
    category: 'basic',
  },
  // 개발자용
  {
    value: 'camel',
    label: 'camelCase',
    description: '첫 단어는 소문자, 나머지는 대문자로 시작',
    example: 'helloWorld',
    icon: '🐫',
    category: 'developer',
  },
  {
    value: 'pascal',
    label: 'PascalCase',
    description: '모든 단어를 대문자로 시작',
    example: 'HelloWorld',
    icon: '🏛️',
    category: 'developer',
  },
  {
    value: 'snake',
    label: 'snake_case',
    description: '소문자와 언더스코어로 연결',
    example: 'hello_world',
    icon: '🐍',
    category: 'developer',
  },
  {
    value: 'kebab',
    label: 'kebab-case',
    description: '소문자와 하이픈으로 연결',
    example: 'hello-world',
    icon: '🍢',
    category: 'developer',
  },
];

export default function TextCase() {
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState<Record<CaseType, string>>({} as Record<CaseType, string>);
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null);
  const [autoConvert, setAutoConvert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [charCount, setCharCount] = useState(0);

  // 자동 변환 처리
  useEffect(() => {
    if (autoConvert && input) {
      handleConvert();
    }
    setCharCount(input.length);
  }, [input, autoConvert]);

  const handleConvert = useCallback(() => {
    if (!input) {
      setOutputs({} as Record<CaseType, string>);
      return;
    }

    const newOutputs: Record<CaseType, string> = {} as Record<CaseType, string>;
    caseOptions.forEach(option => {
      newOutputs[option.value] = convertCase(input, option.value);
    });
    setOutputs(newOutputs);
  }, [input]);

  const handleClear = () => {
    setInput('');
    setOutputs({} as Record<CaseType, string>);
    setSelectedCase(null);
    setCharCount(0);
  };

  const handleQuickCopy = (caseType: CaseType, text: string) => {
    navigator.clipboard.writeText(text);
    setSelectedCase(caseType);
    setToastMessage(`${caseOptions.find(opt => opt.value === caseType)?.label} 복사됨!`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setSelectedCase(null);
    }, 2000);
  };

  const handleSampleText = () => {
    const samples = [
      'hello world example text',
      'Convert This Text Please',
      'the quick brown fox jumps',
      'user authentication service',
      'product catalog manager',
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setInput(randomSample);
    if (autoConvert) {
      setTimeout(() => handleConvert(), 0);
    }
  };


  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="대소문자 변환"
        description="텍스트를 다양한 대소문자 형식으로 변환합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 입력 영역 */}
            <div className="space-y-4">
              {/* 입력 카드 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-gray-700">
                    변환할 텍스트
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {charCount}자
                    </span>
                    <button
                      onClick={handleSampleText}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      예시 텍스트
                    </button>
                  </div>
                </div>

                <TextArea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="변환할 텍스트를 입력하세요..."
                  className="font-mono text-sm"
                  rows={8}
                />

                {/* 컨트롤 버튼들 */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoConvert}
                        onChange={(e) => setAutoConvert(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">실시간 변환</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    {!autoConvert && (
                      <Button
                        onClick={handleConvert}
                        variant="primary"
                        disabled={!input}
                      >
                        변환하기
                      </Button>
                    )}
                    <Button
                      onClick={handleClear}
                      variant="secondary"
                      disabled={!input && Object.keys(outputs).length === 0}
                    >
                      초기화
                    </Button>
                  </div>
                </div>
              </div>

              {/* 사용 가이드 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span> 사용 팁
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>실시간 변환을 켜면 입력과 동시에 결과를 확인할 수 있습니다</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>결과 카드를 클릭하면 자동으로 복사됩니다</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>개발자용 케이스는 변수명, 함수명 등에 사용하세요</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 오른쪽: 결과 영역 */}
            <div className="space-y-4">
              {/* 모든 변환 결과 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {caseOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => outputs[option.value] && handleQuickCopy(option.value, outputs[option.value])}
                      className={`
                        bg-white rounded-lg border p-4 transition-all cursor-pointer
                        ${selectedCase === option.value
                          ? 'border-green-400 bg-green-50 shadow-md transform scale-[1.02]'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }
                        ${!outputs[option.value] ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{option.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{option.label}</h4>
                            <p className="text-xs text-gray-500">{option.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-md p-3 mt-2">
                        <p className="font-mono text-sm text-gray-800 break-all line-clamp-2">
                          {outputs[option.value] || (
                            <span className="text-gray-400 italic">
                              {option.example}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                ))}
              </div>

              {/* 통계 정보 */}
              {Object.keys(outputs).length > 0 && input && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500">원본 길이</p>
                      <p className="text-lg font-semibold text-gray-900">{input.length}자</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">단어 수</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {input.trim().split(/\s+/).filter(w => w).length}개
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">변환 옵션</p>
                      <p className="text-lg font-semibold text-gray-900">8가지</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
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