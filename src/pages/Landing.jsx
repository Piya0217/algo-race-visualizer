import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 overflow-hidden relative">

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full opacity-5 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500 rounded-full opacity-5 blur-3xl" />

      {/* Content */}
      <div
        className="relative z-10 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease',
        }}
      >
        <div className="inline-block px-4 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-mono mb-6">
          ✦ Pathfinding Algorithm Visualizer
        </div>

        <h1 className="text-7xl font-black text-white mb-4 tracking-tight">
          Algo<span className="text-green-400">Race</span>
          <span className="ml-3">🏁</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-lg mx-auto mb-4 leading-relaxed">
          Watch BFS, DFS and A* race through mazes in real time.
          See which algorithm wins — and understand exactly why.
        </p>
        <p className="text-sm text-gray-600 mb-12 font-mono">
          Built for DAA • React • Pathfinding
        </p>

        <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          {[
            { emoji: '🔵', name: 'BFS', desc: 'Floods level by level. Shortest path guaranteed.' },
            { emoji: '🟡', name: 'DFS', desc: 'Dives deep first. Fast but unpredictable.' },
            { emoji: '🟢', name: 'A*', desc: 'Smart heuristic. Most efficient navigator.' },
          ].map((algo, idx) => (
            <div
              key={algo.name}
              className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-600 transition-all hover:-translate-y-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.8s ease ${0.2 + idx * 0.1}s`,
              }}
            >
              <div className="text-3xl mb-2">{algo.emoji}</div>
              <h3 className="text-white font-bold text-base mb-1">{algo.name}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{algo.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ opacity: visible ? 1 : 0, transition: 'all 0.8s ease 0.5s' }}>
          <button
            onClick={() => navigate('/setup')}
            className="group px-12 py-4 bg-green-500 text-white font-bold text-xl rounded-2xl hover:bg-green-400 transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105"
          >
            Get Started
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Landing;