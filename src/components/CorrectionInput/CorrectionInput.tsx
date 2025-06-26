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

  const inspirationalQuotes = [
    "The only way to do great work is to love what you do",
    "Innovation distinguishes between a leader and a follower", 
    "Stay hungry, stay foolish",
    "Be yourself; everyone else is already taken",
    "Life is what happens when you're busy making other plans",
    "The future belongs to those who believe in the beauty of their dreams",
    "Success is not final, failure is not fatal: it is the courage to continue that counts"
  ];

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

  const handleQuoteClick = (quote: string) => {
    setInputText(quote);
  };

  return (
    <section className="correction-input">
      <div className="input-header">
        <h2>✨ 어떤 멋진 영어 문장을 써볼까요?</h2>
      </div>
      
      <div className="input-container">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="영어 문장을 입력해주세요..."
          className="input-textarea"
          rows={3}
        />
        <div className="input-actions">
          <p className="input-hint">⚡ Ctrl + Enter로 바로바로</p>
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !inputText.trim()}
            className="correct-button"
          >
{isLoading ? '✨ 마법을 부리는 중...' : '🪄 더 예쁘게 만들기'}
          </button>
        </div>
      </div>

      {!inputText && (
        <div className="quote-suggestions">
          <p className="suggestions-title">💎 이런 멋진 문장은 어떨까요? </p>
          <div className="quote-grid">
            {inspirationalQuotes.slice(0, 4).map((quote, index) => (
              <button
                key={index}
                onClick={() => handleQuoteClick(quote)}
                className="quote-button"
                type="button"
              >
                "{quote}"
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};