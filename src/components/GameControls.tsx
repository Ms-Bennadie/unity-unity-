
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shuffle, RefreshCw, Clock, MoveHorizontal, Target, Lightbulb } from "lucide-react";

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

  // Calculate difficulty rating
  const getDifficultyRating = () => {
    if (size === 3) return { level: "Easy", color: "text-green-400" };
    if (size === 4) return { level: "Medium", color: "text-yellow-400" };
    return { level: "Hard", color: "text-red-400" };
  };

  const difficulty = getDifficultyRating();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stats-card">
          <Clock className="h-5 w-5 mb-2 text-primary" />
          <div className="text-xs text-muted-foreground font-medium mb-1">TIME</div>
          <div className="text-lg font-bold tabular-nums">
            {formatTime(elapsedTime)}
          </div>
        </div>
        
        <div className="stats-card">
          <MoveHorizontal className="h-5 w-5 mb-2 text-primary" />
          <div className="text-xs text-muted-foreground font-medium mb-1">MOVES</div>
          <div className="text-lg font-bold tabular-nums">
            {moves}
          </div>
        </div>

        <div className="stats-card">
          <Target className="h-5 w-5 mb-2 text-primary" />
          <div className="text-xs text-muted-foreground font-medium mb-1">LEVEL</div>
          <div className={`text-sm font-bold ${difficulty.color}`}>
            {difficulty.level}
          </div>
        </div>
      </div>
      
      {/* Size Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-center">Choose Difficulty</h3>
        <div className="flex justify-center space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`control-button ${size === 3 ? 'bg-primary text-primary-foreground border-primary' : ''}`}
            onClick={() => onSizeChange(3)}
            disabled={!isBoardInitialized}
          >
            3×3
            <span className="text-xs ml-1 opacity-70">Easy</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`control-button ${size === 4 ? 'bg-primary text-primary-foreground border-primary' : ''}`}
            onClick={() => onSizeChange(4)}
            disabled={!isBoardInitialized}
          >
            4×4
            <span className="text-xs ml-1 opacity-70">Medium</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`control-button ${size === 5 ? 'bg-primary text-primary-foreground border-primary' : ''}`}
            onClick={() => onSizeChange(5)}
            disabled={!isBoardInitialized}
          >
            5×5
            <span className="text-xs ml-1 opacity-70">Hard</span>
          </motion.button>
        </div>
      </div>
      
      {/* New Game Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="control-button bg-secondary/80 hover:bg-secondary"
          onClick={resetGame}
          disabled={!isBoardInitialized}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          New Game
        </motion.button>
      </div>
      
      {/* Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4 border border-primary/20"
      >
        <div className="flex items-center mb-3">
          <Lightbulb className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-sm font-semibold">How to Play</h3>
        </div>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Tap tiles next to the empty space to move them</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Arrange numbers 1-{size * size - 1} in ascending order</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Complete the puzzle with the empty space in bottom-right</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default GameControls;
