import { initCanvas, initGrid } from './Initialise.js';
import { initProfilingTools } from './ProfilingTools.js';
import { renderingLoop } from './Rendering.js';
import { simulationLoop } from './Simulation.js';

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initProfilingTools();
  initGrid();
  gameLoop();
  // Initialize two game state buffers: gameStateBufferA and gameStateBufferB
  // Set gameStateBufferRead = A (initially for rendering)
  // Set gameStateBufferWrite = B (initially for simulation updates)});
});

let nextFrame = false; // Rendering sets this true when ready for a new frame

function gameLoop() {
  // 1. Run Simulation loop (simulate as fast as possible)
  simulationLoop(gameStateBufferRead, gameStateBufferWrite);

  // 2. Swap buffers only when Rendering signals it's safe
  if (nextFrame) {
    // Swap gameStateBufferRead and gameStateBufferWrite
    // Reset nextFrame = false
  }

  // 3. Run Rendering loop (~60fps / ~16.667ms)
  renderingLoop(gameStateBufferRead);

  // 4. Continue looping immediately
  gameLoop();
}
