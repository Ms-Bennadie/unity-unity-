
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shuffle, RefreshCw, Clock, MoveHorizontal } from "lucide-react";

interface GameControlsProps {
  size: number;
  onSizeChange: (size: number) => void;
  moves: number;
  startTime: number | null;
  isComplete: boolean;
  resetGame: () => void;
  isBoardInitialized: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  size,
  onSizeChange,
  moves,
  startTime,
  isComplete,
  resetGame,
  isBoardInitialized
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Timer logic
  useEffect(() => {
    if (!startTime || isComplete) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, isComplete]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/40 shadow-sm">
        <div className="flex flex-col items-center justify-center p-3 bg-white/80 rounded-md">
          <div className="text-xs text-muted-foreground font-medium mb-1 flex items-center">
            <Clock className="h-3 w-3 mr-1 opacity-70" />
            TIME
          </div>
          <div className="text-xl font-semibold tabular-nums">
            {formatTime(elapsedTime)}
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-3 bg-white/80 rounded-md">
          <div className="text-xs text-muted-foreground font-medium mb-1 flex items-center">
            <MoveHorizontal className="h-3 w-3 mr-1 opacity-70" />
            MOVES
          </div>
          <div className="text-xl font-semibold tabular-nums">
            {moves}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={`control-button ${size === 3 ? 'bg-white text-primary' : ''}`}
            onClick={() => onSizeChange(3)}
            disabled={!isBoardInitialized}
          >
            3×3
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={`control-button ${size === 4 ? 'bg-white text-primary' : ''}`}
            onClick={() => onSizeChange(4)}
            disabled={!isBoardInitialized}
          >
            4×4
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className={`control-button ${size === 5 ? 'bg-white text-primary' : ''}`}
            onClick={() => onSizeChange(5)}
            disabled={!isBoardInitialized}
          >
            5×5
          </motion.button>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="control-button"
          onClick={resetGame}
          disabled={!isBoardInitialized}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Game
        </motion.button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-t border-border/50 pt-4"
      >
        <h3 className="text-sm font-medium mb-2">How to Play:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Click tiles adjacent to the empty space to move them.</li>
          <li>• Arrange numbers in ascending order.</li>
          <li>• The puzzle is solved when all numbers are in order and the empty space is in the bottom right.</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default GameControls;
