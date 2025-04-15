// Initialise.js
import { initChunker } from './SpatialAccelerator.js';

// Add to Initialise.js
let canvasRef, ctxRef;

export function initCanvas() {
  canvasRef = document.getElementById('sandCanvas');
  ctxRef = canvasRef.getContext('2d');

  canvasRef.width = 1200;
  canvasRef.height = 800;

  initChunker(canvasRef.width, canvasRef.height);
}

export function getCanvasContext() {
  return ctxRef;
}
