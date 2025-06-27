import React, { useEffect, useState } from 'react';
import { useStatistics } from '../hooks';
import { GoodExpressions } from '../components';
import './StatsPage.css';

export const StatsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const {
    dailyStats,
    scoreTrend,
    errorPatterns,
    feedbackStats,
    averageScore,
    goodExpressions,
    isLoading,
    error,
    fetchDailyStats,
    fetchScoreTrend,
    fetchErrorPatterns,
    fetchFeedbackStats,
    fetchAverageScore,
    fetchGoodExpressions
  } = useStatistics();

  useEffect(() => {
    // 페이지 로드 시 모든 통계 데이터 가져오기
    fetchDailyStats();
    fetchScoreTrend();
    fetchErrorPatterns();
    fetchFeedbackStats();
    fetchAverageScore();
    // TODO: 사용자 ID가 있을 때 잘한 표현 로드
    // fetchGoodExpressions(userId);
  }, [fetchDailyStats, fetchScoreTrend, fetchErrorPatterns, fetchFeedbackStats, fetchAverageScore]);

  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'GRAMMAR': return '📝';
      case 'SPELLING': return '🔤';
      case 'STYLE': return '✨';
      case 'PUNCTUATION': return '❗';
      default: return '⚙️';
    }
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case 'GRAMMAR': return '#3b82f6';
      case 'SPELLING': return '#f59e0b';
      case 'STYLE': return '#8b5cf6';
      case 'PUNCTUATION': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 8) return { level: 'excellent', color: '#10b981', label: '훌륭해요!' };
    if (score >= 6) return { level: 'good', color: '#f59e0b', label: '좋아요!' };
    if (score >= 4) return { level: 'needs-work', color: '#ef4444', label: '연습이 필요해요' };
    return { level: 'poor', color: '#6b7280', label: '더 노력해보세요' };
  };

  if (isLoading) {
    return (
      <div className="stats-page">
        <div className="stats-loading">
          <div className="loading-spinner"></div>
          <p>📊 통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-container">
        <div className="stats-header">
          <h1>📊 나의 영어 학습 통계</h1>
          <p>지금까지의 학습 성과를 한눈에 확인해보세요</p>
        </div>

        {error && (
          <div className="error-card">
            <p>😅 통계를 불러오는 중 문제가 발생했어요</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        )}

        <div className="stats-grid">
          {/* 평균 점수 카드 */}
          <div className="stat-card primary-card">
            <div className="card-header">
              <h3>🎯 전체 평균 점수</h3>
            </div>
            <div className="score-display">
              <div className="score-number">{averageScore?.averageScore?.toFixed(1) || '0.0'}</div>
              <div className="score-max">/10</div>
            </div>
            <div className="score-label">
              {averageScore?.averageScore ? getScoreLevel(averageScore.averageScore).label : '아직 데이터가 없어요'}
            </div>
          </div>

          {/* 오늘의 통계 */}
          <div className="stat-card">
            <div className="card-header">
              <h3>📅 오늘의 학습</h3>
            </div>
            <div className="today-stats">
              <div className="stat-item">
                <span className="stat-icon">✏️</span>
                <div>
                  <div className="stat-number">{dailyStats?.totalCorrections || 0}</div>
                  <div className="stat-label">교정 횟수</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <div>
                  <div className="stat-number">{dailyStats?.averageScore?.toFixed(1) || '0.0'}</div>
                  <div className="stat-label">평균 점수</div>
                </div>
              </div>
            </div>
          </div>

          {/* 피드백 타입 분포 */}
          <div className="stat-card feedback-card">
            <div className="card-header">
              <h3>🔍 교정 타입 분포</h3>
            </div>
            <div className="feedback-stats">
              {feedbackStats && Object.entries(feedbackStats).map(([type, count]) => (
                <div key={type} className="feedback-item">
                  <div className="feedback-info">
                    <span className="feedback-icon">{getFeedbackTypeIcon(type)}</span>
                    <span className="feedback-type">{type}</span>
                  </div>
                  <div className="feedback-count">{count as number}</div>
                  <div 
                    className="feedback-bar"
                    style={{
                      backgroundColor: getFeedbackTypeColor(type),
                      width: `${((count as number) / Math.max(...Object.values(feedbackStats) as number[])) * 100}%`
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 점수 변화 */}
          <div className="stat-card trend-card">
            <div className="card-header">
              <h3>📈 점수 변화 추이</h3>
            </div>
            <div className="score-trend">
              {scoreTrend?.scoreTrend?.slice(-10).map((item, index) => (
                <div key={index} className="trend-item">
                  <div 
                    className="trend-bar"
                    style={{
                      height: `${(item.score / 10) * 100}%`,
                      backgroundColor: getScoreLevel(item.score).color
                    }}
                  ></div>
                  <div className="trend-score">{item.score}</div>
                </div>
              )) || (
                <div className="empty-trend">
                  <p>📊 아직 충분한 데이터가 없어요</p>
                  <p>더 많은 교정을 받아보세요!</p>
                </div>
              )}
            </div>
          </div>

          {/* 자주 하는 실수 */}
          <div className="stat-card error-card">
            <div className="card-header">
              <h3>💡 자주 하는 실수</h3>
            </div>
            <div className="error-patterns">
              {errorPatterns?.errorPatterns && Object.entries(errorPatterns.errorPatterns).map(([type, patterns]) => (
                <div key={type} className="error-section">
                  <h4>{getFeedbackTypeIcon(type)} {type}</h4>
                  <div className="error-list">
                    {(patterns as string[]).slice(0, 3).map((pattern, index) => (
                      <div key={index} className="error-item">
                        <span className="error-text">"{pattern}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) || (
                <div className="empty-errors">
                  <p>🎉 분석할 실수 패턴이 충분하지 않아요</p>
                  <p>더 많이 연습해보세요!</p>
                </div>
              )}
            </div>
          </div>

          {/* 학습 성취도 */}
          <div className="stat-card achievement-card">
            <div className="card-header">
              <h3>🏆 학습 성취도</h3>
            </div>
            <div className="achievements">
              <div className="achievement-item">
                <div className="achievement-icon">🔥</div>
                <div className="achievement-info">
                  <div className="achievement-title">교정 마스터</div>
                  <div className="achievement-desc">
                    {(dailyStats?.totalCorrections || 0) >= 10 ? '완료!' : `${10 - (dailyStats?.totalCorrections || 0)}개 더 필요`}
                  </div>
                </div>
              </div>
              <div className="achievement-item">
                <div className="achievement-icon">⭐</div>
                <div className="achievement-info">
                  <div className="achievement-title">완벽주의자</div>
                  <div className="achievement-desc">
                    {(averageScore?.averageScore || 0) >= 8 ? '완료!' : '평균 8점 이상 달성하기'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 잘한 표현 섹션 */}
        <GoodExpressions 
          goodExpressions={goodExpressions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};