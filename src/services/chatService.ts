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

  /**
   * AI 챗봇에 질문을 보내고 스트리밍 응답을 받습니다.
   */
  async sendQuestionStream(
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_STREAM}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE 형식 파싱: "data:내용\n" 또는 "data: 내용\n"
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 마지막 불완전한 라인은 버퍼에 유지

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const content = line.slice(5);
            if (content === '[DONE]') continue;
            // 빈 data: 라인은 개행으로 처리
            onChunk(content || '\n');
          }
        }
      }

      // 남은 버퍼 처리
      if (buffer.startsWith('data:')) {
        const content = buffer.slice(5);
        if (content !== '[DONE]') {
          onChunk(content || '\n');
        }
      }

      onComplete?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}

// Singleton instance for backward compatibility
export const chatService = new ChatService(apiClient);
