// Renderer.js

import { ParticleComponents, MovingParticles } from './GameStateManager.js';

const size = 2;

export function drawStaticParticles(ctx) {
  for (let i = 0; i < ParticleComponents.x.length; i++) {
    if (!ParticleComponents.isMoving[i]) {
      ctx.fillStyle = ParticleComponents.colour[i] || 'black';
      ctx.fillRect(ParticleComponents.x[i], ParticleComponents.y[i], size, size);
    }
  }
}

export function drawDynamicParticles(ctx) {
  // Loop through the moving particles
  for (let i = 0; i < MovingParticles.length; i++) {
    const index = MovingParticles[i];
    
    ctx.fillStyle = ParticleComponents.colour[index] || 'black';
    ctx.fillRect(ParticleComponents.x[index],ParticleComponents.y[index], size, size);
  }
}



