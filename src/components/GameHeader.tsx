
import { motion } from "framer-motion";

const GameHeader = () => {
  return (
    <div className="flex flex-col items-center mb-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1"
      >
        Puzzle Game
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="text-3xl sm:text-4xl font-semibold tracking-tight"
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
