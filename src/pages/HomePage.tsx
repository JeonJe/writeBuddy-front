import React from 'react';
import { 
  CorrectionInput, 
  CorrectionResult, 
  FloatingChatButton,
  LoadingState,
  Toast
} from '../components';
import { useCorrectionsContext } from '../contexts/CorrectionsContext';
import { useToast, useCorrections } from '../hooks';
import './HomePage.css';

interface HomePageProps {
  onOpenChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenChat }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const {
    currentCorrection,
    isLoading,
    error,
    createCorrection,
    toggleFavorite,
    clearError,
    setInputText,
  } = useCorrectionsContext();

  const { getScoreLevel } = useCorrections();

  const { toasts, showSuccess, removeToast } = useToast();

  const handleCreateCorrection = async (text: string) => {
    await createCorrection(text, () => {
      showSuccess('훨씬 더 멋져졌어요! ✨');
    });
  };

  const handleExampleClick = (text: string) => {
    setInputText(text);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-page">
      <FloatingChatButton onClick={onOpenChat} />
      
      <main className="main-content">
        {error && (
          <div className="error-message">
            {error}
            <button 
              onClick={clearError}
              className="error-close-btn"
              aria-label="오류 메시지 닫기"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="main-container">
          <div className="main-editor">
            <CorrectionInput 
              onCorrect={handleCreateCorrection}
              isLoading={isLoading}
            />
            
            {isLoading && (
              <LoadingState message="교정 중..." />
            )}
            
            {currentCorrection && !isLoading && (
              <CorrectionResult
                correction={currentCorrection}
                onToggleFavorite={toggleFavorite}
                getScoreLevel={getScoreLevel}
                onTagClick={() => {}}
              />
            )}
          </div>
        </div>
      </main>
        
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label="도움말 패널 열기"
      >
        <div className="toggle-handle">
          <div className="handle-grip"></div>
          <div className="handle-grip"></div>
          <div className="handle-grip"></div>
        </div>
      </button>
      
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-section">
          <div className="quick-action">
            <span className="action-icon">📝</span>
            <div className="action-content">
              <h3>빠른 교정</h3>
              <p>AI가 즉시 영어를 개선해드립니다</p>
            </div>
          </div>
        </div>
        
        
        <div className="sidebar-section">
          <div className="quick-action">
            <span className="action-icon">💡</span>
            <div className="action-content">
              <h3>오늘의 팁</h3>
              <p>자연스러운 표현을 연습해보세요</p>
            </div>
          </div>
        </div>
        
        <div className="sidebar-section examples-section">
          <h4>예시 문장</h4>
          <div className="example-quotes">
            <button className="example-quote" onClick={() => handleExampleClick("The only way to do great work is to love what you do")}>
              "The only way to do great work is to love what you do"
            </button>
            <button className="example-quote" onClick={() => handleExampleClick("Innovation distinguishes between a leader and a follower")}>
              "Innovation distinguishes between a leader and a follower"
            </button>
            <button className="example-quote" onClick={() => handleExampleClick("Stay hungry, stay foolish")}>
              "Stay hungry, stay foolish"
            </button>
          </div>
        </div>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={true}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};