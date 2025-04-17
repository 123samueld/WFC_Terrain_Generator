// ProfilingTools.js
import { getChunks } from './SpatialAccelerator.js';
import { ParticleComponents } from './GameStateManager.js';


let showChunkGrid = false;

export function initProfilingTools() {
  const toggleBtn = document.getElementById('toggleGrid');
  toggleBtn.addEventListener('click', () => {
    showChunkGrid = !showChunkGrid;
    toggleBtn.classList.toggle('active', showChunkGrid);
  });
}

export function drawChunkGrid(ctx) {
  if (!showChunkGrid) return;

  const chunks = getChunks();

  ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)'; // Pale yellow
  ctx.setLineDash([4, 4]);

  for (const chunk of chunks) {
    ctx.strokeRect(chunk.x, chunk.y, chunk.width, chunk.height);
  }

  ctx.setLineDash([]); // Reset
}

export function drawChunkHighlightForParticle(ctx) {
  if (!showChunkGrid) return; // Toggle with the chunk grid

  const chunks = getChunks();
  const x = ParticleComponents.x[0];
  const y = ParticleComponents.y[0];

  for (const chunk of chunks) {
    if (
      x >= chunk.x && x < chunk.x + chunk.width &&
      y >= chunk.y && y < chunk.y + chunk.height
    ) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'; // Light red overlay
      ctx.fillRect(chunk.x, chunk.y, chunk.width, chunk.height);
      break; // Only highlight one chunk
    }
  }
}
