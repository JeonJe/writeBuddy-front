import React, { useMemo } from 'react';
import { CompareAnswerResponse } from '../../types';
import './AnswerComparison.css';

interface AnswerComparisonProps {
  userAnswer: string;
  bestAnswer: string;
  result?: CompareAnswerResponse | null;
}

export const AnswerComparison: React.FC<AnswerComparisonProps> = ({
  userAnswer,
  bestAnswer,
  result,
}) => {
  const displayUserAnswer = useMemo(() =>
    userAnswer.trim() || "(작성하지 않음)",
    [userAnswer]
  );

  const isPerfect = useMemo(() =>
    result?.isCorrect && result.score >= 95,
    [result]
  );

  return (
    <div className="answer-comparison">
      <div className="answer-section user-answer-section">
        <div className="answer-label">내 답:</div>
        <div className="answer-text user-answer">{displayUserAnswer}</div>
      </div>

      <div className="answer-section best-answer-section">
        <div className="answer-label">✨ Best:</div>
        <div className="answer-text best-answer">{bestAnswer}</div>
      </div>

      {result && (
        <div className={`feedback-section ${isPerfect ? 'perfect' : ''}`}>
          <div className="feedback-icon">💡</div>
          <div className="feedback-content">
            <div className="feedback-message">{result.overallFeedback}</div>
            {result.differences.length > 0 && (
              <div className="differences-list">
                {result.differences.slice(0, 3).map((diff, index) => (
                  <div key={index} className="difference-item">
                    <span className="difference-highlight">{diff.userPart}</span>
                    <span className="difference-arrow">→</span>
                    <span className="difference-highlight">{diff.bestPart}</span>
                    <div className="difference-explanation">{diff.explanation}</div>
                  </div>
                ))}
              </div>
            )}
            {result.tip && (
              <div className="tip-text">💡 Tip: {result.tip}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
