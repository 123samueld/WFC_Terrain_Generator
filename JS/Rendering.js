//Rendering.js
import { getCanvasContext, getTerrainTiles, miniMapCanvasRef } from './Initialise.js';
import { cartesianToIsometric } from './Math.js';
import { drawGridOverlay } from './ProfilingTools.js';
import { inputState } from './Input.js';

// Draw highlight for selected tile
function drawSelectedTileHighlight(ctx, gameStateBufferRead) {
    if (!inputState.selectedTile) return;

    const { x, y } = inputState.selectedTile;
    const isoCoords = cartesianToIsometric(x, y);
    
    // Center the highlight on the screen and apply camera offset
    const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x;
    const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;

    // Draw highlight
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenX, screenY - 50);        // Top
    ctx.lineTo(screenX + 100, screenY);       // Right
    ctx.lineTo(screenX, screenY + 50);        // Bottom
    ctx.lineTo(screenX - 100, screenY);       // Left
    ctx.closePath();
    ctx.stroke();
}

export function renderingLoop(gameStateBufferRead) {
    const ctx = getCanvasContext();
    const miniMapCtx = miniMapCanvasRef.getContext('2d');
    const terrainTiles = getTerrainTiles();

    // Clear both canvases
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    miniMapCtx.clearRect(0, 0, miniMapCanvasRef.width, miniMapCanvasRef.height);

    // --- GAME CANVAS TILE DRAWING ---
    for (let y = 0; y < gameStateBufferRead.gridSize; y++) {
        for (let x = 0; x < gameStateBufferRead.gridSize; x++) {
            const tileType = gameStateBufferRead.getTile(x, y);
            if (tileType && terrainTiles[tileType]) {
                const isoCoords = cartesianToIsometric(x, y);
                const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x;
                const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;
                terrainTiles[tileType].draw(ctx, screenX, screenY, 'isometric');
            }
        }
    }

    // Draw selected tile highlight
    drawSelectedTileHighlight(ctx, gameStateBufferRead);

    // --- MINIMAP GRID + FILLED DIAMONDS ---
    const gridSize = gameStateBufferRead.gridSize;
    const miniMapWidth = miniMapCanvasRef.width;
    const miniMapHeight = miniMapCanvasRef.height;

    // Enforce 2:1 isometric tile ratio
    const isoTileWidth = miniMapWidth / gridSize;
    const isoTileHeight = isoTileWidth / 2;

    const centerX = miniMapWidth / 2;
    const centerY = 5;

    miniMapCtx.lineWidth = 1;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const tileType = gameStateBufferRead.getTile(x, y);

            const isoX = (x - y) * (isoTileWidth / 2) + centerX;
            const isoY = (x + y) * (isoTileHeight / 2) + centerY;

            const halfW = isoTileWidth / 2;
            const halfH = isoTileHeight / 2;

            // Draw tile outline
            miniMapCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            miniMapCtx.beginPath();
            miniMapCtx.moveTo(isoX, isoY - halfH);        // Top
            miniMapCtx.lineTo(isoX + halfW, isoY);         // Right
            miniMapCtx.lineTo(isoX, isoY + halfH);         // Bottom
            miniMapCtx.lineTo(isoX - halfW, isoY);         // Left
            miniMapCtx.closePath();
            miniMapCtx.stroke();

            // Optionally draw diamond if the tile is filled
            if (tileType) {
                const miniHalfW = isoTileWidth * 0.25;
                const miniHalfH = isoTileHeight * 0.25;

                miniMapCtx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                miniMapCtx.beginPath();
                miniMapCtx.moveTo(isoX, isoY - miniHalfH);
                miniMapCtx.lineTo(isoX + miniHalfW, isoY);
                miniMapCtx.lineTo(isoX, isoY + miniHalfH);
                miniMapCtx.lineTo(isoX - miniHalfW, isoY);
                miniMapCtx.closePath();
                miniMapCtx.fill();
            }
        }
    }

    // --- MINIMAP CAMERA RECTANGLE ---
    const scaleX = miniMapWidth / 7200;
    const scaleY = miniMapHeight / 3600;
    const viewportWidth = 1200 * scaleX;
    const viewportHeight = 800 * scaleY;
    const camMiniX = (gameStateBufferRead.camera.x + 7200 / 2 - 1200 / 2) * scaleX - 3;
    const camMiniY = (gameStateBufferRead.camera.y - 800 / 2) * scaleY;

    miniMapCtx.strokeStyle = 'white';
    miniMapCtx.lineWidth = 1;
    miniMapCtx.strokeRect(camMiniX, camMiniY, viewportWidth, viewportHeight);

    // --- Optional: debug grid overlay ---
    drawGridOverlay(gameStateBufferRead);
}

