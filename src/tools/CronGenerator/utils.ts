/**
 * Cron 표현식 관련 유틸리티 함수
 */

export interface CronConfig {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronPreset {
  label: string;
  description: string;
  expression: string;
}

/**
 * Cron 표현식 생성
 */
export function generateCronExpression(config: CronConfig): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = config;
  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

/**
 * Cron 표현식 파싱
 */
export function parseCronExpression(expression: string): CronConfig | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return null;
  }

  return {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4]
  };
}

/**
 * Cron 표현식 검증
 */
export function validateCronExpression(expression: string): { valid: boolean; error?: string } {
  const parts = expression.trim().split(/\s+/);

  if (parts.length !== 5) {
    return { valid: false, error: 'Cron 표현식은 5개의 필드로 구성되어야 합니다.' };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // 분 검증 (0-59)
  if (!isValidCronField(minute, 0, 59)) {
    return { valid: false, error: '분 필드가 올바르지 않습니다. (0-59 또는 *, /, -, ,)' };
  }

  // 시간 검증 (0-23)
  if (!isValidCronField(hour, 0, 23)) {
    return { valid: false, error: '시간 필드가 올바르지 않습니다. (0-23 또는 *, /, -, ,)' };
  }

  // 일 검증 (1-31)
  if (!isValidCronField(dayOfMonth, 1, 31)) {
    return { valid: false, error: '일 필드가 올바르지 않습니다. (1-31 또는 *, /, -, ,)' };
  }

  // 월 검증 (1-12)
  if (!isValidCronField(month, 1, 12)) {
    return { valid: false, error: '월 필드가 올바르지 않습니다. (1-12 또는 *, /, -, ,)' };
  }

  // 요일 검증 (0-6, 0=일요일)
  if (!isValidCronField(dayOfWeek, 0, 6)) {
    return { valid: false, error: '요일 필드가 올바르지 않습니다. (0-6 또는 *, /, -, ,)' };
  }

  return { valid: true };
}

/**
 * Cron 필드 검증 헬퍼
 */
function isValidCronField(field: string, min: number, max: number): boolean {
  // * (모든 값)
  if (field === '*') return true;

  // ? (특정 필드에서만 사용 가능, 여기서는 간단히 허용)
  if (field === '?') return true;

  // 범위 (예: 1-5)
  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number);
    return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end;
  }

  // 증분 (예: */5 또는 1-10/2)
  if (field.includes('/')) {
    const parts = field.split('/');
    if (parts.length !== 2) return false;

    const [range, step] = parts;
    const stepNum = Number(step);

    if (isNaN(stepNum) || stepNum <= 0) return false;

    if (range === '*') return true;
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      return !isNaN(start) && !isNaN(end) && start >= min && end <= max;
    }

    return false;
  }

  // 리스트 (예: 1,3,5)
  if (field.includes(',')) {
    const values = field.split(',').map(Number);
    return values.every(v => !isNaN(v) && v >= min && v <= max);
  }

  // 단일 숫자
  const num = Number(field);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Cron 표현식을 사람이 읽을 수 있는 형태로 변환
 */
export function cronToHumanReadable(expression: string): string {
  const config = parseCronExpression(expression);
  if (!config) {
    return '유효하지 않은 Cron 표현식';
  }

  const parts: string[] = [];

  // 분
  const minuteDesc = describeField(config.minute, '분');

  // 시간
  const hourDesc = describeField(config.hour, '시');

  // 일
  const dayDesc = describeField(config.dayOfMonth, '일');

  // 월
  const monthDesc = describeField(config.month, '월');

  // 요일
  const weekDesc = describeWeekday(config.dayOfWeek);

  // 조합하여 설명 생성
  if (config.dayOfWeek !== '*' && config.dayOfWeek !== '?') {
    parts.push(weekDesc);
  }

  if (config.month !== '*') {
    parts.push(monthDesc);
  }

  if (config.dayOfMonth !== '*' && config.dayOfMonth !== '?') {
    parts.push(dayDesc);
  }

  if (config.hour !== '*') {
    parts.push(hourDesc);
  } else {
    parts.push('매 시간');
  }

  if (config.minute !== '*') {
    parts.push(minuteDesc);
  } else if (config.hour === '*') {
    parts.push('매 분');
  }

  return parts.length > 0 ? parts.join(', ') : '매 분마다 실행';
}

/**
 * 필드를 설명으로 변환
 */
function describeField(field: string, unit: string): string {
  if (field === '*' || field === '?') {
    return `매 ${unit}`;
  }

  if (field.includes('-')) {
    const [start, end] = field.split('-');
    return `${start}-${end}${unit}`;
  }

  if (field.includes('/')) {
    const [range, step] = field.split('/');
    if (range === '*') {
      return `${step}${unit}마다`;
    }
    const [start, end] = range.split('-');
    return `${start}-${end}${unit} 중 ${step}${unit}마다`;
  }

  if (field.includes(',')) {
    const values = field.split(',');
    return `${values.join(', ')}${unit}`;
  }

  return `${field}${unit}`;
}

/**
 * 요일 필드를 설명으로 변환
 */
function describeWeekday(field: string): string {
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  if (field === '*' || field === '?') {
    return '매일';
  }

  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number);
    return `${weekdays[start]}-${weekdays[end]}`;
  }

  if (field.includes('/')) {
    const [, step] = field.split('/');
    return `${step}일마다`;
  }

  if (field.includes(',')) {
    const values = field.split(',').map(Number);
    return values.map(v => weekdays[v]).join(', ');
  }

  const num = Number(field);
  return weekdays[num] || field;
}

/**
 * 자주 사용하는 Cron 프리셋
 */
export const cronPresets: CronPreset[] = [
  {
    label: '매 분마다',
    description: '1분마다 실행',
    expression: '* * * * *'
  },
  {
    label: '매 5분마다',
    description: '5분마다 실행',
    expression: '*/5 * * * *'
  },
  {
    label: '매 15분마다',
    description: '15분마다 실행',
    expression: '*/15 * * * *'
  },
  {
    label: '매 30분마다',
    description: '30분마다 실행',
    expression: '*/30 * * * *'
  },
  {
    label: '매 시간마다',
    description: '매 시간 정각에 실행',
    expression: '0 * * * *'
  },
  {
    label: '매일 자정',
    description: '매일 00:00에 실행',
    expression: '0 0 * * *'
  },
  {
    label: '매일 정오',
    description: '매일 12:00에 실행',
    expression: '0 12 * * *'
  },
  {
    label: '매주 월요일 오전 9시',
    description: '매주 월요일 09:00에 실행',
    expression: '0 9 * * 1'
  },
  {
    label: '매주 월요일 자정',
    description: '매주 월요일 00:00에 실행',
    expression: '0 0 * * 1'
  },
  {
    label: '매월 1일 자정',
    description: '매월 1일 00:00에 실행',
    expression: '0 0 1 * *'
  },
  {
    label: '평일 오전 9시',
    description: '월-금 09:00에 실행',
    expression: '0 9 * * 1-5'
  },
  {
    label: '주말 오전 10시',
    description: '토-일 10:00에 실행',
    expression: '0 10 * * 0,6'
  },
  {
    label: '업무시간 매시간 (9-18시)',
    description: '평일 9-18시 정각마다 실행',
    expression: '0 9-18 * * 1-5'
  }
];

/**
 * 다음 실행 시간 계산 (간단한 버전)
 */
export function getNextRunTimes(expression: string): string[] {
  // 실제로는 복잡한 로직이 필요하지만, 여기서는 간단히 설명만 반환
  const validation = validateCronExpression(expression);
  if (!validation.valid) {
    return [];
  }

  const description = cronToHumanReadable(expression);

  // 실제 시간 계산은 매우 복잡하므로, 여기서는 설명만 반환
  return [
    `실행 조건: ${description}`,
    '※ 정확한 다음 실행 시간은 서버의 현재 시간에 따라 결정됩니다.'
  ];
}

/**
 * Cron 표현식 예제 생성
 */
export function generateExamples(): { expression: string; description: string }[] {
  return [
    { expression: '0 9 * * 1-5', description: '평일 오전 9시' },
    { expression: '*/10 * * * *', description: '10분마다' },
    { expression: '0 0 1 * *', description: '매월 1일 자정' },
    { expression: '0 */2 * * *', description: '2시간마다' },
    { expression: '30 8 * * 1', description: '매주 월요일 오전 8시 30분' }
  ];
}
