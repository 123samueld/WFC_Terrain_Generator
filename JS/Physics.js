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
  updateParticleCoordinates();
  processNeighbourLookups();
}

// Function to update all particle coordinates based on type and behavior
function updateParticleCoordinates() {
    MovingParticles.length = 0; // Clear previous frame's moving particles
  
    for (let i = 0; i < ParticleComponents.x.length; i++) {
      // Check the type of particle and call the corresponding movement behavior
      const particleType = ParticleComponents.type[i];
      const movementBehavior = ParticleTypeMovementBehavior[particleType];
  
      if (movementBehavior) {
        movementBehavior(i); // Call the appropriate movement behavior
      }
  
      ParticleComponents.isMoving[i] = true;
      MovingParticles.push(i);
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
    // No movement logic for rocks, they stay stationary
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