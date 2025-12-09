import { apiClient, ApiClient } from '../utils/apiClient';
import { ChatRequest, ChatResponse } from '../types';
import { API_CONFIG } from '../config/api';

/**
 * Chat service with dependency injection
 */
export class ChatService {
  constructor(private apiClient: ApiClient) {}

  /**
   * AI 챗봇에 질문을 보냅니다.
   */
  async sendQuestion(request: ChatRequest): Promise<ChatResponse> {
    return this.apiClient.post<ChatResponse>(API_CONFIG.ENDPOINTS.CHAT, request);
  }
}

// Singleton instance for backward compatibility
export const chatService = new ChatService(apiClient);
