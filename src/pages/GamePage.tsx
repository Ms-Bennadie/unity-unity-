
import React, { useState } from "react";
import GameBoard from "@/components/GameBoard";
import GameControls from "@/components/GameControls";
import GameHeader from "@/components/GameHeader";
import { useToast } from "@/components/ui/use-toast";

const GamePage = () => {
  const [size, setSize] = useState(3);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isBoardInitialized, setIsBoardInitialized] = useState(false);
  const { toast } = useToast();

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    resetGame();
  };

  const resetGame = () => {
    setMoves(0);
    setStartTime(null);
    setIsComplete(false);
    setIsBoardInitialized(false);
  };

  const handleMove = () => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setMoves((prev) => prev + 1);
  };

  const handleGameComplete = (time: number) => {
    setIsComplete(true);
    toast({
      title: "Puzzle Solved!",
      description: `You completed the puzzle in ${time} seconds with ${moves} moves.`,
      duration: 5000,
    });
  };

  const handleBoardInitialized = () => {
    setIsBoardInitialized(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-8 overflow-x-hidden">
      <div className="w-full max-w-md animate-fade-in">
        <div className="space-y-6">
          <GameHeader />
          <GameBoard 
            size={size} 
            onMove={handleMove} 
            onComplete={handleGameComplete} 
            isComplete={isComplete}
            startTime={startTime}
            resetGame={resetGame}
            onBoardInitialized={handleBoardInitialized}
          />
          <GameControls 
            size={size} 
            onSizeChange={handleSizeChange} 
            moves={moves}
            startTime={startTime}
            isComplete={isComplete}
            resetGame={resetGame}
            isBoardInitialized={isBoardInitialized}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
