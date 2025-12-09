import { ApiError, createApiError } from '../apiError';
import { ERROR_MESSAGES } from '../../config/api';

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an error with custom message', () => {
      const error = new ApiError(404, 'Not Found', '/api/test', '리소스를 찾을 수 없습니다.');

      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
      expect(error.url).toBe('/api/test');
      expect(error.message).toBe('리소스를 찾을 수 없습니다.');
      expect(error.name).toBe('ApiError');
    });

    it('should use default message for 404 if no custom message provided', () => {
      const error = new ApiError(404, 'Not Found', '/api/test');
      expect(error.message).toBe(ERROR_MESSAGES.NOT_FOUND);
    });

    it('should use default message for 500 if no custom message provided', () => {
      const error = new ApiError(500, 'Internal Server Error', '/api/test');
      expect(error.message).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('should use default message for 400 if no custom message provided', () => {
      const error = new ApiError(400, 'Bad Request', '/api/test');
      expect(error.message).toBe(ERROR_MESSAGES.VALIDATION_ERROR);
    });

    it('should use default message for 401 if no custom message provided', () => {
      const error = new ApiError(401, 'Unauthorized', '/api/test');
      expect(error.message).toBe(ERROR_MESSAGES.UNAUTHORIZED);
    });

    it('should use default message for 403 if no custom message provided', () => {
      const error = new ApiError(403, 'Forbidden', '/api/test');
      expect(error.message).toBe(ERROR_MESSAGES.FORBIDDEN);
    });

    it('should use UNKNOWN message for unhandled status codes', () => {
      const error = new ApiError(418, "I'm a teapot", '/api/test');
      expect(error.message).toBe(ERROR_MESSAGES.UNKNOWN);
    });
  });

  describe('isNetworkError', () => {
    it('should return true for network errors (status 0)', () => {
      const error = new ApiError(0, 'Network Error', '/api/test');
      expect(error.isNetworkError()).toBe(true);
    });

    it('should return false for non-network errors', () => {
      const error = new ApiError(404, 'Not Found', '/api/test');
      expect(error.isNetworkError()).toBe(false);
    });
  });

  describe('isClientError', () => {
    it('should return true for 4xx errors', () => {
      expect(new ApiError(400, 'Bad Request', '/test').isClientError()).toBe(true);
      expect(new ApiError(404, 'Not Found', '/test').isClientError()).toBe(true);
      expect(new ApiError(499, 'Custom', '/test').isClientError()).toBe(true);
    });

    it('should return false for non-4xx errors', () => {
      expect(new ApiError(200, 'OK', '/test').isClientError()).toBe(false);
      expect(new ApiError(500, 'Server Error', '/test').isClientError()).toBe(false);
      expect(new ApiError(0, 'Network Error', '/test').isClientError()).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 5xx errors', () => {
      expect(new ApiError(500, 'Internal Server Error', '/test').isServerError()).toBe(true);
      expect(new ApiError(503, 'Service Unavailable', '/test').isServerError()).toBe(true);
      expect(new ApiError(599, 'Custom', '/test').isServerError()).toBe(true);
    });

    it('should return false for non-5xx errors', () => {
      expect(new ApiError(200, 'OK', '/test').isServerError()).toBe(false);
      expect(new ApiError(404, 'Not Found', '/test').isServerError()).toBe(false);
      expect(new ApiError(0, 'Network Error', '/test').isServerError()).toBe(false);
    });
  });

  describe('createApiError', () => {
    it('should create error from Response object', () => {
      const mockResponse = {
        status: 404,
        statusText: 'Not Found',
        url: 'https://api.example.com/test',
      } as Response;

      const error = createApiError(mockResponse);

      expect(error.status).toBe(404);
      expect(error.statusText).toBe('Not Found');
      expect(error.url).toBe('https://api.example.com/test');
      expect(error.message).toBe(ERROR_MESSAGES.NOT_FOUND);
    });

    it('should create error for 500 status', () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        url: 'https://api.example.com/test',
      } as Response;

      const error = createApiError(mockResponse);

      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
      expect(error.message).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });
  });
});
