import {
  formatDateTime,
  formatDate,
  formatTime,
  truncate,
  capitalize,
  formatNumber,
  formatPercentage,
} from '../formatters';

describe('formatters', () => {
  describe('formatDateTime', () => {
    it('should format date string to localized date/time', () => {
      const dateString = '2024-01-15T14:30:00Z';
      const formatted = formatDateTime(dateString, 'ko-KR');

      expect(formatted).toMatch(/2024/);
      expect(formatted).toMatch(/01/);
      expect(formatted).toMatch(/15/);
    });

    it('should return original string on invalid date', () => {
      const invalidDate = 'not-a-date';
      const formatted = formatDateTime(invalidDate);

      expect(formatted).toBe(invalidDate);
    });
  });

  describe('formatDate', () => {
    it('should format date string to localized date only', () => {
      const dateString = '2024-01-15T14:30:00Z';
      const formatted = formatDate(dateString, 'ko-KR');

      expect(formatted).toMatch(/2024/);
      expect(formatted).toMatch(/01/);
      expect(formatted).toMatch(/15/);
      // Should not contain time components
      expect(formatted).not.toMatch(/14/);
      expect(formatted).not.toMatch(/30/);
    });

    it('should return original string on invalid date', () => {
      const invalidDate = 'invalid';
      expect(formatDate(invalidDate)).toBe(invalidDate);
    });
  });

  describe('formatTime', () => {
    it('should format date string to localized time only', () => {
      const dateString = '2024-01-15T14:30:00Z';
      const formatted = formatTime(dateString, 'ko-KR');

      // Should contain time components
      expect(formatted).toMatch(/:/);
      // Should not contain date components like year
      expect(formatted).not.toMatch(/2024/);
    });

    it('should return original string on invalid date', () => {
      const invalidDate = 'invalid';
      expect(formatTime(invalidDate)).toBe(invalidDate);
    });
  });

  describe('truncate', () => {
    it('should truncate long strings with ellipsis', () => {
      const longText = 'This is a very long text that should be truncated';
      const truncated = truncate(longText, 20);

      expect(truncated).toBe('This is a very lo...');
      expect(truncated.length).toBe(20);
    });

    it('should not truncate short strings', () => {
      const shortText = 'Short';
      const result = truncate(shortText, 20);

      expect(result).toBe(shortText);
    });

    it('should handle exact length match', () => {
      const text = '12345';
      const result = truncate(text, 5);

      expect(result).toBe('12345');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should not change already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character strings', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with thousands separators', () => {
      const formatted = formatNumber(1234567);

      // Korean locale uses comma separator
      expect(formatted).toContain(',');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(42)).toBe('42');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with default decimals', () => {
      expect(formatPercentage(75.5)).toBe('75.5%');
      expect(formatPercentage(100)).toBe('100.0%');
    });

    it('should format percentage with custom decimals', () => {
      expect(formatPercentage(75.567, 2)).toBe('75.57%');
      expect(formatPercentage(75.5, 0)).toBe('76%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
    });
  });
});
