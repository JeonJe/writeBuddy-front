import { logger } from '../logger';

describe('logger', () => {
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.debug('Test debug message');

      expect(consoleDebugSpy).toHaveBeenCalled();
      const loggedMessage = consoleDebugSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[DEBUG]');
      expect(loggedMessage).toContain('Test debug message');

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logger.debug('Test debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('should include context in debug logs', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.debug('Test message', { userId: 123, action: 'login' });

      expect(consoleDebugSpy).toHaveBeenCalled();
      const loggedMessage = consoleDebugSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('userId');
      expect(loggedMessage).toContain('123');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');

      expect(consoleInfoSpy).toHaveBeenCalled();
      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[INFO]');
      expect(loggedMessage).toContain('Test info message');
    });

    it('should include context in info logs', () => {
      logger.info('User action', { action: 'create_correction' });

      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('action');
      expect(loggedMessage).toContain('create_correction');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const loggedMessage = consoleWarnSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[WARN]');
      expect(loggedMessage).toContain('Test warning message');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Test error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('[ERROR]');
      expect(loggedMessage).toContain('Test error message');
    });

    it('should include Error object details', () => {
      const error = new Error('Something went wrong');
      error.stack = 'Error stack trace';

      logger.error('An error occurred', error);

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('Something went wrong');
      expect(loggedMessage).toContain('Error stack trace');
    });

    it('should handle non-Error objects', () => {
      logger.error('Unknown error', { code: 'UNKNOWN' });

      const loggedMessage = consoleErrorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('Unknown error');
      expect(loggedMessage).toContain('UNKNOWN');
    });
  });

  describe('message formatting', () => {
    it('should include ISO timestamp in all logs', () => {
      logger.info('Test message');

      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      // Check for ISO date format (YYYY-MM-DDTHH:mm:ss.sssZ)
      expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    it('should format context as JSON', () => {
      const context = { userId: 123, action: 'test', nested: { value: 'abc' } };
      logger.info('Test', context);

      const loggedMessage = consoleInfoSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('"userId":123');
      expect(loggedMessage).toContain('"action":"test"');
    });
  });
});
