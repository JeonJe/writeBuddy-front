import { apiClient } from '../utils/apiClient';
import { API_CONFIG } from '../config/api';
import { WordSearchResponse, GrammarSearchResponse } from '../types';

export const wordService = {
  async searchWord(keyword: string): Promise<WordSearchResponse> {
    return apiClient.get<WordSearchResponse>(
      `${API_CONFIG.ENDPOINTS.WORDS_SEARCH}?keyword=${encodeURIComponent(keyword)}`
    );
  },

  async searchGrammar(keyword: string): Promise<GrammarSearchResponse> {
    return apiClient.get<GrammarSearchResponse>(
      `${API_CONFIG.ENDPOINTS.GRAMMAR_SEARCH}?keyword=${encodeURIComponent(keyword)}`
    );
  }
};
