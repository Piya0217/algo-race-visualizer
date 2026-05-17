import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const complexityData = {
  BFS: {
    time: 'O(V + E)',
    space: 'O(V)',
    best: 'Shortest path guaranteed',
    worst: 'Explores all nodes',
  },
  DFS: {
    time: 'O(V + E)',
    space: 'O(V)',
    best: 'Fast on deep graphs',
    worst: 'No shortest path guarantee',
  },
  'A*': {
    time: 'O(V log V)',
    space: 'O(V)',
    best: 'Fastest with heuristic',
    worst: 'Depends on heuristic quality',
  },
};

function detectComplexity(code) {
  const hasPriorityQueue = code.includes('.sort(') && (code.includes('fCost') || code.includes('heuristic') || code.includes('cost'));
  const hasNestedLoop = /for.*\n.*for|while.*\n.*while/.test(code);
  const hasSort = code.includes('.sort(');
  const hasQueue = code.includes('.shift()') || code.includes('queue');
  const hasStack = code.includes('.pop()') || code.includes('stack');

  if (hasPriorityQueue) return { time: 'O(V log V)', space: 'O(V)', best: 'Heuristic-guided search', worst: 'Depends on heuristic quality' };
  if (hasNestedLoop) return { time: 'O(V²)', space: 'O(V)', best: 'Works on all graphs', worst: 'Slow on large grids' };
  if (hasSort) return { time: 'O(V log V)', space: 'O(V)', best: 'Sorted priority exploration', worst: 'Sort overhead per step' };
  if (hasQueue) return { time: 'O(V + E)', space: 'O(V)', best: 'Level by level exploration', worst: 'High memory usage' };
  if (hasStack) return { time: 'O(V + E)', space: 'O(V)', best: 'Deep path exploration', worst: 'No shortest path guarantee' };
  return { time: 'O(?)', space: 'O(?)', best: 'Custom implementation', worst: 'Depends on your logic' };
}

const conclusions = {
  BFS: (results) => {
    const bfs = results.find(r => r.name === 'BFS');
    return `BFS won by exploring nodes level by level using a Queue (FIFO). It visited ${bfs?.nodes} nodes and found the shortest path of length ${bfs?.pathLen}. While BFS guarantees the shortest path, it explores more nodes than A* because it has no heuristic — it treats all directions equally. On this maze layout, that thoroughness paid off!`;
  },
  DFS: (results) => {
    const dfs = results.find(r => r.name === 'DFS');
    return `DFS won by diving deep immediately using a Stack (LIFO). It visited only ${dfs?.nodes} nodes making it fast on this maze. However, DFS does NOT guarantee the shortest path — it just finds any path. On different mazes, DFS often loses because it gets stuck exploring wrong directions first.`;
  },
  'A*': (results) => {
    const astar = results.find(r => r.name === 'A*');
    const bfs = results.find(r => r.name === 'BFS');
    return `A* won using Manhattan distance heuristic: f(n) = g(n) + h(n), where g(n) is distance from start and h(n) estimates distance to goal. This intelligence allowed A* to visit only ${astar?.nodes} nodes compared to BFS which visited ${bfs?.nodes} nodes — making A* roughly ${Math.round((bfs?.nodes || 1) / (astar?.nodes || 1))}x more efficient. A* is the gold standard for pathfinding!`;
  },
  Mine: (results) => {
    const mine = results.find(r => r.name === 'Mine');
    const best = [...results].sort((a, b) => a.nodes - b.nodes)[0];
    return `Your custom algorithm won! It visited ${mine?.nodes} nodes and found a path of length ${mine?.pathLen}. ${mine?.nodes <= (best?.nodes || Infinity) ? 'Impressive — your algorithm was the most efficient racer!' : `The most efficient built-in algorithm visited ${best?.nodes} nodes. Try optimizing your logic further!`}`;
  },
};

function Scoreboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results = [], config = {} } = location.state || {};
  const userCode = localStorage.getItem('algorace-user-code') || '';

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-white">📊 No race data found!</h1>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg">
          🏠 Go Home
        </button>
      </div>
    );
  }

  const sorted = [...results].sort((a, b) => {
  if (a.nodes !== b.nodes) return a.nodes - b.nodes;
  return parseFloat(a.time) - parseFloat(b.time);
});
  const ranked = [];
  let currentRank = 1;
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    const group = [];
    while (j < sorted.length && sorted[j].nodes === sorted[i].nodes && parseFloat(sorted[j].time) === parseFloat(sorted[i].time)) {
      group.push(sorted[j]);
      j++;
    }
    ranked.push({ rank: currentRank, group, tied: group.length > 1 });
    currentRank += group.length;
    i = j;
  }

  const medals = ['🥇', '🥈', '🥉', '4th', '5th'];
  const winner = ranked[0].group.map(r => r.name).join(' & ');
  const winnerName = ranked[0].group[0].name;

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">📊 Race Results</h1>
        <div className="flex justify-center gap-4">
          <span className="px-3 py-1 bg-gray-800 text-green-400 text-sm rounded-full border border-gray-700">
            Maze: {config.maze}
          </span>
          <span className="px-3 py-1 bg-gray-800 text-blue-400 text-sm rounded-full border border-gray-700">
            Problem: {config.problem}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">

        {/* Winner Banner */}
        <div className="mb-8 p-6 bg-yellow-400/10 border border-yellow-400 rounded-xl text-center">
          <p className="text-5xl mb-2">🏆</p>
          <p className="text-2xl font-extrabold text-yellow-400">
            {ranked[0].tied
              ? `🔥 Dead Heat! ${winner} are neck and neck!`
              : `Winner: ${winner}!`}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {ranked[0].tied
              ? '⚡ Both algorithms crossed the finish line at the same time!'
              : 'Most efficient pathfinder on this maze'}
          </p>
        </div>

        {/* Scoreboard Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Algorithm</th>
                <th className="text-left py-3 px-4">Nodes</th>
                <th className="text-left py-3 px-4">Path</th>
                <th className="text-left py-3 px-4">Time</th>
                <th className="text-left py-3 px-4">Time Complexity</th>
                <th className="text-left py-3 px-4">Space Complexity</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map(({ rank, group, tied }) =>
                tied ? (
                  <tr
                    key={group.map(g => g.name).join('-')}
                    className="border-b border-gray-800 bg-yellow-400/5"
                  >
                    <td className="py-3 px-4 text-xl">
                      {medals[rank - 1]}{' '}
                      <span className="text-yellow-400 text-xs font-bold">TIED</span>
                    </td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">
                      {group.map(g => g.name).join(' & ')}
                    </td>
                    <td className="py-3 px-4 text-blue-300">{group[0].nodes}</td>
                    <td className="py-3 px-4 text-green-300">{group[0].pathLen}</td>
                    <td className="py-3 px-4 text-yellow-300">{group[0].time}ms</td>
                    <td className="py-3 px-4 font-mono">
                      {group.map(g => {
                        const c = g.name === 'Mine' ? detectComplexity(userCode) : complexityData[g.name];
                        return (
                          <div key={g.name} className="text-xs">
                            <span className="text-gray-400">{g.name}: </span>
                            <span className="text-purple-300">{c?.time}</span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {group.map(g => {
                        const c = g.name === 'Mine' ? detectComplexity(userCode) : complexityData[g.name];
                        return (
                          <div key={g.name} className="text-xs">
                            <span className="text-gray-400">{g.name}: </span>
                            <span className="text-pink-300">{c?.space}</span>
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                ) : (
                  group.map(result => {
                    const complexity = result.name === 'Mine'
                      ? detectComplexity(userCode)
                      : complexityData[result.name];
                    return (
                      <tr
                        key={result.name}
                        className={`border-b border-gray-800 ${rank === 1 ? 'bg-yellow-400/5' : ''}`}
                      >
                        <td className="py-3 px-4 text-xl">{medals[rank - 1]}</td>
                        <td className="py-3 px-4 text-white font-bold">{result.name}</td>
                        <td className="py-3 px-4 text-blue-300">{result.nodes}</td>
                        <td className="py-3 px-4 text-green-300">{result.pathLen}</td>
                        <td className="py-3 px-4 text-yellow-300">{result.time}ms</td>
                        <td className="py-3 px-4 text-purple-300 font-mono">{complexity?.time}</td>
                        <td className="py-3 px-4 text-pink-300 font-mono">{complexity?.space}</td>
                      </tr>
                    );
                  })
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {results.map((result) => {
            const complexity = result.name === 'Mine'
              ? detectComplexity(userCode)
              : complexityData[result.name];
            return (
              <div key={result.name} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-bold mb-2">{result.name}</h3>
                <div className="flex flex-col gap-1 text-xs">
                  <p className="text-gray-400">⏱ Time: <span className="text-purple-300 font-mono">{complexity?.time}</span></p>
                  <p className="text-gray-400">💾 Space: <span className="text-pink-300 font-mono">{complexity?.space}</span></p>
                  <p className="text-gray-400 mt-1">✅ Best: <span className="text-green-300">{complexity?.best}</span></p>
                  <p className="text-gray-400">⚠️ Worst: <span className="text-red-300">{complexity?.worst}</span></p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conclusion */}
        <div className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-white font-bold text-lg mb-3">
            💡 Why {winner} won
          </h3>
          {ranked[0].tied ? (
            ranked[0].group.map(r => (
              <div key={r.name} className="mb-4">
                <p className="text-yellow-400 font-bold mb-1">🔥 {r.name}:</p>
                <p className="text-gray-300 leading-relaxed">
                  {conclusions[r.name]
                    ? conclusions[r.name](results)
                    : `${r.name} performed equally well on this maze!`}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-300 leading-relaxed">
              {conclusions[winnerName]
                ? conclusions[winnerName](results)
                : `${winner} won this race! Check the complexity stats above to understand why.`}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600"
          >🏠 Home</button>
          <button
            onClick={() => navigate('/setup')}
            className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600"
          >⚙️ New Setup</button>
          <button
            onClick={() => navigate('/race')}
            className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600"
          >🔄 Race Again</button>
        </div>

      </div>
    </div>
  );
}

export default Scoreboard;