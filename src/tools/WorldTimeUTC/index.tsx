import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import { COMMON_TIMEZONES } from './constants';
import {
  formatUTCTime,
  getCurrentUnixTimestamp
} from './utils';

export default function WorldTimeUTC() {
  const [utcTime, setUtcTime] = useState(formatUTCTime());
  const [currentUnixTimestamp, setCurrentUnixTimestamp] = useState(getCurrentUnixTimestamp());

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

  return (
    <div className="flex flex-col h-full">
      <Header
        title="세계 시간 (UTC 기준)"
        description="UTC 시간과 주요 시간대 정보"
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
