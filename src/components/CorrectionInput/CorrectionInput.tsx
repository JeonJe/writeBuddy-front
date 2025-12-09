import React from 'react';
import { useCorrectionsContext } from '../../contexts/CorrectionsContext';
import './CorrectionInput.css';

interface CorrectionInputProps {
  onCorrect: (text: string) => void;
  isLoading: boolean;
}

const MAX_LENGTH = 1000;

export const CorrectionInput: React.FC<CorrectionInputProps> = ({
  onCorrect,
  isLoading
}) => {
  const { inputText, setInputText } = useCorrectionsContext();

  const handleSubmit = () => {
    if (inputText.trim() && inputText.length <= MAX_LENGTH) {
      onCorrect(inputText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter만 누르면 교정 실행
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && inputText.trim()) {
        handleSubmit();
      }
    }
    // Shift+Enter는 줄바꿈 유지 (기본 동작)
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setInputText(value);
    }
  };

  const charCount = inputText.length;
  const isNearLimit = charCount >= MAX_LENGTH * 0.9;
  const isAtLimit = charCount >= MAX_LENGTH;

  return (
    <section className="correction-input">
      <div className="input-container">
        <div className="textarea-wrapper">
          <textarea
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="영어 문장을 입력하세요"
            className="input-textarea"
            rows={3}
            maxLength={MAX_LENGTH}
            aria-label="교정할 영어 문장 입력"
          />
          <span className={`char-count ${isNearLimit ? 'near-limit' : ''} ${isAtLimit ? 'at-limit' : ''}`}>
            {charCount} / {MAX_LENGTH}
          </span>
        </div>
        <div className="input-actions">
          <span className="input-hint">Enter로 교정 · Shift+Enter 줄바꿈</span>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !inputText.trim()}
            className="correct-button"
            aria-label={isLoading ? '교정 중입니다' : '영어 문장 교정하기'}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span className="button-spinner" aria-hidden="true"></span>
                교정 중...
              </>
            ) : '교정하기'}
          </button>
        </div>
      </div>
    </section>
  );
};
