import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Correction } from '../types';
import { correctionService } from '../services/correctionService';
import { ApiError } from '../utils/apiError';
import { ERROR_MESSAGES } from '../config/api';

interface CorrectionsContextType {
  // 상태
  corrections: Correction[];
  currentCorrection: Correction | null;
  sessionCorrections: Correction[]; // 세션 내 교정 히스토리
  currentIndex: number; // 현재 보고 있는 카드 인덱스
  inputText: string;
  isLoading: boolean;
  isLoadingHistory: boolean;
  error: string | null;

  // 액션
  createCorrection: (originSentence: string, onSuccess?: () => void) => Promise<void>;
  loadCorrections: () => Promise<void>;
  toggleFavorite: (correctionId: number) => Promise<void>;
  updateMemo: (correctionId: number, memo: string) => Promise<void>;
  setInputText: (text: string) => void;
  setCurrentIndex: (index: number) => void;
  clearError: () => void;
  clearCurrentCorrection: () => void;
}

const CorrectionsContext = createContext<CorrectionsContextType | undefined>(undefined);

interface CorrectionsProviderProps {
  children: ReactNode;
}

export const CorrectionsProvider: React.FC<CorrectionsProviderProps> = ({ children }) => {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [currentCorrection, setCurrentCorrection] = useState<Correction | null>(null);
  const [sessionCorrections, setSessionCorrections] = useState<Correction[]>([]); // 세션 히스토리
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 현재 인덱스
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof ApiError) {
      if (error.isNetworkError()) {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        setError(error.message || ERROR_MESSAGES.UNKNOWN);
      }
    } else {
      setError(ERROR_MESSAGES.UNKNOWN);
    }
  }, []);

  const createCorrection = useCallback(async (originSentence: string, onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      const newCorrection = await correctionService.createCorrection({ originSentence });
      setCurrentCorrection(newCorrection);
      setCorrections(prev => [newCorrection, ...prev]);
      // 세션 히스토리에 추가하고 최신 카드로 이동
      setSessionCorrections(prev => [...prev, newCorrection]);
      setCurrentIndex(sessionCorrections.length); // 새 카드 인덱스로 이동
      // 새로운 교정 생성 성공 시 콜백 실행
      onSuccess?.();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, sessionCorrections.length]);

  const loadCorrections = useCallback(async () => {
    setIsLoadingHistory(true);
    setError(null);
    
    try {
      const fetchedCorrections = await correctionService.getAllCorrections();
      setCorrections(fetchedCorrections);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [handleApiError]);

  const toggleFavorite = useCallback(async (correctionId: number) => {
    // 로컬 상태 먼저 업데이트 (optimistic update)
    const previousCorrections = corrections;
    const previousCurrentCorrection = currentCorrection;
    const previousSessionCorrections = sessionCorrections;

    setCorrections(prev =>
      prev.map(correction =>
        correction.id === correctionId
          ? { ...correction, isFavorite: !correction.isFavorite }
          : correction
      )
    );

    setSessionCorrections(prev =>
      prev.map(correction =>
        correction.id === correctionId
          ? { ...correction, isFavorite: !correction.isFavorite }
          : correction
      )
    );

    if (currentCorrection?.id === correctionId) {
      setCurrentCorrection(prev =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }

    try {
      await correctionService.toggleFavorite(correctionId);
    } catch (err) {
      // API 호출 실패 시 상태 롤백
      setCorrections(previousCorrections);
      setSessionCorrections(previousSessionCorrections);
      if (previousCurrentCorrection) {
        setCurrentCorrection(previousCurrentCorrection);
      }
      handleApiError(err);
    }
  }, [corrections, currentCorrection, sessionCorrections, handleApiError]);

  const updateMemo = useCallback(async (correctionId: number, memo: string) => {
    try {
      await correctionService.updateMemo(correctionId, memo);
      
      // 상태 업데이트
      setCorrections(prev => 
        prev.map(correction => 
          correction.id === correctionId 
            ? { ...correction, memo }
            : correction
        )
      );
      
      // 현재 교정 결과도 업데이트
      if (currentCorrection?.id === correctionId) {
        setCurrentCorrection(prev => 
          prev ? { ...prev, memo } : null
        );
      }
    } catch (err) {
      handleApiError(err);
    }
  }, [currentCorrection?.id, handleApiError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentCorrection = useCallback(() => {
    setCurrentCorrection(null);
  }, []);

  const value: CorrectionsContextType = {
    // 상태
    corrections,
    currentCorrection,
    sessionCorrections,
    currentIndex,
    inputText,
    isLoading,
    isLoadingHistory,
    error,

    // 액션
    createCorrection,
    loadCorrections,
    toggleFavorite,
    updateMemo,
    setInputText,
    setCurrentIndex,
    clearError,
    clearCurrentCorrection,
  };

  return (
    <CorrectionsContext.Provider value={value}>
      {children}
    </CorrectionsContext.Provider>
  );
};

export const useCorrectionsContext = (): CorrectionsContextType => {
  const context = useContext(CorrectionsContext);
  if (context === undefined) {
    throw new Error('useCorrectionsContext must be used within a CorrectionsProvider');
  }
  return context;
};