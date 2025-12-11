import React from 'react';
import { Correction, ScoreLevel } from '../../types';
import './CorrectionHistory.css';

// HTML 엔티티 이스케이프 함수 (XSS 방지)
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

interface CorrectionHistoryProps {
  corrections: Correction[];
  onToggleFavorite: (id: number, currentFavoriteStatus: boolean) => void;
  getScoreLevel: (score: number | null) => ScoreLevel;
}

export const CorrectionHistory: React.FC<CorrectionHistoryProps> = ({
  corrections,
  onToggleFavorite,
  getScoreLevel,
}) => {
  if (corrections.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const highlightDifferences = (original: string, corrected: string) => {
    // 문장이 동일하면 하이라이트 없이 반환 (XSS 방지를 위해 이스케이프)
    if (original === corrected) {
      return {
        originalHighlighted: escapeHtml(original),
        correctedHighlighted: escapeHtml(corrected)
      };
    }

    const originalWords = original.split(/(\s+)/); // 공백도 보존
    const correctedWords = corrected.split(/(\s+)/);

    // 간단한 LCS 기반 diff 알고리즘
    const dp = Array(originalWords.length + 1).fill(null).map(() =>
      Array(correctedWords.length + 1).fill(0)
    );

    for (let i = 1; i <= originalWords.length; i++) {
      for (let j = 1; j <= correctedWords.length; j++) {
        if (originalWords[i - 1] === correctedWords[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // 역추적으로 diff 생성
    const originalResult = [];
    const correctedResult = [];
    let i = originalWords.length;
    let j = correctedWords.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && originalWords[i - 1] === correctedWords[j - 1]) {
        originalResult.unshift(escapeHtml(originalWords[i - 1]));
        correctedResult.unshift(escapeHtml(correctedWords[j - 1]));
        i--;
        j--;
      } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
        if (originalWords[i - 1].trim()) { // 공백이 아닌 경우만 하이라이트
          originalResult.unshift(`<span class="diff-removed">${escapeHtml(originalWords[i - 1])}</span>`);
        } else {
          originalResult.unshift(escapeHtml(originalWords[i - 1]));
        }
        i--;
      } else {
        if (correctedWords[j - 1].trim()) { // 공백이 아닌 경우만 하이라이트
          correctedResult.unshift(`<span class="diff-added">${escapeHtml(correctedWords[j - 1])}</span>`);
        } else {
          correctedResult.unshift(escapeHtml(correctedWords[j - 1]));
        }
        j--;
      }
    }

    return {
      originalHighlighted: originalResult.join(''),
      correctedHighlighted: correctedResult.join('')
    };
  };

  const getInsights = () => {
    const excellentCount = corrections.filter(c => getScoreLevel(c.score) === 'excellent').length;
    const averageScore = corrections.reduce((sum, c) => sum + (c.score || 0), 0) / corrections.length;

    // 향상 트렌드 계산 개선
    let improvementTrend = false;
    if (corrections.length >= 6) {
      const recent5 = corrections.slice(0, 5).reduce((sum, c) => sum + (c.score || 0), 0) / 5;
      const previous5 = corrections.slice(5, 10).reduce((sum, c) => sum + (c.score || 0), 0) / 5;
      // 최근 5개가 이전 5개보다 0.5점 이상 높으면 향상중
      improvementTrend = recent5 - previous5 >= 0.5;
    }

    return {
      excellentCount,
      averageScore: Math.round(averageScore * 10) / 10,
      improvementTrend
    };
  };

  const insights = getInsights();

  return (
    <section className="corrections-history">
      <div className="learning-insights">
        <div className="insight-cards">
          <div className="insight-card">
            <div className="insight-number">{corrections.length}</div>
            <div className="insight-label">교정 완료</div>
          </div>
          <div className="insight-card">
            <div className="insight-number">{insights.averageScore}</div>
            <div className="insight-label">평균 점수</div>
          </div>
          <div className="insight-card">
            <div className="insight-number">{insights.excellentCount}</div>
            <div className="insight-label">완벽한 문장</div>
          </div>
          {insights.improvementTrend && (
            <div className="insight-card trending">
              <div className="insight-number">📈</div>
              <div className="insight-label">최근 향상중</div>
            </div>
          )}
        </div>
      </div>
      <div className="corrections-list">
        {corrections.map((item, index) => (
          <div
            key={item.id}
            className={`correction-item ${item.isFavorite ? 'favorited' : ''}`}
          >
            <div className="item-header">
              <div className="header-left">
                <div className="item-number-container">
                  <span
                    className={`favorite-star ${item.isFavorite ? 'favorited' : ''}`}
                    onClick={() => onToggleFavorite(item.id, item.isFavorite)}
                  >
                    {item.isFavorite ? '⭐' : '☆'}
                  </span>
                  <span className="item-number">#{corrections.length - index}</span>
                </div>
              </div>
              <div className="header-right">
                <div className="item-date">{formatDate(item.createdAt)}</div>
                <div className="score-badges">
                  {item.score && (
                    <span className={`score score-${getScoreLevel(item.score)}`}>
                      {item.score}/10
                    </span>
                  )}
                  <span className="feedback-type">{item.feedbackType}</span>
                </div>
              </div>
            </div>
            <div className="sentence-comparison">
              <div className={`sentence-box original-box score-${getScoreLevel(item.score)}`}>
                <div
                  className="sentence-text"
                  dangerouslySetInnerHTML={{
                    __html: highlightDifferences(item.originSentence, item.correctedSentence).originalHighlighted
                  }}
                />
              </div>
              <div className="arrow-separator">
                <div className="arrow-icon">→</div>
                <div className="comparison-label">교정</div>
              </div>
              <div className="sentence-box corrected-box">
                <div
                  className="sentence-text"
                  dangerouslySetInnerHTML={{
                    __html: highlightDifferences(item.originSentence, item.correctedSentence).correctedHighlighted
                  }}
                />
              </div>
            </div>
            {item.feedback && (
              <div className="feedback-section">
                <div className="feedback-label">💡 교정 이유</div>
                <div className="feedback-text">{item.feedback}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};