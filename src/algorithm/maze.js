export function generateMaze(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Start with all walls
  const maze = grid.map((r) =>
    r.map((cell) => ({
      ...cell,
      isWall: !cell.isStart && !cell.isEnd,
      isVisited: false,
    }))
  );

  // Recursive backtracking - only on odd cells
  const startRow = 1;
  const startCol = 1;

  function carve(row, col) {
    maze[row][col].isWall = false;
    maze[row][col].isVisited = true;

    const directions = shuffle([
      [0, 2],
      [0, -2],
      [2, 0],
      [-2, 0],
    ]);

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow > 0 &&
        newRow < rows - 1 &&
        newCol > 0 &&
        newCol < cols - 1 &&
        !maze[newRow][newCol].isVisited
      ) {
        // Carve wall between
        maze[row + dr / 2][col + dc / 2].isWall = false;
        carve(newRow, newCol);
      }
    }
  }

  carve(startRow, startCol);

  // Make sure start and end are always open
  maze[0][7].isWall = false;
  maze[1][7].isWall = false;
  maze[rows - 1][7].isWall = false;
  maze[rows - 2][7].isWall = false;

  return maze;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}