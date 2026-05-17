# 🏁 AlgoRace — Pathfinding Algorithm Visualizer

A real-time pathfinding algorithm race visualizer built with React. 
Watch BFS, DFS and A* compete through mazes simultaneously — 
and understand exactly why one wins over the others.

🔗 **Live Demo:** https://algo-race-visualizer-5q92.vercel.app/

---

## 🎯 What is AlgoRace?

AlgoRace is an interactive web application that visualizes and compares 
three classic pathfinding algorithms racing through the same maze in real time.
Built as a Design and Analysis of Algorithms (DAA) project.

---

## ✨ Features

- 🔵 **BFS** — Floods level by level, guarantees shortest path
- 🟡 **DFS** — Dives deep, fast but unpredictable
- 🟢 **A\*** — Smart heuristic navigation, most efficient
- ⚡ **Custom Algorithm** — Write and race your own algorithm!
- 🌀 **Maze Generator** — Random, Spiral, Corridor, Scattered, Custom
- 📊 **Live Scoreboard** — Nodes visited, path length, time taken
- 💡 **Complexity Analysis** — Time and Space complexity per algorithm
- 🏆 **Winner Conclusion** — Explains exactly why the winner won

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React | Frontend framework |
| Tailwind CSS | Styling |
| React Router | Page navigation |
| JavaScript | Algorithm logic |
| Vercel | Deployment |

---

## 🧠 Algorithms Implemented

### BFS (Breadth First Search)
- Data Structure: Queue (FIFO)
- Time Complexity: O(V + E)
- Space Complexity: O(V)
- Guarantees shortest path ✅

### DFS (Depth First Search)
- Data Structure: Stack (LIFO)
- Time Complexity: O(V + E)
- Space Complexity: O(V)
- Does NOT guarantee shortest path ❌

### A* (A Star)
- Data Structure: Priority Queue
- Time Complexity: O(V log V)
- Space Complexity: O(V)
- Uses Manhattan distance heuristic
- Guarantees shortest path ✅

---

## 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/Piya0217/algo-race-visualizer.git

# Go into the folder
cd algo-race-visualizer

# Install dependencies
npm install

# Start the app
npm start
```

Open http://localhost:3000 in your browser.

---

## 📸 How to Use
1.Open the app
2.Click "Get Started"
3.Pick a maze type
4.Pick a problem type
5.Optionally write your own algorithm
6.Click "Start Race"
7.Watch all algorithms race simultaneously
8.View scoreboard with complexity analysis

---

## 📁 Project Structure
src/
├── algorithm/
│   ├── bfs.js        → BFS implementation
│   ├── dfs.js        → DFS implementation
│   ├── aStar.js      → A* implementation
│   └── maze.js       → Maze generator
├── pages/
│   ├── Landing.jsx   → Home page
│   ├── Setup.jsx     → Race setup
│   ├── CodeEditor.jsx→ Custom algorithm editor
│   ├── Race.jsx      → Live race page
│   └── Scoreboard.jsx→ Results and analysis
└── App.js            → Routing

---

## 👩‍💻 Built By

**Priya** — DAA Project  
Built with React + Tailwind CSS  
Deployed on Vercel
