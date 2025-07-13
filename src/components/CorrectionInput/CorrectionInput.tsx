import React from 'react';
import { useCorrectionsContext } from '../../contexts/CorrectionsContext';
import './CorrectionInput.css';

interface CorrectionInputProps {
  onCorrect: (text: string) => void;
  isLoading: boolean;
}

export const CorrectionInput: React.FC<CorrectionInputProps> = ({ 
  onCorrect, 
  isLoading 
}) => {
  const { inputText, setInputText } = useCorrectionsContext();


  const handleSubmit = () => {
    if (inputText.trim()) {
      onCorrect(inputText);
      // 교정 후 입력 텍스트는 유지 (사용자가 다시 편집할 수 있도록)
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };


  return (
    <section className="correction-input">
      
      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="안녕하세요! 여기에 영어 문장을 입력하면 AI가 더 자연스럽게 만들어 드릴게요 ✨"
          className="input-textarea"
          rows={3}
        />
        <div className="input-actions">
          <p className="input-hint">⚡ Ctrl/Cmd + Enter로 바로 교정</p>
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