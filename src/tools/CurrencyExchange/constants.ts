import type { Currency } from './types';

// Major currencies supported
export const CURRENCIES: Currency[] = [
  { code: 'USD', name: '미국 달러', symbol: '$' },
  { code: 'EUR', name: '유로', symbol: '€' },
  { code: 'JPY', name: '일본 엔', symbol: '¥' },
  { code: 'CNY', name: '중국 위안', symbol: '¥' },
  { code: 'KRW', name: '대한민국 원', symbol: '₩' },
  { code: 'GBP', name: '영국 파운드', symbol: '£' },
  { code: 'CAD', name: '캐나다 달러', symbol: 'C$' },
  { code: 'AUD', name: '호주 달러', symbol: 'A$' },
  { code: 'CHF', name: '스위스 프랑', symbol: 'CHF' },
  { code: 'INR', name: '인도 루피', symbol: '₹' },
];

export const DEFAULT_FROM_CURRENCY = 'USD';
export const DEFAULT_TO_CURRENCY = 'KRW';
