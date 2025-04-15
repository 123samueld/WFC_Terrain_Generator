// ProfilingTools.js
import { getChunks } from './SpatialAccelerator.js';

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
