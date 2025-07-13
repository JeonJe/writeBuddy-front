import { useState, useCallback, useEffect } from 'react';
import { DailyStatistics, ScoreTrend, ErrorPatterns, Correction } from '../types';
import { correctionService } from '../services';
import { ApiError } from '../utils/apiError';

export const useStatistics = () => {
  const [dailyStats, setDailyStats] = useState<DailyStatistics | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrend | null>(null);
  const [errorPatterns, setErrorPatterns] = useState<ErrorPatterns | null>(null);
  const [feedbackStats, setFeedbackStats] = useState<Record<string, number> | null>(null);
  const [averageScore, setAverageScore] = useState<{ averageScore: number } | null>(null);
  const [goodExpressions, setGoodExpressions] = useState<Correction[]>([]);
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
      setAverageScore(data);
    } catch (err) {
      console.error('평균 점수 로드 실패:', err);
      throw err;
    }
  }, []);

  const loadFeedbackStats = useCallback(async () => {
    try {
      const data = await correctionService.getStatistics();
      setFeedbackStats(data);
    } catch (err) {
      console.error('피드백 통계 로드 실패:', err);
      throw err;
    }
  }, []);

  const loadGoodExpressions = useCallback(async (userId: number) => {
    try {
      const data = await correctionService.getUserGoodExpressions(userId);
      setGoodExpressions(data);
    } catch (err) {
      console.error('잘한 표현 로드 실패:', err);
      throw err;
    }
  }, []);

  // 🔄 기존 개별 API 로더 (Fallback)
  const loadLegacyStatistics = useCallback(async () => {
    try {
      await Promise.all([
        loadDailyStatistics(),
        loadScoreTrend(),
        loadErrorPatterns(),
        loadAverageScore(),
        loadFeedbackStats(),
      ]);
      console.log('🔄 기존 개별 API 사용 완료');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  }, [loadDailyStatistics, loadScoreTrend, loadErrorPatterns, loadAverageScore, loadFeedbackStats, handleApiError]);

  // 🆕 통합 통계 API 로더 (권장)
  const loadUnifiedStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const unifiedData = await correctionService.getUnifiedStatistics();
      
      // 기존 state로 데이터 매핑 (로그인 없는 버전)
      setDailyStats(unifiedData.dashboardData.dailyStatistics);
      setScoreTrend({ scoreTrend: unifiedData.dashboardData.scoreTrend });
      setErrorPatterns({ errorPatterns: unifiedData.dashboardData.errorPatterns });
      setFeedbackStats(unifiedData.correctionStatistics.feedbackTypeStatistics);
      setAverageScore({ averageScore: unifiedData.correctionStatistics.averageScore });
      
      console.log('🆕 통합 통계 API 성공 - 성능 최적화 완료');
    } catch (err) {
      console.warn('🔄 통합 API 실패, 기존 방식으로 fallback');
      // Fallback: 기존 개별 API 호출
      return await loadLegacyStatistics();
    } finally {
      setIsLoading(false);
    }
  }, [loadLegacyStatistics]);

  // 🆕 메인 로더 (Unified API 우선)
  const loadAllStatistics = useCallback(async () => {
    await loadUnifiedStatistics();
  }, [loadUnifiedStatistics]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 컴포넌트 마운트 시 데이터 로드 (통합 API 우선)
  useEffect(() => {
    loadAllStatistics();
  }, [loadAllStatistics]);

  return {
    dailyStats,
    scoreTrend,
    errorPatterns,
    feedbackStats,
    averageScore,
    goodExpressions,
    isLoading,
    error,
    loadAllStatistics,
    fetchGoodExpressions: loadGoodExpressions,
    clearError,
  };
};