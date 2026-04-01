import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {
  generateCronExpression,
  parseCronExpression,
  validateCronExpression,
  cronToHumanReadable,
  cronPresets,
  getNextRunTimes,
  type CronConfig
} from './utils';

type BuilderMode = 'simple' | 'advanced' | 'custom';

export default function CronGenerator() {
  const [mode, setMode] = useState<BuilderMode>('simple');
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [customInput, setCustomInput] = useState('');

  // Simple mode states
  const [simpleInterval, setSimpleInterval] = useState('every_minute');
  const [simpleHour, setSimpleHour] = useState('0');
  const [simpleMinute, setSimpleMinute] = useState('0');
  const [simpleDay, setSimpleDay] = useState('1');
  const [simpleWeekday, setSimpleWeekday] = useState('1');

  // Advanced mode states
  const [advancedConfig, setAdvancedConfig] = useState<CronConfig>({
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*'
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Simple mode 자동 업데이트 (useEffect로 상태 변경 감지)
  useEffect(() => {
    if (mode !== 'simple') return;

    let expression = '';

    switch (simpleInterval) {
      case 'every_minute':
        expression = '* * * * *';
        break;
      case 'every_5_minutes':
        expression = '*/5 * * * *';
        break;
      case 'every_15_minutes':
        expression = '*/15 * * * *';
        break;
      case 'every_30_minutes':
        expression = '*/30 * * * *';
        break;
      case 'every_hour':
        expression = `${simpleMinute} * * * *`;
        break;
      case 'daily':
        expression = `${simpleMinute} ${simpleHour} * * *`;
        break;
      case 'weekly':
        expression = `${simpleMinute} ${simpleHour} * * ${simpleWeekday}`;
        break;
      case 'monthly':
        expression = `${simpleMinute} ${simpleHour} ${simpleDay} * *`;
        break;
      default:
        expression = '* * * * *';
    }

    setCronExpression(expression);
  }, [mode, simpleInterval, simpleHour, simpleMinute, simpleDay, simpleWeekday]);

  // Advanced mode 업데이트
  const handleAdvancedChange = (field: keyof CronConfig, value: string) => {
    const newConfig = { ...advancedConfig, [field]: value };
    setAdvancedConfig(newConfig);
    setCronExpression(generateCronExpression(newConfig));
  };

  // Preset 적용
  const handlePresetClick = (expression: string) => {
    setCronExpression(expression);
    const parsed = parseCronExpression(expression);
    if (parsed) {
      setAdvancedConfig(parsed);
    }
  };

  // Custom input 적용
  const handleCustomApply = () => {
    const validation = validateCronExpression(customInput);
    if (validation.valid) {
      setCronExpression(customInput);
      const parsed = parseCronExpression(customInput);
      if (parsed) {
        setAdvancedConfig(parsed);
      }
      setToastMessage('Cron 표현식이 적용되었습니다!');
    } else {
      setToastMessage(validation.error || '유효하지 않은 Cron 표현식입니다.');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 복사
  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    setToastMessage('Cron 표현식이 복사되었습니다!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 검증
  const validation = validateCronExpression(cronExpression);
  const humanReadable = validation.valid ? cronToHumanReadable(cronExpression) : '';
  const nextRuns = validation.valid ? getNextRunTimes(cronExpression) : [];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header
        title="Cron 표현식 생성기"
        description="Cron 작업 스케줄을 쉽게 생성하고 검증합니다. 시각적 인터페이스로 복잡한 Cron 표현식을 간단하게 만들 수 있습니다"
      />

      <div className="flex-1 p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          {/* 2열 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* 왼쪽: 설정 영역 (스크롤 가능) */}
            <div className="overflow-y-auto pr-2">
              {/* 모드 선택 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">생성 모드</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setMode('simple')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      mode === 'simple'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    간단 모드
                  </button>
                  <button
                    onClick={() => setMode('advanced')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      mode === 'advanced'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    고급 모드
                  </button>
                  <button
                    onClick={() => setMode('custom')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      mode === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    직접 입력
                  </button>
                </div>
              </div>

              {/* 간단 모드 */}
              {mode === 'simple' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">간단 설정</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">실행 주기</label>
                      <select
                        value={simpleInterval}
                        onChange={(e) => setSimpleInterval(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="every_minute">매 분마다</option>
                        <option value="every_5_minutes">5분마다</option>
                        <option value="every_15_minutes">15분마다</option>
                        <option value="every_30_minutes">30분마다</option>
                        <option value="every_hour">매 시간마다</option>
                        <option value="daily">매일</option>
                        <option value="weekly">매주</option>
                        <option value="monthly">매월</option>
                      </select>
                    </div>

                    {/* 시간 선택 (daily, weekly, monthly) */}
                    {['daily', 'weekly', 'monthly'].includes(simpleInterval) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">시</label>
                          <select
                            value={simpleHour}
                            onChange={(e) => setSimpleHour(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>{i}시</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">분</label>
                          <select
                            value={simpleMinute}
                            onChange={(e) => setSimpleMinute(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i}>{i}분</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* 매 시간마다 - 분 선택 */}
                    {simpleInterval === 'every_hour' && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">분</label>
                        <select
                          value={simpleMinute}
                          onChange={(e) => setSimpleMinute(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>{i}분</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* 요일 선택 (weekly) */}
                    {simpleInterval === 'weekly' && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">요일</label>
                        <select
                          value={simpleWeekday}
                          onChange={(e) => setSimpleWeekday(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="0">일요일</option>
                          <option value="1">월요일</option>
                          <option value="2">화요일</option>
                          <option value="3">수요일</option>
                          <option value="4">목요일</option>
                          <option value="5">금요일</option>
                          <option value="6">토요일</option>
                          <option value="1-5">평일 (월-금)</option>
                          <option value="0,6">주말 (토-일)</option>
                        </select>
                      </div>
                    )}

                    {/* 일 선택 (monthly) */}
                    {simpleInterval === 'monthly' && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">일</label>
                        <select
                          value={simpleDay}
                          onChange={(e) => setSimpleDay(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}일</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 고급 모드 */}
              {mode === 'advanced' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">상세 설정</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        분 (0-59)
                      </label>
                      <Input
                        value={advancedConfig.minute}
                        onChange={(e) => handleAdvancedChange('minute', e.target.value)}
                        placeholder="*, 0-59, */5, 0,15,30,45"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">예: */5 (5분마다)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        시 (0-23)
                      </label>
                      <Input
                        value={advancedConfig.hour}
                        onChange={(e) => handleAdvancedChange('hour', e.target.value)}
                        placeholder="*, 0-23, */2, 9-18"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">예: 9-18 (9시-18시)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        일 (1-31)
                      </label>
                      <Input
                        value={advancedConfig.dayOfMonth}
                        onChange={(e) => handleAdvancedChange('dayOfMonth', e.target.value)}
                        placeholder="*, 1-31, */2, 1,15"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">예: 1,15 (1일과 15일)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        월 (1-12)
                      </label>
                      <Input
                        value={advancedConfig.month}
                        onChange={(e) => handleAdvancedChange('month', e.target.value)}
                        placeholder="*, 1-12, */3, 1,4,7,10"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">예: 1,4,7,10 (분기별)</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        요일 (0-6, 0=일)
                      </label>
                      <Input
                        value={advancedConfig.dayOfWeek}
                        onChange={(e) => handleAdvancedChange('dayOfWeek', e.target.value)}
                        placeholder="*, 0-6, 1-5, 0,6"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">예: 1-5 (평일)</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <strong>사용 가능한 문자:</strong> * (모든 값), - (범위), / (증분), , (목록)
                    </p>
                  </div>
                </div>
              )}

              {/* 직접 입력 모드 */}
              {mode === 'custom' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Cron 표현식 입력</h3>

                  <div className="flex gap-3">
                    <Input
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="예: 0 9 * * 1-5 (평일 오전 9시)"
                      className="font-mono"
                    />
                    <Button onClick={handleCustomApply}>적용</Button>
                  </div>
                </div>
              )}

              {/* 프리셋 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">자주 사용하는 설정</h3>
                <div className="grid grid-cols-1 gap-2">
                  {cronPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetClick(preset.expression)}
                      className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{preset.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{preset.description}</p>
                        </div>
                        <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded ml-2">
                          {preset.expression}
                        </code>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cron 문법 가이드 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📖</span> Cron 표현식 문법
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="font-medium mb-2">필드 구조</p>
                      <code className="block bg-white/50 p-2 rounded font-mono text-xs">
                        분 시 일 월 요일
                      </code>
                    </div>
                    <div>
                      <p className="font-medium mb-2">특수 문자</p>
                      <ul className="space-y-1 text-xs">
                        <li><code className="bg-white/50 px-1 rounded">*</code> - 모든 값</li>
                        <li><code className="bg-white/50 px-1 rounded">-</code> - 범위 (예: 1-5)</li>
                        <li><code className="bg-white/50 px-1 rounded">/</code> - 증분 (예: */5)</li>
                        <li><code className="bg-white/50 px-1 rounded">,</code> - 목록 (예: 1,3,5)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 결과 영역 (고정) */}
            <div className="lg:sticky lg:top-0 lg:h-fit">
              {/* 결과 카드 */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900">생성된 Cron 표현식</h3>
                  <Button onClick={handleCopy} variant="secondary" size="sm">
                    복사
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 mb-4">
                  <code className="text-xl font-mono font-bold text-blue-700 break-all block text-center">
                    {cronExpression}
                  </code>
                </div>

                {validation.valid ? (
                  <>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 text-lg flex-shrink-0">✓</span>
                        <div>
                          <p className="text-sm font-semibold text-green-900 mb-1">실행 조건</p>
                          <p className="text-base font-medium text-green-700">{humanReadable}</p>
                        </div>
                      </div>
                    </div>

                    {nextRuns.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-2">실행 정보</p>
                        {nextRuns.map((run, index) => (
                          <p key={index} className="text-sm text-blue-700">{run}</p>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 text-lg flex-shrink-0">✗</span>
                      <div>
                        <p className="text-sm font-semibold text-red-900 mb-1">오류</p>
                        <p className="text-sm text-red-600">{validation.error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 빠른 예제 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span> 예제
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <code className="bg-white/60 px-2 py-1 rounded font-mono text-purple-700 flex-shrink-0">0 9 * * 1-5</code>
                    <span className="text-purple-800">평일 오전 9시</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="bg-white/60 px-2 py-1 rounded font-mono text-purple-700 flex-shrink-0">*/15 * * * *</code>
                    <span className="text-purple-800">15분마다</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="bg-white/60 px-2 py-1 rounded font-mono text-purple-700 flex-shrink-0">0 0 1 * *</code>
                    <span className="text-purple-800">매월 1일 자정</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <code className="bg-white/60 px-2 py-1 rounded font-mono text-purple-700 flex-shrink-0">0 */2 * * *</code>
                    <span className="text-purple-800">2시간마다</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast 메시지 */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            validation.valid ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
