import React from 'react';
import { useNavigate } from 'react-router-dom';

const template = `function myAlgo(grid, startNode, endNode) {
  const visitedNodes = [];

  // Your logic here!
  // Tip: Use a queue for BFS, stack for DFS

  return { visitedNodes, found: false };
}`;

const bfsTemplate = `function myAlgo(grid, startNode, endNode) {
  const visitedNodes = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift();
    visitedNodes.push(current);

    if (current.row === endNode.row && 
        current.col === endNode.col) {
      return { visitedNodes, found: true };
    }

    const { row, col } = current;
    const neighbors = [
      grid[row - 1]?.[col],
      grid[row + 1]?.[col],
      grid[row]?.[col - 1],
      grid[row]?.[col + 1],
    ].filter(Boolean);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = current;
        queue.push(neighbor);
      }
    }
  }
  return { visitedNodes, found: false };
}`;

const dfsTemplate = `function myAlgo(grid, startNode, endNode) {
  const visitedNodes = [];
  const stack = [startNode];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current.isVisited || current.isWall) continue;
    current.isVisited = true;
    visitedNodes.push(current);

    if (current.row === endNode.row && 
        current.col === endNode.col) {
      return { visitedNodes, found: true };
    }

    const { row, col } = current;
    const neighbors = [
      grid[row - 1]?.[col],
      grid[row + 1]?.[col],
      grid[row]?.[col - 1],
      grid[row]?.[col + 1],
    ].filter(Boolean);

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.previousNode = current;
        stack.push(neighbor);
      }
    }
  }
  return { visitedNodes, found: false };
}`;

function CodeEditor() {
  const navigate = useNavigate();
  const [code, setCode] = React.useState(template);
  const [status, setStatus] = React.useState(null);
  const [error, setError] = React.useState('');
  const [errorType, setErrorType] = React.useState('');

  const config = JSON.parse(
    localStorage.getItem('algorace-config') || '{}'
  );

  const testCode = () => {
    setStatus(null);
    setError('');
    setErrorType('');

    if (!code.trim()) {
      setStatus('error');
      setErrorType('❌ Empty Code');
      setError('Your editor is empty! Pick a template or write your algorithm.');
      return;
    }

    if (!code.includes('function myAlgo')) {
      setStatus('error');
      setErrorType('❌ Wrong Function Name');
      setError('Your function must be named exactly "myAlgo". Fix: function myAlgo(grid, startNode, endNode) { ... }');
      return;
    }

    let fn;
    try {
      fn = new Function(`${code}; return myAlgo;`)();
    } catch (err) {
      setStatus('error');
      if (err instanceof SyntaxError) {
        setErrorType('❌ Syntax Error');
        setError(`${err.message}. Check for missing brackets, semicolons or typos!`);
      } else {
        setErrorType('❌ Compiler Error');
        setError(err.message);
      }
      return;
    }

    if (typeof fn !== 'function') {
      setStatus('error');
      setErrorType('❌ Not a Function');
      setError('myAlgo must be a function! Make sure you defined it correctly.');
      return;
    }

    const dummyGrid = Array.from({ length: 5 }, (_, r) =>
      Array.from({ length: 5 }, (_, c) => ({
        row: r, col: c,
        isWall: false,
        isVisited: false,
        previousNode: null,
        gCost: Infinity,
        hCost: 0,
        fCost: Infinity,
      }))
    );

    let result;
    try {
      result = fn(dummyGrid, dummyGrid[0][0], dummyGrid[4][4]);
    } catch (err) {
      setStatus('error');
      setErrorType('❌ Runtime Error');
      setError(`Your code crashed while running: "${err.message}". Check for undefined variables or infinite loops!`);
      return;
    }

    if (!result) {
      setStatus('error');
      setErrorType('❌ No Return Value');
      setError('Your function returned nothing! Add: return { visitedNodes, found }');
      return;
    }

    if (!Array.isArray(result.visitedNodes)) {
      setStatus('error');
      setErrorType('❌ Wrong Return Format');
      setError('visitedNodes must be an array! Fix: return { visitedNodes: [], found: true/false }');
      return;
    }

    if (typeof result.found !== 'boolean') {
      setStatus('error');
      setErrorType('❌ Wrong Return Format');
      setError('"found" must be true or false! Fix: return { visitedNodes, found: true }');
      return;
    }

    if (result.visitedNodes.length > 10000) {
      setStatus('error');
      setErrorType('❌ Infinite Loop Detected');
      setError('Your algorithm visited too many nodes! Check for infinite loops.');
      return;
    }

    setStatus('success');
    localStorage.setItem('algorace-user-code', code);
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-10">

      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-white mb-1">
          ⚡ Write Your Algorithm
        </h1>
        <div className="flex justify-center gap-4 mt-2">
          <span className="px-3 py-1 bg-gray-800 text-green-400 text-sm rounded-full border border-gray-700">
            Maze: {config.maze || 'random'}
          </span>
          <span className="px-3 py-1 bg-gray-800 text-blue-400 text-sm rounded-full border border-gray-700">
            Problem: {config.problem || 'shortest'}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mb-4 flex gap-3">
        <span className="text-gray-400 text-sm self-center">Start with:</span>
        <button
          onClick={() => { setCode(template); setStatus(null); }}
          className="px-4 py-1 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600"
        >⭐ Scratch</button>
        <button
          onClick={() => { setCode(bfsTemplate); setStatus(null); }}
          className="px-4 py-1 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-600"
        >🔵 BFS Template</button>
        <button
          onClick={() => { setCode(dfsTemplate); setStatus(null); }}
          className="px-4 py-1 bg-yellow-700 text-white text-sm rounded-lg hover:bg-yellow-600"
        >🟡 DFS Template</button>
      </div>

      <div className="max-w-5xl mx-auto flex gap-6">

        <div className="flex-1">
          <textarea
            value={code}
            onChange={(e) => { setCode(e.target.value); setStatus(null); }}
            className="w-full h-96 bg-gray-800 text-green-300 font-mono text-sm p-4 rounded-xl border border-gray-700 focus:outline-none focus:border-green-400 resize-none"
            spellCheck={false}
          />

          {status === 'success' && (
            <div className="mt-3 px-4 py-3 bg-green-500/10 border border-green-500 rounded-lg">
              <p className="text-green-400 font-bold">✅ Code looks good! Ready to race!</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-3 px-4 py-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-400 font-bold text-base">{errorType}</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
              <p className="text-gray-400 text-xs mt-2">Fix the error and click Test Code again!</p>
            </div>
          )}
        </div>

        <div className="w-64 bg-gray-800 rounded-xl border border-gray-700 p-5 h-fit">
          <h3 className="text-white font-bold text-base mb-4">
            📖 How to write your algorithm
          </h3>
          <p className="text-gray-400 text-xs mb-3">
            Your function must be named <span className="text-green-400 font-mono">myAlgo</span> and accept:
          </p>
          <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-blue-300 mb-4">
            <p>grid</p>
            <p>startNode</p>
            <p>endNode</p>
          </div>
          <p className="text-gray-400 text-xs mb-3">Each node has:</p>
          <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-yellow-300 mb-4">
            <p>node.row</p>
            <p>node.col</p>
            <p>node.isWall</p>
            <p>node.isVisited</p>
            <p>node.previousNode</p>
          </div>
          <p className="text-gray-400 text-xs mb-3">Must return:</p>
          <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-300 mb-4">
            <p>{'{'}</p>
            <p>&nbsp;visitedNodes,</p>
            <p>&nbsp;found</p>
            <p>{'}'}</p>
          </div>
          <p className="text-gray-400 text-xs">
            📌 Tip: Pick BFS or DFS template and modify it!
          </p>
        </div>

      </div>

      <div className="max-w-5xl mx-auto mt-6 flex justify-between">
        <button
          onClick={() => navigate('/setup')}
          className="px-6 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 text-sm"
        >← Back</button>
        <div className="flex gap-3">
          <button
            onClick={testCode}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 text-sm"
          >▶ Test Code</button>
          <button
            onClick={() => {
              if (status !== 'success') { testCode(); return; }
              navigate('/race');
            }}
            className={`px-8 py-2 font-bold rounded-lg text-sm text-white ${
              status === 'success'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >🏁 Start Race →</button>
        </div>
      </div>

    </div>
  );
}

export default CodeEditor;