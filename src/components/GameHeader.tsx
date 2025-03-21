
import { motion } from "framer-motion";
import { Gamepad2Icon } from "lucide-react";

const GameHeader = () => {
  return (
    <div className="flex flex-col items-center mb-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold mb-2"
      >
        <Gamepad2Icon size={16} className="text-primary" />
        <span>Puzzle Game</span>
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
      >
        Unity
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="text-sm text-muted-foreground mt-2 text-center max-w-sm"
      >
        Arrange the tiles in ascending order, with the empty space in the bottom right corner.
      </motion.p>
    </div>
  );
};

export default GameHeader;
