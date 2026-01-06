import React, { useRef, useEffect } from 'react';
import {
  CorrectionInput,
  Toast,
  ResultCarousel,
  ChatInterface,
  PracticePanel,
} from '../components';
import { useCorrectionsContext } from '../contexts/CorrectionsContext';
import { useToast, useCorrections } from '../hooks';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    sessionCorrections,
    currentIndex,
    isLoading,
    error,
    createCorrection,
    toggleFavorite,
    clearError,
    setCurrentIndex,
  } = useCorrectionsContext();

  const { getScoreLevel } = useCorrections();
  const { toasts, showSuccess, removeToast } = useToast();

  // 교정 완료 후 입력창으로 포커스
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleCreateCorrection = async (text: string) => {
    await createCorrection(text, () => {
      showSuccess('훨씬 더 멋져졌어요! ✨');
    });
  };

  return (
    <div className="home-page">
      <main className="main-layout">
        {/* 좌측: 입력 + 결과 영역 (70%) */}
        <div className="content-area">
          {error && (
            <div className="error-message" role="alert">
              <span className="error-text">{error}</span>
              <div className="error-actions">
                <button
                  onClick={() => {
                    clearError();
                    if (sessionCorrections.length > 0) {
                      handleCreateCorrection(sessionCorrections[sessionCorrections.length - 1].originSentence);
                    }
                  }}
                  className="error-retry-btn"
                  aria-label="다시 시도"
                >
                  다시 시도
                </button>
                <button
                  onClick={clearError}
                  className="error-close-btn"
                  aria-label="오류 메시지 닫기"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* 연습 영역 */}
          <PracticePanel />

          {/* 입력 영역 */}
          <section className="input-section">
            <CorrectionInput
              onCorrect={handleCreateCorrection}
              isLoading={isLoading}
            />
          </section>

          {/* 결과 영역 */}
          <section className="result-section">
            <ResultCarousel
              corrections={sessionCorrections}
              currentIndex={currentIndex}
              isLoading={isLoading}
              onIndexChange={setCurrentIndex}
              onToggleFavorite={toggleFavorite}
              getScoreLevel={getScoreLevel}
            />
          </section>
        </div>

        {/* 우측: AI 도우미 사이드바 (30%) */}
        <aside className="chat-sidebar">
          <section className="sidebar-card chat-card">
            <div className="sidebar-header">
              <h2>💬 AI 도우미</h2>
            </div>
            <ChatInterface />
          </section>
        </aside>
      </main>

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
