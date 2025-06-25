import React, { useState } from 'react';
import './CorrectionInput.css';

interface CorrectionInputProps {
  onCorrect: (text: string) => void;
  isLoading: boolean;
}

export const CorrectionInput: React.FC<CorrectionInputProps> = ({ 
  onCorrect, 
  isLoading 
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim()) {
      onCorrect(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <section className="correction-input">
      <h2>영어 문장을 입력하세요</h2>
      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="영어 문장을 입력해주세요... (예: I am student in university)"
          className="input-textarea"
          rows={2}
        />
        <div className="input-actions">
          <p className="input-hint">Ctrl + Enter로 빠른 교정</p>
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !inputText.trim()}
            className="correct-button"
          >
            {isLoading ? '교정 중...' : '교정하기'}
          </button>
        </div>
      </div>
    </section>
  );
};