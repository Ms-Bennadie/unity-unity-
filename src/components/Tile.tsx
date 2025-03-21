
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TileProps {
  value: number;
  size: number;
  row: number;
  col: number;
  isMovable: boolean;
  onClick: () => void;
  className?: string;
  initializing: boolean;
  isComplete: boolean;
}

export const Tile: React.FC<TileProps> = ({
  value,
  size,
  row,
  col,
  isMovable,
  onClick,
  className,
  initializing,
  isComplete,
}) => {
  if (value === 0) {
    return (
      <motion.div
        key={`empty-${row}-${col}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn("rounded-xl", className)}
      />
    );
  }

  // Calculate if the tile is in the correct position
  const correctRow = Math.floor((value - 1) / size);
  const correctCol = (value - 1) % size;
  const isCorrect = row === correctRow && col === correctCol;

  // Variants for tile animations
  const variants = {
    hidden: { 
      opacity: 0,
      scale: 0.8 
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
        type: "spring",
        stiffness: 250,
        damping: 20
      }
    }),
    correct: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 1px 3px rgba(0,0,0,0.1)",
        "0 10px 15px -5px rgba(59,130,246,0.5)",
        "0 1px 3px rgba(0,0,0,0.1)"
      ],
      transition: {
        duration: 0.4,
        times: [0, 0.5, 1],
        delay: 0.1
      }
    }
  };

  return (
    <motion.button
      layout
      key={`tile-${value}`}
      custom={value}
      variants={variants}
      initial="hidden"
      animate={initializing ? "visible" : isCorrect && isComplete ? "correct" : "visible"}
      whileHover={isMovable && !isComplete ? { scale: 1.03 } : {}}
      whileTap={isMovable && !isComplete ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={!isMovable || isComplete}
      className={cn(
        "tile",
        isMovable && !isComplete && "tile-movable",
        isCorrect && "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/20",
        className
      )}
    >
      <span className={cn(
        "text-2xl font-semibold",
        isCorrect ? "text-primary" : "text-foreground"
      )}>
        {value}
      </span>
    </motion.button>
  );
};
