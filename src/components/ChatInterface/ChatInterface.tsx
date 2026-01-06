import React, { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { chatService } from '../../services/chatService';
import { wordService } from '../../services/wordService';
import { WordSearchResponse, GrammarSearchResponse } from '../../types';
import './ChatInterface.css';

// 단어 검색 결과를 마크다운으로 포맷
const formatWordResponse = (data: WordSearchResponse): string => {
  let content = `## ${data.word}\n\n`;
  content += `${data.meaning}\n\n`;

  if (data.example) {
    content += `### 예문\n`;
    content += `> ${data.example.sentence}\n> *${data.example.translation}*\n\n`;
  }

  if (data.point) {
    content += `💡 **Point:** ${data.point}`;
  }

  return content;
};

// 문법 검색 결과를 마크다운으로 포맷
const formatGrammarResponse = (data: GrammarSearchResponse): string => {
  let content = `## ${data.expression}\n\n`;
  content += `${data.meaning}\n\n`;

  if (data.correct) {
    content += `### 올바른 예문\n`;
    content += `> ${data.correct.sentence}\n> *${data.correct.translation}*\n\n`;
  }

  if (data.wrong) {
    content += `⚠️ **틀린 표현:** ${data.wrong}\n\n`;
  }

  if (data.tip) {
    content += `💡 **Tip:** ${data.tip}`;
  }

  return content;
};

interface ChatInterfaceProps {
  className?: string;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: string; // ISO 문자열로 변경 (localStorage 저장용)
  mode?: QueryMode; // 질문 모드 (user 메시지에만 사용)
}

type QueryMode = 'chat' | 'word' | 'grammar';

const MODE_CONFIG: Record<QueryMode, {
  label: string;
  icon: string;
  placeholder: string;
  hint: string;
}> = {
  chat: {
    label: '자유 대화',
    icon: '💬',
    placeholder: '영어 학습에 관해 무엇이든 물어보세요...',
    hint: 'Enter로 전송 · Shift+Enter 줄바꿈'
  },
  word: {
    label: '단어 뜻',
    icon: '📚',
    placeholder: '단어나 표현을 입력하세요 (예: effect, in charge of)',
    hint: '단어/표현의 뜻을 빠르게 찾아드려요'
  },
  grammar: {
    label: '문법 설명',
    icon: '📝',
    placeholder: '문법 개념을 입력하세요 (예: present perfect, a vs an)',
    hint: '문법 개념을 간단히 설명해드려요'
  }
};

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
  const [queryMode, setQueryMode] = useState<QueryMode>('chat');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentConfig = MODE_CONFIG[queryMode];

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 스크롤 위치 감지
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShowScrollBtn(!isNearBottom && messages.length > 0);
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleSubmit = useCallback(async () => {
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion('');
    setError(null);
    setIsLoading(true);

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      type: 'user',
      content: userQuestion,
      timestamp: new Date().toISOString(),
      mode: queryMode !== 'chat' ? queryMode : undefined
    };

    // AI 응답 placeholder 추가
    const aiMessage: ChatMessage = {
      type: 'ai',
      content: '',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);

    // 단어/문법 모드일 경우 wordService 사용, 아니면 chatService
    if (queryMode === 'word') {
      try {
        const result = await wordService.searchWord(userQuestion);
        const responseContent = formatWordResponse(result);

        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.type === 'ai') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: responseContent
            };
          }
          return updated;
        });
        setIsLoading(false);
        textareaRef.current?.focus();
      } catch {
        setError('단어를 찾지 못했어요. 다른 검색어를 시도하거나 질문 탭에서 물어보세요.');
        setMessages(prev => prev.filter((_, idx) => idx !== prev.length - 1));
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    } else if (queryMode === 'grammar') {
      try {
        const result = await wordService.searchGrammar(userQuestion);
        const responseContent = formatGrammarResponse(result);

        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.type === 'ai') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: responseContent
            };
          }
          return updated;
        });
        setIsLoading(false);
        textareaRef.current?.focus();
      } catch {
        setError('문법 정보를 찾지 못했어요. 다른 검색어를 시도하거나 질문 탭에서 물어보세요.');
        setMessages(prev => prev.filter((_, idx) => idx !== prev.length - 1));
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    } else {
      // 자유 대화 모드: 기존 chatService 스트리밍
      await chatService.sendQuestionStream(
        { question: userQuestion },
        (chunk) => {
          setMessages(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex]?.type === 'ai') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + chunk
              };
            }
            return updated;
          });
        },
        () => {
          setIsLoading(false);
          textareaRef.current?.focus();
        },
        () => {
          setError('답변을 받아오는 중 오류가 발생했습니다.');
          setMessages(prev => prev.filter((_, idx) => idx !== prev.length - 1 || prev[idx].content !== ''));
          setIsLoading(false);
          textareaRef.current?.focus();
        }
      );
    }
  }, [question, isLoading, queryMode]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter만 누르면 전송
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const exampleQuestions = [
    "What's the difference between 'affect' and 'effect'?",
    "When should I use 'a' vs 'an'?",
    "How do I use present perfect tense?",
  ];

  const handleModeChange = (mode: QueryMode) => {
    setQueryMode(mode);
    textareaRef.current?.focus();
  };

  return (
    <div className={`chat-interface ${className || ''}`}>
      {/* 메시지 영역 */}
      <div className="chat-messages" ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-emoji">{currentConfig.icon}</div>
            <p className="welcome-title">{currentConfig.label}</p>
            <p className="welcome-hint">{currentConfig.hint}</p>
            {queryMode === 'chat' && (
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
            )}
            {queryMode === 'word' && (
              <div className="example-questions">
                {['effect', 'carry out', 'in charge of'].map((q) => (
                  <button key={q} className="example-btn" onClick={() => setQuestion(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            {queryMode === 'grammar' && (
              <div className="example-questions">
                {['present perfect', 'a vs an', 'conditional'].map((q) => (
                  <button key={q} className="example-btn" onClick={() => setQuestion(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'ai' && <span className="avatar">🤖</span>}
                <div className="message-content">
                  {msg.type === 'ai' ? (
                    // 스트리밍 중 빈 메시지면 로딩 표시
                    msg.content ? (
                      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{msg.content}</ReactMarkdown>
                    ) : (
                      <div className="loading">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    )
                  ) : (
                    <>
                      {msg.mode && (
                        <span className={`mode-badge ${msg.mode}`}>
                          {msg.mode === 'word' ? '📚' : '📝'}
                        </span>
                      )}
                      {msg.content}
                    </>
                  )}
                </div>
                {msg.type === 'user' && <span className="avatar">👤</span>}
              </div>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />

        {/* 맨 아래로 버튼 */}
        {showScrollBtn && (
          <button
            type="button"
            className="scroll-to-bottom"
            onClick={scrollToBottom}
            aria-label="맨 아래로"
          >
            ↓
          </button>
        )}
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
        {/* 모드 탭 */}
        <div className="mode-tabs" role="tablist">
          <button
            type="button"
            className={`mode-tab ${queryMode === 'word' ? 'active' : ''}`}
            role="tab"
            aria-selected={queryMode === 'word'}
            onClick={() => handleModeChange('word')}
          >
            📚 단어
          </button>
          <button
            type="button"
            className={`mode-tab ${queryMode === 'grammar' ? 'active' : ''}`}
            role="tab"
            aria-selected={queryMode === 'grammar'}
            onClick={() => handleModeChange('grammar')}
          >
            📝 문법
          </button>
          <button
            type="button"
            className={`mode-tab ${queryMode === 'chat' ? 'active' : ''}`}
            role="tab"
            aria-selected={queryMode === 'chat'}
            onClick={() => handleModeChange('chat')}
          >
            💬 질문
          </button>
        </div>
        <div className="input-row">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentConfig.placeholder}
            disabled={isLoading}
            rows={2}
          />
          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={!question.trim() || isLoading}
          >
            {isLoading ? '⏳' : '✨'}
          </button>
        </div>
      </div>
    </div>
  );
};
