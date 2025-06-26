import React from 'react';
import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "✨ 마법을 부리는 중..." 
}) => {
  return (
    <div className="loading-state">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <div className="loading-content">
          <h3>{message}</h3>
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="loading-tip">AI가 당신의 영어를 더 멋지게 만들고 있어요</p>
          </div>
        </div>
      </div>
    </div>
  );
};