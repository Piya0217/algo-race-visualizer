import React from 'react';
import { bfs, getShortestPath } from '../algorithm/bfs.js';

const ROWS = 15;
const COLS = 25;

const createGrid = () => {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      row,
      col,
      isWall: false,
      isStart: row === 7 && col === 2,
      isEnd: row === 7 && col === 22,
      isVisited: false,
      isPath: false,
      previousNode: null,
    }))
  );
};

function Grid() {
  const [grid, setGrid] = React.useState(createGrid());
  const [isRunning, setIsRunning] = React.useState(false);

  const handleCellClick = (row, col) => {
    if (isRunning) return;
    const newGrid = grid.map((r) =>
      r.map((cell) => {
        if (cell.row === row && cell.col === col) {
          if (cell.isStart || cell.isEnd) return cell;
          return { ...cell, isWall: !cell.isWall };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const getCellColor = (cell) => {
    if (cell.isStart) return 'bg-green-500';
    if (cell.isEnd) return 'bg-red-500';
    if (cell.isPath) return 'bg-yellow-400';
    if (cell.isVisited) return 'bg-blue-500';
    if (cell.isWall) return 'bg-gray-100';
    return 'bg-gray-700';
  };

  const runBFS = () => {
    setIsRunning(true);
    const freshGrid = grid.map((r) =>
      r.map((cell) => ({
        ...cell,
        isVisited: false,
        isPath: false,
        previousNode: null,
      }))
    );

    const startNode = freshGrid[7][2];
    const endNode = freshGrid[7][22];

    const visitedNodes = bfs(freshGrid, startNode, endNode);
    const shortestPath = getShortestPath(endNode);

    animateBFS(visitedNodes, shortestPath, freshGrid);
  };

  const animateBFS = (visitedNodes, shortestPath, freshGrid) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          animatePath(shortestPath, freshGrid, visitedNodes);
        }, 20 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        setGrid((prev) =>
          prev.map((r) =>
            r.map((cell) =>
              cell.row === node.row && cell.col === node.col
                ? { ...cell, isVisited: true }
                : cell
            )
          )
        );
      }, 20 * i);
    }
  };

  const animatePath = (shortestPath, freshGrid, visitedNodes) => {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        setGrid((prev) =>
          prev.map((r) =>
            r.map((cell) =>
              cell.row === node.row && cell.col === node.col
                ? { ...cell, isPath: true }
                : cell
            )
          )
        );
        if (i === shortestPath.length - 1) setIsRunning(false);
      }, 50 * i);
    }
  };

  const resetGrid = () => {
    setGrid(createGrid());
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={runBFS}
          disabled={isRunning}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Run BFS 🔵
        </button>
        <button
          onClick={resetGrid}
          disabled={isRunning}
          className="px-6 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="flex">
          {row.map((cell, cIdx) => (
            <div
              key={cIdx}
              onClick={() => handleCellClick(cell.row, cell.col)}
              className={`w-8 h-8 border border-gray-600 cursor-pointer ${getCellColor(cell)}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;