import { useState, useCallback } from 'react';
import { ApiError } from '../utils/apiError';

/**
 * Generic async state interface
 */
interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Return type for useAsync hook
 */
interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (asyncFn: () => Promise<T>) => Promise<T>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

/**
 * Generic hook for managing async operations
 * Eliminates duplicated loading/error/data state pattern
 *
 * @example
 * const { data, isLoading, error, execute } = useAsync<User>();
 *
 * const loadUser = async () => {
 *   await execute(() => userService.getUser(id));
 * };
 */
export function useAsync<T = unknown>(): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T> => {
    setState({ data: null, isLoading: true, error: null });

    try {
      const result = await asyncFn();
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : err instanceof Error
        ? err.message
        : '알 수 없는 오류가 발생했습니다.';

      setState({ data: null, isLoading: false, error: errorMessage });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}
