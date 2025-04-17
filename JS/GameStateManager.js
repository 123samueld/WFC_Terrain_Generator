// GameStateManager.js

import { updatePhysics, simulateWater, simulateSand, simulateRock } from './Physics.js';

export const ParticleComponents = {
  id: [],
  type: [],
  x: [],
  y: [],
  mass: [],
  isMoving: []
};

export const ParticleTypeFrictionCoefficient = {
  water: { friction: 0.05 },
  sand: { friction: 0.4 },
  rock: { friction: 0.6 }
};

export const ParticleTypeMovementBehavior = {
  water: simulateWater,
  sand: simulateSand,
  rock: simulateRock
};

export const MovingParticles = []; // Tracks IDs of moving particles

export function updateGameStateSimulation() {
  updatePhysics(); // one clean call to process all physics
}
