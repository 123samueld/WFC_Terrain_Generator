//Simulation.js
import { getInput } from './Input.js';
import { getCanvasContext } from './Initialise.js';

export function simulationLoop(gameStateBufferRead, gameStateBufferWrite) {
    const ctx = getCanvasContext();
    
    // Copy the read buffer to write buffer
    Object.assign(gameStateBufferWrite, gameStateBufferRead);
    
    // Get input state
    const input = getInput();
    
    // Update character position based on input
    const moveSpeed = 5;
    const { character, camera } = gameStateBufferWrite;
    
    // Define movement boundaries
    const leftBoundary = character.width / 2;
    const rightBoundary = (ctx.canvas.width / 3) - (character.width / 2);
    
    // Check if character is at a boundary
    const atLeftBoundary = character.x <= leftBoundary;
    const atRightBoundary = character.x >= rightBoundary;
    
    // Handle left movement
    if (input.keyboard.a) {
        if (atLeftBoundary) {
            // At left boundary, scroll background right
            camera.x -= moveSpeed;
        } else {
            // Not at boundary, move character left
            character.x -= moveSpeed;
        }
    }
    
    // Handle right movement
    if (input.keyboard.d) {
        if (atRightBoundary) {
            // At right boundary, scroll background left
            camera.x += moveSpeed;
        } else {
            // Not at boundary, move character right
            character.x += moveSpeed;
        }
    }
    
    // Update character vertical position
    if (input.keyboard.w) character.y -= moveSpeed;
    if (input.keyboard.s) character.y += moveSpeed;
    
    // Keep character within movement bounds
    character.x = Math.max(leftBoundary, Math.min(rightBoundary, character.x));
    character.y = Math.max(character.height / 2, Math.min(ctx.canvas.height - character.height / 2, character.y));
}