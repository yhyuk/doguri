export type UnitCategory =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed';

export type LengthUnit = 'm' | 'cm' | 'mm' | 'km' | 'ft' | 'in' | 'yd' | 'mi';
export type WeightUnit = 'kg' | 'g' | 'mg' | 'lb' | 'oz' | 'ton';
export type TemperatureUnit = 'C' | 'F' | 'K';
export type VolumeUnit = 'L' | 'mL' | 'gal' | 'fl oz';
export type AreaUnit = 'm²' | 'ft²' | 'acre' | 'hectare';
export type SpeedUnit = 'm/s' | 'km/h' | 'mph';

export type Unit = LengthUnit | WeightUnit | TemperatureUnit | VolumeUnit | AreaUnit | SpeedUnit;

export interface UnitOption {
  value: string;
  label: string;
}

export interface CategoryOption {
  value: UnitCategory;
  label: string;
}

export interface ConversionResult {
  value: number;
  fromUnit: string;
  toUnit: string;
  formula?: string;
}
