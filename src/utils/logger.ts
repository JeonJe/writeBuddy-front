/**
 * Structured logging utility to replace console.log statements
 * Provides consistent logging format and environment-aware behavior
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const formatMessage = (level: LogLevel, message: string, context?: LogContext): string => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

/**
 * Logger utility
 * - debug: Development-only detailed logs
 * - info: Informational messages
 * - warn: Warning messages
 * - error: Error messages
 */
export const logger = {
  /**
   * Debug logging (development only)
   * Use for detailed debugging information
   */
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message, context));
    }
  },

  /**
   * Informational logging
   * Use for general operational messages
   */
  info: (message: string, context?: LogContext) => {
    console.info(formatMessage('info', message, context));
  },

  /**
   * Warning logging
   * Use for potentially harmful situations
   */
  warn: (message: string, context?: LogContext) => {
    console.warn(formatMessage('warn', message, context));
  },

  /**
   * Error logging
   * Use for error events
   */
  error: (message: string, error?: unknown, context?: LogContext) => {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error,
    };
    console.error(formatMessage('error', message, errorContext));
  },
};
