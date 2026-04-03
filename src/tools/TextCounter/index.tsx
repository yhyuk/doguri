import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import { getTextStats, type TextStats } from './utils';

export default function TextCounter() {
  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState<TextStats>({
    totalCharacters: 0,
    charactersWithoutSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    withinTwitterLimit: true,
    readingTimeMinutes: 0,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 텍스트 변경 시 실시간 카운팅
  useEffect(() => {
    setStats(getTextStats(text));
  }, [text]);

  const handleClear = () => {
    setText('');
    setToastMessage('텍스트가 초기화되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCopy = () => {
    const statsText = `총 글자 수: ${stats.totalCharacters}
공백 제외: ${stats.charactersWithoutSpaces}
단어 수: ${stats.words}
문장 수: ${stats.sentences}
문단 수: ${stats.paragraphs}
예상 읽기 시간: ${stats.readingTimeMinutes}분

--- 원본 텍스트 ---
${text}`;

    navigator.clipboard.writeText(statsText);
    setToastMessage('통계가 클립보드에 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="글자수 계산"
        description="글자 수, 단어 수, 문장 수, 문단 수를 실시간으로 계산합니다. 한글과 영문을 모두 지원합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 텍스트 입력 영역 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  텍스트 입력
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="여기에 텍스트를 입력하세요..."
                  className="w-full h-96 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleCopy} disabled={text.length === 0}>
                    통계 복사
                  </Button>
                  <Button variant="secondary" onClick={handleClear} disabled={text.length === 0}>
                    초기화
                  </Button>
                </div>
              </div>
            </div>

            {/* 통계 영역 */}
            <div className="space-y-4">
              {/* 기본 통계 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">기본 통계</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">총 글자 수</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.totalCharacters.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">공백 제외</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.charactersWithoutSpaces.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">단어 수</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.words.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">문장 수</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.sentences.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">문단 수</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.paragraphs.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">추가 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">예상 읽기 시간</span>
                    <span className="text-lg font-bold text-purple-600">
                      {stats.readingTimeMinutes}분
                    </span>
                  </div>
                </div>
              </div>

              {/* 빠른 통계 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">요약</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">글자</div>
                    <div className="text-xl font-bold text-blue-600">
                      {stats.totalCharacters.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">단어</div>
                    <div className="text-xl font-bold text-blue-600">
                      {stats.words.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">문장</div>
                    <div className="text-xl font-bold text-blue-600">
                      {stats.sentences.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">문단</div>
                    <div className="text-xl font-bold text-blue-600">
                      {stats.paragraphs.toLocaleString()}
                    </div>
                  </div>
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
                <span>텍스트를 입력하면 실시간으로 통계가 업데이트됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>한글과 영문 모두 정확하게 카운트됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>빈 줄로 구분된 텍스트는 별도의 문단으로 카운트됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>예상 읽기 시간은 평균 200단어/분 기준입니다</span>
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
