import React from 'react';
import { useNavigate } from 'react-router-dom';
import { bfs, getShortestPath } from '../algorithm/bfs.js';
import { dfs } from '../algorithm/dfs.js';
import { aStar } from '../algorithm/aStar.js';
import { generateMaze } from '../algorithm/maze.js';

const ROWS = 20;
const COLS = 15;

const createGrid = () => {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      row, col,
      isWall: false,
      isStart: row === 0 && col === 7,
      isEnd: row === 19 && col === 7,
      isVisited: false,
      isPath: false,
      previousNode: null,
      gCost: Infinity,
      hCost: 0,
      fCost: Infinity,
    }))
  );
};

const BASE_ALGOS = [
  { name: 'BFS', emoji: '🔵', fn: bfs, visitColor: '#60a5fa', pathColor: '#bfdbfe' },
  { name: 'DFS', emoji: '🟡', fn: dfs, visitColor: '#facc15', pathColor: '#fef08a' },
  { name: 'A*',  emoji: '🟢', fn: aStar, visitColor: '#4ade80', pathColor: '#bbf7d0' },
];

// Generate maze presets
function generateSpiral(grid) {
  const newGrid = grid.map(r => r.map(c => ({ ...c, isWall: false })));
  for (let i = 2; i < ROWS - 2; i++) {
    newGrid[i][3].isWall = true;
    newGrid[i][11].isWall = true;
  }
  for (let j = 3; j < 12; j++) {
    newGrid[5][j].isWall = true;
    newGrid[14][j].isWall = true;
  }
  newGrid[0][7].isWall = false;
  newGrid[19][7].isWall = false;
  return newGrid;
}

function generateCorridor(grid) {
  const newGrid = grid.map(r => r.map(c => ({ ...c, isWall: false })));
  for (let i = 1; i < ROWS - 1; i++) {
    for (let j = 0; j < COLS; j++) {
      if (j !== 6 && j !== 7 && j !== 8) {
        newGrid[i][j].isWall = true;
      }
    }
  }
  newGrid[0][7].isWall = false;
  newGrid[19][7].isWall = false;
  return newGrid;
}

function generateScattered(grid) {
  const newGrid = grid.map(r => r.map(c => ({ ...c, isWall: false })));
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (!newGrid[i][j].isStart && !newGrid[i][j].isEnd) {
        if (Math.random() < 0.3) newGrid[i][j].isWall = true;
      }
    }
  }
  return newGrid;
}

function RaceGrid({ algo, wallGrid, isRacing, onFinish }) {
  const [visitedCount, setVisitedCount] = React.useState(0);
  const [pathCount, setPathCount] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [found, setFound] = React.useState(null);
  const [time, setTime] = React.useState(0);

  const visitedRef = React.useRef([]);
  const pathRef = React.useRef([]);
  const baseGridRef = React.useRef(createGrid());

  React.useEffect(() => {
    if (!isRacing) {
      visitedRef.current = [];
      pathRef.current = [];
      baseGridRef.current = createGrid();
      setVisitedCount(0);
      setPathCount(0);
      setDone(false);
      setFound(null);
      setTime(0);
      return;
    }

    const freshGrid = createGrid().map((r) =>
      r.map((cell) => ({
        ...cell,
        isWall: wallGrid[cell.row][cell.col].isWall,
      }))
    );

    baseGridRef.current = freshGrid;
    const startNode = freshGrid[0][7];
    const endNode = freshGrid[19][7];

    const startTime = performance.now();
    const { visitedNodes, found: f } = algo.fn(freshGrid, startNode, endNode);
    const endTime = performance.now();

    visitedRef.current = visitedNodes;
    pathRef.current = f ? getShortestPath(endNode) : [];
    setTime((endTime - startTime).toFixed(2));
    setFound(f);
    setVisitedCount(0);
    setPathCount(0);
    setDone(false);

    let v = 0;
    const visitInterval = setInterval(() => {
      if (v < visitedNodes.length) {
        v++;
        setVisitedCount(v);
      } else {
        clearInterval(visitInterval);
        if (!f) {
          setDone(true);
          onFinish(algo.name, false, visitedNodes.length, 0, (endTime - startTime).toFixed(2));
          return;
        }
        let p = 0;
        const pathInterval = setInterval(() => {
          if (p < pathRef.current.length) {
            p++;
            setPathCount(p);
          } else {
            clearInterval(pathInterval);
            setDone(true);
            onFinish(algo.name, true, visitedNodes.length, pathRef.current.length, (endTime - startTime).toFixed(2));
          }
        }, 100);
      }
    }, 80);

    return () => clearInterval(visitInterval);
  },// eslint-disable-next-line react-hooks/exhaustive-deps
  [isRacing]);

  const getCellColor = (cell) => {
    if (cell.isStart) return '#22c55e';
    if (cell.isEnd) return '#ef4444';
    if (cell.isWall) return '#f3f4f6';

    const pathIndex = pathRef.current.findIndex(
      (n) => n.row === cell.row && n.col === cell.col
    );
    if (pathIndex !== -1 && pathIndex < pathCount) return algo.pathColor;

    const visitIndex = visitedRef.current.findIndex(
      (n) => n.row === cell.row && n.col === cell.col
    );
    if (visitIndex !== -1 && visitIndex < visitedCount) return algo.visitColor;

    return '#1f2937';
  };

  const grid = baseGridRef.current;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold text-white mb-2">
        {algo.emoji} {algo.name}
        {done && found && <span className="ml-2 text-green-400">✅</span>}
        {done && found === false && <span className="ml-2 text-red-400">❌</span>}
      </h2>
      <div style={{ border: '1px solid #4b5563' }}>
        {grid.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex' }}>
            {row.map((cell, cIdx) => (
              <div
                key={cIdx}
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: getCellColor(cell),
                  border: '1px solid #374151',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-300 flex gap-3">
        <span>Nodes: <span className="text-white font-bold">{visitedCount}</span></span>
        <span>Path: <span className="text-white font-bold">{pathCount}</span></span>
        <span>Time: <span className="text-white font-bold">{time}ms</span></span>
      </div>
    </div>
  );
}

function Race() {
  const navigate = useNavigate();
  const config = JSON.parse(localStorage.getItem('algorace-config') || '{}');
  const userCode = localStorage.getItem('algorace-user-code');

  const [wallGrid, setWallGrid] = React.useState(() => {
    const base = createGrid();
    if (config.maze === 'random') return generateMaze(base);
    if (config.maze === 'spiral') return generateSpiral(base);
    if (config.maze === 'corridor') return generateCorridor(base);
    if (config.maze === 'scattered') return generateScattered(base);
    return base;
  });

  const [isRacing, setIsRacing] = React.useState(false);
  const [raceKey, setRaceKey] = React.useState(0);
  const [winner, setWinner] = React.useState(null);
  const [, setResults] = React.useState([]);
  const finishedRef = React.useRef([]);

  // Build algos list
  const algos = React.useMemo(() => {
    const list = [...BASE_ALGOS];
    if (config.ownAlgo && userCode) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${userCode}; return myAlgo;`)();
        list.push({
          name: 'Mine',
          emoji: '⚡',
          fn: fn,
          visitColor: '#f472b6',
          pathColor: '#fbcfe8',
        });
      } catch (e) {}
    }
    return list;
  }, []);

  const handleCellClick = (row, col) => {
    if (isRacing || config.maze !== 'custom') return;
    const newGrid = wallGrid.map((r) =>
      r.map((cell) => {
        if (cell.row === row && cell.col === col) {
          if (cell.isStart || cell.isEnd) return cell;
          return { ...cell, isWall: !cell.isWall };
        }
        return cell;
      })
    );
    setWallGrid(newGrid);
  };

  const startRace = () => {
    setWinner(null);
    setResults([]);
    finishedRef.current = [];
    setRaceKey((k) => k + 1);
    setIsRacing(true);
  };

  const handleFinish = (name, found, nodes, pathLen, time) => {
    if (!found) return;
    finishedRef.current.push({ name, nodes, pathLen, time });
    if (finishedRef.current.length === 1) setWinner(name);
    if (finishedRef.current.length === algos.length) {
      setResults([...finishedRef.current]);
      setIsRacing(false);
      setTimeout(() => navigate('/scoreboard', {
        state: { results: finishedRef.current, config }
      }), 1500);
    }
  };

  const getWallCellColor = (cell) => {
    if (cell.isStart) return 'bg-green-500';
    if (cell.isEnd) return 'bg-red-500';
    if (cell.isWall) return 'bg-gray-100';
    return 'bg-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-8">

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-white mb-1">
          🏁 Live Race
        </h1>
        <div className="flex justify-center gap-4 mt-2">
          <span className="px-3 py-1 bg-gray-800 text-green-400 text-sm rounded-full border border-gray-700">
            Maze: {config.maze || 'custom'}
          </span>
          <span className="px-3 py-1 bg-gray-800 text-blue-400 text-sm rounded-full border border-gray-700">
            Problem: {config.problem || 'shortest'}
          </span>
          {config.ownAlgo && (
            <span className="px-3 py-1 bg-gray-800 text-pink-400 text-sm rounded-full border border-gray-700">
              ⚡ Your algo included!
            </span>
          )}
        </div>
      </div>

      {/* Custom maze drawing */}
      {config.maze === 'custom' && !isRacing && (
        <div className="flex flex-col items-center mb-6">
          <p className="text-gray-400 text-sm mb-2">
            🖱️ Click cells to place walls!
          </p>
          {wallGrid.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  onClick={() => handleCellClick(cell.row, cell.col)}
                  className={`w-5 h-5 border border-gray-700 cursor-pointer ${getWallCellColor(cell)}`}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => navigate('/setup')}
          className="px-6 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 text-sm"
        >
          ← Back
        </button>
        <button
          onClick={startRace}
          disabled={isRacing}
          className="px-8 py-3 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 disabled:opacity-50"
        >
          🏁 Start Race
        </button>
        <button
          onClick={() => {
            setIsRacing(false);
            setWinner(null);
            setResults([]);
            setRaceKey((k) => k + 1);
          }}
          className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 text-sm"
        >
          🔄 Reset
        </button>
      </div>

      {/* Winner Banner */}
      {winner && (
        <div className="flex justify-center mb-6">
          <div className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg">
            🏆 Winner: {algos.find(a => a.name === winner)?.emoji} {winner}!
          </div>
        </div>
      )}

      {/* Race Grids */}
      <div className="flex flex-row gap-6 justify-center flex-wrap">
        {algos.map((algo) => (
          <RaceGrid
            key={`${algo.name}-${raceKey}`}
            algo={algo}
            wallGrid={wallGrid}
            isRacing={isRacing}
            onFinish={handleFinish}
          />
        ))}
      </div>

    </div>
  );
}

export default Race;