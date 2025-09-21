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
  originTranslation: string | null;
  correctedTranslation: string | null;
  relatedExamples: RealExample[];
}

export interface CreateCorrectionRequest {
  originSentence: string;
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
