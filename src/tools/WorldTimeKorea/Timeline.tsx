import { formatInTimeZone } from 'date-fns-tz';
import { KST_TIMEZONE } from './constants';

interface TimelineProps {
  currentDate: Date;
}

export default function Timeline({ currentDate }: TimelineProps) {
  const currentHour = parseInt(formatInTimeZone(currentDate, KST_TIMEZONE, 'HH'), 10);
  const currentMinute = parseInt(formatInTimeZone(currentDate, KST_TIMEZONE, 'mm'), 10);

  // Calculate position as percentage (0-100%)
  const position = ((currentHour + currentMinute / 60) / 24) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">24시간 타임라인</h3>

      {/* Timeline container */}
      <div className="relative">
        {/* Gradient background (day/night) */}
        <div
          className="h-16 rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(to right,
              #1e3a8a 0%,    /* midnight - dark blue */
              #1e40af 12.5%, /* 3am */
              #3b82f6 20.83%,/* 5am - lighter blue */
              #60a5fa 25%,   /* 6am - dawn */
              #fbbf24 29.17%,/* 7am - sunrise yellow */
              #fcd34d 33.33%,/* 8am */
              #fef3c7 37.5%, /* 9am - light yellow */
              #fffbeb 50%,   /* noon - bright */
              #fef3c7 62.5%, /* 3pm */
              #fcd34d 66.67%,/* 4pm */
              #fbbf24 70.83%,/* 5pm */
              #f59e0b 75%,   /* 6pm - sunset orange */
              #3b82f6 79.17%,/* 7pm - dusk blue */
              #1e40af 87.5%, /* 9pm */
              #1e3a8a 100%   /* midnight */
            )`
          }}
        >
          {/* Hour markers */}
          <div className="relative h-full flex items-end">
            {Array.from({ length: 25 }, (_, i) => (
              <div
                key={i}
                className="flex-1 border-l border-white/20 relative"
                style={{ minWidth: '4.1667%' }}
              >
                {i % 3 === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs font-medium text-white/90 drop-shadow-md">
                    {i}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 transition-all duration-1000"
          style={{ left: `${position}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-red-600">
            KST {formatInTimeZone(currentDate, KST_TIMEZONE, 'HH:mm')}
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="mt-10 flex justify-between text-xs text-gray-500">
        <span>자정</span>
        <span>정오</span>
        <span>자정</span>
      </div>
    </div>
  );
}
