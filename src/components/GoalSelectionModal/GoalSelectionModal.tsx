import React, { useEffect, useState } from 'react';
import './GoalSelectionModal.css';

interface GoalSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoal: (goal: number) => void;
  defaultGoal?: number;
  availableCount: number; // 현재 즐겨찾기 개수
}

const GOAL_OPTIONS = [
  { value: 5, label: '가볍게' },
  { value: 10, label: '기본' },
  { value: 20, label: '열심히' },
] as const;

export const GoalSelectionModal: React.FC<GoalSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectGoal,
  defaultGoal = 10,
  availableCount,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<number>(defaultGoal);

  useEffect(() => {
    if (!isOpen) return;

    // 즐겨찾기가 목표보다 적으면 자동으로 즐겨찾기 개수로 설정
    const adjustedGoal = Math.min(defaultGoal, Math.max(availableCount, 5));
    setSelectedGoal(adjustedGoal);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, defaultGoal, availableCount, onClose]);

  if (!isOpen) return null;

  const handleStart = () => {
    onSelectGoal(selectedGoal);
    onClose();
  };

  return (
    <div className="goal-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="goal-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="복습 목표 선택"
      >
        <div className="goal-modal-header">
          <h3>🎯 오늘의 복습 목표를 선택해주세요!</h3>
          <button type="button" className="goal-modal-close" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="goal-info">
          <div className="favorite-count">
            ⭐ 즐겨찾기한 문장: {availableCount}개
          </div>
          {availableCount === 0 && (
            <div className="no-favorites-warning">
              ⚠️ 즐겨찾기가 없어요. 먼저 교정을 하고 별표를 눌러보세요!
            </div>
          )}
        </div>

        <div className="goal-options">
          {GOAL_OPTIONS.map((option) => {
            const isDisabled = option.value > availableCount;
            return (
              <button
                key={option.value}
                type="button"
                className={`goal-option ${selectedGoal === option.value ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && setSelectedGoal(option.value)}
                disabled={isDisabled}
                title={isDisabled ? `즐겨찾기가 ${availableCount}개뿐이에요` : ''}
              >
                <div className="goal-number">{option.value}개</div>
                <div className="goal-label">{option.label}</div>
                {isDisabled && <div className="goal-disabled">🚫</div>}
              </button>
            );
          })}
        </div>

        <button type="button" className="goal-start-btn" onClick={handleStart}>
          시작하기 →
        </button>
      </div>
    </div>
  );
};
