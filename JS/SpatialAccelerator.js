// SpatialAccelerator.js

let chunks = [];
let chunkWidth, chunkHeight, cols, rows;

export function initChunker(canvasWidth, canvasHeight) {
  cols = 24;
  rows = 16;
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
        height: chunkHeight,
        particles: []
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

export function clearChunkAssignments() {
  for (let chunk of chunks) {
    chunk.particles = [];
  }
}

export function assignParticlesToChunks(particleXs, particleYs) {
  clearChunkAssignments();

  for (let i = 0; i < particleXs.length; i++) {
    const x = particleXs[i];
    const y = particleYs[i];
    const col = Math.floor(x / chunkWidth);
    const row = Math.floor(y / chunkHeight);
    const chunkId = row * cols + col;

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      chunks[chunkId].particles.push(i);
    }
  }
}

export function getCurrentChunk(x, y) {
  // Given an x and y position, calculate and return the chunk ID the particle is currently in.
  // Return -1 if the coordinates fall outside valid chunk space.
}

export function getNeighbourChunks(chunkId) {
  // Given a chunk ID, calculate and return an array of the 8 neighboring chunk IDs.
  // Ignore chunks that would fall outside the grid.
}
