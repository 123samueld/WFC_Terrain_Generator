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

export const ParticleTypeColors = {
  water: 'deepskyblue',
  sand: 'sandybrown',
  rock: ['#555', '#666', '#777', '#888', '#999'] // 5 Shades of grey
};

export function initParticles(canvasWidth, canvasHeight) {
  if (hasInitialisedParticles) return;
  hasInitialisedParticles = true;

  const n = 5000;

  for (let i = 0; i < n; i++) {
    ParticleComponents.id.push(i);
    ParticleComponents.type.push("sand");
    ParticleComponents.x.push(Math.floor(Math.random() * canvasWidth));
    ParticleComponents.y.push(Math.floor(Math.random() * canvasHeight));
    ParticleComponents.mass.push(1);
    ParticleComponents.isMoving.push(true);
    ParticleComponents.colour.push(ParticleTypeColors.sand);
  }

  // Solid bottom layer of rock: 5 pixels tall
  for (let y = canvasHeight - 5; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      const rockShades = ParticleTypeColors.rock;
      const shade = rockShades[Math.floor(Math.random() * rockShades.length)];

      ParticleComponents.id.push(ParticleComponents.id.length);
      ParticleComponents.type.push("rock");
      ParticleComponents.x.push(x);
      ParticleComponents.y.push(y);
      ParticleComponents.mass.push(1);
      ParticleComponents.isMoving.push(false);
      ParticleComponents.colour.push(shade);
    }
  }
}