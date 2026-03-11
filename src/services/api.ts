import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';

// Base API client with retry logic
class ApiClient {
  private client: AxiosInstance;
  private maxRetries: number;
  private retryDelay: number;

  constructor(baseURL: string, maxRetries = 3, retryDelay = 1000) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry(() => this.client.get<T>(url, config));
  }

  private async requestWithRetry<T>(
    requestFn: () => Promise<{ data: T }>,
    retryCount = 0
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      // Don't retry on 4xx errors (client errors)
      if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
        throw new Error(`API Error: ${axiosError.response.statusText}`);
      }

      // Retry on network errors or 5xx errors
      if (retryCount < this.maxRetries) {
        await this.sleep(this.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
        return this.requestWithRetry(requestFn, retryCount + 1);
      }

      throw new Error(
        axiosError.message || 'Network error occurred'
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default ApiClient;
