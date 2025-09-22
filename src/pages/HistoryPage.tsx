import React from 'react';
import { CorrectionHistory } from '../components';
import { Toast } from '../components/Toast/Toast';
import { useCorrectionsContext } from '../contexts/CorrectionsContext';
import { useCorrections } from '../hooks';
import { useToast } from '../hooks/useToast';
import './HistoryPage.css';

export const HistoryPage: React.FC = () => {
  const {
    corrections,
    toggleFavorite,
    loadCorrections,
    isLoadingHistory,
  } = useCorrectionsContext();

  const { getScoreLevel } = useCorrections();
  const { toasts, removeToast, showSuccess } = useToast();

  const handleToggleFavorite = async (id: number, currentFavoriteStatus: boolean) => {
    await toggleFavorite(id);
    if (currentFavoriteStatus) {
      showSuccess('💔 즐겨찾기에서 제거했어요');
    } else {
      showSuccess('⭐ 즐겨찾기에 추가했어요!');
    }
  };


  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div className="header-content">
            <h1>내 기록</h1>
          </div>
          <button
            className="load-history-button"
            onClick={loadCorrections}
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? '새로고침 중...' : '새로고침'}
          </button>
        </div>
        
        {isLoadingHistory ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>📝 교정 기록을 불러오는 중입니다...</p>
          </div>
        ) : corrections.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>아직 교정 기록이 없어요</h3>
            <p>새로고침 버튼을 눌러 기록을 불러오거나<br/>새로운 영어 문장을 교정해보세요!</p>
          </div>
        ) : (
          <CorrectionHistory
            corrections={corrections}
            onToggleFavorite={handleToggleFavorite}
            getScoreLevel={getScoreLevel}
          />
        )}
      </div>

      {/* Toast 컴포넌트들 렌더링 */}
      <div className="toast-container">
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
    </div>
  );
};