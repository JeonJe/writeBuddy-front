import React from 'react';
import { Correction, ScoreLevel } from '../../types';
import { RealExamplesList } from '../RealExamplesList/RealExamplesList';
import './CorrectionResult.css';

interface CorrectionResultProps {
  correction: Correction;
  onToggleFavorite: (id: number) => void;
  getScoreLevel: (score: number | null) => ScoreLevel;
  onTagClick?: (tag: string) => void;
}

export const CorrectionResult: React.FC<CorrectionResultProps> = ({
  correction,
  onToggleFavorite,
  getScoreLevel,
  onTagClick,
}) => {
  return (
    <section className="correction-result">
      <div className="result-header">
        <h3>✨ 훨씬 더 멋져졌어요!</h3>
        <div className="result-meta">
          {correction.score && (
            <span className={`score score-${getScoreLevel(correction.score)}`}>
              {correction.score}/10
            </span>
          )}
          <button 
            onClick={() => onToggleFavorite(correction.id)}
            className={`favorite-btn ${correction.isFavorite ? 'favorited' : ''}`}
          >
            {correction.isFavorite ? '💖' : '🤍'}
          </button>
        </div>
      </div>

      <div className="result-card">
        <div className="sentence-comparison">
          <div className="sentence-block original-block">
            <div className="sentence-label">원문</div>
            <div className="sentence-content">{correction.originSentence}</div>
            {correction.originTranslation && (
              <div className="translation">💬 {correction.originTranslation}</div>
            )}
          </div>
          
          <div className="sentence-arrow">→</div>
          
          <div className="sentence-block corrected-block">
            <div className="sentence-label">교정</div>
            <div className="sentence-content">{correction.correctedSentence}</div>
            {correction.correctedTranslation && (
              <div className="translation">💬 {correction.correctedTranslation}</div>
            )}
          </div>
        </div>
        
        <div className="feedback-section">
          <div className="feedback-label">🧠 AI 피드백</div>
          <div className="feedback-content">{correction.feedback}</div>
          <div className="feedback-type-badge" data-type={correction.feedbackType}>
            {correction.feedbackType}
          </div>
        </div>

        {correction.relatedExamples && correction.relatedExamples.length > 0 && (
          <div className="examples-section">
            <RealExamplesList
              examples={correction.relatedExamples}
              title="🎬 실제 사용 예시"
              onTagClick={onTagClick}
            />
          </div>
        )}
      </div>
    </section>
  );
};