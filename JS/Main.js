import FPSCounter from './FPSCounter.js';
import { initCanvas, getCanvasContext } from './Initialise.js';
import { initProfilingTools, drawChunkGrid } from './ProfilingTools.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the canvas after the DOM is fully loaded
  initCanvas();
  initProfilingTools();
});

const fpsDisplayElement = document.getElementById('fpsDisplay');
const fpsCounter = new FPSCounter(fpsDisplayElement);

let lastTimestamp = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert ms to seconds
  lastTimestamp = timestamp;

  // Update FPS counter
  fpsCounter.updateFrame(timestamp);


  const ctx = getCanvasContext();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw debug chunk grid if enabled
  drawChunkGrid(ctx);

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame((timestamp) => {
  lastTimestamp = timestamp;
  gameLoop(timestamp);
});
