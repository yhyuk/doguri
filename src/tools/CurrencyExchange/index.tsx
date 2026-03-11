import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { CURRENCIES, DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY } from './constants';
import { useCurrencyRates } from './hooks';
import {
  parseNumberInput,
  isValidNumber,
  formatResult,
  convertCurrency,
  formatLastUpdate,
} from './utils';

export default function CurrencyExchange() {
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM_CURRENCY);
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO_CURRENCY);
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [conversionError, setConversionError] = useState('');

  const { rates, lastUpdate, loading, error, refresh } = useCurrencyRates();

  // Perform conversion whenever input or currencies change
  useEffect(() => {
    if (!rates || !inputValue || !isValidNumber(inputValue)) {
      setOutputValue('');
      setConversionError('');
      return;
    }

    const numValue = parseNumberInput(inputValue);
    if (numValue === null) {
      setOutputValue('');
      setConversionError('');
      return;
    }

    try {
      const result = convertCurrency(numValue, fromCurrency, toCurrency, rates);
      setOutputValue(formatResult(result.result));
      setConversionError('');
    } catch (err) {
      setConversionError(err instanceof Error ? err.message : '변환 오류가 발생했습니다');
      setOutputValue('');
    }
  }, [inputValue, fromCurrency, toCurrency, rates]);

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
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleClear = () => {
    setInputValue('');
    setOutputValue('');
    setConversionError('');
  };

  const currencyOptions = CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
  }));

  return (
    <div className="flex flex-col h-full">
      <Header
        title="환율 계산기"
        description="실시간 환율로 통화를 변환합니다"
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-blue-700 text-sm">환율 정보를 불러오는 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm mb-3">{error}</p>
              <Button onClick={refresh} size="sm">
                다시 시도
              </Button>
            </div>
          )}

          {/* Last Update Info */}
          {!loading && !error && lastUpdate && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                마지막 업데이트: {formatLastUpdate(lastUpdate)}
              </p>
              <Button onClick={refresh} size="sm" variant="secondary">
                새로고침
              </Button>
            </div>
          )}

          {/* Conversion Panel */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              {/* From Currency */}
              <div className="space-y-4">
                <Select
                  label="변환할 통화"
                  options={currencyOptions}
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  disabled={loading}
                />
                <Input
                  label="금액"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="금액을 입력하세요"
                  error={conversionError}
                  disabled={loading || !!error}
                />
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:pb-2">
                <Button
                  onClick={handleSwap}
                  variant="secondary"
                  size="sm"
                  className="w-full md:w-auto"
                  title="통화 바꾸기"
                  disabled={loading}
                >
                  ⇄
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-4">
                <Select
                  label="변환될 통화"
                  options={currencyOptions}
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  disabled={loading}
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
            <Button onClick={handleClear} variant="secondary" disabled={loading}>
              지우기
            </Button>
          </div>

          {/* Exchange Rate Info */}
          {!loading && !error && rates && inputValue && parseNumberInput(inputValue) !== null && (
            <div className="mt-8 bg-gray-50 rounded-lg p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                환율 정보
              </h3>
              <div className="text-sm text-gray-600">
                1 {fromCurrency} = {formatResult(rates[toCurrency] / rates[fromCurrency])} {toCurrency}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
