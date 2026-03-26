export interface CityTime {
  name: string;
  timezone: string;
  region: string;
}

export interface CityTimeDisplay extends CityTime {
  currentTime: Date;
  timeString: string;
  dateString: string;
  offsetFromKST: string;
  offsetHours: number;
  isBusinessHours: boolean;
  timePeriod: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
}

export type Region = 'asia' | 'europe' | 'americas' | 'oceania';

export interface RegionGroup {
  id: Region;
  name: string;
  cities: CityTime[];
}
