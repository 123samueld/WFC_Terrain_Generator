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
  getChunks
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
  if (currentChunkId === -1) return;

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

  // Future: apply collision or neighbor interactions
  // e.g. checkCollisions(particleId, neighbours);
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
export  function simulateSand(particleId) {
    ParticleComponents.y[particleId] += 4;
}