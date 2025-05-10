//Rendering.js
import { getCanvasContext, getTerrainTiles, miniMapCanvasRef, mapOrigin } from './Initialise.js';
import { cartesianToIsometric } from './Math.js';
import { drawGridOverlay } from './ProfilingTools.js';
import { inputState } from './Input.js';

// Draw highlight for a tile
function drawTileHighlight(ctx, x, y, color, lineWidth = 3) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y - 50);        // Top
    ctx.lineTo(x + 100, y);       // Right
    ctx.lineTo(x, y + 50);        // Bottom
    ctx.lineTo(x - 100, y);       // Left
    ctx.closePath();
    ctx.stroke();
}

// Get highlight color based on tile type
function getHighlightColor(tileType) {
    switch(tileType) {
        case 'cross':
            return 'rgba(255, 255, 0, 0.8)'; // Yellow
        case 'straight_latitude':
            return 'rgba(0, 255, 255, 0.8)'; // Cyan
        case 'straight_longitude':
            return 'rgba(255, 0, 255, 0.8)'; // Magenta
        default:
            return 'rgba(255, 255, 255, 0.8)'; // White
    }
}

// Draw selected and hovered tile highlights
function drawTileHighlights(ctx, gameStateBufferRead) {
    // Draw hovered tile highlight
    if (inputState.mouse.hoveredTile) {
        const { x, y } = inputState.mouse.hoveredTile;
        const isoCoords = cartesianToIsometric(x, y);
        const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x;
        const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;
        
        // Draw hover effect with thinner line
        drawTileHighlight(ctx, screenX, screenY, 'rgba(255, 255, 255, 0.4)', 2);
    }
}

// Draw tile information
function drawTileInfo(ctx, gameStateBufferRead) {
    if (!inputState.selectedTile) return;

    const { x, y } = inputState.selectedTile;
    const tileType = gameStateBufferRead.getTile(x, y);
    
    if (!tileType) return;

    // Position the info box in the top-right corner
    const padding = 10;
    const lineHeight = 20;
    const boxWidth = 200;
    const boxHeight = 80;
    const boxX = ctx.canvas.width - boxWidth - padding;
    const boxY = padding;

    // Draw semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Draw border
    ctx.strokeStyle = getHighlightColor(tileType);
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = '16px UnrealT';
    ctx.textBaseline = 'top';
    
    // Draw tile type
    ctx.fillText(`Tile Type: ${tileType}`, boxX + padding, boxY + padding);
    
    // Draw coordinates
    ctx.fillText(`Grid Position: (${x}, ${y})`, boxX + padding, boxY + padding + lineHeight);
    
    // Draw camera-relative position
    const isoCoords = cartesianToIsometric(x, y);
    const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x;
    const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;
    ctx.fillText(`Screen Position: (${Math.round(screenX)}, ${Math.round(screenY)})`, 
                 boxX + padding, boxY + padding + lineHeight * 2);
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

    // Draw tile highlights
    drawTileHighlights(ctx, gameStateBufferRead);

    // Draw tile information
    drawTileInfo(ctx, gameStateBufferRead);

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

