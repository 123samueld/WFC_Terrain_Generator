// Main.js

import { initCanvas } from './Initialise.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the canvas after the DOM is fully loaded
  initCanvas();
});

let lastTime = 0;

function gameLoop(timestamp) {
  // Calculate time difference for smooth animation
  let deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Update canvas content (if needed)
  // You can add more update functions here as your simulation grows

  // Request next animation frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);
