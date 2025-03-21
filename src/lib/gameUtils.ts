
/**
 * Shuffles an array of tiles and ensures the resulting puzzle is solvable
 */
export function shuffle(array: number[], size: number): number[] {
  const result = [...array];
  let currentIndex = result.length;

  // Fisher-Yates shuffle algorithm
  while (currentIndex > 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex], result[currentIndex]
    ];
  }

  // Check if the puzzle is solvable, if not, make it solvable
  if (!isSolvable(result, size)) {
    // Swap the first two non-empty tiles to change parity
    const firstIndex = result.findIndex(x => x !== 0);
    const secondIndex = result.findIndex((x, i) => x !== 0 && i > firstIndex);
    
    if (firstIndex !== -1 && secondIndex !== -1) {
      [result[firstIndex], result[secondIndex]] = [
        result[secondIndex], result[firstIndex]
      ];
    }
  }

  return result;
}

/**
 * Determines if a puzzle is solvable
 * 
 * For a puzzle to be solvable:
 * - For odd grid sizes: the number of inversions must be even
 * - For even grid sizes: the number of inversions + row of empty tile (from bottom) must be odd
 */
function isSolvable(tiles: number[], size: number): boolean {
  const inversions = countInversions(tiles);
  
  if (size % 2 === 1) {
    // For odd grid sizes
    return inversions % 2 === 0;
  } else {
    // For even grid sizes
    const emptyTileIndex = tiles.indexOf(0);
    const emptyTileRow = Math.floor(emptyTileIndex / size);
    const rowFromBottom = size - emptyTileRow;
    
    return (inversions + rowFromBottom) % 2 === 1;
  }
}

/**
 * Counts inversions in the tile array
 * An inversion is when a tile precedes another tile with a lower number
 */
function countInversions(tiles: number[]): number {
  let inversions = 0;
  const tilesWithoutEmpty = tiles.filter(t => t !== 0);
  
  for (let i = 0; i < tilesWithoutEmpty.length; i++) {
    for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
      if (tilesWithoutEmpty[i] > tilesWithoutEmpty[j]) {
        inversions++;
      }
    }
  }
  
  return inversions;
}
