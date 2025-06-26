import React, { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose,
  isVisible
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // 애니메이션 완료 후 제거
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'error':
        return '😅';
      case 'info':
        return '💡';
      default:
        return '🎉';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return '완료!';
      case 'error':
        return '앗!';
      case 'info':
        return '알림';
      default:
        return '완료!';
    }
  };

  return (
    <div className={`toast toast-${type} ${isShowing ? 'toast-show' : 'toast-hide'}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        <div className="toast-text">
          <div className="toast-title">{getTitle()}</div>
          <div className="toast-message">{message}</div>
        </div>
      </div>
      <div className="toast-progress">
        <div className="toast-progress-bar" style={{ animationDuration: `${duration}ms` }}></div>
      </div>
    </div>
  );
};