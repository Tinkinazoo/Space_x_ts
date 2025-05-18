// GameSpace.tsx
import React, { useState, useEffect, useCallback } from 'react';

type Position = {
  x: number;
  y: number;
};

type CellType = 'empty' | 'player' | 'obstacle' | 'goal';

type GameSpaceProps = {
  width: number;
  height: number;
};

const GameSpace: React.FC<GameSpaceProps> = ({ width, height }) => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 });
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [gameWon, setGameWon] = useState(false);

  // Initialize the game grid
  useEffect(() => {
    const initialGrid: CellType[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill('empty'));

    // Add some obstacles
    for (let i = 0; i < width; i++) {
      initialGrid[0][i] = 'obstacle';
      initialGrid[height - 1][i] = 'obstacle';
    }
    for (let i = 0; i < height; i++) {
      initialGrid[i][0] = 'obstacle';
      initialGrid[i][width - 1] = 'obstacle';
    }

    // Add a goal
    initialGrid[height - 2][width - 2] = 'goal';

    setGrid(initialGrid);
  }, [width, height]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameWon) return;

      const { x, y } = playerPos;
      let newX = x;
      let newY = y;

      switch (e.key) {
        case 'ArrowUp':
          newY = Math.max(1, y - 1);
          break;
        case 'ArrowDown':
          newY = Math.min(height - 2, y + 1);
          break;
        case 'ArrowLeft':
          newX = Math.max(1, x - 1);
          break;
        case 'ArrowRight':
          newX = Math.min(width - 2, x + 1);
          break;
        default:
          return;
      }

      // Check if new position is valid (not an obstacle)
      if (grid[newY][newX] !== 'obstacle') {
        setPlayerPos({ x: newX, y: newY });

        // Check if player reached the goal
        if (grid[newY][newX] === 'goal') {
          setGameWon(true);
        }
      }
    },
    [playerPos, grid, width, height, gameWon]
  );

  // Add event listener for keyboard input
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Render the game grid
  const renderCell = (cell: CellType, rowIndex: number, colIndex: number) => {
    const isPlayer = playerPos.x === colIndex && playerPos.y === rowIndex;

    let cellClass = 'cell';
    if (isPlayer) cellClass += ' player';
    else if (cell === 'obstacle') cellClass += ' obstacle';
    else if (cell === 'goal') cellClass += ' goal';

    return <div key={`${rowIndex}-${colIndex}`} className={cellClass} />;
  };

  return (
    <div className="game-space">
      <h2>Game Space</h2>
      <p>Use arrow keys to move. Reach the green goal to win!</p>
      
      {gameWon ? (
        <div className="game-over-message">Congratulations! You won!</div>
      ) : (
        <div 
          className="grid" 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${width}, 30px)`,
            gridTemplateRows: `repeat(${height}, 30px)`,
            gap: '2px'
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
          )}
        </div>
      )}
    </div>
  );
};

export default GameSpace;
