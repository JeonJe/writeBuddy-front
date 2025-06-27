import React from 'react';
import { RealExample } from '../../types';
import { 
  getSourceTypeColor, 
  getDifficultyEmoji, 
  getDifficultyText,
  getDifficultyColor 
} from '../../utils/exampleHelpers';
import './RealExampleCard.css';

interface RealExampleCardProps {
  example: RealExample;
  onTagClick?: (tag: string) => void;
}

export const RealExampleCard: React.FC<RealExampleCardProps> = ({
  example,
  onTagClick,
}) => {
  const sourceColor = getSourceTypeColor(example.sourceType);
  const difficultyEmoji = getDifficultyEmoji(example.difficulty);
  const difficultyText = getDifficultyText(example.difficulty);
  const difficultyColor = getDifficultyColor(example.difficulty);


  return (
    <div className="real-example-card">
      <div className="example-header">
        <div 
          className="source-badge"
          style={{ backgroundColor: sourceColor }}
        >
          <span className="source-emoji">{example.sourceTypeEmoji}</span>
          <span className="source-text">{example.sourceTypeDisplay}</span>
        </div>
        {example.isVerified && (
          <div className="verified-badge">
            <span className="verified-icon">✓</span>
            <span className="verified-text">검증됨</span>
          </div>
        )}
      </div>

      <div className="example-content">
        <div className="phrase">
          "{example.phrase}"
        </div>
        
        <div className="source-info">
          <strong>출처:</strong> {example.source}
        </div>
        
        <div className="context">
          {example.context}
        </div>
      </div>

      <div className="example-meta">
        <div className="difficulty-info">
          <span className="difficulty-emoji">{difficultyEmoji}</span>
          <span 
            className="difficulty-text"
            style={{ color: difficultyColor }}
          >
            {difficultyText} ({example.difficulty}/10)
          </span>
        </div>

      </div>

      {example.tags && Array.isArray(example.tags) && example.tags.length > 0 && (
        <div className="example-tags">
          {example.tags.map((tag, index) => (
            <button
              key={index}
              className="tag-button"
              onClick={() => onTagClick?.(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};