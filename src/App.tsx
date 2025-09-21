import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, HistoryPage } from './pages';
import { Navigation, ChatSidePanel } from './components';
import { CorrectionsProvider } from './contexts/CorrectionsContext';
import './styles/globals.css';

function App() {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  return (
    <CorrectionsProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage onOpenChat={() => setIsChatPanelOpen(true)} />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
        <ChatSidePanel 
          isOpen={isChatPanelOpen} 
          onClose={() => setIsChatPanelOpen(false)} 
        />
      </Router>
    </CorrectionsProvider>
  );
}

export default App;