import { ExampleSourceType, DifficultyLevel } from '../types';

export const getSourceTypeColor = (sourceType: ExampleSourceType): string => {
  const colors: Record<ExampleSourceType, string> = {
    [ExampleSourceType.MOVIE]: '#ef4444', // 빨간색
    [ExampleSourceType.SONG]: '#8b5cf6', // 보라색
    [ExampleSourceType.NEWS]: '#3b82f6', // 파란색
    [ExampleSourceType.BOOK]: '#92400e', // 갈색
    [ExampleSourceType.INTERVIEW]: '#ea580c', // 주황색
    [ExampleSourceType.SOCIAL]: '#ec4899', // 핑크색
    [ExampleSourceType.SPEECH]: '#6b7280', // 회색
    [ExampleSourceType.PODCAST]: '#22c55e', // 초록색
  };
  return colors[sourceType] || '#6b7280';
};

export const getDifficultyLevel = (difficulty: number): DifficultyLevel => {
  if (difficulty <= 3) return 'beginner';
  if (difficulty <= 6) return 'intermediate';
  if (difficulty <= 8) return 'upper-intermediate';
  return 'advanced';
};

export const getDifficultyColor = (difficulty: number): string => {
  const level = getDifficultyLevel(difficulty);
  const colors: Record<DifficultyLevel, string> = {
    beginner: '#22c55e', // 초록색
    intermediate: '#f59e0b', // 노란색
    'upper-intermediate': '#f97316', // 주황색
    advanced: '#ef4444', // 빨간색
  };
  return colors[level];
};

export const getDifficultyEmoji = (difficulty: number): string => {
  const level = getDifficultyLevel(difficulty);
  const emojis: Record<DifficultyLevel, string> = {
    beginner: '🟢',
    intermediate: '🟡',
    'upper-intermediate': '🟠',
    advanced: '🔴',
  };
  return emojis[level];
};

export const getDifficultyText = (difficulty: number): string => {
  const level = getDifficultyLevel(difficulty);
  const texts: Record<DifficultyLevel, string> = {
    beginner: '초급',
    intermediate: '중급',
    'upper-intermediate': '중상급',
    advanced: '고급',
  };
  return texts[level];
};