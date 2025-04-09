// Main.js

import FPSCounter from './FPSCounter.js';
import { initCanvas } from './Initialise.js';
import { heavyComputation } from './ProfilingTools.js';


document.addEventListener('DOMContentLoaded', () => {
  // Initialize the canvas after the DOM is fully loaded
  initCanvas();
});

// Get the FPS container element
const fpsDisplayElement = document.getElementById('fpsDisplay');

// Initialize FPS counter
const fpsCounter = new FPSCounter(fpsDisplayElement);

function gameLoop(timestamp) {
  // Update FPS counter with the current timestamp
  fpsCounter.updateFrame(timestamp);


   // Call the heavy computation function to simulate a CPU-bound task
  heavyComputation(30);  // Run heavy computation for n milliseconds
  
  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
