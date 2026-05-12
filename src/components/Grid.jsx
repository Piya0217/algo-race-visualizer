import React from 'react';
import { bfs, getShortestPath } from '../algorithm/bfs.js';
import { dfs } from '../algorithm/dfs.js';
import { aStar } from '../algorithm/aStar.js';

const ROWS = 20;
const COLS = 15;

const createGrid = () => {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      row,
      col,
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

const ALGOS = [
  { name: 'BFS', emoji: '🔵', fn: bfs, visitColor: '#60a5fa', pathColor: '#bfdbfe' },
  { name: 'DFS', emoji: '🟡', fn: dfs, visitColor: '#facc15', pathColor: '#fef08a' },
  { name: 'A*',  emoji: '🟢', fn: aStar, visitColor: '#4ade80', pathColor: '#bbf7d0' },
];

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
          onFinish(algo.name, false);
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
            onFinish(algo.name, true);
          }
        }, 100);
      }
    }, 80);

    return () => clearInterval(visitInterval);
  }, [isRacing]);

  const getCellColor = (cell) => {
    if (cell.isStart) return '#22c55e';
    if (cell.isEnd) return '#ef4444';
    if (cell.isWall) return '#f3f4f6';

    const visitedNodes = visitedRef.current;
    const pathNodes = pathRef.current;

    const pathIndex = pathNodes.findIndex(
      (n) => n.row === cell.row && n.col === cell.col
    );
    if (pathIndex !== -1 && pathIndex < pathCount) return algo.pathColor;

    const visitIndex = visitedNodes.findIndex(
      (n) => n.row === cell.row && n.col === cell.col
    );
    if (visitIndex !== -1 && visitIndex < visitedCount) return algo.visitColor;

    return '#1f2937';
  };

  const grid = baseGridRef.current;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-white mb-2">
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
                  width: 24,
                  height: 24,
                  backgroundColor: getCellColor(cell),
                  border: '1px solid #374151',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-300 flex gap-4">
        <span>Nodes: <span className="text-white font-bold">{visitedCount}</span></span>
        <span>Path: <span className="text-white font-bold">{pathCount}</span></span>
        <span>Time: <span className="text-white font-bold">{time}ms</span></span>
      </div>
    </div>
  );
}

function Grid() {
  const [wallGrid, setWallGrid] = React.useState(createGrid());
  const [isRacing, setIsRacing] = React.useState(false);
  const [raceKey, setRaceKey] = React.useState(0);
  const [winner, setWinner] = React.useState(null);
  const finishedRef = React.useRef([]);

  const handleCellClick = (row, col) => {
    if (isRacing) return;
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
    finishedRef.current = [];
    setRaceKey((k) => k + 1);
    setIsRacing(true);
  };

  const resetAll = () => {
    setIsRacing(false);
    setWallGrid(createGrid());
    setWinner(null);
    finishedRef.current = [];
    setRaceKey((k) => k + 1);
  };

  const handleFinish = (name, found) => {
    if (!found) return;
    finishedRef.current.push(name);
    if (finishedRef.current.length === 1) {
      setWinner(name);
    }
  };

  const getWallCellColor = (cell) => {
    if (cell.isStart) return 'bg-green-500';
    if (cell.isEnd) return 'bg-red-500';
    if (cell.isWall) return 'bg-gray-100';
    return 'bg-gray-800';
  };

  return (
    <div className="flex flex-col items-center pb-12">
      <div className="mb-6">
        <p className="text-gray-400 text-center mb-2 text-sm">
          🖱️ Click cells to place walls, then start the race!
        </p>
        {wallGrid.map((row, rIdx) => (
          <div key={rIdx} className="flex">
            {row.map((cell, cIdx) => (
              <div
                key={cIdx}
                onClick={() => handleCellClick(cell.row, cell.col)}
                className={`w-6 h-6 border border-gray-700 cursor-pointer ${getWallCellColor(cell)}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={startRace}
          disabled={isRacing}
          className="px-8 py-3 bg-green-500 text-white font-bold text-lg rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          🏁 Start Race
        </button>
        <button
          onClick={resetAll}
          className="px-8 py-3 bg-gray-600 text-white font-bold text-lg rounded-lg hover:bg-gray-700"
        >
          🔄 Reset
        </button>
      </div>

      {winner && (
        <div className="mb-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold text-xl rounded-lg">
          🏆 Winner: {ALGOS.find(a => a.name === winner)?.emoji} {winner}!
        </div>
      )}

      <div className="flex flex-row gap-8 items-start justify-center">
        {ALGOS.map((algo) => (
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

export default Grid;