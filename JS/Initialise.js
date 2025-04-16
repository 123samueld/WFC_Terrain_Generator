// Initialise.js
import { initChunker } from './SpatialAccelerator.js';
import { SandComponents } from './GameStateManager.js';

let canvasRef, ctxRef;
let hasInitialisedSand = false;


export function initCanvas() {
  canvasRef = document.getElementById('sandCanvas');
  ctxRef = canvasRef.getContext('2d');

  canvasRef.width = 1200;
  canvasRef.height = 800;

  initChunker(canvasRef.width, canvasRef.height);
  initSandParticles(canvasRef.width, canvasRef.height);

}

export function getCanvasContext() {
  return ctxRef;
}

export function initSandParticles(canvasWidth, canvasHeight) {
  if (hasInitialisedSand) return; // Prevent double-init
  hasInitialisedSand = true;
  const n = 500;

  for (let i = 0; i < n; i++) {
    SandComponents.id.push(i);
    SandComponents.x.push(Math.floor(Math.random() * canvasWidth));
    SandComponents.y.push(Math.floor(Math.random() * canvasHeight));
    SandComponents.mass.push(1);
    SandComponents.isMoving.push(true);
  }
  console.log('Initialising particles');

}
