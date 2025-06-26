import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>WriteBuddy</h1>
          <span className="nav-tagline">영어가 쉬워지는 곳</span>
        </div>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">✨</span>
            <span className="nav-text">교정하기</span>
          </NavLink>
          <NavLink 
            to="/history" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">내 기록</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};