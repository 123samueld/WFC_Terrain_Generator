let chunks = [];
let chunkWidth, chunkHeight, cols, rows;

export function initChunker(canvasWidth, canvasHeight) {
  cols = 12;
  rows = 8;
  chunkWidth = canvasWidth / cols;
  chunkHeight = canvasHeight / rows;

  chunks = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      chunks.push({
        id: row * cols + col,
        x: col * chunkWidth,
        y: row * chunkHeight,
        width: chunkWidth,
        height: chunkHeight
      });
    }
  }
}

export function getChunks() {
  return chunks;
}

export function getChunkDimensions() {
  return { cols, rows, chunkWidth, chunkHeight };
}
