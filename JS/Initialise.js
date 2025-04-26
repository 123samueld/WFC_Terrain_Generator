// Initialise.js
import { } from './Simulation.js';

let canvasRef, ctxRef;

export function initCanvas() {
  canvasRef = document.getElementById('sandCanvas');
  ctxRef = canvasRef.getContext('2d');

  canvasRef.width = 1200;
  canvasRef.height = 800;

}

export function getCanvasContext() {
  return ctxRef;
}

export function initGrid() {
  const cellSize = 4;

  if (!canvasRef) {
    throw new Error('Canvas not initialized. Call initCanvas() first.');
  }

  // Calculate number of columns and rows
  const cols = Math.floor(canvasRef.width / cellSize);
  const rows = Math.floor(canvasRef.height / cellSize);
  const totalCells = cols * rows;

  // Create a flat boolean array initialized to false
  const grid = new Array(totalCells).fill(false);

  return { cols, rows, cellSize, grid };
}