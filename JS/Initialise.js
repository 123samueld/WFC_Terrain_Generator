// Initialise.js
import { initChunker } from './SpatialAccelerator.js';
import { ParticleComponents } from './GameStateManager.js';

let canvasRef, ctxRef;
let hasInitialisedParticles = false;


export function initCanvas() {
  canvasRef = document.getElementById('sandCanvas');
  ctxRef = canvasRef.getContext('2d');

  canvasRef.width = 1200;
  canvasRef.height = 800;

  initChunker(canvasRef.width, canvasRef.height);
  initParticles(canvasRef.width, canvasRef.height);

}

export function getCanvasContext() {
  return ctxRef;
}

export function initParticles(canvasWidth, canvasHeight) {
  if (hasInitialisedParticles) return; // Prevent double-init
  hasInitialisedParticles = true;
  const n = 500;

  for (let i = 0; i < n; i++) {
    ParticleComponents.id.push(i);
    ParticleComponents.type.push("sand");
    ParticleComponents.x.push(Math.floor(Math.random() * canvasWidth));
    ParticleComponents.y.push(Math.floor(Math.random() * canvasHeight));
    ParticleComponents.mass.push(1);
    ParticleComponents.isMoving.push(true);
  }
  console.log('Initialising particles');

}
