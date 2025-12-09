import { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest, AuthUser } from '../types';
import { apiClient, ApiClient } from '../utils/apiClient';
import { API_CONFIG } from '../config/api';

/**
 * Authentication service with dependency injection
 */
export class AuthService {
  constructor(private apiClient: ApiClient) {}

  /**
   * 로그인
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { email, password };
    return this.apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, request);
  }

  /**
   * 회원가입
   */
  async register(username: string, email: string, password: string): Promise<AuthUser> {
    const request: RegisterRequest = { username, email, password };
    return this.apiClient.post<AuthUser>(API_CONFIG.ENDPOINTS.REGISTER, request);
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    return this.apiClient.post<void>(API_CONFIG.ENDPOINTS.LOGOUT);
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const request: RefreshTokenRequest = { refreshToken };
    return this.apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.REFRESH_TOKEN, request);
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<AuthUser> {
    return this.apiClient.get<AuthUser>('/users/me');
  }
}

// Singleton instance for backward compatibility
export const authService = new AuthService(apiClient);
