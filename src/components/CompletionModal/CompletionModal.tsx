import React, { useEffect, useState } from 'react';
import './CompletionModal.css';

interface CompletionModalProps {
  isOpen: boolean;
  goal: number;
  completed: number;
  onContinue: () => void;
  onClose: () => void;
}

const MESSAGES = [
  "오늘도 성장하고 있어요! 💪 내일도 함께 해요!",
  "{goal}개 복습 완료! 꾸준함이 실력이 돼요! 🌟",
  "목표 달성! 이런 열정이면 금방 늘 거예요! 🔥",
] as const;

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  goal,
  completed,
  onContinue,
  onClose,
}) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * MESSAGES.length);
      const selectedMessage = MESSAGES[randomIndex].replace('{goal}', String(goal));
      setMessage(selectedMessage);
    }
  }, [isOpen, goal]);

  if (!isOpen) return null;

  return (
    <div className="completion-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="completion-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="복습 완료 축하"
      >
        <div className="completion-celebration">
          <div className="celebration-icon">🎉</div>
          <h2 className="completion-title">{completed}개 복습 완료!</h2>
          <p className="completion-message">{message}</p>
        </div>

        <div className="completion-actions">
          <button type="button" className="completion-continue" onClick={onContinue}>
            계속 복습하기
          </button>
          <button type="button" className="completion-close" onClick={onClose}>
            종료
          </button>
        </div>
      </div>
    </div>
  );
};
