import {
  getSourceTypeColor,
  getDifficultyColor,
  getDifficultyLevel,
  getDifficultyEmoji,
  getDifficultyText,
} from '../exampleHelpers';
import { ExampleSourceType } from '../../types';

describe('exampleHelpers', () => {
  describe('getSourceTypeColor', () => {
    it('should return correct color for each source type', () => {
      expect(getSourceTypeColor(ExampleSourceType.MOVIE)).toBe('#ef4444');
      expect(getSourceTypeColor(ExampleSourceType.SONG)).toBe('#8b5cf6');
      expect(getSourceTypeColor(ExampleSourceType.NEWS)).toBe('#3b82f6');
      expect(getSourceTypeColor(ExampleSourceType.BOOK)).toBe('#92400e');
      expect(getSourceTypeColor(ExampleSourceType.INTERVIEW)).toBe('#ea580c');
      expect(getSourceTypeColor(ExampleSourceType.SOCIAL)).toBe('#ec4899');
      expect(getSourceTypeColor(ExampleSourceType.SPEECH)).toBe('#6b7280');
      expect(getSourceTypeColor(ExampleSourceType.PODCAST)).toBe('#22c55e');
      expect(getSourceTypeColor(ExampleSourceType.OTHER)).toBe('#64748b');
    });

    it('should return default color for unknown source type', () => {
      expect(getSourceTypeColor('UNKNOWN' as ExampleSourceType)).toBe('#6b7280');
    });
  });

  describe('getDifficultyLevel', () => {
    it('should return beginner for difficulties <= 3', () => {
      expect(getDifficultyLevel(1)).toBe('beginner');
      expect(getDifficultyLevel(2)).toBe('beginner');
      expect(getDifficultyLevel(3)).toBe('beginner');
    });

    it('should return intermediate for difficulties 4-6', () => {
      expect(getDifficultyLevel(4)).toBe('intermediate');
      expect(getDifficultyLevel(5)).toBe('intermediate');
      expect(getDifficultyLevel(6)).toBe('intermediate');
    });

    it('should return upper-intermediate for difficulties 7-8', () => {
      expect(getDifficultyLevel(7)).toBe('upper-intermediate');
      expect(getDifficultyLevel(8)).toBe('upper-intermediate');
    });

    it('should return advanced for difficulties >= 9', () => {
      expect(getDifficultyLevel(9)).toBe('advanced');
      expect(getDifficultyLevel(10)).toBe('advanced');
    });
  });

  describe('getDifficultyColor', () => {
    it('should return green for beginner difficulties (1-3)', () => {
      expect(getDifficultyColor(1)).toBe('#22c55e');
      expect(getDifficultyColor(2)).toBe('#22c55e');
      expect(getDifficultyColor(3)).toBe('#22c55e');
    });

    it('should return yellow for intermediate difficulties (4-6)', () => {
      expect(getDifficultyColor(4)).toBe('#f59e0b');
      expect(getDifficultyColor(5)).toBe('#f59e0b');
      expect(getDifficultyColor(6)).toBe('#f59e0b');
    });

    it('should return orange for upper-intermediate difficulties (7-8)', () => {
      expect(getDifficultyColor(7)).toBe('#f97316');
      expect(getDifficultyColor(8)).toBe('#f97316');
    });

    it('should return red for advanced difficulties (9+)', () => {
      expect(getDifficultyColor(9)).toBe('#ef4444');
      expect(getDifficultyColor(10)).toBe('#ef4444');
    });
  });

  describe('getDifficultyEmoji', () => {
    it('should return correct emoji for each difficulty level', () => {
      expect(getDifficultyEmoji(1)).toBe('🟢'); // beginner
      expect(getDifficultyEmoji(3)).toBe('🟢');
      expect(getDifficultyEmoji(4)).toBe('🟡'); // intermediate
      expect(getDifficultyEmoji(6)).toBe('🟡');
      expect(getDifficultyEmoji(7)).toBe('🟠'); // upper-intermediate
      expect(getDifficultyEmoji(8)).toBe('🟠');
      expect(getDifficultyEmoji(9)).toBe('🔴'); // advanced
      expect(getDifficultyEmoji(10)).toBe('🔴');
    });
  });

  describe('getDifficultyText', () => {
    it('should return Korean text for each difficulty level', () => {
      expect(getDifficultyText(1)).toBe('초급'); // beginner
      expect(getDifficultyText(3)).toBe('초급');
      expect(getDifficultyText(4)).toBe('중급'); // intermediate
      expect(getDifficultyText(6)).toBe('중급');
      expect(getDifficultyText(7)).toBe('중상급'); // upper-intermediate
      expect(getDifficultyText(8)).toBe('중상급');
      expect(getDifficultyText(9)).toBe('고급'); // advanced
      expect(getDifficultyText(10)).toBe('고급');
    });
  });
});
