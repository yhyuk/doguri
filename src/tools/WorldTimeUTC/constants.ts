import type { TimezoneOffset } from './types';

export const COMMON_TIMEZONES: TimezoneOffset[] = [
  { name: 'UTC-12', offset: '-12:00', description: '베이커 섬' },
  { name: 'UTC-11', offset: '-11:00', description: '사모아' },
  { name: 'UTC-10', offset: '-10:00', description: '하와이' },
  { name: 'UTC-9', offset: '-09:00', description: '알래스카' },
  { name: 'UTC-8', offset: '-08:00', description: '태평양 표준시 (PST)' },
  { name: 'UTC-7', offset: '-07:00', description: '산악 표준시 (MST)' },
  { name: 'UTC-6', offset: '-06:00', description: '중부 표준시 (CST)' },
  { name: 'UTC-5', offset: '-05:00', description: '동부 표준시 (EST)' },
  { name: 'UTC-4', offset: '-04:00', description: '대서양 표준시' },
  { name: 'UTC-3', offset: '-03:00', description: '브라질리아' },
  { name: 'UTC-2', offset: '-02:00', description: '중부 대서양' },
  { name: 'UTC-1', offset: '-01:00', description: '아조레스' },
  { name: 'UTC+0', offset: '+00:00', description: 'GMT, 런던' },
  { name: 'UTC+1', offset: '+01:00', description: '중앙유럽 (CET)' },
  { name: 'UTC+2', offset: '+02:00', description: '동유럽 (EET)' },
  { name: 'UTC+3', offset: '+03:00', description: '모스크바' },
  { name: 'UTC+4', offset: '+04:00', description: '두바이' },
  { name: 'UTC+5', offset: '+05:00', description: '파키스탄' },
  { name: 'UTC+5:30', offset: '+05:30', description: '인도' },
  { name: 'UTC+6', offset: '+06:00', description: '카자흐스탄' },
  { name: 'UTC+7', offset: '+07:00', description: '방콕' },
  { name: 'UTC+8', offset: '+08:00', description: '베이징, 싱가포르' },
  { name: 'UTC+9', offset: '+09:00', description: '서울, 도쿄' },
  { name: 'UTC+10', offset: '+10:00', description: '시드니' },
  { name: 'UTC+11', offset: '+11:00', description: '솔로몬 제도' },
  { name: 'UTC+12', offset: '+12:00', description: '오클랜드, 피지' },
  { name: 'UTC+13', offset: '+13:00', description: '통가' },
  { name: 'UTC+14', offset: '+14:00', description: '키리바시' }
];

export const ISO_8601_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
export const ISO_8601_SHORT_FORMAT = "yyyy-MM-dd'T'HH:mm:ssxxx";
