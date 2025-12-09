/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

/**
 * Score thresholds for correction quality levels
 */
export const SCORE_THRESHOLDS = {
  EXCELLENT: 8,
  GOOD: 6,
} as const;

/**
 * Difficulty level thresholds for examples
 */
export const DIFFICULTY_LEVELS = {
  EASY: 3,
  MEDIUM: 6,
  HARD: 8,
} as const;

/**
 * UI-related constants
 */
export const UI_CONSTANTS = {
  TOAST_DURATION: 3000, // milliseconds
  TEXTAREA_MAX_HEIGHT: 120, // pixels
  DEBOUNCE_DELAY: 300, // milliseconds
} as const;

/**
 * API-related constants
 */
export const API_CONSTANTS = {
  DEFAULT_TIMEOUT: 60000, // milliseconds
  MAX_RETRIES: 3,
} as const;

/**
 * Validation constants
 */
export const VALIDATION = {
  MIN_SENTENCE_LENGTH: 1,
  MAX_SENTENCE_LENGTH: 1000,
  MIN_MEMO_LENGTH: 0,
  MAX_MEMO_LENGTH: 500,
} as const;
