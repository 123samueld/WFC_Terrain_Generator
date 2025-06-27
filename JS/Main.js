import { initCanvas, initGrid, initInput, initGameState, getGameStateBuffers, loadTerrainTiles } from './Initialise.js';
import {  } from './ProfilingTools.js';
import { renderingLoop } from './Rendering.js';
import { simulationLoop } from './Simulation.js';
import { getInput, updateCameraPosition, initEventListeners } from './Input.js';
import { buildMenu } from './BuildMenu.js';
import { GENERATION_STATE } from './TerrainGenerator/GenerationState.js';

let nextFrame = false; // Rendering sets this true when ready for a new frame

// Function to monitor generation state and show/hide popup
function updateGenerationPopup() {
    const generationPopup = document.getElementById('generationPopup');
    
    if (generationPopup) {
        if (GENERATION_STATE.isGenerating) {
            generationPopup.style.display = 'flex';
        } else {
            generationPopup.style.display = 'none';
        }
    }
}

// Function to monitor delete map state and show/hide popup
function updateDeleteMapPopup() {
    const deleteMapPopup = document.getElementById('deleteMapPopup');
    
    if (deleteMapPopup) {
        if (GENERATION_STATE.deleteMap) {
            deleteMapPopup.style.display = 'flex';
        } else {
            deleteMapPopup.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
  initCanvas();
  initGrid();
  initInput();
  initGameState();
  await loadTerrainTiles(); // Load terrain tiles before starting the game loop
  initEventListeners();
  
  // Set up interval to monitor generation state
  setInterval(updateGenerationPopup, 100); // Check every 100ms
  setInterval(updateDeleteMapPopup, 100); // Check every 100ms
  
  requestAnimationFrame(gameLoop);
});

function swapGameStateBuffers() {
  [gameStateBufferRead, gameStateBufferWrite] = [gameStateBufferWrite, gameStateBufferRead];
}

function gameLoop() {
  // Test input
  const input = getInput();

  // 1. Run Simulation loop (simulate as fast as possible)
  const buffers = getGameStateBuffers();
  simulationLoop(buffers.read, buffers.write);

  // 2. Swap buffers only when Rendering signals it's safe
  if (nextFrame) {
    swapGameStateBuffers();
    nextFrame = false;
  }

  // 3. Run Rendering loop (~60fps / ~16.667ms)
  renderingLoop(buffers.read);

  // 4. Update camera position based on input
  updateCameraPosition(buffers.write);

  // 5. Schedule next frame
  requestAnimationFrame(gameLoop);
}