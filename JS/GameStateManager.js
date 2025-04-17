// GameStateManager.js

import { assignParticlesToChunks, getCurrentChunk, getNeighbourChunks, getChunks } from './SpatialAccelerator.js';


export const SandComponents = {
  id: [],
  x: [],
  y: [],
  mass: [],
  isMoving: []
};

export const MovingSandParticles = []; // Tracks IDs of moving particles

export function updateGameStateSimulation() {
  updateSandParticleCoordinate();
  processNeighbourLookups(); // Start the neighbour chain
}

function updateSandParticleCoordinate() {
  MovingSandParticles.length = 0;

  for (let i = 0; i < SandComponents.x.length; i++) {
    SandComponents.y[i] += 4;

    if (SandComponents.isMoving[i]) {
      MovingSandParticles.push(i);
    }
  }

  assignParticlesToChunks(SandComponents.x, SandComponents.y);
}

function processNeighbourLookups() {
  for (let i = 0; i < MovingSandParticles.length; i++) {
    const particleId = MovingSandParticles[i];
    getNeighbourParticles(particleId);
  }
}

export function getNeighbourParticles(particleId) {
  const x = SandComponents.x[particleId];
  const y = SandComponents.y[particleId];

  const currentChunkId = getCurrentChunk(x, y);
  if (currentChunkId === -1) return []; // Invalid position

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