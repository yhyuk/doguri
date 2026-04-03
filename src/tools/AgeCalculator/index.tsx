import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  calculateAllAges,
  isFutureDate,
  type AgeResult
} from './utils';

export default function AgeCalculator() {
  const today = new Date().toISOString().split('T')[0];

  const [birthDate, setBirthDate] = useState('');
  const [baseDate, setBaseDate] = useState(today);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }

    if (!baseDate) {
      setError('기준 날짜를 입력해주세요.');
      return;
    }

    try {
      const birth = new Date(birthDate);
      const base = new Date(baseDate);

      // 날짜 유효성 검증
      if (isNaN(birth.getTime()) || isNaN(base.getTime())) {
        setError('유효하지 않은 날짜입니다.');
        return;
      }

      // 미래 날짜 검증
      if (isFutureDate(birth, base)) {
        setError('생년월일이 기준 날짜보다 미래일 수 없습니다.');
        return;
      }

      const ageResult = calculateAllAges(birth, base);
      setResult(ageResult);
      setToastMessage('나이가 계산되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '나이 계산 중 오류가 발생했습니다.');
    }
  };

  const handleClear = () => {
    setBirthDate('');
    setBaseDate(today);
    setResult(null);
    setError('');
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="나이 계산기"
        description="생년월일을 입력하여 만 나이, 연 나이, 개월 수, 일 수 및 다음 생일까지 남은 일수를 계산합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 입력 패널 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 생년월일 입력 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  생년월일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={baseDate}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 기준 날짜 입력 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  기준 날짜
                </label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  max={today}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">기본값은 오늘 날짜입니다</p>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 mt-6">
              <Button onClick={handleCalculate}>계산하기</Button>
              <Button variant="secondary" onClick={handleClear}>초기화</Button>
            </div>
          </div>

          {/* 결과 패널 */}
          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 만 나이 (국제 나이) */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-600 font-medium mb-1">만 나이 (국제 나이)</div>
                  <div className="text-2xl font-bold text-blue-900">{formatNumber(result.internationalAge)}세</div>
                  <div className="text-xs text-blue-600 mt-1">International Age</div>
                </div>

                {/* 연 나이 (한국 나이) */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="text-sm text-green-600 font-medium mb-1">연 나이 (한국 나이)</div>
                  <div className="text-2xl font-bold text-green-900">{formatNumber(result.koreanAge)}세</div>
                  <div className="text-xs text-green-600 mt-1">Korean Age</div>
                </div>

                {/* 개월 수 */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-600 font-medium mb-1">총 개월 수</div>
                  <div className="text-2xl font-bold text-purple-900">{formatNumber(result.ageInMonths)}개월</div>
                  <div className="text-xs text-purple-600 mt-1">Months</div>
                </div>

                {/* 총 일 수 */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="text-sm text-orange-600 font-medium mb-1">총 일 수</div>
                  <div className="text-2xl font-bold text-orange-900">{formatNumber(result.ageInDays)}일</div>
                  <div className="text-xs text-orange-600 mt-1">Days</div>
                </div>

                {/* 다음 생일까지 */}
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                  <div className="text-sm text-pink-600 font-medium mb-1">다음 생일까지</div>
                  <div className="text-2xl font-bold text-pink-900">
                    {result.daysUntilBirthday === 0 ? '오늘' : `${formatNumber(result.daysUntilBirthday)}일`}
                  </div>
                  <div className="text-xs text-pink-600 mt-1">
                    {result.daysUntilBirthday === 0 ? '생일 축하합니다!' : 'Days Until Birthday'}
                  </div>
                </div>

                {/* 다음 생일 날짜 */}
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="text-sm text-indigo-600 font-medium mb-1">다음 생일</div>
                  <div className="text-lg font-bold text-indigo-900">{result.nextBirthdayDate}</div>
                  <div className="text-xs text-indigo-600 mt-1">Next Birthday</div>
                </div>
              </div>
            </div>
          )}

          {/* 사용 팁 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> 만 나이와 연 나이의 차이
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <div>
                  <strong>만 나이 (국제 나이)</strong>: 태어난 날을 0세로 계산하고, 생일이 지날 때마다 1세씩 증가합니다.
                  국제적으로 통용되는 나이 계산 방식입니다.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <div>
                  <strong>연 나이 (한국 나이)</strong>: 태어난 해를 기준으로 계산하며,
                  현재 연도 - 출생 연도 + 1로 계산됩니다. 한국에서 전통적으로 사용되던 방식입니다.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <div>
                  <strong>참고</strong>: 2023년 6월부터 대한민국에서는 공식적으로 만 나이를 사용합니다.
                </div>
              </div>
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
