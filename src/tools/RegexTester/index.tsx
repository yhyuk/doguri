import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import {
  testRegex,
  replaceWithRegex,
  type RegexFlags,
  COMMON_PATTERNS,
  highlightMatches
} from './utils';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [replacement, setReplacement] = useState('');
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [mode, setMode] = useState<'test' | 'replace'>('test');
  const [result, setResult] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleTest = () => {
    const testResult = testRegex(pattern, testText, flags);
    setResult(testResult);

    if (!testResult.isValid && testResult.error) {
      setToastMessage(testResult.error);
    } else if (testResult.matches.length === 0) {
      setToastMessage('일치하는 항목이 없습니다.');
    } else {
      setToastMessage(`${testResult.matches.length}개의 일치 항목을 찾았습니다.`);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleReplace = () => {
    const replaceResult = replaceWithRegex(pattern, testText, replacement, flags);
    setResult(replaceResult);

    if (replaceResult.error) {
      setToastMessage(replaceResult.error);
    } else {
      setToastMessage(`${replaceResult.count}개 항목이 치환되었습니다.`);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleExecute = () => {
    if (mode === 'test') {
      handleTest();
    } else {
      handleReplace();
    }
  };

  const handleSelectPattern = (patternObj: typeof COMMON_PATTERNS[0]) => {
    setPattern(patternObj.pattern);
    setToastMessage(`${patternObj.name} 패턴이 적용되었습니다.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCopy = () => {
    if (mode === 'replace' && result?.result) {
      navigator.clipboard.writeText(result.result);
      setToastMessage('치환 결과가 복사되었습니다!');
    } else if (mode === 'test' && result?.matches) {
      const matches = result.matches.map((m: any) => m.match).join('\n');
      navigator.clipboard.writeText(matches);
      setToastMessage('매치 결과가 복사되었습니다!');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setPattern('');
    setTestText('');
    setReplacement('');
    setResult(null);
  };

  const handleExample = () => {
    setPattern('\\d{3}-\\d{4}-\\d{4}');
    setTestText('전화번호: 010-1234-5678\n긴급번호: 119\n팩스: 02-3456-7890');
    setToastMessage('예제가 로드되었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="정규식 테스터"
        description="정규식을 테스트하고 텍스트를 검색하거나 치환합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 모드 선택 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">모드</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('test')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      mode === 'test'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    테스트
                  </button>
                  <button
                    onClick={() => setMode('replace')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      mode === 'replace'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    치환
                  </button>
                </div>
              </div>

              {/* 일반 패턴 선택 */}
              <div className="lg:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">일반 패턴</label>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const idx = parseInt(e.target.value);
                      if (!isNaN(idx)) {
                        handleSelectPattern(COMMON_PATTERNS[idx]);
                      }
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">패턴 선택...</option>
                    {COMMON_PATTERNS.map((p, index) => (
                      <option key={index} value={index}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 플래그 옵션 */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">플래그</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags.global}
                    onChange={(e) => setFlags({ ...flags, global: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <code className="bg-gray-100 px-1 rounded">g</code> 전역
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags.ignoreCase}
                    onChange={(e) => setFlags({ ...flags, ignoreCase: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <code className="bg-gray-100 px-1 rounded">i</code> 대소문자
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags.multiline}
                    onChange={(e) => setFlags({ ...flags, multiline: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <code className="bg-gray-100 px-1 rounded">m</code> 여러줄
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags.dotAll}
                    onChange={(e) => setFlags({ ...flags, dotAll: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <code className="bg-gray-100 px-1 rounded">s</code> dotAll
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags.unicode}
                    onChange={(e) => setFlags({ ...flags, unicode: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <code className="bg-gray-100 px-1 rounded">u</code> 유니코드
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags.sticky}
                    onChange={(e) => setFlags({ ...flags, sticky: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    <code className="bg-gray-100 px-1 rounded">y</code> 고정
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* 정규식 패턴 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <label className="text-sm font-medium text-gray-700 mb-2 block">정규식 패턴</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="예: \d+ (숫자), [a-z]+ (영소문자)"
                  className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {mode === 'replace' && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">치환 텍스트</label>
                    <input
                      type="text"
                      value={replacement}
                      onChange={(e) => setReplacement(e.target.value)}
                      placeholder="치환할 텍스트를 입력하세요..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* 테스트 텍스트 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <TextArea
                  label="테스트 텍스트"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="정규식을 테스트할 텍스트를 입력하세요..."
                  rows={8}
                />
              </div>

              {/* 실행 버튼 */}
              <div className="flex gap-3">
                <Button onClick={handleExecute}>
                  {mode === 'test' ? '테스트 실행' : '치환 실행'}
                </Button>
                <Button variant="secondary" onClick={handleClear}>지우기</Button>
                <Button variant="secondary" onClick={handleExample}>예제</Button>
              </div>
            </div>

            {/* 결과 영역 */}
            <div className="space-y-4">
              {result && (
                <>
                  {mode === 'test' && result.isValid && (
                    <>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-semibold text-gray-700">
                            매치 결과 ({result.matches.length}개)
                          </h3>
                          {result.matches.length > 0 && (
                            <Button onClick={handleCopy} variant="secondary">
                              복사
                            </Button>
                          )}
                        </div>
                        {result.matches.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {result.matches.map((match: any, index: number) => (
                              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <span className="font-mono text-sm text-gray-700 break-all">
                                    {match.match}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    위치: {match.index}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                            일치하는 항목이 없습니다.
                          </div>
                        )}
                      </div>

                      {/* 하이라이트된 텍스트 */}
                      {result.matches.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">하이라이트 보기</h3>
                          <div
                            className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap font-mono text-sm"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatches(testText, result.matches)
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {mode === 'replace' && !result.error && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                          치환 결과 ({result.count}개 치환됨)
                        </h3>
                        <Button onClick={handleCopy} variant="secondary">
                          복사
                        </Button>
                      </div>
                      <TextArea
                        value={result.result}
                        readOnly
                        rows={8}
                        className="bg-gray-50"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 정규식 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><code className="bg-blue-100 px-1 rounded">\d</code>는 숫자, <code className="bg-blue-100 px-1 rounded">\w</code>는 문자, <code className="bg-blue-100 px-1 rounded">\s</code>는 공백을 의미합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><code className="bg-blue-100 px-1 rounded">+</code>는 1개 이상, <code className="bg-blue-100 px-1 rounded">*</code>는 0개 이상, <code className="bg-blue-100 px-1 rounded">?</code>는 0개 또는 1개를 의미합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>그룹 캡처는 <code className="bg-blue-100 px-1 rounded">()</code>를 사용하고, 캡처하지 않으려면 <code className="bg-blue-100 px-1 rounded">(?:)</code>를 사용하세요</span>
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