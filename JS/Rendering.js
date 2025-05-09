//Rendering.js
import { getCanvasContext, getTerrainTiles, miniMapCanvasRef } from './Initialise.js';
import { cartesianToIsometric } from './Math.js';
import { drawGridOverlay } from './ProfilingTools.js';

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

    // --- MINIMAP ISOMETRIC GRID DRAWING ---
const gridSize = gameStateBufferRead.gridSize;
const miniMapWidth = miniMapCanvasRef.width;
const miniMapHeight = miniMapCanvasRef.height;

// Enforce 2:1 isometric tile ratio
const isoTileWidth = miniMapWidth / gridSize;
const isoTileHeight = isoTileWidth / 2;

const centerX = miniMapWidth / 2;
const centerY = 5;

miniMapCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
miniMapCtx.lineWidth = 1;

for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
        const isoX = (x - y) * (isoTileWidth / 2) + centerX;
        const isoY = (x + y) * (isoTileHeight / 2) + centerY;

        const halfW = isoTileWidth / 2;
        const halfH = isoTileHeight / 2;

        miniMapCtx.beginPath();
        miniMapCtx.moveTo(isoX, isoY - halfH);        // Top
        miniMapCtx.lineTo(isoX + halfW, isoY);         // Right
        miniMapCtx.lineTo(isoX, isoY + halfH);         // Bottom
        miniMapCtx.lineTo(isoX - halfW, isoY);         // Left
        miniMapCtx.closePath();
        miniMapCtx.stroke();
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

