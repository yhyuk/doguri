import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { COMMON_TIMEZONES } from './constants';
import {
  formatUTCTime,
  unixToDateTime,
  getCurrentUnixTimestamp,
  isValidUnixTimestamp,
  formatAsISO8601,
  parseISO8601
} from './utils';

export default function WorldTimeUTC() {
  const [utcTime, setUtcTime] = useState(formatUTCTime());
  const [currentUnixTimestamp, setCurrentUnixTimestamp] = useState(getCurrentUnixTimestamp());

  // Unix timestamp converter states
  const [timestampInput, setTimestampInput] = useState('');
  const [timestampResult, setTimestampResult] = useState('');
  const [timestampError, setTimestampError] = useState('');

  // ISO 8601 converter states
  const [isoInput, setIsoInput] = useState('');
  const [isoResult, setIsoResult] = useState('');
  const [isoError, setIsoError] = useState('');

  // Update UTC time and timestamp every second
  useEffect(() => {
    const updateTime = () => {
      setUtcTime(formatUTCTime());
      setCurrentUnixTimestamp(getCurrentUnixTimestamp());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle unix timestamp conversion
  const handleTimestampConvert = () => {
    if (!timestampInput.trim()) {
      setTimestampError('타임스탬프를 입력하세요');
      setTimestampResult('');
      return;
    }

    if (!isValidUnixTimestamp(timestampInput)) {
      setTimestampError('유효하지 않은 타임스탬프입니다');
      setTimestampResult('');
      return;
    }

    try {
      const result = unixToDateTime(Number(timestampInput));
      setTimestampResult(`${result.dateTime}\nISO: ${result.iso8601}`);
      setTimestampError('');
    } catch (error) {
      setTimestampError('변환 중 오류가 발생했습니다');
      setTimestampResult('');
    }
  };

  // Handle ISO 8601 conversion
  const handleISOConvert = () => {
    if (!isoInput.trim()) {
      setIsoError('날짜/시간을 입력하세요');
      setIsoResult('');
      return;
    }

    const date = parseISO8601(isoInput);
    if (!date) {
      setIsoError('유효하지 않은 날짜 형식입니다');
      setIsoResult('');
      return;
    }

    try {
      const iso = formatAsISO8601(date);
      const timestamp = Math.floor(date.getTime() / 1000);
      setIsoResult(`ISO 8601: ${iso}\nUnix Timestamp: ${timestamp}`);
      setIsoError('');
    } catch (error) {
      setIsoError('변환 중 오류가 발생했습니다');
      setIsoResult('');
    }
  };

  const handleUseCurrentTimestamp = () => {
    setTimestampInput(currentUnixTimestamp.toString());
  };

  const handleUseCurrentISO = () => {
    setIsoInput(new Date().toISOString());
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="세계 시간 (UTC 기준)"
        description="UTC 시간과 타임스탬프, ISO 8601 변환 도구"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* UTC Time Display */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 mb-8">
            <div className="text-center">
              <h2 className="text-sm font-medium text-purple-600 mb-2">
                협정 세계시 (UTC)
              </h2>
              <div className="text-5xl font-bold text-purple-900 mb-2">
                {utcTime.timeString}
              </div>
              <div className="text-lg text-purple-700 mb-3">
                {utcTime.dateString}
              </div>
              <div className="text-sm text-purple-600 font-mono bg-purple-100 rounded px-3 py-2 inline-block">
                Unix Timestamp: {currentUnixTimestamp}
              </div>
            </div>
          </div>

          {/* Converters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Unix Timestamp Converter */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Unix Timestamp 변환
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    label="Unix Timestamp"
                    type="text"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    placeholder="1710504000"
                    error={timestampError}
                  />
                  <Button
                    onClick={handleUseCurrentTimestamp}
                    variant="secondary"
                    size="sm"
                    className="self-end mb-1"
                  >
                    현재
                  </Button>
                </div>
                <Button onClick={handleTimestampConvert} className="w-full">
                  변환
                </Button>
                {timestampResult && (
                  <div className="bg-gray-50 rounded p-3 text-sm font-mono whitespace-pre-wrap">
                    {timestampResult}
                  </div>
                )}
              </div>
            </div>

            {/* ISO 8601 Converter */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ISO 8601 변환
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    label="날짜/시간"
                    type="text"
                    value={isoInput}
                    onChange={(e) => setIsoInput(e.target.value)}
                    placeholder="2024-03-15T12:00:00Z"
                    error={isoError}
                  />
                  <Button
                    onClick={handleUseCurrentISO}
                    variant="secondary"
                    size="sm"
                    className="self-end mb-1"
                  >
                    현재
                  </Button>
                </div>
                <Button onClick={handleISOConvert} className="w-full">
                  변환
                </Button>
                {isoResult && (
                  <div className="bg-gray-50 rounded p-3 text-sm font-mono whitespace-pre-wrap">
                    {isoResult}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Common Timezone Offsets Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              주요 시간대 오프셋
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {COMMON_TIMEZONES.map((tz) => (
                <div
                  key={tz.name}
                  className="bg-gray-50 rounded p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="font-semibold text-sm text-gray-800">
                    {tz.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {tz.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Information Panel */}
          <div className="mt-8 bg-gray-50 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              UTC 정보
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>UTC (협정 세계시):</strong> 세계 표준 시간대의 기준이 되는 시간
              </div>
              <div>
                <strong>Unix Timestamp:</strong> 1970년 1월 1일 00:00:00 UTC부터 경과한 초
              </div>
              <div>
                <strong>ISO 8601:</strong> 국제 표준 날짜/시간 형식 (예: 2024-03-15T12:00:00Z)
              </div>
              <div className="text-xs text-gray-500 mt-3">
                * Z는 UTC 시간을 의미합니다 (Zulu time)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
