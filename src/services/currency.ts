import ApiClient from './api';
import cacheService from './cache';
import type { ExchangeRateResponse, CachedRates } from '../types/api';

const API_BASE_URL = 'https://open.er-api.com/v6';
const CACHE_KEY = 'currency_rates';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

class CurrencyService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(API_BASE_URL);
  }

  // Fetch exchange rates with caching
  async getExchangeRates(baseCode = 'USD'): Promise<CachedRates> {
    // Check cache first
    const cached = cacheService.get<CachedRates>(CACHE_KEY);
    if (cached && cached.baseCode === baseCode) {
      return cached;
    }

    // Fetch from API
    try {
      const response = await this.apiClient.get<ExchangeRateResponse>(
        `/latest/${baseCode}`
      );

      const cachedRates: CachedRates = {
        rates: response.conversion_rates,
        baseCode: response.base_code,
        timestamp: response.time_last_update_unix * 1000,
        lastUpdate: response.time_last_update_utc,
      };

      // Cache the result
      cacheService.set(CACHE_KEY, cachedRates, { ttl: CACHE_TTL });

      return cachedRates;
    } catch (error) {
      // If API fails, try to use cached data even if expired
      const cached = cacheService.get<CachedRates>(CACHE_KEY);
      if (cached) {
        console.warn('Using expired cache due to API error');
        return cached;
      }

      throw error;
    }
  }

  // Convert currency
  convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
    if (from === to) return amount;

    const fromRate = rates[from];
    const toRate = rates[to];

    if (!fromRate || !toRate) {
      throw new Error('Invalid currency code');
    }

    // Convert to base currency first, then to target currency
    return (amount / fromRate) * toRate;
  }

  // Clear cache
  clearCache(): void {
    cacheService.remove(CACHE_KEY);
  }

  // Get cache timestamp
  getCacheTimestamp(): number | null {
    return cacheService.getTimestamp(CACHE_KEY);
  }
}

export default new CurrencyService();
