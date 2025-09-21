import React, { useState } from 'react';
import { ChatService } from '../../services/chatService';
import { ChatResponse } from '../../types';
import './ChatModal.css';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ChatService.sendQuestion({ question: question.trim() });
      setChatHistory(prev => [...prev, response]);
      setQuestion('');
    } catch (err) {
      setError('질문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([]);
  };

  const formatAnswer = (answer: string): string => {
    return answer
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<span class="bold-text">$1</span>')
      .replace(/^- (.+)$/gm, '<div class="list-item">• $1</div>')
      .replace(/^(\d+)\. (.+)$/gm, '<div class="numbered-item"><span class="number">$1.</span> $2</div>')
      .replace(/'([^']+)'/g, '<span class="quote-text">"$1"</span>')
      .replace(/예: (.+)/g, '<div class="example-text">💡 예시: $1</div>');
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-modal-header">
          <div className="chat-title">
            <span className="chat-icon">💬</span>
            <h3>영어 학습 도우미</h3>
          </div>
          <button 
            onClick={onClose}
            className="close-button"
            aria-label="채팅 닫기"
          >
            ✕
          </button>
        </div>

        <div className="chat-modal-content">
          <div className="chat-description">
            영어 문법, 표현, 단어 차이 등 궁금한 점을 자유롭게 물어보세요!
          </div>

          <form onSubmit={handleSubmit} className="chat-form">
            <div className="question-input-group">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: What's the difference between 'see', 'look', and 'watch'?"
                className="question-input"
                rows={3}
                disabled={isLoading}
              />
              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={isLoading || !question.trim()}
                  className="ask-button"
                >
                  {isLoading ? '답변 중...' : '질문하기'}
                </button>
                {chatHistory.length > 0 && (
                  <button 
                    type="button"
                    onClick={handleClearHistory}
                    className="clear-history-btn"
                  >
                    대화 초기화
                  </button>
                )}
              </div>
            </div>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </form>

          {chatHistory.length > 0 ? (
            <div className="chat-history">
              <div className="chat-messages">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="chat-message">
                    <div className="question-bubble">
                      <strong>Q:</strong> {chat.question}
                    </div>
                    <div className="answer-bubble">
                      <strong>A:</strong>
                      <div 
                        className="answer-content"
                        dangerouslySetInnerHTML={{ __html: formatAnswer(chat.answer) }}
                      />
                    </div>
                    <div className="chat-timestamp">
                      {new Date(chat.createdAt).toLocaleString('ko-KR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-examples">
              <h4>질문 예시</h4>
              <div className="example-questions">
                <button 
                  onClick={() => setQuestion("When should I use 'a' vs 'an'?")}
                  className="example-question-btn"
                >
                  "When should I use 'a' vs 'an'?"
                </button>
                <button 
                  onClick={() => setQuestion("What's the difference between 'fun' and 'funny'?")}
                  className="example-question-btn"
                >
                  "What's the difference between 'fun' and 'funny'?"
                </button>
                <button 
                  onClick={() => setQuestion("How to politely decline an invitation?")}
                  className="example-question-btn"
                >
                  "How to politely decline an invitation?"
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};