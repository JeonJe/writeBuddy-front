import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatService } from '../../services/chatService';
import { ChatResponse } from '../../types';
import './ChatInterface.css';

interface ChatInterfaceProps {
  className?: string;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: string; // ISO 문자열로 변경 (localStorage 저장용)
}

const STORAGE_KEY = 'writebuddy_chat_history';

// localStorage에서 히스토리 불러오기
const loadChatHistory = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('채팅 히스토리 로드 실패:', err);
  }
  return [];
};

// localStorage에 히스토리 저장
const saveChatHistory = (messages: ChatMessage[]) => {
  try {
    // 최근 100개 메시지만 저장
    const toSave = messages.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('채팅 히스토리 저장 실패:', err);
  }
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 메시지 변경 시 localStorage에 저장
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // textarea 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 80)}px`;
    }
  }, [question]);

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion('');
    setError(null);
    setIsLoading(true);

    // 사용자 메시지 추가
    setMessages(prev => [...prev, {
      type: 'user',
      content: userQuestion,
      timestamp: new Date().toISOString()
    }]);

    try {
      const response: ChatResponse = await chatService.sendQuestion({ question: userQuestion });

      // AI 응답 추가
      setMessages(prev => [...prev, {
        type: 'ai',
        content: response.answer,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      setError('답변을 받아오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter만 누르면 전송
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('대화 기록을 모두 삭제하시겠습니까?')) {
      setMessages([]);
      setError(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exampleQuestions = [
    "What's the difference between 'affect' and 'effect'?",
    "When should I use 'a' vs 'an'?",
    "How do I use present perfect tense?",
  ];

  return (
    <div className={`chat-interface ${className || ''}`}>
      {/* 메시지 영역 */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-emoji">👋</div>
            <p>영어 학습에 관한 궁금한 점을 물어보세요!</p>
            <div className="example-questions">
              {exampleQuestions.map((q, index) => (
                <button
                  key={index}
                  className="example-btn"
                  onClick={() => setQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'ai' && <span className="avatar">🤖</span>}
                <div className="message-content">
                  {msg.type === 'ai' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.type === 'user' && <span className="avatar">👤</span>}
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <span className="avatar">🤖</span>
                <div className="message-content loading">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="chat-error">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="chat-input-area">
        {messages.length > 0 && (
          <button className="clear-btn" onClick={handleClearHistory}>
            🗑️ 초기화
          </button>
        )}
        <div className="input-row">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="질문을 입력하세요..."
            disabled={isLoading}
            rows={1}
          />
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
          >
            {isLoading ? '⏳' : '✨'}
          </button>
        </div>
        <span className="input-hint">Enter로 전송 · Shift+Enter 줄바꿈</span>
      </div>
    </div>
  );
};
