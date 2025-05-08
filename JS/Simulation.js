//Simulation.js
import { getInput } from './Input.js';
import { getCanvasContext } from './Initialise.js';

export function simulationLoop(gameStateBufferRead, gameStateBufferWrite) {
    const ctx = getCanvasContext();
    
    // Copy the read buffer to write buffer
    Object.assign(gameStateBufferWrite, gameStateBufferRead);
    
    // Get input state
    const input = getInput();


}