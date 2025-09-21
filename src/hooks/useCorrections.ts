import { useState, useCallback } from 'react';
import { Correction, ScoreLevel } from '../types';
import { correctionService } from '../services';
import { ApiError } from '../utils/apiError';

export const useCorrections = () => {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [currentCorrection, setCurrentCorrection] = useState<Correction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getScoreLevel = useCallback((score: number | null): ScoreLevel => {
    if (!score) return 'none';
    if (score >= 8) return 'excellent';
    if (score >= 6) return 'good';
    return 'needs-work';
  }, []);

  const handleApiError = useCallback((err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.isNetworkError()) {
        return '인터넷 연결을 확인해주세요.';
      }
      return err.message;
    }
    
    if (err instanceof Error) {
      return err.message;
    }
    
    return '알 수 없는 오류가 발생했습니다.';
  }, []);

  const createCorrection = useCallback(async (originSentence: string) => {
    if (!originSentence.trim()) {
      setError('문장을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await correctionService.createCorrection({ originSentence });
      setCurrentCorrection(result);
      setCorrections(prev => [result, ...prev]);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  const toggleFavorite = useCallback(async (id: number) => {
    try {
      await correctionService.toggleFavorite(id);
      
      setCorrections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
      
      if (currentCorrection && currentCorrection.id === id) {
        setCurrentCorrection({ ...currentCorrection, isFavorite: !currentCorrection.isFavorite });
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  }, [currentCorrection, handleApiError]);

  const loadCorrections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await correctionService.getAllCorrections();
      setCorrections(result);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    corrections,
    currentCorrection,
    isLoading,
    error,
    createCorrection,
    toggleFavorite,
    loadCorrections,
    getScoreLevel,
    clearError,
  };
};