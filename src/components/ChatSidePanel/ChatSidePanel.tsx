import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChatService } from '../../services/chatService';
import { ChatRequest, ChatResponse } from '../../types/correction.types';
import './ChatSidePanel.css';

interface ChatSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSidePanel: React.FC<ChatSidePanelProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string; timestamp: Date }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [question]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  const formatAnswer = (answer: string): string => {
    let formatted = answer
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*)$/gm, '<li value="$1">$2</li>')
      .replace(/"([^"]*)"/g, '<span class="quote">"$1"</span>');

    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    formatted = formatted.replace(/(<li value="\d+">.*<\/li>)/s, '<ol>$1</ol>');

    return formatted;
  };

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;

    const newQuestion = question.trim();
    setQuestion('');
    setError(null);
    setIsLoading(true);

    try {
      const request: ChatRequest = { question: newQuestion };
      const response: ChatResponse = await ChatService.sendQuestion(request);
      
      setChatHistory(prev => [...prev, {
        question: newQuestion,
        answer: response.answer,
        timestamp: new Date()
      }]);
    } catch (err) {
      setError('질문을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setError(null);
  };

  const exampleQuestions = [
    "What's the difference between 'affect' and 'effect'?",
    "When should I use 'a' vs 'an'?",
    "How do I use present perfect tense?",
    "What are common phrasal verbs?"
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="chat-overlay" onClick={onClose} />
      <div className={`chat-side-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-panel-header">
          <div className="panel-title">
            <h3>🤖 AI 학습 도우미</h3>
            <p>영어 궁금한 거 뭐든 물어보세요!</p>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="chat-panel-messages" ref={chatContainerRef}>
          {chatHistory.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-emoji">👋</div>
              <h4>안녕하세요!</h4>
              <p>영어 학습에 관한 궁금한 점을 물어보세요</p>
              <div className="example-questions">
                {exampleQuestions.map((q, index) => (
                  <button
                    key={index}
                    className="example-question"
                    onClick={() => setQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} className="chat-message-group">
                <div className="chat-message user-message">
                  <div className="message-content">{chat.question}</div>
                  <div className="message-time">
                    {chat.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="chat-message ai-message">
                  <div className="message-avatar">🤖</div>
                  <div className="message-bubble">
                    <div 
                      className="message-content"
                      dangerouslySetInnerHTML={{ __html: formatAnswer(chat.answer) }}
                    />
                    <div className="message-time">
                      {chat.timestamp.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="chat-message ai-message">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="chat-panel-input">
          {chatHistory.length > 0 && (
            <button className="clear-chat-button" onClick={clearChat}>
              🗑️ 대화 초기화
            </button>
          )}
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="영어 질문을 입력하세요... (Ctrl/Cmd+Enter로 전송)"
              disabled={isLoading}
              rows={1}
              className="chat-input"
            />
            <button
              onClick={handleSubmit}
              disabled={!question.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '⏳' : '✨'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};