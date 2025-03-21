
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tile } from "@/components/Tile";
import { shuffle } from "@/lib/gameUtils";

interface GameBoardProps {
  size: number;
  onMove: () => void;
  onComplete: (time: number) => void;
  isComplete: boolean;
  startTime: number | null;
  resetGame: () => void;
  onBoardInitialized: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  size,
  onMove,
  onComplete,
  isComplete,
  startTime,
  resetGame,
  onBoardInitialized,
}) => {
  const [board, setBoard] = useState<number[][]>([]);
  const [emptyPos, setEmptyPos] = useState<[number, number]>([size - 1, size - 1]);
  const [initializing, setInitializing] = useState(true);

  // Initialize the board with shuffled tiles
  const initBoard = useCallback(() => {
    setInitializing(true);
    const flatBoard = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    flatBoard.push(0); // Add the empty tile
    
    // Shuffle until we have a solvable puzzle
    let shuffled = shuffle(flatBoard, size);
    
    // Convert flat array to 2D grid
    const newBoard: number[][] = [];
    let emptyRow = 0;
    let emptyCol = 0;
    
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        const value = shuffled[i * size + j];
        row.push(value);
        if (value === 0) {
          emptyRow = i;
          emptyCol = j;
        }
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
    setEmptyPos([emptyRow, emptyCol]);
    
    setTimeout(() => {
      setInitializing(false);
      onBoardInitialized();
    }, 500);
  }, [size, onBoardInitialized]);

  // Check if the puzzle is solved
  const checkComplete = useCallback(() => {
    if (!board.length) return false;
    
    // Check if the board is in order
    const flatBoard = board.flat();
    for (let i = 0; i < flatBoard.length - 1; i++) {
      if (flatBoard[i] !== i + 1) return false;
    }
    
    return flatBoard[flatBoard.length - 1] === 0;
  }, [board]);

  // Move a tile if it's adjacent to the empty space
  const moveTile = (row: number, col: number) => {
    const [emptyRow, emptyCol] = emptyPos;
    
    // Check if tile is adjacent to empty space
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) || 
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);
      
    if (!isAdjacent || isComplete) return;
    
    // Move the tile
    const newBoard = [...board.map(row => [...row])];
    newBoard[emptyRow][emptyCol] = board[row][col];
    newBoard[row][col] = 0;
    
    setBoard(newBoard);
    setEmptyPos([row, col]);
    onMove();
  };

  // Initialize board on load and when size changes
  useEffect(() => {
    initBoard();
  }, [size, initBoard]);

  // Check for completion
  useEffect(() => {
    if (initializing || isComplete) return;
    
    if (checkComplete() && startTime) {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      onComplete(timeElapsed);
    }
  }, [board, checkComplete, initializing, isComplete, onComplete, startTime]);

  // Calculate the grid size based on the board dimension
  const gridTemplateColumns = `repeat(${size}, 1fr)`;
  const tileSizeClass = size === 3 ? "h-24 sm:h-28" : size === 4 ? "h-20 sm:h-24" : "h-16 sm:h-20";

  return (
    <div className="flex justify-center mb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md aspect-square p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg"
      >
        <div 
          className="grid gap-2 h-full w-full"
          style={{ gridTemplateColumns }}
        >
          <AnimatePresence>
            {board.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <Tile 
                  key={value === 0 ? `empty-${rowIndex}-${colIndex}` : `tile-${value}`}
                  value={value}
                  size={size}
                  row={rowIndex}
                  col={colIndex}
                  isMovable={value !== 0}
                  onClick={() => moveTile(rowIndex, colIndex)}
                  className={tileSizeClass}
                  initializing={initializing}
                  isComplete={isComplete}
                />
              ))
            )}
          </AnimatePresence>
        </div>
        
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="px-6 py-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-white/50"
            >
              <h3 className="text-xl font-semibold mb-2">Puzzle Solved!</h3>
              <button 
                onClick={resetGame}
                className="control-button w-full"
              >
                Play Again
              </button>
            </motion.div>
          </div>
        )}
        
        {/* Celebration particles */}
        {isComplete && Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`particle-${i}`}
            className="celebration-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default GameBoard;
