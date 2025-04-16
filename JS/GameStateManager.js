// GameStateManager.js

import { assignParticlesToChunks } from './SpatialAccelerator.js';

export const SandComponents = {
  id: [],
  x: [],
  y: [],
  mass: [],
  isMoving: []
};

export const MovingSandParticleIDs = []; // New array to store IDs of moving particles

export function updateGameStateSimulation() {
  updateSandParticleCoordinate();
}

function updateSandParticleCoordinate() {
  MovingSandParticleIDs.length = 0; // Clear previous frame

  for (let i = 0; i < SandComponents.x.length; i++) {
    SandComponents.y[i] += 4;

    if (SandComponents.isMoving[i]) {
      MovingSandParticleIDs.push(SandComponents.id[i]);
    }
  }

  assignParticlesToChunks(SandComponents.x, SandComponents.y);
}

export function getNeighbourParticles(particleId) {
  // Given a sand particle ID:
  // 1. Use its coordinates to find its current chunk.
  // 2. Get the 8 neighboring chunk IDs.
  // 3. Collect and return all sand particle IDs in those 8 chunks.
  // This will be used for localized interaction checks.
}
