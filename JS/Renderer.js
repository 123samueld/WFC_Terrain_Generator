import { SandComponents } from './GameStateManager.js';

export function drawSandParticles(ctx) {
  ctx.fillStyle = 'sandybrown'; // or whatever sand color you like

  const size = 2; // Size of the particle square

  for (let i = 0; i < SandComponents.x.length; i++) {
    const x = SandComponents.x[i];
    const y = SandComponents.y[i];
    ctx.fillRect(x, y, size, size);
  }
}
