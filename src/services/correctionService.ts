import { Correction, CreateCorrectionRequest, UnifiedStatistics } from '../types';
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
    return apiClient.get<Correction[]>(`${API_CONFIG.ENDPOINTS.CORRECTIONS}?lightweight=true`);
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
   * 사용자별 잘한 표현(10점 만점 문장들)을 조회합니다.
   */
  async getUserGoodExpressions(userId: number): Promise<Correction[]> {
    const endpoint = API_CONFIG.ENDPOINTS.GOOD_EXPRESSIONS.replace('{userId}', userId.toString());
    return apiClient.get<Correction[]>(endpoint);
  },

  /**
   * 통계 API - 모든 통계 데이터를 1번의 API 호출로 조회합니다.
   */
  async getUnifiedStatistics(): Promise<UnifiedStatistics> {
    return apiClient.get<UnifiedStatistics>(API_CONFIG.ENDPOINTS.STATISTICS);
  },
};