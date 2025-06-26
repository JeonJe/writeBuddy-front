import React, { useEffect } from 'react';
import { 
  CorrectionInput, 
  CorrectionResult, 
  FloatingChatButton,
  LoadingState,
  Toast
} from '../components';
import { useCorrections, useToast } from '../hooks';
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
    getScoreLevel,
    clearError,
  } = useCorrections();

  const { toasts, showSuccess, removeToast } = useToast();

  // 교정 완료 시 토스트 표시
  useEffect(() => {
    if (currentCorrection && !isLoading) {
      showSuccess('훨씬 더 멋져졌어요! ✨');
    }
  }, [currentCorrection, isLoading, showSuccess]);

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
            onCorrect={createCorrection}
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