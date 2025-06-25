import React from 'react';
import './Navigation.css';

interface NavigationProps {
  currentPage: 'home' | 'statistics';
  onPageChange: (page: 'home' | 'statistics') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
}) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <button
          onClick={() => onPageChange('home')}
          className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
        >
          <span className="nav-icon">✍️</span>
          <span className="nav-text">교정하기</span>
        </button>
        <button
          onClick={() => onPageChange('statistics')}
          className={`nav-button ${currentPage === 'statistics' ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">통계보기</span>
        </button>
      </div>
    </nav>
  );
};