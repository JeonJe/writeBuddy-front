import React from 'react';
import './FloatingChatButton.css';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      className="floating-chat-button"
      onClick={handleClick}
      aria-label="영어 학습 도우미 열기"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
          fill="currentColor"
        />
        <path
          d="M7 9H17V11H7V9ZM7 13H14V15H7V13Z"
          fill="white"
        />
      </svg>
      <span className="tooltip">AI 학습 도우미</span>
    </button>
  );
};