import React from 'react';
import { Correction } from '../../types';
import './GoodExpressions.css';

interface GoodExpressionsProps {
  goodExpressions: Correction[];
  isLoading: boolean;
}

export const GoodExpressions: React.FC<GoodExpressionsProps> = ({
  goodExpressions,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="good-expressions">
        <div className="good-expressions-header">
          <h3>🏆 잘한 표현들</h3>
          <p>10점 만점을 받은 완벽한 문장들</p>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>잘한 표현들을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (goodExpressions.length === 0) {
    return (
      <div className="good-expressions">
        <div className="good-expressions-header">
          <h3>🏆 잘한 표현들</h3>
          <p>10점 만점을 받은 완벽한 문장들</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h4>아직 10점 만점 문장이 없어요</h4>
          <p>완벽한 문장을 작성해서 10점 만점에 도전해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="good-expressions">
      <div className="good-expressions-header">
        <h3>🏆 잘한 표현들</h3>
        <p>최근 3개월간 10점 만점을 받은 완벽한 문장들 ({goodExpressions.length}개)</p>
      </div>
      
      <div className="good-expressions-list">
        {goodExpressions.map((expression) => (
          <div key={expression.id} className="good-expression-card">
            <div className="expression-header">
              <div className="perfect-score">
                <span className="score-badge">10점</span>
                <span className="perfect-icon">🏆</span>
              </div>
              <div className="expression-date">
                {new Date(expression.createdAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div className="expression-content">
              <div className="original-sentence">
                <span className="sentence-label">원문</span>
                <p className="sentence-text">"{expression.originSentence}"</p>
              </div>
              
              {expression.originTranslation && (
                <div className="translation">
                  <span className="translation-icon">🇰🇷</span>
                  <p className="translation-text">{expression.originTranslation}</p>
                </div>
              )}
              
              <div className="feedback-section">
                <div className="feedback-type-badge">
                  <span className="feedback-icon">
                    {expression.feedbackType === 'GRAMMAR' && '📝'}
                    {expression.feedbackType === 'SPELLING' && '✏️'}
                    {expression.feedbackType === 'STYLE' && '🎨'}
                    {expression.feedbackType === 'PUNCTUATION' && '📍'}
                  </span>
                  <span className="feedback-type">{expression.feedbackType}</span>
                </div>
                <p className="feedback-text">"{expression.feedback}"</p>
              </div>
            </div>
            
            {expression.memo && (
              <div className="expression-memo">
                <span className="memo-icon">📝</span>
                <p className="memo-text">{expression.memo}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};