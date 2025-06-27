import React, { useEffect } from 'react';
import { 
  CorrectionInput, 
  CorrectionResult, 
  FloatingChatButton,
  LoadingState,
  Toast
} from '../components';
import { useCorrectionsContext } from '../contexts/CorrectionsContext';
import { useToast, useCorrections } from '../hooks';
import './HomePage.css';

interface HomePageProps {
  onOpenChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenChat }) => {
  
  const {
    currentCorrection,
    isLoading,
    error,
    createCorrection,
    toggleFavorite,
    clearError,
  } = useCorrectionsContext();

  const { getScoreLevel } = useCorrections();

  const { toasts, showSuccess, removeToast } = useToast();

  const handleCreateCorrection = async (text: string) => {
    await createCorrection(text, () => {
      // 새로운 교정이 성공적으로 생성되었을 때만 토스트 표시
      showSuccess('훨씬 더 멋져졌어요! ✨');
    });
  };

  return (
    <div className="home-page">
      <FloatingChatButton onClick={onOpenChat} />
      
      <main className="main-content">
        <div className="hero-section">
          <h1>Error 404: Grammar Not Found  👨‍💻</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button 
              onClick={clearError}
              className="error-close-btn"
              aria-label="오류 메시지 닫기"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="content-container">
          <CorrectionInput 
            onCorrect={handleCreateCorrection}
            isLoading={isLoading}
          />
          
          {isLoading && (
            <LoadingState message="✨ 마법을 부리는 중..." />
          )}
          
          {currentCorrection && !isLoading && (
            <CorrectionResult
              correction={currentCorrection}
              onToggleFavorite={toggleFavorite}
              getScoreLevel={getScoreLevel}
              onTagClick={(tag) => console.log('Tag clicked:', tag)}
            />
          )}
        </div>
      </main>

      {/* 토스트 알림 */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={true}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};