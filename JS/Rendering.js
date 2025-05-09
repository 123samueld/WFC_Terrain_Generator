//Rendering.js
import { getCanvasContext, getTerrainTiles, initGameCanvas, initMiniMapCanvas, miniMapCanvasRef } from './Initialise.js';
import { TileType } from './TerrainTile.js';
import { cartesianToIsometric, ISOMETRIC_TILE_WIDTH, ISOMETRIC_TILE_HEIGHT } from './Math.js';
import { drawGridOverlay } from './ProfilingTools.js';

export function renderingLoop(gameStateBufferRead) {
    const ctx = getCanvasContext();
    const miniMapCtx = miniMapCanvasRef.getContext('2d');
    const terrainTiles = getTerrainTiles();
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    miniMapCtx.clearRect(0, 0, miniMapCanvasRef.width, miniMapCanvasRef.height);
    
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
    // Draw camera viewport rectangle on minimap
    const scaleX = miniMapCanvasRef.width / 7200;
    const scaleY = miniMapCanvasRef.height / 3600;

    const viewportWidth = 1200 * scaleX;
    const viewportHeight = 800 * scaleY;

    // Center offset for isometric map in minimap
    const xOffset = (7200 / 2) * scaleX;

    const camMiniX = (gameStateBufferRead.camera.x + 7200 / 2 - 1200 / 2) * scaleX - 3;
    const camMiniY = (gameStateBufferRead.camera.y - 800 / 2) * scaleY;


    miniMapCtx.strokeStyle = 'white';
    miniMapCtx.lineWidth = 1;
    miniMapCtx.strokeRect(camMiniX, camMiniY, viewportWidth, viewportHeight);

    // Draw grid overlay
    drawGridOverlay(gameStateBufferRead);
}