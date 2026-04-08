import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { CATEGORIES, UNITS } from './constants';
import { convert, formatResult, parseNumberInput, isValidNumber } from './utils';
import type { UnitCategory } from './types';

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [error, setError] = useState('');

  // Reset units when category changes
  useEffect(() => {
    const units = UNITS[category];
    if (units.length >= 2) {
      setFromUnit(units[0].value);
      setToUnit(units[1].value);
    }
    setInputValue('');
    setOutputValue('');
    setError('');
  }, [category]);

  // Perform conversion whenever input or units change
  useEffect(() => {
    if (!inputValue || !isValidNumber(inputValue)) {
      setOutputValue('');
      setError('');
      return;
    }

    const numValue = parseNumberInput(inputValue);
    if (numValue === null) {
      setOutputValue('');
      setError('');
      return;
    }

    try {
      const result = convert(numValue, fromUnit, toUnit);
      setOutputValue(formatResult(result.value));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '변환 오류가 발생했습니다');
      setOutputValue('');
    }
  }, [inputValue, fromUnit, toUnit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty, minus sign, and decimal point
    if (value === '' || value === '-' || value === '.' || value === '-.') {
      setInputValue(value);
      return;
    }

    // Validate number format
    if (isValidNumber(value)) {
      setInputValue(value);
    }
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleClear = () => {
    setInputValue('');
    setOutputValue('');
    setError('');
  };

  const handleExample = () => {
    const examples: Record<UnitCategory, string> = {
      length: '100',
      weight: '1',
      temperature: '25',
      volume: '1',
      area: '10',
      speed: '60',
      data: '1024'
    };
    setInputValue(examples[category]);
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="단위 변환기"
        description="다양한 단위를 간편하게 변환합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Selection */}
          <div className="mb-6">
            <Select
              label="카테고리"
              options={CATEGORIES}
              value={category}
              onChange={(e) => setCategory(e.target.value as UnitCategory)}
            />
          </div>

          {/* Conversion Panel */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              {/* From Unit */}
              <div className="space-y-4">
                <Select
                  label="변환할 단위"
                  options={UNITS[category]}
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                />
                <Input
                  label="값"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="숫자를 입력하세요"
                  error={error}
                />
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:pb-2">
                <Button
                  onClick={handleSwap}
                  variant="secondary"
                  size="sm"
                  className="w-full md:w-auto"
                  title="단위 바꾸기"
                >
                  ⇄
                </Button>
              </div>

              {/* To Unit */}
              <div className="space-y-4">
                <Select
                  label="변환될 단위"
                  options={UNITS[category]}
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                />
                <Input
                  label="결과"
                  type="text"
                  value={outputValue}
                  readOnly
                  placeholder="결과가 여기에 표시됩니다"
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleClear} variant="secondary">
              지우기
            </Button>
            <Button onClick={handleExample} variant="secondary">
              예제
            </Button>
          </div>

          {/* Quick Reference */}
          <div className="mt-8 bg-gray-50 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              변환 공식 예시
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              {category === 'length' && (
                <>
                  <div>1 m = 100 cm</div>
                  <div>1 km = 1,000 m</div>
                  <div>1 ft = 30.48 cm</div>
                  <div>1 in = 2.54 cm</div>
                </>
              )}
              {category === 'weight' && (
                <>
                  <div>1 kg = 1,000 g</div>
                  <div>1 lb = 453.59 g</div>
                  <div>1 oz = 28.35 g</div>
                  <div>1 ton = 1,000 kg</div>
                </>
              )}
              {category === 'temperature' && (
                <>
                  <div>°C = (°F - 32) × 5/9</div>
                  <div>°F = °C × 9/5 + 32</div>
                  <div>K = °C + 273.15</div>
                  <div>절대영도 = -273.15°C = 0K</div>
                </>
              )}
              {category === 'volume' && (
                <>
                  <div>1 L = 1,000 mL</div>
                  <div>1 gal = 3.785 L</div>
                  <div>1 fl oz = 29.57 mL</div>
                  <div>1 L = 33.81 fl oz</div>
                </>
              )}
              {category === 'area' && (
                <>
                  <div>1 m² = 10.76 ft²</div>
                  <div>1 acre = 4,047 m²</div>
                  <div>1 hectare = 10,000 m²</div>
                  <div>1 hectare = 2.47 acres</div>
                </>
              )}
              {category === 'speed' && (
                <>
                  <div>1 m/s = 3.6 km/h</div>
                  <div>1 km/h = 0.621 mph</div>
                  <div>1 mph = 1.609 km/h</div>
                  <div>100 km/h = 27.78 m/s</div>
                </>
              )}
              {category === 'data' && (
                <>
                  <div>1 KB = 1,000 B (SI)</div>
                  <div>1 KiB = 1,024 B (IEC)</div>
                  <div>1 MB = 1,000 KB</div>
                  <div>1 GiB = 1,024 MiB</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
