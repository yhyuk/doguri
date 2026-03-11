import { useState, useEffect } from 'react';
import currencyService from '../../services/currency';
import type { CachedRates } from '../../types/api';

export function useCurrencyRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);

    try {
      const data: CachedRates = await currencyService.getExchangeRates('USD');
      setRates(data.rates);
      setLastUpdate(data.timestamp);
    } catch (err) {
      setError(err instanceof Error ? err.message : '환율 정보를 가져오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    currencyService.clearCache();
    fetchRates();
  };

  return {
    rates,
    lastUpdate,
    loading,
    error,
    refresh,
  };
}
