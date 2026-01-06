import { apiClient, ApiClient } from '../utils/apiClient';
import { API_CONFIG } from '../config/api';
import { PracticeSentence } from '../types';

/**
 * Practice service with dependency injection
 */
export class PracticeService {
  constructor(private apiClient: ApiClient) {}

  /**
   * AI가 생성한 연습 문장을 가져옵니다.
   */
  async getSentence(): Promise<PracticeSentence> {
    return this.apiClient.get<PracticeSentence>(
      API_CONFIG.ENDPOINTS.PRACTICE_SENTENCE
    );
  }
}

// Singleton instance for backward compatibility
export const practiceService = new PracticeService(apiClient);
