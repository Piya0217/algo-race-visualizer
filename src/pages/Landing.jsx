import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight">
          Algo<span className="text-green-400">Race</span> 🏁
        </h1>
        <p className="text-xl text-gray-400 max-w-xl mx-auto">
          Watch BFS, DFS and A* race through mazes in real time.
          See which algorithm wins — and understand exactly why.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-3 gap-6 mb-12 max-w-3xl">
        <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
          <div className="text-4xl mb-3">🔵</div>
          <h3 className="text-white font-bold text-lg mb-1">BFS</h3>
          <p className="text-gray-400 text-sm">Floods outward level by level. Guarantees shortest path.</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
          <div className="text-4xl mb-3">🟡</div>
          <h3 className="text-white font-bold text-lg mb-1">DFS</h3>
          <p className="text-gray-400 text-sm">Dives deep in one direction. Fast but no shortest path.</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
          <div className="text-4xl mb-3">🟢</div>
          <h3 className="text-white font-bold text-lg mb-1">A*</h3>
          <p className="text-gray-400 text-sm">Uses heuristic to navigate smartly toward the goal.</p>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate('/setup')}
        className="px-12 py-4 bg-green-500 text-white font-bold text-xl rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-105"
      >
        Get Started →
      </button>

      {/* Bottom note */}
      <p className="mt-8 text-gray-600 text-sm">
        Built with React • Pathfinding Algorithm Visualizer
      </p>

    </div>
  );
}

export default Landing;