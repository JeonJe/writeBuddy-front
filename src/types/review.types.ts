export interface ReviewSentencesResponse {
  sentences: ReviewSentence[];
  total: number;
}

export interface ReviewSentence {
  id: number;
  korean: string;
  hint: string;
  bestAnswer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  lastReviewedAt: string | null;
  reviewCount: number;
  nextReviewDate: string;
}

export interface CompareAnswerRequest {
  sentenceId: number;
  userAnswer: string;
  bestAnswer: string;
  korean: string;
}

export interface CompareAnswerResponse {
  isCorrect: boolean;
  score: number;
  differences: Difference[];
  overallFeedback: string;
  tip: string;
}

export interface Difference {
  type: 'GRAMMAR' | 'WORD_CHOICE' | 'NATURALNESS' | 'PUNCTUATION';
  userPart: string;
  bestPart: string;
  explanation: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SaveReviewRecordRequest {
  sentenceId: number;
  userAnswer: string;
  isCorrect: boolean;
  score: number;
  timeSpent: number;
  reviewDate: string;
}

export interface SaveReviewRecordResponse {
  success: boolean;
  nextReviewDate: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
