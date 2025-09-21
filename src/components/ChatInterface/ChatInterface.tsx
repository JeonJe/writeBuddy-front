import React, { useState } from 'react';
import { ChatService } from '../../services/chatService';
import { ChatResponse } from '../../types';
import './ChatInterface.css';

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
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

  return (
    <section className={`chat-interface ${className || ''}`}>
      <div className="chat-header">
        <h3>💬 영어 학습 도우미</h3>
        <p className="chat-description">
          영어 문법, 표현, 단어 차이 등 궁금한 점을 자유롭게 물어보세요!
        </p>
        {chatHistory.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="clear-history-btn"
          >
            대화 초기화
          </button>
        )}
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
          <button 
            type="submit" 
            disabled={isLoading || !question.trim()}
            className="ask-button"
          >
            {isLoading ? '답변 중...' : '질문하기'}
          </button>
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>

      {chatHistory.length > 0 && (
        <div className="chat-history">
          <h4>대화 기록</h4>
          <div className="chat-messages">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-message">
                <div className="question-bubble">
                  <strong>Q:</strong> {chat.question}
                </div>
                <div className="answer-bubble">
                  <strong>A:</strong> {chat.answer}
                </div>
                <div className="chat-timestamp">
                  {new Date(chat.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {chatHistory.length === 0 && (
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
    </section>
  );
};