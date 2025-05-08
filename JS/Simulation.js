//Simulation.js
import { getInput } from './Input.js';
import { getCanvasContext } from './Initialise.js';

export function simulationLoop(gameStateBufferRead, gameStateBufferWrite) {
    const ctx = getCanvasContext();
    
    // Copy the read buffer to write buffer
    Object.assign(gameStateBufferWrite, gameStateBufferRead);
    
    // Get input state
    const input = getInput();

    // Update camera position based on edge scrolling
    if (input.scroll.x !== 0) {
        gameStateBufferWrite.camera.x += input.scroll.x;
    }
    if (input.scroll.y !== 0) {
        gameStateBufferWrite.camera.y += input.scroll.y;
    }
}