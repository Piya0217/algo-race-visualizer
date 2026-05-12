export function aStar(grid, startNode, endNode) {
  const visitedNodes = [];
  startNode.gCost = 0;
  startNode.hCost = heuristic(startNode, endNode);
  startNode.fCost = startNode.hCost;

  const openSet = [startNode];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.fCost - b.fCost);
    const current = openSet.shift();

    if (current.isVisited || current.isWall) continue;
    current.isVisited = true;
    visitedNodes.push(current);

    if (current.row === endNode.row && current.col === endNode.col) {
      return { visitedNodes, found: true };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      if (neighbor.isVisited || neighbor.isWall) continue;
      const tentativeG = current.gCost + 1;
      if (tentativeG < (neighbor.gCost ?? Infinity)) {
        neighbor.previousNode = current;
        neighbor.gCost = tentativeG;
        neighbor.hCost = heuristic(neighbor, endNode);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;
        if (!openSet.includes(neighbor)) openSet.push(neighbor);
      }
    }
  }
  return { visitedNodes, found: false };
}

function heuristic(node, endNode) {
  return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}