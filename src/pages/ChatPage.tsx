import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChatService } from '../services/chatService';
import { ChatRequest, ChatResponse } from '../types/correction.types';
import './ChatPage.css';

export const ChatPage: React.FC = () => {
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
    adjustTextareaHeight();
  }, [question]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const formatAnswer = (answer: string): string => {
    let formatted = answer
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*)$/gm, '<li value="$1">$2</li>')
      .replace(/"([^"]*)"/g, '<span class="quote">"$1"</span>')
      .replace(/예시:\s*(.*)$/gm, '<div class="example">예시: $1</div>');

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
    if (e.key === 'Enter' && e.ctrlKey) {
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
    "Can you explain when to use 'a' vs 'an'?",
    "How do I use present perfect tense correctly?",
    "What are common mistakes with phrasal verbs?"
  ];

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h2>영어 학습 도우미</h2>
          {chatHistory.length > 0 && (
            <button className="clear-button" onClick={clearChat}>
              대화 초기화
            </button>
          )}
        </div>

        <div className="chat-messages" ref={chatContainerRef}>
          {chatHistory.length === 0 ? (
            <div className="welcome-message">
              <h3>무엇을 도와드릴까요?</h3>
              <p>영어 학습에 관한 궁금한 점을 물어보세요!</p>
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
              <div key={index} className="chat-bubble-container">
                <div className="chat-bubble user-bubble">
                  <p>{chat.question}</p>
                  <span className="timestamp">
                    {chat.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="chat-bubble assistant-bubble">
                  <div 
                    dangerouslySetInnerHTML={{ __html: formatAnswer(chat.answer) }}
                  />
                  <span className="timestamp">
                    {chat.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="chat-bubble assistant-bubble loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="질문을 입력하세요... (Ctrl+Enter로 전송)"
            disabled={isLoading}
            rows={1}
            className="chat-textarea"
          />
          <button
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '전송 중...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  );
};