import { API_CONFIG, ERROR_MESSAGES } from '../config/api';
import { ApiError, createApiError } from './apiError';
import { IStorage, LocalStorageAdapter } from './storage';

interface ApiRequestOptions extends RequestInit {
  timeout?: number;
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// Timeout을 지원하는 fetch 래퍼
const fetchWithTimeout = async (
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const { timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError(0, 'Timeout', url, ERROR_MESSAGES.TIMEOUT);
      }
      throw new ApiError(0, 'Network Error', url, ERROR_MESSAGES.NETWORK_ERROR);
    }

    throw error;
  }
};

// API 클라이언트 클래스
export class ApiClient {
  private baseUrl: string;
  private storage: IStorage;
  private tokenRefreshCallback?: () => Promise<void>;

  constructor(baseUrl: string = API_CONFIG.BASE_URL, storage: IStorage = new LocalStorageAdapter()) {
    this.baseUrl = baseUrl;
    this.storage = storage;
  }

  public setTokenRefreshCallback(callback: () => Promise<void>): void {
    this.tokenRefreshCallback = callback;
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
    isRetry: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Add authorization header if token exists
    const token = this.storage.getItem('accessToken');
    const requestOptions: ApiRequestOptions = {
      headers: {
        ...DEFAULT_HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetchWithTimeout(url, requestOptions);

      // Handle 401 with token refresh
      if (response.status === 401 && !isRetry && this.tokenRefreshCallback) {
        try {
          await this.tokenRefreshCallback();
          // Retry the request after token refresh
          return this.request<T>(endpoint, options, true);
        } catch (refreshError) {
          throw createApiError(response);
        }
      }

      if (!response.ok) {
        throw createApiError(response);
      }

      // 204 No Content인 경우 빈 객체 반환
      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text() as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(0, 'Unknown Error', url, ERROR_MESSAGES.UNKNOWN);
    }
  }

  public async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// 기본 API 클라이언트 인스턴스
export const apiClient = new ApiClient();