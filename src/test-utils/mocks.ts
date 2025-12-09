import {
  Correction,
  RealExample,
  AuthUser,
  AuthResponse,
  ChatResponse,
  ExampleSourceType,
  FeedbackType,
} from '../types';

/**
 * Mock data factory functions for testing
 */

export const mockAuthUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  roles: [],
  ...overrides,
});

export const mockAuthResponse = (overrides: Partial<AuthResponse> = {}): AuthResponse => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  tokenType: 'Bearer',
  ...overrides,
});

export const mockRealExample = (overrides: Partial<RealExample> = {}): RealExample => ({
  id: 1,
  phrase: 'test phrase',
  source: 'Test Movie',
  sourceType: 'MOVIE' as ExampleSourceType,
  sourceTypeDisplay: '영화',
  sourceTypeEmoji: '🎬',
  context: 'This is a test context',
  difficulty: 5,
  tags: ['test', 'example'],
  isVerified: true,
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const mockCorrection = (overrides: Partial<Correction> = {}): Correction => ({
  id: 1,
  originSentence: 'I goes to school',
  correctedSentence: 'I go to school',
  feedback: 'Verb conjugation error',
  feedbackType: 'GRAMMAR' as FeedbackType,
  score: 7,
  isFavorite: false,
  memo: null,
  createdAt: '2024-01-01T00:00:00Z',
  originTranslation: '나는 학교에 간다',
  correctedTranslation: '나는 학교에 간다',
  relatedExamples: [],
  ...overrides,
});

export const mockChatResponse = (overrides: Partial<ChatResponse> = {}): ChatResponse => ({
  question: 'This is a test question',
  answer: 'This is a mock answer to your question.',
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

/**
 * Mock API responses
 */
export const mockApiError = (status: number, message: string) => ({
  status,
  statusText: 'Error',
  message,
  url: '/test',
});

/**
 * Mock localStorage
 */
export const createMockLocalStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};
