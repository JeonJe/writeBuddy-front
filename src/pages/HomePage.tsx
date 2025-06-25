import React from 'react';
import { 
  Header, 
  CorrectionInput, 
  CorrectionResult, 
  CorrectionHistory 
} from '../components';
import { useCorrections } from '../hooks';

export const HomePage: React.FC = () => {
  const {
    corrections,
    currentCorrection,
    isLoading,
    error,
    createCorrection,
    toggleFavorite,
    getScoreLevel,
    clearError,
  } = useCorrections();

  return (
    <div className="home-page">
      <Header />
      
      <main className="main-content">
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
        
        <div className="content-layout">
          <div className="left-panel">
            <CorrectionInput 
              onCorrect={createCorrection}
              isLoading={isLoading}
            />
            
            {currentCorrection && (
              <CorrectionResult
                correction={currentCorrection}
                onToggleFavorite={toggleFavorite}
                getScoreLevel={getScoreLevel}
                onTagClick={(tag) => console.log('Tag clicked:', tag)}
              />
            )}
          </div>
          
          <div className="right-panel">
            <CorrectionHistory
              corrections={corrections}
              onToggleFavorite={toggleFavorite}
              getScoreLevel={getScoreLevel}
            />
          </div>
        </div>
      </main>
    </div>
  );
};