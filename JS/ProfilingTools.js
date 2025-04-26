// ProfilingTools.js
import {  } from './Simulation.js';

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

// Find duration of simulationLoop()
// Use to time match to each renderingLoop() cycle.
