import React from 'react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <h1>✍️ WriteBuddy</h1>
      <p>AI 기반 영어 문법 교정 서비스</p>
    </header>
  );
};