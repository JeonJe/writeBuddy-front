import { apiClient } from '../utils/apiClient';
import { ChatRequest, ChatResponse } from '../types';

export class ChatService {
  private static readonly ENDPOINT = '/chat';

  static async sendQuestion(request: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>(this.ENDPOINT, request);
  }
}