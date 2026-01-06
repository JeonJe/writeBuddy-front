import React, { useState, useEffect, useCallback } from 'react';
import { practiceService, reviewService } from '../../services';
import { PracticeSentence, ReviewSentence, CompareAnswerResponse } from '../../types';
import { GoalSelectionModal } from '../GoalSelectionModal/GoalSelectionModal';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { AnswerComparison } from '../AnswerComparison/AnswerComparison';
import { CompletionModal } from '../CompletionModal/CompletionModal';
import { useCorrectionsContext } from '../../contexts/CorrectionsContext';
import './PracticePanel.css';

interface PracticePanelProps {
  isReviewMode?: boolean;
  onReviewModeChange?: (isReview: boolean) => void;
}

export const PracticePanel: React.FC<PracticePanelProps> = ({
  isReviewMode: externalIsReviewMode,
  onReviewModeChange
}) => {
  // 즐겨찾기 개수 확인용
  const { sessionCorrections } = useCorrectionsContext();

  // 기존 practice 모드 상태
  const [sentence, setSentence] = useState<PracticeSentence | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Review 모드 상태 - 외부에서 제어할 수 있음
  const [internalIsReviewMode, setInternalIsReviewMode] = useState(false);
  const isReviewMode = externalIsReviewMode !== undefined ? externalIsReviewMode : internalIsReviewMode;
  const setIsReviewMode = (value: boolean) => {
    setInternalIsReviewMode(value);
    onReviewModeChange?.(value);
  };
  const [reviewGoal, setReviewGoal] = useState<number | null>(null);
  const [currentReviewCount, setCurrentReviewCount] = useState(0);
  const [reviewSentence, setReviewSentence] = useState<ReviewSentence | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [compareResult, setCompareResult] = useState<CompareAnswerResponse | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const loadSentence = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUserInput('');
    setIsCompleted(false);
    setShowAnswer(false);

    try {
      const data = await practiceService.getSentence();
      setSentence(data);
    } catch (err) {
      setError('문장을 불러오지 못했어요. 다시 시도해주세요!');
      console.error('Failed to load practice sentence:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 로딩 - review 모드면 목표 설정 모달 표시
  useEffect(() => {
    if (!isReviewMode) {
      loadSentence();
    }
  }, [isReviewMode, loadSentence]);

  const handleNext = () => {
    setIsCompleted(true);
    setTimeout(() => {
      loadSentence();
    }, 500);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      if (isReviewMode) {
        handleCompareAnswer();
      } else {
        setShowAnswer(true);
      }
    }
  };

  // Review 모드 함수들
  const handleStartReview = () => {
    // 즐겨찾기 개수 확인
    const favoriteCount = sessionCorrections.filter(c => c.isFavorite).length;

    if (favoriteCount === 0) {
      // 토스트 메시지 표시 (간단한 alert로 대체)
      alert('즐겨찾기한 문장이 없어요! 먼저 교정을 하고 별표(⭐)를 눌러 즐겨찾기를 추가해주세요.');
      return;
    }

    setShowGoalModal(true);
  };

  const handleSelectGoal = (goal: number) => {
    setReviewGoal(goal);
    setCurrentReviewCount(0);
    setIsReviewMode(true);
    localStorage.setItem('reviewGoalPreference', String(goal));
    setShowGoalModal(false);
    loadReviewSentences();
  };

  const loadReviewSentences = useCallback(async () => {
    if (!reviewGoal) return;

    setIsLoading(true);
    setError(null);
    setUserInput('');
    setSubmittedAnswer('');
    setCompareResult(null);
    setIsCompleted(false);

    try {
      const response = await reviewService.getSentences(reviewGoal);
      if (response.sentences.length === 0) {
        setError('복습할 문장이 없어요. 더 많은 문장을 작성해보세요!');
        return;
      }

      const randomIndex = Math.floor(Math.random() * response.sentences.length);
      setReviewSentence(response.sentences[randomIndex]);
    } catch (err) {
      setError('복습 문장을 불러오지 못했어요. 다시 시도해주세요!');
      console.error('Failed to load review sentences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [reviewGoal]);

  const handleCompareAnswer = async () => {
    if (!reviewSentence || !userInput.trim()) return;

    setIsComparing(true);
    setSubmittedAnswer(userInput);
    setCompareResult(null);

    try {
      const result = await reviewService.compareAnswer({
        sentenceId: reviewSentence.id,
        userAnswer: userInput,
        bestAnswer: reviewSentence.bestAnswer,
        korean: reviewSentence.korean,
      });
      setCompareResult(result);
      setShowAnswer(true);
    } catch (err) {
      setError('답변 비교에 실패했어요. 다시 시도해주세요!');
      console.error('Failed to compare answer:', err);
    } finally {
      setIsComparing(false);
    }
  };

  const handleNextReview = async () => {
    if (!reviewSentence) return;

    // 기록 저장
    if (compareResult) {
      try {
        await reviewService.saveRecord({
          sentenceId: reviewSentence.id,
          userAnswer: submittedAnswer,
          isCorrect: compareResult.isCorrect,
          score: compareResult.score,
          timeSpent: 0, // TODO: 시간 측정 추가
          reviewDate: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed to save review record:', err);
      }
    }

    setIsCompleted(true);
    setCurrentReviewCount(prev => prev + 1);

    // 목표 달성 체크
    if (reviewGoal && currentReviewCount + 1 >= reviewGoal) {
      setShowCompletionModal(true);
    } else {
      setTimeout(() => {
        loadReviewSentences();
      }, 500);
    }
  };

  const handleContinueReview = () => {
    setShowCompletionModal(false);
    setShowGoalModal(true);
  };

  const handleCloseReview = () => {
    setShowCompletionModal(false);
    setIsReviewMode(false);
    setReviewGoal(null);
    setCurrentReviewCount(0);
    setReviewSentence(null);
    setCompareResult(null);
    setSubmittedAnswer('');
    setShowAnswer(false);
    setIsCompleted(false);
    loadSentence();
  };

  // localStorage에서 저장된 목표 불러오기
  useEffect(() => {
    const savedGoal = localStorage.getItem('reviewGoalPreference');
    if (savedGoal) {
      const goal = parseInt(savedGoal, 10);
      if ([5, 10, 20].includes(goal)) {
        // 모달에서 기본값으로 사용
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="practice-panel">
        <div className="practice-header">
          <span className="practice-label">
            {isReviewMode ? '🔄 오늘의 복습' : '✏️ 오늘의 연습'}
          </span>
        </div>
        {isReviewMode && reviewGoal && (
          <ProgressBar current={currentReviewCount} total={reviewGoal} />
        )}
        <div className="practice-loading">문장을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice-panel practice-error">
        <div className="practice-header">
          <span className="practice-label">
            {isReviewMode ? '🔄 오늘의 복습' : '✏️ 오늘의 연습'}
          </span>
          <button
            type="button"
            className="skip-btn"
            onClick={isReviewMode ? loadReviewSentences : loadSentence}
            title="다시 시도"
          >
            ↻
          </button>
        </div>
        {isReviewMode && reviewGoal && (
          <ProgressBar current={currentReviewCount} total={reviewGoal} />
        )}
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Review 모드 시작 전
  if (isReviewMode && !reviewGoal) {
    return (
      <div className="practice-panel">
        <div className="practice-header">
          <span className="practice-label">🔄 오늘의 복습</span>
          <button
            type="button"
            className="back-to-practice-btn"
            onClick={() => setIsReviewMode(false)}
            title="연습 모드로 돌아가기"
          >
            ✏️ 연습하기
          </button>
        </div>
        <div className="start-review-prompt">
          <button className="start-review-btn" onClick={handleStartReview}>
            🔄 복습 시작
          </button>
        </div>

        <GoalSelectionModal
          isOpen={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          onSelectGoal={handleSelectGoal}
          defaultGoal={parseInt(localStorage.getItem('reviewGoalPreference') || '10', 10)}
          availableCount={sessionCorrections.filter(c => c.isFavorite).length}
        />
      </div>
    );
  }

  if (!isReviewMode && !sentence) return null;
  if (isReviewMode && !reviewSentence) return null;

  // Practice 모드 UI
  if (!isReviewMode && sentence) {
    return (
      <div className="practice-panel">
        <div className="practice-header">
          <span className="practice-label">✏️ 오늘의 연습</span>
          <div className="practice-actions">
            <button
              type="button"
              className="review-start-btn"
              onClick={handleStartReview}
              title="즐겨찾기한 문장 복습"
            >
              🔄 복습 시작
            </button>
            <button
              type="button"
              className="skip-btn"
              onClick={loadSentence}
              title="다른 문장"
            >
              ↻
            </button>
          </div>
        </div>

        <div className="practice-sentence">
          <p className="korean-text">{sentence.korean}</p>
          <p className="hint-text">💡 {sentence.hint}</p>
        </div>

        <div className="practice-input-area">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="영어로 작성해보세요... (Enter로 정답 확인)"
            className="practice-input"
            disabled={isCompleted}
          />
        </div>

        {showAnswer && (
          <div className="best-answer">
            <span className="best-answer-label">✨ Best:</span>
            <span className="best-answer-text">{sentence.bestAnswer}</span>
          </div>
        )}

        {userInput.trim() && !isCompleted && (
          <div className="practice-actions">
            {!showAnswer && (
              <button
                type="button"
                className="action-btn show-answer"
                onClick={handleShowAnswer}
              >
                👀 정답 보기
              </button>
            )}
            <button
              type="button"
              className="action-btn next"
              onClick={handleNext}
            >
              ➡️ 다음 문장
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="practice-complete">
            다음 문장을 불러오는 중...
          </div>
        )}
      </div>
    );
  }

  // Review 모드 UI
  if (isReviewMode && reviewSentence && reviewGoal) {
    return (
      <>
        <div className="practice-panel">
          <div className="practice-header">
            <span className="practice-label">🔄 오늘의 복습</span>
            <button
              type="button"
              className="skip-btn"
              onClick={loadReviewSentences}
              title="다른 문장"
            >
              ↻
            </button>
          </div>

          <ProgressBar current={currentReviewCount} total={reviewGoal} />

          <div className="practice-sentence">
            <p className="korean-text">{reviewSentence.korean}</p>
            {reviewSentence.hint && (
              <p className="hint-text">💡 {reviewSentence.hint}</p>
            )}
          </div>

          <div className="practice-input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="영어로 작성해보세요... (Enter로 정답 확인)"
              className="practice-input"
              disabled={isCompleted || isComparing}
            />
          </div>

          {showAnswer && (
            <AnswerComparison
              userAnswer={submittedAnswer}
              bestAnswer={reviewSentence.bestAnswer}
              result={compareResult}
            />
          )}

          {userInput.trim() && !isCompleted && (
            <div className="practice-actions">
              {!showAnswer && (
                <button
                  type="button"
                  className="action-btn show-answer"
                  onClick={handleCompareAnswer}
                  disabled={isComparing}
                >
                  {isComparing ? '분석 중...' : '👀 정답 확인'}
                </button>
              )}
              {showAnswer && (
                <button
                  type="button"
                  className="action-btn next"
                  onClick={handleNextReview}
                >
                  ➡️ 다음 문장
                </button>
              )}
            </div>
          )}

          {isCompleted && (
            <div className="practice-complete">
              다음 문장을 불러오는 중...
            </div>
          )}
        </div>

        <GoalSelectionModal
          isOpen={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          onSelectGoal={handleSelectGoal}
          defaultGoal={parseInt(localStorage.getItem('reviewGoalPreference') || '10', 10)}
          availableCount={sessionCorrections.filter(c => c.isFavorite).length}
        />

        <CompletionModal
          isOpen={showCompletionModal}
          goal={reviewGoal}
          completed={currentReviewCount}
          onContinue={handleContinueReview}
          onClose={handleCloseReview}
        />
      </>
    );
  }

  return null;
};
