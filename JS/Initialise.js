// Initialise.js
import { } from './Simulation.js';
import { inputState, handleKeyDown, handleKeyUp, handleMouseMove } from './Input.js';

let canvasRef, ctxRef;
let gameStateBufferA;
let gameStateBufferB;
let gameStateBufferRead;
let gameStateBufferWrite;

export function getGameStateBuffers() {
    return {
        read: gameStateBufferRead,
        write: gameStateBufferWrite
    };
}

export function initCanvas() {
  canvasRef = document.getElementById('gameCanvas');
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

// Set up keyboard event listeners
function initKeyboard() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

// Set up mouse event listeners
function initMouse() {
    window.addEventListener('mousemove', handleMouseMove);
}

export function initInput() {
    initKeyboard();
    initMouse();
}

export function initGameState() {
    const grid = initGrid();
    gameStateBufferA = { 
        ...grid,
        character: {
            x: canvasRef.width / 2,
            y: canvasRef.height / 2,
            width: 40,
            height: 80,
            color: '#0000FF'
        },
        camera: {
            x: 0
        },
        platforms: [
            // Visible platforms
            {
                x: 0,
                y: canvasRef.height - 100,
                width: canvasRef.width,
                height: 20,
                color: '#00FF00'
            },
            {
                x: 200,
                y: canvasRef.height - 300,
                width: 400,
                height: 20,
                color: '#00FF00'
            },
            {
                x: 600,
                y: canvasRef.height - 500,
                width: 400,
                height: 20,
                color: '#00FF00'
            },
            // Off-screen platforms
            {
                x: canvasRef.width + 200,
                y: canvasRef.height - 200,
                width: 400,
                height: 20,
                color: '#00FF00'
            },
            {
                x: canvasRef.width + 800,
                y: canvasRef.height - 400,
                width: 400,
                height: 20,
                color: '#00FF00'
            },
            {
                x: -400,
                y: canvasRef.height - 200,
                width: 400,
                height: 20,
                color: '#00FF00'
            },
            {
                x: -800,
                y: canvasRef.height - 400,
                width: 400,
                height: 20,
                color: '#00FF00'
            }
        ]
    };
    gameStateBufferB = { ...gameStateBufferA };
    gameStateBufferRead = gameStateBufferA;
    gameStateBufferWrite = gameStateBufferB;
}