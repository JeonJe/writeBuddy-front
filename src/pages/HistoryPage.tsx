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

  useEffect(() => {
    // 페이지 로드 시 교정 목록이 비어있으면 로드
    if (corrections.length === 0) {
      loadCorrections();
    }
  }, [corrections.length, loadCorrections]);

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <h1>교정 기록</h1>
          <p>지금까지의 영어 학습 기록을 확인해보세요</p>
        </div>
        
        {isLoadingHistory ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>교정 기록을 불러오는 중...</p>
          </div>
        ) : corrections.length === 0 ? (
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