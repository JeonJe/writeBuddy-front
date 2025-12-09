import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, HistoryPage } from './pages';
import { Navigation } from './components';
import { CorrectionsProvider } from './contexts/CorrectionsContext';
import './styles/globals.css';

function App() {
  return (
    <CorrectionsProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Router>
    </CorrectionsProvider>
  );
}

export default App;
