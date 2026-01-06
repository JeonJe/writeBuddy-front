import { apiClient, ApiClient } from '../utils/apiClient';
import { API_CONFIG } from '../config/api';
import {
  CompareAnswerRequest,
  CompareAnswerResponse,
  ReviewSentencesResponse,
  SaveReviewRecordRequest,
  SaveReviewRecordResponse,
} from '../types';

/**
 * Review service with dependency injection
 */
export class ReviewService {
  constructor(private apiClient: ApiClient) {}

  async getSentences(limit: number): Promise<ReviewSentencesResponse> {
    return this.apiClient.get<ReviewSentencesResponse>(
      `${API_CONFIG.ENDPOINTS.REVIEW_SENTENCES}?limit=${limit}`
    );
  }

  async compareAnswer(request: CompareAnswerRequest): Promise<CompareAnswerResponse> {
    return this.apiClient.post<CompareAnswerResponse>(API_CONFIG.ENDPOINTS.REVIEW_COMPARE, request);
  }

  async saveRecord(request: SaveReviewRecordRequest): Promise<SaveReviewRecordResponse> {
    return this.apiClient.post<SaveReviewRecordResponse>(API_CONFIG.ENDPOINTS.REVIEW_RECORDS, request);
  }
}

export const reviewService = new ReviewService(apiClient);
