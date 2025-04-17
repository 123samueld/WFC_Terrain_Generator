// SpatialAccelerator.js

import { ParticleComponents } from './GameStateManager.js';

let chunks = [];
let chunkWidth, chunkHeight, cols, rows;

// The "Chunker" is a way to partition the canvas into smaller chunks. This allows a rough pass neighbour check making a detailed pass
// neighbour check less expensive in CPU resources.
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

export function assignParticlesToChunks(particleX, particleY) {
  clearChunkAssignments();

  for (let i = 0; i < particleX.length; i++) {
    const x = particleX[i];
    const y = particleY[i];
    const col = Math.floor(x / chunkWidth);
    const row = Math.floor(y / chunkHeight);
    const chunkId = row * cols + col;

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      chunks[chunkId].particles.push(i);
    }
  }
}

export function getCurrentChunk(particleId) {
  const x = ParticleComponents.x[particleId];
  const y = ParticleComponents.y[particleId];

  const col = Math.floor(x / chunkWidth);
  const row = Math.floor(y / chunkHeight);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    const chunkId = row * cols + col;
    return chunkId;
  } else {
    return -1; // Invalid position (outside canvas)
  }
}

export function getNeighbourChunks(chunkId) {
  const nearbyChunks = [];

  const row = Math.floor(chunkId / cols);
  const col = chunkId % cols;

  // Directional offsets: current, left, right, below-left, below, below-right
  const offsets = [
    [0, 0],   // current
    [0, -1],  // left
    [0, 1],   // right
    [1, -1],  // below-left
    [1, 0],   // below
    [1, 1],   // below-right
  ];

  for (const [dRow, dCol] of offsets) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      const neighborId = newRow * cols + newCol;
      nearbyChunks.push(neighborId);
    }
  }

  return nearbyChunks;
}
