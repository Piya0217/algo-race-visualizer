import React from 'react';
import { useNavigate } from 'react-router-dom';

function Setup() {
  const navigate = useNavigate();
  const [selectedMaze, setSelectedMaze] = React.useState(null);
  const [selectedProblem, setSelectedProblem] = React.useState(null);
  const [ownAlgo, setOwnAlgo] = React.useState(false);

  const mazes = [
    { id: 'random', label: '🌀 Random Maze', desc: 'Randomly generated maze' },
    { id: 'spiral', label: '🌊 Spiral', desc: 'Spiral shaped walls' },
    { id: 'scattered', label: '💥 Scattered', desc: 'Random scattered walls' },
    { id: 'corridor', label: '🚪 Corridor', desc: 'Narrow corridor path' },
    { id: 'custom', label: '🖱️ Custom', desc: 'Draw your own walls' },
  ];

  const problems = [
    { id: 'shortest', label: '🎯 Shortest Path', desc: 'Find the shortest route to goal' },
    { id: 'explore', label: '🔍 Explore All', desc: 'Explore every possible node' },
    { id: 'fastest', label: '⚡ Find Any Path Fast', desc: 'Reach goal as fast as possible' },
  ];

  const handleNext = () => {
    if (!selectedMaze || !selectedProblem) return;
    const config = { maze: selectedMaze, problem: selectedProblem, ownAlgo };
    localStorage.setItem('algorace-config', JSON.stringify(config));
    if (ownAlgo) {
      navigate('/editor');
    } else {
      navigate('/race');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-1">
          Algo<span className="text-green-400">Race</span> 🏁
        </h1>
        <p className="text-gray-400 text-sm">Set up your race</p>
      </div>

      <div className="max-w-lg mx-auto flex flex-col gap-8">

        {/* Step 1 - Maze */}
        <div>
          <h2 className="text-xl font-bold text-blue-500 uppercase tracking-widest mb-3">
            Pick a Maze
          </h2>
          <div className="flex flex-col gap-2">
            {mazes.map((maze) => (
              <div
                key={maze.id}
                onClick={() => setSelectedMaze(maze.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMaze === maze.id
                    ? 'border-blue-400 bg-green-400/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                }`}
              >
                <span className="text-white font-semibold text-sm">{maze.label}</span>
                <span className="text-gray-400 text-xs">{maze.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 - Problem */}
        <div>
          <h2 className="text-xl font-bold text-blue-500 uppercase tracking-widest mb-3">
            Pick a Problem Type
          </h2>
          <div className="flex flex-col gap-2">
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  selectedProblem === problem.id
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                }`}
              >
                <span className="text-white font-semibold text-sm">{problem.label}</span>
                <span className="text-gray-400 text-xs">{problem.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 - Own Algo */}
        <div>
          <h2 className="text-xl font-bold text-blue-500 uppercase tracking-widest mb-3">
            Race Your Own Algorithm?
          </h2>
          <div className="flex flex-col gap-2">
            <div
              onClick={() => setOwnAlgo(true)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                ownAlgo
                  ? 'border-blue-400 bg-purple-400/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <span className="text-white font-semibold text-sm">⚡ Yes, I'll write my algo!</span>
              <span className="text-gray-400 text-xs">Race your code vs BFS/DFS/A*</span>
            </div>
            <div
              onClick={() => setOwnAlgo(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                !ownAlgo
                  ? 'border-blue-400 bg-purple-400/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <span className="text-white font-semibold text-sm">👀 No, just watch the race</span>
              <span className="text-gray-400 text-xs">Watch BFS, DFS and A* race</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 text-sm"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedMaze || !selectedProblem}
            className="px-8 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}

export default Setup;