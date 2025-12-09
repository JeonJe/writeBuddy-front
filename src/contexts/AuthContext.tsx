import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthUser } from '../types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);

        // TODO: 사용자 정보 가져오기 API 구현 후 활성화
        // try {
        //   const userInfo = await authService.getCurrentUser();
        //   setUser(userInfo);
        // } catch (error) {
        //   console.error('Failed to fetch user info:', error);
        //   // 토큰이 유효하지 않으면 로그아웃 처리
        //   await logout();
        // }
      }
      setIsLoading(false);
    };

    initAuth();

    // API 클라이언트에 토큰 갱신 콜백 설정
    import('../utils/apiClient').then(({ apiClient }) => {
      apiClient.setTokenRefreshCallback(async () => {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        const authResponse = await authService.refreshToken(refreshTokenValue);
        localStorage.setItem('accessToken', authResponse.accessToken);
        setAccessToken(authResponse.accessToken);
      });
    });
  }, []);

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
