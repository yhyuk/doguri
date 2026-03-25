import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  compareDiff,
  createUnifiedDiff,
  renderDiffAsHtml,
  renderSideBySide,
  type DiffType
} from './utils';

type ViewMode = 'inline' | 'side-by-side' | 'unified';

export default function DiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffType, setDiffType] = useState<DiffType>('lines');
  const [viewMode, setViewMode] = useState<ViewMode>('inline');
  const [result, setResult] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCompare = () => {
    if (!text1 && !text2) {
      setToastMessage('비교할 텍스트를 입력해주세요.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const diffResult = compareDiff(text1, text2, diffType);
      setResult(diffResult);

      if (diffResult.similarity === 100) {
        setToastMessage('두 텍스트가 동일합니다.');
      } else {
        setToastMessage(`유사도: ${diffResult.similarity}% (추가: ${diffResult.added}, 삭제: ${diffResult.removed})`);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : '비교 중 오류가 발생했습니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSwap = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setResult(null);
    setToastMessage('텍스트가 바뀌었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleClear = () => {
    setText1('');
    setText2('');
    setResult(null);
  };

  const handleCopyUnified = () => {
    const patch = createUnifiedDiff(text1, text2);
    navigator.clipboard.writeText(patch);
    setToastMessage('Unified diff가 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleFileUpload = (file: File, setTextFunc: (text: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTextFunc(content);
      setToastMessage(`${file.name} 파일이 로드되었습니다.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    };
    reader.readAsText(file);
  };

  const handleExample = () => {
    setText1('Hello World\nThis is a test\nOriginal text\nLine 4\nLine 5');
    setText2('Hello World\nThis is a demo\nModified text\nLine 4\nLine 6');
    setToastMessage('예제가 로드되었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const diffTypes = [
    { value: 'lines', label: '줄 단위' },
    { value: 'words', label: '단어 단위' },
    { value: 'chars', label: '문자 단위' },
    { value: 'sentences', label: '문장 단위' },
    { value: 'json', label: 'JSON' },
    { value: 'css', label: 'CSS' }
  ];

  const viewModes = [
    { value: 'inline', label: '인라인' },
    { value: 'side-by-side', label: '나란히' },
    { value: 'unified', label: 'Unified' }
  ];

  const renderResult = () => {
    if (!result) return null;

    if (viewMode === 'inline') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">비교 결과 (인라인)</h3>
          <div
            className="p-4 bg-gray-50 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-x-auto"
            dangerouslySetInnerHTML={{
              __html: renderDiffAsHtml(result.changes)
            }}
          />
        </div>
      );
    }

    if (viewMode === 'side-by-side') {
      const { left, right } = renderSideBySide(text1, text2);
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">비교 결과 (나란히)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-2">원본</h4>
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-xs overflow-x-auto border border-gray-200">
                {left.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line === '' ? 'bg-red-50' : ''
                    } ${right[index] !== line ? 'bg-red-100' : ''}`}
                  >
                    {line || <span className="text-gray-400">{'<삭제됨>'}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-2">수정본</h4>
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-xs overflow-x-auto border border-gray-200">
                {right.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line === '' ? 'bg-green-50' : ''
                    } ${left[index] !== line ? 'bg-green-100' : ''}`}
                  >
                    {line || <span className="text-gray-400">{'<추가됨>'}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (viewMode === 'unified') {
      const patch = createUnifiedDiff(text1, text2);
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Unified Diff</h3>
            <Button onClick={handleCopyUnified} variant="secondary">복사</Button>
          </div>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-xs overflow-x-auto">
            {patch}
          </pre>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="Diff 비교 도구"
        description="두 텍스트의 차이점을 비교하고 변경 사항을 시각화합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 옵션 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 비교 단위 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">비교 단위</label>
                <div className="flex flex-wrap gap-2">
                  {diffTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setDiffType(type.value as DiffType)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        diffType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 보기 모드 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">보기 모드</label>
                <div className="flex flex-wrap gap-2">
                  {viewModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setViewMode(mode.value as ViewMode)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        viewMode === mode.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 텍스트 입력 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">원본 텍스트</label>
                <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  파일 선택
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, setText1);
                    }}
                  />
                </label>
              </div>
              <div className="w-full">
                <textarea
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="원본 텍스트를 입력하세요..."
                  rows={10}
                  className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">수정된 텍스트</label>
                <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                  파일 선택
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, setText2);
                    }}
                  />
                </label>
              </div>
              <div className="w-full">
                <textarea
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="수정된 텍스트를 입력하세요..."
                  rows={10}
                  className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handleCompare}>비교하기</Button>
            <Button onClick={handleSwap} variant="secondary">좌우 바꾸기</Button>
            <Button onClick={handleClear} variant="secondary">지우기</Button>
            <Button onClick={handleExample} variant="secondary">예제</Button>
          </div>

          {/* 통계 정보 */}
          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">비교 통계</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.similarity}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">유사도</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    +{result.added}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">추가</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    -{result.removed}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">삭제</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {result.unchanged}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">변경 없음</div>
                </div>
              </div>
            </div>
          )}

          {/* 결과 표시 */}
          {renderResult()}

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 mt-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>인라인 모드는 변경사항을 한 화면에서 색상으로 구분하여 보여줍니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>나란히 모드는 원본과 수정본을 좌우로 비교할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Unified 모드는 Git과 같은 표준 패치 형식으로 출력합니다</span>
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