import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContextType, AuthUser } from '../types';
import { authService } from '../services/authService';
import { isTokenExpired, getTokenRemainingTime } from '../utils/jwt';

/**
 * SECURITY WARNING:
 * 현재 JWT 토큰을 localStorage에 저장하고 있습니다.
 * 이 방식은 XSS 공격에 취약할 수 있습니다.
 *
 * 프로덕션 환경에서 더 안전한 방법:
 * 1. httpOnly 쿠키 사용 (백엔드 변경 필요)
 * 2. 메모리에만 저장하고 새로고침 시 재인증
 * 3. Secure + SameSite 쿠키 설정
 *
 * 현재 구현은 개발 편의성을 위한 것이며,
 * 프로덕션 배포 전 반드시 보안 검토가 필요합니다.
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 토큰 만료 시 자동 갱신 또는 로그아웃 처리
  const handleTokenRefreshOrLogout = useCallback(async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (refreshTokenValue && !isTokenExpired(refreshTokenValue)) {
      try {
        const authResponse = await authService.refreshToken(refreshTokenValue);
        localStorage.setItem('accessToken', authResponse.accessToken);
        setAccessToken(authResponse.accessToken);
        return true;
      } catch {
        // 리프레시 실패 시 로그아웃
      }
    }
    // 리프레시 토큰도 만료되었거나 갱신 실패 시 로그아웃
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
    return false;
  }, []);

  // 앱 시작 시 토큰 확인 및 유효성 검증
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // 토큰 만료 여부 확인 (60초 버퍼)
        if (isTokenExpired(token, 60)) {
          // 토큰이 만료되었거나 곧 만료될 예정이면 갱신 시도
          const refreshed = await handleTokenRefreshOrLogout();
          if (!refreshed) {
            setIsLoading(false);
            return;
          }
        } else {
          setAccessToken(token);
          setIsAuthenticated(true);
        }

        // TODO: 사용자 정보 가져오기 API 구현 후 활성화
        // try {
        //   const userInfo = await authService.getCurrentUser();
        //   setUser(userInfo);
        // } catch (error) {
        //   console.error('Failed to fetch user info:', error);
        //   await handleTokenRefreshOrLogout();
        // }
      }
      setIsLoading(false);
    };

    initAuth();

    // API 클라이언트에 토큰 갱신 콜백 설정
    import('../utils/apiClient').then(({ apiClient }) => {
      apiClient.setTokenRefreshCallback(async () => {
        await handleTokenRefreshOrLogout();
      });
    });
  }, [handleTokenRefreshOrLogout]);

  // 토큰 만료 전 자동 갱신 타이머
  useEffect(() => {
    if (!accessToken) return;

    const remainingTime = getTokenRemainingTime(accessToken);
    if (remainingTime <= 0) return;

    // 만료 60초 전에 자동 갱신 시도
    const refreshTime = Math.max((remainingTime - 60) * 1000, 0);

    const timer = setTimeout(async () => {
      await handleTokenRefreshOrLogout();
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [accessToken, handleTokenRefreshOrLogout]);

  const login = async (email: string, password: string) => {
    try {
      const authResponse = await authService.login(email, password);

      // 토큰 저장
      localStorage.setItem('accessToken', authResponse.accessToken);
      localStorage.setItem('refreshToken', authResponse.refreshToken);

      setAccessToken(authResponse.accessToken);
      setIsAuthenticated(true);

      // TODO: 사용자 정보 가져오기 API 구현 후 활성화
      // const userInfo = await authService.getCurrentUser();
      // setUser(userInfo);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await authService.register(username, email, password);
      // 회원가입 성공 후 자동 로그인
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // 로컬 상태 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const authResponse = await authService.refreshToken(refreshTokenValue);

      localStorage.setItem('accessToken', authResponse.accessToken);
      setAccessToken(authResponse.accessToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      // 리프레시 실패 시 로그아웃
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    login,
    register,
    logout,
    refreshToken,
  };

  if (isLoading) {
    return null; // 또는 로딩 스피너
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
