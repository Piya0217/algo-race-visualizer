export function bfs(grid, startNode, endNode) {
  const visitedNodes = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === endNode) return visitedNodes;

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = current;
        visitedNodes.push(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visitedNodes;
}

export function getShortestPath(endNode) {
  const path = [];
  let current = endNode;
  while (current !== null && current !== undefined) {
    path.unshift(current);
    current = current.previousNode;
  }
  return path;
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