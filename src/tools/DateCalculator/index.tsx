import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import {
  calculateDDay,
  calculateDateDifference,
  addDays,
  subtractDays,
  formatDateResult,
  formatDateDifference,
  formatDDay,
  isValidDate,
  type DateDifference
} from './utils';

type CalculatorMode = 'dday' | 'difference' | 'addsubtract';
type AddSubtractMode = 'add' | 'subtract';

export default function DateCalculator() {
  const today = new Date().toISOString().split('T')[0];

  const [mode, setMode] = useState<CalculatorMode>('dday');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // D-day 모드 상태
  const [targetDate, setTargetDate] = useState('');
  const [ddayResult, setDdayResult] = useState<number | null>(null);

  // 날짜 차이 모드 상태
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [differenceResult, setDifferenceResult] = useState<DateDifference | null>(null);

  // 날짜 더하기/빼기 모드 상태
  const [baseDate, setBaseDate] = useState(today);
  const [daysCount, setDaysCount] = useState(0);
  const [addSubtractMode, setAddSubtractMode] = useState<AddSubtractMode>('add');
  const [calculatedDate, setCalculatedDate] = useState<Date | null>(null);

  const [error, setError] = useState('');

  const handleDDayCalculate = () => {
    setError('');
    setDdayResult(null);

    if (!targetDate) {
      setError('목표 날짜를 입력해주세요.');
      return;
    }

    try {
      const target = new Date(targetDate);

      if (!isValidDate(target)) {
        setError('유효하지 않은 날짜입니다.');
        return;
      }

      const result = calculateDDay(target);
      setDdayResult(result);
      setToastMessage('D-day가 계산되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'D-day 계산 중 오류가 발생했습니다.');
    }
  };

  const handleDifferenceCalculate = () => {
    setError('');
    setDifferenceResult(null);

    if (!startDate || !endDate) {
      setError('시작 날짜와 종료 날짜를 모두 입력해주세요.');
      return;
    }

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isValidDate(start) || !isValidDate(end)) {
        setError('유효하지 않은 날짜입니다.');
        return;
      }

      const result = calculateDateDifference(start, end);
      setDifferenceResult(result);
      setToastMessage('날짜 차이가 계산되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '날짜 차이 계산 중 오류가 발생했습니다.');
    }
  };

  const handleAddSubtractCalculate = () => {
    setError('');
    setCalculatedDate(null);

    if (!baseDate) {
      setError('기준 날짜를 입력해주세요.');
      return;
    }

    try {
      const base = new Date(baseDate);

      if (!isValidDate(base)) {
        setError('유효하지 않은 날짜입니다.');
        return;
      }

      const result = addSubtractMode === 'add'
        ? addDays(base, daysCount)
        : subtractDays(base, daysCount);

      setCalculatedDate(result);
      setToastMessage('날짜가 계산되었습니다!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '날짜 계산 중 오류가 발생했습니다.');
    }
  };

  const handleClear = () => {
    setTargetDate('');
    setDdayResult(null);
    setStartDate('');
    setEndDate('');
    setDifferenceResult(null);
    setBaseDate(today);
    setDaysCount(0);
    setCalculatedDate(null);
    setError('');
  };

  const modes = [
    { value: 'dday', label: 'D-day 계산' },
    { value: 'difference', label: '날짜 차이' },
    { value: 'addsubtract', label: '날짜 더하기/빼기' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="날짜 계산기"
        description="D-day 계산, 두 날짜 사이의 기간 계산, 날짜 더하기/빼기 기능을 제공합니다"
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 모드 선택 탭 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">계산 모드</label>
            <div className="flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m.value}
                  onClick={() => {
                    setMode(m.value as CalculatorMode);
                    setError('');
                  }}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    mode === m.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* D-day 계산 모드 */}
          {mode === 'dday' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">D-day 계산</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    목표 날짜 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button onClick={handleDDayCalculate}>계산하기</Button>
                <Button variant="secondary" onClick={handleClear}>초기화</Button>
              </div>

              {ddayResult !== null && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-900 mb-2">
                      {formatDDay(ddayResult)}
                    </div>
                    <div className="text-sm text-blue-700">
                      {ddayResult > 0 && `${ddayResult}일 남았습니다`}
                      {ddayResult < 0 && `${Math.abs(ddayResult)}일 지났습니다`}
                      {ddayResult === 0 && '오늘이 D-Day입니다!'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 날짜 차이 모드 */}
          {mode === 'difference' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">날짜 차이 계산</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    시작 날짜 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    종료 날짜 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button onClick={handleDifferenceCalculate}>계산하기</Button>
                <Button variant="secondary" onClick={handleClear}>초기화</Button>
              </div>

              {differenceResult && (
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-sm text-blue-600 font-medium mb-1">년</div>
                      <div className="text-3xl font-bold text-blue-900">{differenceResult.years}</div>
                      <div className="text-xs text-blue-600 mt-1">Years</div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-sm text-green-600 font-medium mb-1">개월</div>
                      <div className="text-3xl font-bold text-green-900">{differenceResult.months}</div>
                      <div className="text-xs text-green-600 mt-1">Months</div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="text-sm text-purple-600 font-medium mb-1">일</div>
                      <div className="text-3xl font-bold text-purple-900">{differenceResult.days}</div>
                      <div className="text-xs text-purple-600 mt-1">Days</div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-sm text-blue-700 mb-1">총 기간</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {formatDateDifference(differenceResult)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 날짜 더하기/빼기 모드 */}
          {mode === 'addsubtract' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">날짜 더하기/빼기</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    기준 날짜 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={baseDate}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    일 수 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={daysCount}
                    onChange={(e) => setDaysCount(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">연산 방식</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAddSubtractMode('add')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      addSubtractMode === 'add'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    더하기 (+)
                  </button>
                  <button
                    onClick={() => setAddSubtractMode('subtract')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      addSubtractMode === 'subtract'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    빼기 (-)
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button onClick={handleAddSubtractCalculate}>계산하기</Button>
                <Button variant="secondary" onClick={handleClear}>초기화</Button>
              </div>

              {calculatedDate && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-sm text-green-700 mb-2">
                      {baseDate} {addSubtractMode === 'add' ? '+' : '-'} {daysCount}일
                    </div>
                    <div className="text-4xl font-bold text-green-900">
                      {formatDateResult(calculatedDate)}
                    </div>
                    <div className="text-xs text-green-700 mt-2">
                      {calculatedDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </div>
                  </div>
                </div>
              )}
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
                <div>
                  <strong>D-day 계산</strong>: 목표 날짜까지 남은 일수를 계산합니다.
                  양수는 앞으로 남은 일수, 음수는 지난 일수를 의미합니다.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <div>
                  <strong>날짜 차이</strong>: 두 날짜 사이의 정확한 기간을 년, 월, 일 단위로 계산합니다.
                  날짜 순서는 자동으로 정렬됩니다.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <div>
                  <strong>날짜 더하기/빼기</strong>: 기준 날짜에서 N일 후 또는 N일 전의 날짜를 계산합니다.
                  윤년과 월말을 자동으로 고려합니다.
                </div>
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
