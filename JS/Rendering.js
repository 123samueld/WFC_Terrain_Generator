//Rendering.js
import { getCanvasContext, getTerrainTiles } from './Initialise.js';
import { TileType } from './TerrainTile.js';
import { cartesianToIsometric, ISOMETRIC_TILE_WIDTH, ISOMETRIC_TILE_HEIGHT } from './Math.js';
import { drawGridOverlay } from './ProfilingTools.js';

export function renderingLoop(gameStateBufferRead) {
    const ctx = getCanvasContext();
    const terrainTiles = getTerrainTiles();
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw all tiles in the grid
    for (let y = 0; y < gameStateBufferRead.gridSize; y++) {
        for (let x = 0; x < gameStateBufferRead.gridSize; x++) {
            const tileType = gameStateBufferRead.getTile(x, y);
            if (tileType && terrainTiles[tileType]) {
                // Convert grid coordinates to isometric screen coordinates
                const isoCoords = cartesianToIsometric(x, y);
                
                // Center the tiles on the screen and apply camera offset
                const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x;
                const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;
                
                // Draw the tile
                terrainTiles[tileType].draw(ctx, screenX, screenY, 'isometric');
            }
        }
    }

    // Draw grid overlay
    drawGridOverlay(gameStateBufferRead);
}