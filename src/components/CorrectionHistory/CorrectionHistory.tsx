import React from 'react';
import { Correction, ScoreLevel } from '../../types';
import './CorrectionHistory.css';

interface CorrectionHistoryProps {
  corrections: Correction[];
  onToggleFavorite: (id: number) => void;
  getScoreLevel: (score: number | null) => ScoreLevel;
}

export const CorrectionHistory: React.FC<CorrectionHistoryProps> = ({
  corrections,
  onToggleFavorite,
  getScoreLevel,
}) => {
  if (corrections.length === 0) return null;

  return (
    <section className="corrections-history">
      <h3>교정 기록</h3>
      <div className="corrections-list">
        {corrections.map(item => (
          <div key={item.id} className="correction-item">
            <div className="sentence-pair">
              <div className="original">{item.originSentence}</div>
              <div className="corrected">{item.correctedSentence}</div>
            </div>
            <div className="item-meta">
              {item.score && (
                <span className={`score score-${getScoreLevel(item.score)}`}>
                  {item.score}/10
                </span>
              )}
              <span className="feedback-type">{item.feedbackType}</span>
              <button 
                onClick={() => onToggleFavorite(item.id)}
                className={`favorite-btn ${item.isFavorite ? 'favorited' : ''}`}
              >
                {item.isFavorite ? '⭐' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};