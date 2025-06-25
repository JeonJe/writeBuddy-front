import { useState, useCallback, useEffect } from 'react';
import { DailyStatistics, ScoreTrend, ErrorPatterns } from '../types';
import { correctionService } from '../services';
import { ApiError } from '../utils/apiError';

export const useStatistics = () => {
  const [dailyStats, setDailyStats] = useState<DailyStatistics | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrend | null>(null);
  const [errorPatterns, setErrorPatterns] = useState<ErrorPatterns | null>(null);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = useCallback((err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.isNetworkError()) {
        return '인터넷 연결을 확인해주세요.';
      }
      return err.message;
    }
    
    if (err instanceof Error) {
      return err.message;
    }
    
    return '통계 데이터를 불러오는 중 오류가 발생했습니다.';
  }, []);

  const loadDailyStatistics = useCallback(async () => {
    try {
      const data = await correctionService.getDailyDashboard();
      setDailyStats(data);
    } catch (err) {
      console.error('일별 통계 로드 실패:', err);
      throw err;
    }
  }, []);

  const loadScoreTrend = useCallback(async () => {
    try {
      const data = await correctionService.getScoreTrend();
      setScoreTrend(data);
    } catch (err) {
      console.error('점수 추이 로드 실패:', err);
      throw err;
    }
  }, []);

  const loadErrorPatterns = useCallback(async () => {
    try {
      const data = await correctionService.getErrorPatterns();
      setErrorPatterns(data);
    } catch (err) {
      console.error('오류 패턴 로드 실패:', err);
      throw err;
    }
  }, []);

  const loadAverageScore = useCallback(async () => {
    try {
      const data = await correctionService.getAverageScore();
      setAverageScore(data.averageScore);
    } catch (err) {
      console.error('평균 점수 로드 실패:', err);
      throw err;
    }
  }, []);

  const loadAllStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadDailyStatistics(),
        loadScoreTrend(),
        loadErrorPatterns(),
        loadAverageScore(),
      ]);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [loadDailyStatistics, loadScoreTrend, loadErrorPatterns, loadAverageScore, handleApiError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadAllStatistics();
  }, [loadAllStatistics]);

  return {
    dailyStats,
    scoreTrend,
    errorPatterns,
    averageScore,
    isLoading,
    error,
    loadAllStatistics,
    clearError,
  };
};