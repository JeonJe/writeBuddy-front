import { Correction, CreateCorrectionRequest, ScoreTrend, ErrorPatterns, DailyStatistics } from '../types';
import { apiClient } from '../utils/apiClient';
import { API_CONFIG } from '../config/api';

export const correctionService = {
  /**
   * 새로운 교정 요청을 생성합니다.
   */
  async createCorrection(request: CreateCorrectionRequest): Promise<Correction> {
    return apiClient.post<Correction>(API_CONFIG.ENDPOINTS.CORRECTIONS, request);
  },

  /**
   * 모든 교정 목록을 조회합니다.
   */
  async getAllCorrections(): Promise<Correction[]> {
    return apiClient.get<Correction[]>(API_CONFIG.ENDPOINTS.CORRECTIONS);
  },

  /**
   * 특정 교정의 즐겨찾기 상태를 토글합니다.
   */
  async toggleFavorite(id: number): Promise<void> {
    return apiClient.put<void>(`${API_CONFIG.ENDPOINTS.CORRECTIONS}/${id}/favorite`);
  },

  /**
   * 특정 교정의 메모를 업데이트합니다.
   */
  async updateMemo(id: number, memo: string): Promise<void> {
    return apiClient.put<void>(
      `${API_CONFIG.ENDPOINTS.CORRECTIONS}/${id}/memo`,
      { memo }
    );
  },

  /**
   * 즐겨찾기된 교정 목록을 조회합니다.
   */
  async getFavorites(): Promise<Correction[]> {
    return apiClient.get<Correction[]>(API_CONFIG.ENDPOINTS.FAVORITES);
  },

  /**
   * 교정 통계를 조회합니다.
   */
  async getStatistics(): Promise<Record<string, number>> {
    return apiClient.get<Record<string, number>>(API_CONFIG.ENDPOINTS.STATISTICS);
  },

  /**
   * 평균 점수를 조회합니다.
   */
  async getAverageScore(): Promise<{ averageScore: number }> {
    return apiClient.get<{ averageScore: number }>(API_CONFIG.ENDPOINTS.AVERAGE_SCORE);
  },

  /**
   * 일별 대시보드 데이터를 조회합니다.
   */
  async getDailyDashboard(): Promise<DailyStatistics> {
    return apiClient.get(API_CONFIG.ENDPOINTS.DAILY_DASHBOARD);
  },

  /**
   * 점수 변화 추이를 조회합니다 (최근 20개).
   */
  async getScoreTrend(): Promise<ScoreTrend> {
    return apiClient.get(API_CONFIG.ENDPOINTS.SCORE_TREND);
  },

  /**
   * 오류 패턴 분석 데이터를 조회합니다.
   */
  async getErrorPatterns(): Promise<ErrorPatterns> {
    return apiClient.get(API_CONFIG.ENDPOINTS.ERROR_PATTERNS);
  },
};