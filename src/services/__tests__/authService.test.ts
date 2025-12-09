import { AuthService } from '../authService';
import { ApiClient } from '../../utils/apiClient';
import { MemoryStorage } from '../../utils/storage';
import { AuthResponse, AuthUser } from '../../types';

describe('AuthService', () => {
  let authService: AuthService;
  let mockApiClient: jest.Mocked<ApiClient>;
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setTokenRefreshCallback: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    authService = new AuthService(mockApiClient);
  });

  describe('login', () => {
    it('should call apiClient.post with correct endpoint and credentials', async () => {
      const mockResponse: AuthResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          roles: ['user'],
          createdAt: '2024-01-01T00:00:00Z',
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should call apiClient.post with correct endpoint and user data', async () => {
      const mockUser: AuthUser = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
        roles: ['user'],
        createdAt: '2024-01-01T00:00:00Z',
      };

      mockApiClient.post.mockResolvedValue(mockUser);

      const result = await authService.register('newuser', 'new@example.com', 'password');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('should call apiClient.post with logout endpoint', async () => {
      mockApiClient.post.mockResolvedValue(undefined);

      await authService.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('refreshToken', () => {
    it('should call apiClient.post with refresh token endpoint', async () => {
      const mockResponse: AuthResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          roles: ['user'],
          createdAt: '2024-01-01T00:00:00Z',
        },
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await authService.refreshToken('old-refresh-token');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should call apiClient.get with user endpoint', async () => {
      const mockUser: AuthUser = {
        id: 1,
        username: 'currentuser',
        email: 'current@example.com',
        roles: ['user'],
        createdAt: '2024-01-01T00:00:00Z',
      };

      mockApiClient.get.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });
  });
});
