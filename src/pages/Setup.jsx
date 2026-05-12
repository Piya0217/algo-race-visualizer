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
    <div className="min-h-screen bg-gray-900 px-8 py-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          🏁 AlgoRace
        </h1>
        <p className="text-gray-400">Set up your race</p>
      </div>

      <div className="max-w-3xl mx-auto">

        {/* Step 1 - Maze */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Pick a Maze
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mazes.map((maze) => (
              <div
                key={maze.id}
                onClick={() => setSelectedMaze(maze.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMaze === maze.id
                    ? 'border-green-400 bg-green-400/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                }`}
              >
                <p className="text-white font-bold">{maze.label}</p>
                <p className="text-gray-400 text-sm mt-1">{maze.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 - Problem */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Pick a Problem Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => setSelectedProblem(problem.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedProblem === problem.id
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                }`}
              >
                <p className="text-white font-bold">{problem.label}</p>
                <p className="text-gray-400 text-sm mt-1">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 - Own Algo */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            Race Your Own Algorithm?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setOwnAlgo(true)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                ownAlgo
                  ? 'border-purple-400 bg-purple-400/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <p className="text-white font-bold">⚡ Yes, I'll write my algo!</p>
              <p className="text-gray-400 text-sm mt-1">Race your code vs BFS/DFS/A*</p>
            </div>
            <div
              onClick={() => setOwnAlgo(false)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                !ownAlgo
                  ? 'border-purple-400 bg-purple-400/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <p className="text-white font-bold">👀 No, just watch the race</p>
              <p className="text-gray-400 text-sm mt-1">Watch BFS, DFS and A* race</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedMaze || !selectedProblem}
            className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}

export default Setup;