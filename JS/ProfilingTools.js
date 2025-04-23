// ProfilingTools.js
import { getChunks } from './SpatialAccelerator.js';
import { ParticleComponents, MovingParticles } from './Simulation.js';

let showChunkGrid = false;
let fpsDisplayElement = null;
let fpsFrames = 0;
let fpsLastTime = Date.now();

// Initialize profiling tools UI and behaviors
export function initProfilingTools() {
  // Grid toggle button
  const toggleBtn = document.getElementById('toggleGrid');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      showChunkGrid = !showChunkGrid;
      toggleBtn.classList.toggle('active', showChunkGrid);
    });
  }

  // FPS display element
  fpsDisplayElement = document.getElementById('fpsDisplay');
}

/**
 * Call fpsCounter() once per frame. The first call initializes timers and
 * display; subsequent calls increment frame count and update display every second.
 */
export function fpsCounter() {
  if (!fpsDisplayElement) return;

  // Initialize on first call
  if (fpsFrames === null) {
    fpsFrames = 0;
    fpsLastTime = Date.now();
  }

  // Count this frame
  fpsFrames++;
  const now = Date.now();
  const delta = now - fpsLastTime;

  // Update display every second
  if (delta >= 1000) {
    const fps = fpsFrames;
    fpsFrames = 0;
    fpsLastTime = now;
    const span = fpsDisplayElement.querySelector('span');
    if (span) span.textContent = `FPS: ${fps}`;
  }
}

// Draw the chunk partition grid on the canvas
export function drawChunkGrid(ctx) {
  if (!showChunkGrid) return;
  const chunks = getChunks();
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
  ctx.setLineDash([4, 4]);
  for (const chunk of chunks) {
    ctx.strokeRect(chunk.x, chunk.y, chunk.width, chunk.height);
  }
  ctx.setLineDash([]);
}

// Highlight the chunk containing the first particle
export function drawChunkHighlightForParticle(ctx) {
  if (!showChunkGrid) return;
  const chunks = getChunks();
  const x = ParticleComponents.x[0];
  const y = ParticleComponents.y[0];
  for (const chunk of chunks) {
    if (
      x >= chunk.x && x < chunk.x + chunk.width &&
      y >= chunk.y && y < chunk.y + chunk.height
    ) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fillRect(chunk.x, chunk.y, chunk.width, chunk.height);
      break;
    }
  }
}

// Update the DOM display for moving particle count
export function updateParticleCountDisplay() {
  const display = document.getElementById('particleDisplay');
  if (!display) return;
  const count = MovingParticles.length;
  const span = display.querySelector('span');
  if (span) span.innerHTML = `Moving Particles: <br>${count}`;
}
