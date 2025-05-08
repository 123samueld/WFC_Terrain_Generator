// ProfilingTools.js
import { getCanvasContext } from './Initialise.js';
import { cartesianToIsometric, ISOMETRIC_TILE_WIDTH, ISOMETRIC_TILE_HEIGHT } from './Math.js';

// Constants for edge scrolling (matching Input.js)
const EDGE_ZONE_1 = 75;  // First buffer zone (0-75px)
const EDGE_ZONE_2 = 150; // Second buffer zone (75-150px)

export function drawDebugOverlay() {
    const ctx = getCanvasContext();
    
    // Draw first buffer zone (inner)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    
    // Left
    ctx.fillRect(0, 0, EDGE_ZONE_1, ctx.canvas.height);
    // Right
    ctx.fillRect(ctx.canvas.width - EDGE_ZONE_1, 0, EDGE_ZONE_1, ctx.canvas.height);
    // Top
    ctx.fillRect(0, 0, ctx.canvas.width, EDGE_ZONE_1);
    // Bottom
    ctx.fillRect(0, ctx.canvas.height - EDGE_ZONE_1, ctx.canvas.width, EDGE_ZONE_1);

    // Draw second buffer zone (outer)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    
    // Left
    ctx.fillRect(EDGE_ZONE_1, 0, EDGE_ZONE_2 - EDGE_ZONE_1, ctx.canvas.height);
    // Right
    ctx.fillRect(ctx.canvas.width - EDGE_ZONE_2, 0, EDGE_ZONE_2 - EDGE_ZONE_1, ctx.canvas.height);
    // Top
    ctx.fillRect(0, EDGE_ZONE_1, ctx.canvas.width, EDGE_ZONE_2 - EDGE_ZONE_1);
    // Bottom
    ctx.fillRect(0, ctx.canvas.height - EDGE_ZONE_2, ctx.canvas.width, EDGE_ZONE_2 - EDGE_ZONE_1);
}

export function drawGridOverlay(gameStateBufferRead) {
    const ctx = getCanvasContext();
    const gridSize = gameStateBufferRead.gridSize;
    
    // Set grid line style
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Draw grid lines
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Get isometric coordinates for this grid position
            const isoCoords = cartesianToIsometric(x, y);
            
            // Center the grid on the screen and apply camera offset
            const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x + 100;
            const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;
            
            // Draw grid cell using the same dimensions as tiles
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(screenX + ISOMETRIC_TILE_WIDTH/2, screenY + ISOMETRIC_TILE_HEIGHT/2);  // Right edge
            ctx.lineTo(screenX, screenY + ISOMETRIC_TILE_HEIGHT);                            // Bottom edge
            ctx.lineTo(screenX - ISOMETRIC_TILE_WIDTH/2, screenY + ISOMETRIC_TILE_HEIGHT/2);  // Left edge
            ctx.closePath();
            ctx.stroke();
        }
    }
}
