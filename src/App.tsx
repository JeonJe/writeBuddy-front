import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, HistoryPage, StatsPage } from './pages';
import { Navigation, ChatSidePanel } from './components';
import './styles/globals.css';

function App() {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage onOpenChat={() => setIsChatPanelOpen(true)} />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
      <ChatSidePanel 
        isOpen={isChatPanelOpen} 
        onClose={() => setIsChatPanelOpen(false)} 
      />
    </Router>
  );
}

export default App;