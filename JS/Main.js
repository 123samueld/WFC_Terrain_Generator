import { initCanvas } from './Initialise.js';
import { initProfilingTools } from './ProfilingTools.js';
import { renderingLoop } from './Rendering.js';
import { simulationLoop } from './Simulation.js';


document.addEventListener('DOMContentLoaded', () => {
  // Initialize the canvas after the DOM is fully loaded
  initCanvas();
  initProfilingTools();
});

let lastTimestamp = 0;

function gameLoop(timestamp) {

  //Iterate Simulation Loop
  simulationLoop();

  //Iterate Rendering Loop
  renderingLoop();

  // Request next frame
  requestAnimationFrame(gameLoop);
}


// Start the loop
requestAnimationFrame((timestamp) => {
  lastTimestamp = timestamp;
  gameLoop(timestamp);
});
