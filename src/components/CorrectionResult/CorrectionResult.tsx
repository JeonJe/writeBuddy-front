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
      <h3>교정 결과</h3>
      <div className="result-card">
        <div className="sentence-pair">
          <div className="original">
            <strong>원문:</strong> {correction.originSentence}
          </div>
          <div className="corrected">
            <strong>교정:</strong> {correction.correctedSentence}
          </div>
        </div>
        
        <div className="feedback">
          <strong>피드백:</strong> {correction.feedback}
        </div>
        
        <div className="result-meta">
          {correction.score && (
            <span className={`score score-${getScoreLevel(correction.score)}`}>
              점수: {correction.score}/10
            </span>
          )}
          <span className="feedback-type">
            {correction.feedbackType}
          </span>
          <button 
            onClick={() => onToggleFavorite(correction.id)}
            className={`favorite-btn ${correction.isFavorite ? 'favorited' : ''}`}
          >
            {correction.isFavorite ? '⭐' : '☆'} 즐겨찾기
          </button>
        </div>

        {correction.relatedExamples && correction.relatedExamples.length > 0 && (
          <RealExamplesList
            examples={correction.relatedExamples}
            title="관련 실제 사용 예시"
            onTagClick={onTagClick}
          />
        )}
      </div>
    </section>
  );
};