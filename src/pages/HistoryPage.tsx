import React, { useEffect } from 'react';
import { CorrectionHistory } from '../components';
import { useCorrectionsContext } from '../contexts/CorrectionsContext';
import { useCorrections } from '../hooks';
import './HistoryPage.css';

export const HistoryPage: React.FC = () => {
  const {
    corrections,
    toggleFavorite,
    loadCorrections,
    isLoadingHistory,
  } = useCorrectionsContext();

  const { getScoreLevel } = useCorrections();


  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <h1>교정 기록</h1>
          <p>지금까지의 영어 학습 기록을 확인해보세요</p>
        </div>

        <div className="history-controls">
          <button 
            className="load-history-button"
            onClick={loadCorrections}
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? '📝 로딩 중...' : '📝 교정 기록 불러오기'}
          </button>
        </div>
        
        {isLoadingHistory ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>📝 교정 기록을 불러오는 중입니다...</p>
          </div>
        ) : corrections.length === 0 ? (
          <div className="empty-state">
            <h3>📝 교정 기록을 불러와주세요</h3>
            <p>위의 "교정 기록 불러오기" 버튼을 클릭하여<br/>지금까지의 영어 학습 기록을 확인해보세요!</p>
          </div>
        ) : (
          <CorrectionHistory
            corrections={corrections}
            onToggleFavorite={toggleFavorite}
            getScoreLevel={getScoreLevel}
          />
        )}
      </div>
    </div>
  );
};