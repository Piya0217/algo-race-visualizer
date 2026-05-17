import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import CodeEditor from './pages/CodeEditor';
import Race from './pages/Race';
import Scoreboard from './pages/Scoreboard';

function CustomCursor() {
  const [cursor, setCursor] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', left: cursor.x, top: cursor.y,
        width: 20, height: 20, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #ffffff, #4ade80)',
        boxShadow: '0 0 10px #4ade80, 0 0 20px #4ade80, 0 4px 8px rgba(0,0,0,0.5)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 9999,
      }} />
      <div style={{
        position: 'fixed', left: cursor.x, top: cursor.y,
        width: 40, height: 40, borderRadius: '50%',
        border: '1.5px solid rgba(74,222,128,0.5)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', zIndex: 9998,
        transition: 'left 0.08s ease, top 0.08s ease',
      }} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ cursor: 'none' }}>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/editor" element={<CodeEditor />} />
          <Route path="/race" element={<Race />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;