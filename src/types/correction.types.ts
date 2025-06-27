export interface Correction {
  id: number;
  originSentence: string;
  correctedSentence: string;
  feedback: string;
  feedbackType: 'GRAMMAR' | 'SPELLING' | 'STYLE' | 'PUNCTUATION' | 'SYSTEM';
  score: number | null;
  isFavorite: boolean;
  memo: string | null;
  createdAt: string;
  originTranslation: string | null;    // 원문의 한국어 번역
  correctedTranslation: string | null; // 교정문의 한국어 번역
  relatedExamples: RealExample[];      // 관련 실제 사용 예시
}

export interface CreateCorrectionRequest {
  originSentence: string;
}

export interface DailyStatistics {
  totalCorrections: number;
  averageScore: number;
  feedbackTypes: Record<string, number>;
}

export interface ScoreTrendItem {
  order: number;
  score: number;
  feedbackType: string;
  createdAt: string;
}

export interface ScoreTrend {
  scoreTrend: ScoreTrendItem[];
}

export interface ErrorPatterns {
  errorPatterns: Record<string, string[]>;
}

export interface StatisticsOverview {
  totalCorrections: number;
  averageScore: number;
  favoriteCount: number;
  feedbackTypeDistribution: Record<string, number>;
}

export type FeedbackType = 'GRAMMAR' | 'SPELLING' | 'STYLE' | 'PUNCTUATION' | 'SYSTEM';

export type ScoreLevel = 'excellent' | 'good' | 'needs-work' | 'none';

export interface RealExample {
  id: number;
  phrase: string;
  source: string;
  sourceType: ExampleSourceType;
  sourceTypeDisplay: string;
  sourceTypeEmoji: string;
  context: string;
  url?: string | null;
  timestamp?: string | null;
  difficulty: number;
  tags: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export enum ExampleSourceType {
  MOVIE = 'MOVIE',
  SONG = 'SONG',
  NEWS = 'NEWS',
  BOOK = 'BOOK',
  INTERVIEW = 'INTERVIEW',
  SOCIAL = 'SOCIAL',
  SPEECH = 'SPEECH',
  PODCAST = 'PODCAST',
  OTHER = 'OTHER'
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'upper-intermediate' | 'advanced';

export interface ChatResponse {
  question: string;
  answer: string;
  createdAt: string;
}

export interface ChatRequest {
  question: string;
}