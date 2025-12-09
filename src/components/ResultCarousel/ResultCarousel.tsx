import React from 'react';
import { Correction, ScoreLevel } from '../../types';
import { CorrectionResult } from '../CorrectionResult/CorrectionResult';
import './ResultCarousel.css';

interface ResultCarouselProps {
  corrections: Correction[];
  currentIndex: number;
  isLoading: boolean;
  onIndexChange: (index: number) => void;
  onToggleFavorite: (id: number) => void;
  getScoreLevel: (score: number | null) => ScoreLevel;
}

export const ResultCarousel: React.FC<ResultCarouselProps> = ({
  corrections,
  currentIndex,
  isLoading,
  onIndexChange,
  onToggleFavorite,
  getScoreLevel,
}) => {
  const totalCards = corrections.length + (isLoading ? 1 : 0);
  const displayIndex = isLoading ? corrections.length : currentIndex;

  const handlePrev = () => {
    if (displayIndex > 0) {
      onIndexChange(displayIndex - 1);
    }
  };

  const handleNext = () => {
    if (displayIndex < corrections.length - 1) {
      onIndexChange(displayIndex + 1);
    }
  };

  // 빈 상태
  if (corrections.length === 0 && !isLoading) {
    return (
      <div className="carousel-empty">
        <div className="empty-icon">✨</div>
        <h3>영어 문장을 입력해보세요</h3>
        <p>AI가 더 자연스러운 표현으로 교정해드립니다</p>
      </div>
    );
  }

  return (
    <div className="result-carousel">
      {/* 헤더: 카운터 + 네비게이션 */}
      <div className="carousel-header">
        <button
          className="carousel-nav prev"
          onClick={handlePrev}
          disabled={displayIndex === 0}
          aria-label="이전 결과"
        >
          ◀
        </button>
        <span className="carousel-counter">
          {displayIndex + 1} / {totalCards}
        </span>
        <button
          className="carousel-nav next"
          onClick={handleNext}
          disabled={isLoading || displayIndex >= corrections.length - 1}
          aria-label="다음 결과"
        >
          ▶
        </button>
      </div>

      {/* 카드 슬라이더 */}
      <div className="carousel-track-wrapper">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${displayIndex * 100}%)`,
          }}
        >
          {corrections.map((correction, index) => (
            <div key={correction.id} className="carousel-slide">
              <CorrectionResult
                correction={correction}
                onToggleFavorite={onToggleFavorite}
                getScoreLevel={getScoreLevel}
                onTagClick={() => {}}
              />
            </div>
          ))}

          {/* 로딩 카드 */}
          {isLoading && (
            <div className="carousel-slide">
              <div className="loading-card">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <h3>🔄 교정 중...</h3>
                <p>AI가 당신의 영어를 분석하고 있어요</p>
                <div className="loading-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 인디케이터 */}
      {totalCards > 1 && (
        <div className="carousel-indicators">
          {corrections.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === displayIndex ? 'active' : ''}`}
              onClick={() => onIndexChange(index)}
              aria-label={`${index + 1}번째 결과로 이동`}
            />
          ))}
          {isLoading && (
            <button
              className={`indicator loading ${displayIndex === corrections.length ? 'active' : ''}`}
              disabled
              aria-label="로딩 중"
            />
          )}
        </div>
      )}
    </div>
  );
};
