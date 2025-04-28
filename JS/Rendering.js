//Rendering.js
import { getCanvasContext } from './Initialise.js';

export function renderingLoop(gameStateBufferRead) {
    const ctx = getCanvasContext();
    const { camera } = gameStateBufferRead;
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw platforms
    const { platforms } = gameStateBufferRead;
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(
            platform.x - camera.x,
            platform.y,
            platform.width,
            platform.height
        );
    });
    
    // Draw character
    const { character } = gameStateBufferRead;
    ctx.fillStyle = character.color;
    ctx.fillRect(
        character.x - character.width / 2,
        character.y - character.height / 2,
        character.width,
        character.height
    );
}