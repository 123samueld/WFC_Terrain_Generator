// Physics.js

import { 
    ParticleComponents, 
    MovingParticles,
    ParticleTypeFrictionCoefficient,
    ParticleTypeMovementBehavior
} from './GameStateManager.js';

import {
  assignParticlesToChunks,
  getCurrentChunk,
  getNeighbourChunks,
  getChunks,
  cols, 
  rows,
  chunkHeight,
  chunkWidth
} from './SpatialAccelerator.js';

export function updatePhysics() {
  updateMovingParticles();
  updateParticleCoordinates();
  processNeighbourLookups();
}

// Keep MovingParticles array up to date each frame
export function updateMovingParticles() {
    MovingParticles.length = 0; // Clear list each frame
  
    for (let i = 0; i < ParticleComponents.isMoving.length; i++) {
      if (ParticleComponents.isMoving[i]) {
        MovingParticles.push(i);
      }
    }
  }
  

// Function to update all particle coordinates based on type and behavior
function updateParticleCoordinates() {
    for (let i = 0; i < MovingParticles.length; i++) {
      const id = MovingParticles[i];
      const particleType = ParticleComponents.type[id];
      const movementBehavior = ParticleTypeMovementBehavior[particleType];
  
      if (movementBehavior) {
        movementBehavior(id);
      }
    }
  
    assignParticlesToChunks(ParticleComponents.x, ParticleComponents.y);
  }
  

function processNeighbourLookups() {
  for (let i = 0; i < MovingParticles.length; i++) {
    const id = MovingParticles[i];
    getNeighbourParticles(id);
  }
}

function getNeighbourParticles(particleId) {
  const x = ParticleComponents.x[particleId];
  const y = ParticleComponents.y[particleId];

  const currentChunkId = getCurrentChunk(particleId);
  if (currentChunkId === -1) return [];

  const nearbyChunkIds = getNeighbourChunks(currentChunkId);
  const allChunks = getChunks();

  const neighbours = [];

  for (const chunkId of nearbyChunkIds) {
    const particlesInChunk = allChunks[chunkId].particles;
    for (const otherId of particlesInChunk) {
      if (otherId !== particleId) {
        neighbours.push(otherId);
      }
    }
  }

  return neighbours;
}


// Particle Type Movement Behavior functions


// Rock behavior (does nothing, obstructs movement)
export function simulateRock(particleId) {
    // No movement logic for rocks, they are stationary
    ParticleComponents.isMoving[particleId] = false;
}

// Water movement behavior (you can expand this with specific water movement logic)
export function simulateWater(particleId) {
    ParticleComponents.y[particleId] += 2;
}
  
// Sand movement behavior (e.g., move downward with some friction)
export function simulateSand(particleId) {
  const x = ParticleComponents.x[particleId];
  const y = ParticleComponents.y[particleId];

  // Get current chunk info
  const currentChunkId = getCurrentChunk(particleId);
  if (currentChunkId === -1) {
    ParticleComponents.isMoving[particleId] = false;
    return;
  }

  const currentChunk = getChunks()[currentChunkId];

  // === 1. Check current chunk for a particle directly below ===
  for (const id of currentChunk.particles) {
    if (id === particleId) continue;

    const nx = ParticleComponents.x[id];
    const ny = ParticleComponents.y[id];

    if (nx === x && ny === y + 1) {
      // Found blocking particle directly below in same chunk
      // Check bottom-left or bottom-right randomly
      const directions = Math.random() < 0.5 ? [-1, 1] : [1, -1];

      for (const dx of directions) {
        const tx = x + dx;
        const ty = y + 1;

        let blocked = false;
        for (const otherId of currentChunk.particles) {
          if (ParticleComponents.x[otherId] === tx && ParticleComponents.y[otherId] === ty) {
            blocked = true;
            break;
          }
        }

        if (!blocked) {
          // Move diagonally
          ParticleComponents.x[particleId] = tx;
          ParticleComponents.y[particleId] = ty;
          return;
        }
      }

      // Couldn’t move diagonally either
      ParticleComponents.isMoving[particleId] = false;
      return;
    }
  }

  // === 2. Check the chunk below for a particle directly below ===
  const currentRow = Math.floor(y / chunkHeight);
  const currentCol = Math.floor(x / chunkWidth);
  const belowRow = currentRow + 1;

  if (belowRow < rows) {
    const belowChunkId = belowRow * cols + currentCol;
    const belowChunk = getChunks()[belowChunkId];

    for (const id of belowChunk.particles) {
      const nx = ParticleComponents.x[id];
      const ny = ParticleComponents.y[id];

      if (nx === x && ny === y + 1) {
        // Found blocking particle directly below in chunk below
        ParticleComponents.isMoving[particleId] = false;
        return;
      }
    }
  }

  // === No particle below, move down ===
  ParticleComponents.y[particleId] += 1;
}
