import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import { REGION_GROUPS } from './constants';
import { formatKSTTime, getCitiesTimeDisplay } from './utils';
import type { CityTimeDisplay } from './types';

export default function WorldTimeKorea() {
  const [kstTime, setKstTime] = useState(formatKSTTime());
  const [citiesTimes, setCitiesTimes] = useState<Record<string, CityTimeDisplay[]>>({});

  // Update time every minute
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setKstTime(formatKSTTime(now));

      const newCitiesTimes: Record<string, CityTimeDisplay[]> = {};
      REGION_GROUPS.forEach(group => {
        newCitiesTimes[group.id] = getCitiesTimeDisplay(group.cities, now);
      });
      setCitiesTimes(newCitiesTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="세계 시간 (한국 기준)"
        description="한국 시간을 기준으로 전 세계 주요 도시의 현재 시간을 확인합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Korean Time Display */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
            <div className="text-center">
              <h2 className="text-sm font-medium text-blue-600 mb-2">
                대한민국 서울 (KST, UTC+9)
              </h2>
              <div className="text-5xl font-bold text-blue-900 mb-2">
                {kstTime.timeString}
              </div>
              <div className="text-lg text-blue-700">
                {kstTime.dateString} {kstTime.dayOfWeek}
              </div>
            </div>
          </div>

          {/* Cities by Region */}
          <div className="space-y-8">
            {REGION_GROUPS.map(group => (
              <div key={group.id}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  {group.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {citiesTimes[group.id]?.map((city) => (
                    <div
                      key={city.name}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{city.name}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            city.offsetHours === 0
                              ? 'bg-green-100 text-green-700'
                              : city.offsetHours > 0
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {city.offsetFromKST}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {city.timeString}
                      </div>
                      <div className="text-sm text-gray-600">
                        {city.dateString}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Information Panel */}
          <div className="mt-8 bg-gray-50 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              시간대 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div>한국 표준시(KST): UTC+9</div>
              <div>일본 표준시(JST): UTC+9 (동일)</div>
              <div>중국 표준시(CST): UTC+8 (-1시간)</div>
              <div>그리니치 표준시(GMT): UTC+0 (-9시간)</div>
              <div>미국 동부시간(EST/EDT): UTC-5/-4 (-14/-13시간)</div>
              <div>미국 서부시간(PST/PDT): UTC-8/-7 (-17/-16시간)</div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              * 서머타임(일광절약시간제) 적용 지역은 계절에 따라 시간 차이가 달라집니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
