import FPSCounter from './FPSCounter.js';
import { initCanvas, getCanvasContext } from './Initialise.js';
import { initProfilingTools, drawChunkGrid, drawChunkHighlightForParticle, updateParticleCountDisplay } from './ProfilingTools.js';
import { drawDynamicParticles, drawStaticParticles } from './Renderer.js';
import { updateGameStateSimulation } from './GameStateManager.js';


document.addEventListener('DOMContentLoaded', () => {
  // Initialize the canvas after the DOM is fully loaded
  initCanvas();
  initProfilingTools();
});

const fpsDisplayElement = document.getElementById('fpsDisplay');
const fpsCounter = new FPSCounter(fpsDisplayElement);

let lastTimestamp = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTimestamp) / 1000; 

  // Update FPS counter
  fpsCounter.updateFrame(timestamp);

  // Core game simulation loop call
  updateGameStateSimulation();

  // Render particles
  const ctx = getCanvasContext();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawStaticParticles(ctx); 
  drawDynamicParticles(ctx);

  // Debug overlays
  drawChunkGrid(ctx);
  drawChunkHighlightForParticle(ctx);
  updateParticleCountDisplay();


  // Request next frame
  requestAnimationFrame(gameLoop);
}


// Start the loop
requestAnimationFrame((timestamp) => {
  lastTimestamp = timestamp;
  gameLoop(timestamp);
});
