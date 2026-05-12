export function dfs(grid, startNode, endNode) {
  const visitedNodes = [];

  function explore(node) {
    if (!node || node.isVisited || node.isWall) return false;
    node.isVisited = true;
    visitedNodes.push(node);

    if (node.row === endNode.row && node.col === endNode.col) return true;

    const { row, col } = node;
    const neighbors = [
      grid[row + 1]?.[col],
      grid[row]?.[col + 1],
      grid[row - 1]?.[col],
      grid[row]?.[col - 1],
    ].filter(Boolean);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = node;
        if (explore(neighbor)) return true;
      }
    }
    return false;
  }

  const found = explore(startNode);
  return { visitedNodes, found };
}