import React from 'react';

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
    }))
  );
};

function Grid() {
  const [grid, setGrid] = React.useState(createGrid());

  const handleCellClick = (row, col) => {
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
    if (cell.isWall) return 'bg-gray-100';
    return 'bg-gray-700';
  };

  return (
    <div className="flex flex-col items-center mt-8">
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