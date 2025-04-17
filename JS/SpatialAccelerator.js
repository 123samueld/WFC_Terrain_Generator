// SpatialAccelerator.js

import { SandComponents } from './GameStateManager.js';

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
  const x = SandComponents.x[particleId];
  const y = SandComponents.y[particleId];

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
  const nearByChunks = [];

  const col = chunkId % cols;
  const row = Math.floor(chunkId / cols);

  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      const neighbourRow = row + dRow;
      const neighbourCol = col + dCol;

      // Check bounds
      if (
        neighbourCol >= 0 && neighbourCol < cols &&
        neighbourRow >= 0 && neighbourRow < rows
      ) {
        const neighbourId = neighbourRow * cols + neighbourCol;
        nearByChunks.push(neighbourId);
      }
    }
  }

  return nearByChunks;
}
