
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tile } from "@/components/Tile";
import { shuffle } from "@/lib/gameUtils";
import { Trophy, Sparkles } from "lucide-react";

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
  const [progress, setProgress] = useState(0);

  // Calculate progress based on correctly placed tiles
  const calculateProgress = useCallback(() => {
    if (!board.length) return 0;
    
    let correctTiles = 0;
    const totalTiles = size * size - 1; // Exclude empty tile
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const value = board[i][j];
        if (value !== 0) {
          const correctRow = Math.floor((value - 1) / size);
          const correctCol = (value - 1) % size;
          if (i === correctRow && j === correctCol) {
            correctTiles++;
          }
        }
      }
    }
    
    return (correctTiles / totalTiles) * 100;
  }, [board, size]);

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

  // Update progress when board changes
  useEffect(() => {
    if (!initializing) {
      setProgress(calculateProgress());
    }
  }, [board, calculateProgress, initializing]);

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
  const tileSizeClass = size === 3 ? "h-20 sm:h-24" : size === 4 ? "h-16 sm:h-20" : "h-12 sm:h-16";

  return (
    <div className="flex flex-col items-center mb-6 space-y-4">
      {/* Progress Bar */}
      {!initializing && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progress</span>
            <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="progress-indicator">
            <motion.div 
              className="progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Game Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md aspect-square p-4 game-card"
      >
        <div 
          className="grid gap-3 h-full w-full"
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center p-6"
            >
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-primary">Puzzle Solved!</h3>
              <p className="text-muted-foreground mb-6">Congratulations! 🎉</p>
              <motion.button 
                onClick={resetGame}
                className="control-button bg-primary text-primary-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        
        {/* Enhanced celebration particles */}
        {isComplete && Array.from({ length: 30 }).map((_, i) => (
          <motion.div 
            key={`particle-${i}`}
            className="celebration-particle"
            initial={{ 
              opacity: 0,
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -100, -200],
              scale: [0, 1, 0.5],
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 0.5,
              ease: "easeOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default GameBoard;
