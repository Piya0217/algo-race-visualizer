import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import CodeEditor from './pages/CodeEditor';
import Race from './pages/Race';
import Scoreboard from './pages/Scoreboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/editor" element={<CodeEditor />} />
        <Route path="/race" element={<Race />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;