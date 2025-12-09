import React, { useState, useMemo } from 'react';
import { CorrectionHistory } from '../components';
import { Toast } from '../components/Toast/Toast';
import { useCorrectionsContext } from '../contexts/CorrectionsContext';
import { useCorrections } from '../hooks';
import { useToast } from '../hooks/useToast';
import './HistoryPage.css';

type FilterType = 'all' | 'favorites' | 'high-score' | 'needs-work';

export const HistoryPage: React.FC = () => {
  const {
    corrections,
    toggleFavorite,
    loadCorrections,
    isLoadingHistory,
  } = useCorrectionsContext();

  const { getScoreLevel } = useCorrections();
  const { toasts, removeToast, showSuccess } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // 검색 및 필터 적용
  const filteredCorrections = useMemo(() => {
    let result = [...corrections];

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.originSentence.toLowerCase().includes(query) ||
        c.correctedSentence.toLowerCase().includes(query) ||
        c.feedback.toLowerCase().includes(query)
      );
    }

    // 필터 적용
    switch (activeFilter) {
      case 'favorites':
        result = result.filter(c => c.isFavorite);
        break;
      case 'high-score':
        result = result.filter(c => c.score !== null && c.score >= 8);
        break;
      case 'needs-work':
        result = result.filter(c => c.score !== null && c.score < 6);
        break;
    }

    return result;
  }, [corrections, searchQuery, activeFilter]);

  const handleToggleFavorite = async (id: number, currentFavoriteStatus: boolean) => {
    await toggleFavorite(id);
    if (currentFavoriteStatus) {
      showSuccess('💔 즐겨찾기에서 제거했어요');
    } else {
      showSuccess('⭐ 즐겨찾기에 추가했어요!');
    }
  };

  const filterButtons: { key: FilterType; label: string; emoji: string }[] = [
    { key: 'all', label: '전체', emoji: '📋' },
    { key: 'favorites', label: '즐겨찾기', emoji: '⭐' },
    { key: 'high-score', label: '고득점', emoji: '🏆' },
    { key: 'needs-work', label: '복습필요', emoji: '📝' },
  ];

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div className="header-content">
            <h1>내 기록</h1>
            <span className="record-count">{corrections.length}개 기록</span>
          </div>
          <button
            className="load-history-button"
            onClick={loadCorrections}
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? '새로고침 중...' : '🔄 새로고침'}
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="search-filter-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="문장 또는 피드백 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-buttons">
            {filterButtons.map(({ key, label, emoji }) => (
              <button
                key={key}
                className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
                onClick={() => setActiveFilter(key)}
              >
                <span className="filter-emoji">{emoji}</span>
                <span className="filter-label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 검색 결과 표시 */}
        {(searchQuery || activeFilter !== 'all') && (
          <div className="search-result-info">
            {filteredCorrections.length}개 결과
            {searchQuery && <span> · "{searchQuery}"</span>}
            {activeFilter !== 'all' && (
              <span> · {filterButtons.find(f => f.key === activeFilter)?.label}</span>
            )}
          </div>
        )}

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
        ) : filteredCorrections.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>검색 결과가 없어요</h3>
            <p>다른 검색어나 필터를 시도해보세요</p>
          </div>
        ) : (
          <CorrectionHistory
            corrections={filteredCorrections}
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
