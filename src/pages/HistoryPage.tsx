import React from 'react';
import { CorrectionHistory } from '../components';
import { useCorrections } from '../hooks';
import './HistoryPage.css';

export const HistoryPage: React.FC = () => {
  const {
    corrections,
    toggleFavorite,
    getScoreLevel,
  } = useCorrections();

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <h1>교정 기록</h1>
          <p>지금까지의 영어 학습 기록을 확인해보세요</p>
        </div>
        
        {corrections.length === 0 ? (
          <div className="empty-state">
            <p>아직 교정 기록이 없습니다.</p>
            <p>영어 문장을 입력하고 교정을 받아보세요!</p>
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