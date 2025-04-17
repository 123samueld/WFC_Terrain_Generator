import { ParticleComponents } from './GameStateManager.js';

export function drawParticles(ctx) {
  ctx.fillStyle = 'sandybrown'; // or whatever sand color you like

  const size = 2; // Size of the particle square

  for (let i = 0; i < ParticleComponents.x.length; i++) {
    const x = ParticleComponents.x[i];
    const y = ParticleComponents.y[i];
    ctx.fillRect(x, y, size, size);
  }
}
