import type { RegionGroup } from './types';

export const KST_TIMEZONE = 'Asia/Seoul';

export const REGION_GROUPS: RegionGroup[] = [
  {
    id: 'asia',
    name: '아시아',
    cities: [
      { name: '도쿄', timezone: 'Asia/Tokyo', region: 'asia' },
      { name: '베이징', timezone: 'Asia/Shanghai', region: 'asia' },
      { name: '싱가포르', timezone: 'Asia/Singapore', region: 'asia' },
      { name: '방콕', timezone: 'Asia/Bangkok', region: 'asia' }
    ]
  },
  {
    id: 'europe',
    name: '유럽',
    cities: [
      { name: '런던', timezone: 'Europe/London', region: 'europe' },
      { name: '파리', timezone: 'Europe/Paris', region: 'europe' },
      { name: '베를린', timezone: 'Europe/Berlin', region: 'europe' },
      { name: '모스크바', timezone: 'Europe/Moscow', region: 'europe' }
    ]
  },
  {
    id: 'americas',
    name: '아메리카',
    cities: [
      { name: '뉴욕', timezone: 'America/New_York', region: 'americas' },
      { name: '로스앤젤레스', timezone: 'America/Los_Angeles', region: 'americas' },
      { name: '시카고', timezone: 'America/Chicago', region: 'americas' },
      { name: '상파울루', timezone: 'America/Sao_Paulo', region: 'americas' }
    ]
  },
  {
    id: 'oceania',
    name: '오세아니아',
    cities: [
      { name: '시드니', timezone: 'Australia/Sydney', region: 'oceania' },
      { name: '오클랜드', timezone: 'Pacific/Auckland', region: 'oceania' }
    ]
  }
];

export const ALL_CITIES = REGION_GROUPS.flatMap(group => group.cities);
