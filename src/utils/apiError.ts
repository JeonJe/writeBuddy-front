import { HTTP_STATUS, ERROR_MESSAGES } from '../config/api';

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly url: string;

  constructor(status: number, statusText: string, url: string, message?: string) {
    super(message || ApiError.getDefaultMessage(status));
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }

  private static getDefaultMessage(status: number): string {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN;
    }
  }

  public isNetworkError(): boolean {
    return this.status === 0;
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }
}

export const createApiError = (response: Response): ApiError => {
  return new ApiError(
    response.status,
    response.statusText,
    response.url
  );
};