import type { CategoryOption, UnitOption, UnitCategory } from './types';

export const CATEGORIES: CategoryOption[] = [
  { value: 'length', label: '길이 (Length)' },
  { value: 'weight', label: '무게 (Weight)' },
  { value: 'temperature', label: '온도 (Temperature)' },
  { value: 'volume', label: '부피 (Volume)' },
  { value: 'area', label: '면적 (Area)' },
  { value: 'speed', label: '속도 (Speed)' },
  { value: 'data', label: '파일 크기 (Data)' }
];

export const UNITS: Record<UnitCategory, UnitOption[]> = {
  length: [
    { value: 'm', label: '미터 (m)' },
    { value: 'cm', label: '센티미터 (cm)' },
    { value: 'mm', label: '밀리미터 (mm)' },
    { value: 'km', label: '킬로미터 (km)' },
    { value: 'ft', label: '피트 (ft)' },
    { value: 'in', label: '인치 (in)' },
    { value: 'yd', label: '야드 (yd)' },
    { value: 'mi', label: '마일 (mi)' }
  ],
  weight: [
    { value: 'kg', label: '킬로그램 (kg)' },
    { value: 'g', label: '그램 (g)' },
    { value: 'mg', label: '밀리그램 (mg)' },
    { value: 'lb', label: '파운드 (lb)' },
    { value: 'oz', label: '온스 (oz)' },
    { value: 'ton', label: '톤 (ton)' }
  ],
  temperature: [
    { value: 'C', label: '섭씨 (°C)' },
    { value: 'F', label: '화씨 (°F)' },
    { value: 'K', label: '켈빈 (K)' }
  ],
  volume: [
    { value: 'L', label: '리터 (L)' },
    { value: 'mL', label: '밀리리터 (mL)' },
    { value: 'gal', label: '갤런 (gal)' },
    { value: 'fl oz', label: '액량온스 (fl oz)' }
  ],
  area: [
    { value: 'm²', label: '제곱미터 (m²)' },
    { value: 'ft²', label: '제곱피트 (ft²)' },
    { value: 'acre', label: '에이커 (acre)' },
    { value: 'hectare', label: '헥타르 (hectare)' }
  ],
  speed: [
    { value: 'm/s', label: '미터/초 (m/s)' },
    { value: 'km/h', label: '킬로미터/시 (km/h)' },
    { value: 'mph', label: '마일/시 (mph)' }
  ],
  data: [
    { value: 'B', label: '바이트 (B)' },
    { value: 'KB', label: '킬로바이트 (KB)' },
    { value: 'MB', label: '메가바이트 (MB)' },
    { value: 'GB', label: '기가바이트 (GB)' },
    { value: 'TB', label: '테라바이트 (TB)' },
    { value: 'PB', label: '페타바이트 (PB)' },
    { value: 'KiB', label: '키비바이트 (KiB)' },
    { value: 'MiB', label: '메비바이트 (MiB)' },
    { value: 'GiB', label: '기비바이트 (GiB)' },
    { value: 'TiB', label: '테비바이트 (TiB)' }
  ]
};

// Conversion factors to base unit (meter for length, gram for weight, etc.)
export const CONVERSION_FACTORS: Record<string, number> = {
  // Length (base: meter)
  'm': 1,
  'cm': 0.01,
  'mm': 0.001,
  'km': 1000,
  'ft': 0.3048,
  'in': 0.0254,
  'yd': 0.9144,
  'mi': 1609.344,

  // Weight (base: gram)
  'g': 1,
  'kg': 1000,
  'mg': 0.001,
  'lb': 453.59237,
  'oz': 28.349523125,
  'ton': 1000000,

  // Volume (base: liter)
  'L': 1,
  'mL': 0.001,
  'gal': 3.78541,
  'fl oz': 0.0295735,

  // Area (base: square meter)
  'm²': 1,
  'ft²': 0.09290304,
  'acre': 4046.8564224,
  'hectare': 10000,

  // Speed (base: m/s)
  'm/s': 1,
  'km/h': 0.277778,
  'mph': 0.44704,

  // Data (base: byte) - SI 단위 (1000 기반)
  'B': 1,
  'KB': 1000,
  'MB': 1000000,
  'GB': 1000000000,
  'TB': 1000000000000,
  'PB': 1000000000000000,
  // IEC 단위 (1024 기반)
  'KiB': 1024,
  'MiB': 1048576,
  'GiB': 1073741824,
  'TiB': 1099511627776
};
