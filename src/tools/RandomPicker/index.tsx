import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/TextArea';
import { pickFromList, pickRandomNumbers, parseList } from './utils';

type PickerMode = 'list' | 'number';

export default function RandomPicker() {
  const [mode, setMode] = useState<PickerMode>('list');
  const [listText, setListText] = useState('');
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [results, setResults] = useState<(string | number)[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePick = () => {
    try {
      setIsAnimating(true);

      if (mode === 'list') {
        const items = parseList(listText);
        if (items.length === 0) {
          throw new Error('목록에 항목을 입력해주세요.');
        }
        const picked = pickFromList(items, count, allowDuplicates);
        setResults(picked);
      } else {
        const picked = pickRandomNumbers(minNumber, maxNumber, count, allowDuplicates);
        setResults(picked);
      }

      setToastMessage('추첨이 완료되었습니다!');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsAnimating(false);
      }, 2000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : '추첨 중 오류가 발생했습니다.');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsAnimating(false);
      }, 3000);
    }
  };

  const handleClear = () => {
    setResults([]);
    setListText('');
    setMinNumber(1);
    setMaxNumber(100);
    setCount(1);
    setAllowDuplicates(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join('\n'));
    setToastMessage('결과가 클립보드에 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="랜덤 추첨기"
        description="목록이나 숫자 범위에서 랜덤하게 선택합니다. 중복 허용 여부를 설정할 수 있습니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 모드 선택 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <label className="text-sm font-medium text-gray-700 mb-3 block">추첨 모드</label>
            <div className="flex gap-3">
              <button
                onClick={() => setMode('list')}
                className={`flex-1 px-4 py-3 text-sm rounded-lg transition-all ${
                  mode === 'list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                목록에서 선택
              </button>
              <button
                onClick={() => setMode('number')}
                className={`flex-1 px-4 py-3 text-sm rounded-lg transition-all ${
                  mode === 'number'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                숫자 범위 선택
              </button>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            {mode === 'list' ? (
              <div className="h-64">
                <TextArea
                  label="항목 입력 (한 줄에 하나씩)"
                  value={listText}
                  onChange={(e) => setListText(e.target.value)}
                  placeholder="사과&#10;바나나&#10;오렌지&#10;포도&#10;딸기"
                  className="h-full"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">최소값</label>
                  <input
                    type="number"
                    value={minNumber}
                    onChange={(e) => setMinNumber(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">최대값</label>
                  <input
                    type="number"
                    value={maxNumber}
                    onChange={(e) => setMaxNumber(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 옵션 설정 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">선택 개수</label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowDuplicates}
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                  />
                  <span className="text-sm text-gray-700">중복 허용</span>
                </label>
              </div>
            </div>
          </div>

          {/* 추첨 버튼 */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handlePick}>추첨하기</Button>
            <Button variant="secondary" onClick={handleClear}>
              초기화
            </Button>
          </div>

          {/* 추첨 결과 */}
          {results.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700">추첨 결과</h3>
                <Button onClick={handleCopy} variant="secondary" size="sm">
                  복사
                </Button>
              </div>
              <div
                className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 ${
                  isAnimating ? 'animate-bounce' : ''
                }`}
              >
                <div className="flex flex-wrap gap-3 justify-center">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white px-6 py-4 rounded-lg shadow-md border-2 border-blue-300 min-w-[120px] text-center"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: isAnimating ? 'fadeIn 0.5s ease-in-out' : 'none'
                      }}
                    >
                      <span className="text-2xl font-bold text-blue-600">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 사용 팁
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>목록 모드: 텍스트를 한 줄에 하나씩 입력하면 그 중에서 랜덤 선택됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>숫자 모드: 지정한 범위 내에서 랜덤 숫자가 선택됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>중복 허용을 체크하면 같은 항목이나 숫자가 여러 번 선택될 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>crypto.getRandomValues()를 사용하여 안전한 랜덤 선택을 보장합니다</span>
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
