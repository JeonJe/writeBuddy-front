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
  relatedExamples?: RealExample[];
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
  url?: string;
  timestamp?: string;
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
  PODCAST = 'PODCAST'
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'upper-intermediate' | 'advanced';