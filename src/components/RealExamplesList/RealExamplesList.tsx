import React from 'react';
import { RealExample } from '../../types';
import { RealExampleCard } from '../RealExampleCard/RealExampleCard';
import './RealExamplesList.css';

interface RealExamplesListProps {
  examples: RealExample[];
  title?: string;
  onTagClick?: (tag: string) => void;
}

export const RealExamplesList: React.FC<RealExamplesListProps> = ({
  examples,
  title = "실제 사용 예시",
  onTagClick,
}) => {
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <div className="real-examples-list">
      <div className="examples-header">
        <h4 className="examples-title">
          🎬 {title}
        </h4>
        <span className="examples-count">
          {examples.length}개의 예시
        </span>
      </div>
      
      <div className="examples-container">
        {examples.map((example) => (
          <RealExampleCard
            key={example.id}
            example={example}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
};