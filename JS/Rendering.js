//Rendering.js
import { getCanvasContext, getTerrainTiles, miniMapCanvasRef, mapOrigin } from './Initialise.js';
import { cartesianToIsometric, 
    isometricToCartesian, 
    ISOMETRIC_TILE_WIDTH, 
    ISOMETRIC_TILE_WIDTH_HALF, 
    ISOMETRIC_TILE_HEIGHT, 
    CANVAS_HALF_WIDTH, 
    CANVAS_HALF_HEIGHT } from './Math.js';
import { drawGridOverlay } from './ProfilingTools.js';
import { inputState } from './Input.js';
import { buildMenu } from './BuildMenu.js';

// Add toggle at the top level
let drawGrid = true;

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

// Draw selected and hovered tile highlights including if a menu item is selected
function drawTileHighlights(ctx, gameStateBufferRead) {
    // Draw hovered tile highlight
    if (inputState.mouse.hoveredTile) {
        // For highlight outline, we need the +1 offset
        const highlightX = inputState.mouse.hoveredTile.x + 1;
        const y = inputState.mouse.hoveredTile.y;
        
        // For sprite preview, we use the actual grid position
        const spriteX = inputState.mouse.hoveredTile.x;
        
        const isoCoords = cartesianToIsometric(highlightX, y);
        const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x;
        const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;
        
        // If a menu item is selected, draw its sprite instead of the highlight
        const selectedMenuItem = buildMenu.getSelectedMenuItem();
        if (selectedMenuItem && selectedMenuItem.tileType) {
            const terrainTiles = getTerrainTiles();
            const terrainTile = terrainTiles[selectedMenuItem.tileType];
            if (terrainTile) {
                // Calculate sprite position using the actual grid position
                const spriteIsoCoords = cartesianToIsometric(spriteX, y);
                const spriteScreenX = ctx.canvas.width / 2 + spriteIsoCoords.x - gameStateBufferRead.camera.x;
                const spriteScreenY = ctx.canvas.height / 2 + spriteIsoCoords.y - gameStateBufferRead.camera.y;
                
                // Draw the sprite with 50% opacity
                ctx.globalAlpha = 0.5;
                terrainTile.draw(ctx, spriteScreenX, spriteScreenY, 'isometric');
                ctx.globalAlpha = 1.0;
            }
        } else {
            // Draw hover effect with thinner line if no menu item is selected
            drawTileHighlight(ctx, screenX, screenY, 'rgba(255, 255, 255, 0.4)', 2);
        }
    }
}

// Occlusion culling based on 6 tiles in each direction from center
function calculateVisibleTiles(gameStateBufferRead) {
    const camera = gameStateBufferRead.camera;

    // Center of the screen is the camera position
    const viewportCenterX = camera.x;
    const viewportCenterY = camera.y;

    // Convert to cartesian grid coordinates
    const centerTile = isometricToCartesian(viewportCenterX, viewportCenterY);
    const centerGridX = Math.round(centerTile.x);
    const centerGridY = Math.round(centerTile.y);

    const visibleTiles = [];

    // 12 columns and rows = 6 tiles in each direction from center
    const RANGE = 6;

    for (let dy = -RANGE; dy <= RANGE; dy++) {
        for (let dx = -RANGE; dx <= RANGE; dx++) {
            const tileX = centerGridX + dx;
            const tileY = centerGridY + dy;
            visibleTiles.push({ x: tileX, y: tileY });
        }
    }

    return visibleTiles;
}

// Draw minimap
function drawMiniMap(gameStateBufferRead) {
    const miniMapCtx = miniMapCanvasRef.getContext('2d');
    const terrainTiles = getTerrainTiles();

    // Clear minimap canvas
    miniMapCtx.clearRect(0, 0, miniMapCanvasRef.width, miniMapCanvasRef.height);

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

                const terrainTile = terrainTiles[tileType];
                miniMapCtx.fillStyle = terrainTile.miniMapTileColour;

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
}


function drawMainMap(gameStateBufferRead, visibleTiles) {
    const ctx = getCanvasContext();
    const terrainTiles = getTerrainTiles();

    for (const { x, y } of visibleTiles) {
        const tileType = gameStateBufferRead.getTile(x, y);
        if (tileType && terrainTiles[tileType]) {
            const isoCoords = cartesianToIsometric(x, y);
            const screenX = ctx.canvas.width / 2 + isoCoords.x - gameStateBufferRead.camera.x;
            const screenY = ctx.canvas.height / 2 + isoCoords.y - gameStateBufferRead.camera.y;
            terrainTiles[tileType].draw(ctx, screenX, screenY, 'isometric');
        }
    }
}

let toggleDraw = true;

export function renderingLoop(gameStateBufferRead) {
    const ctx = getCanvasContext();

    // Clear main canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Calculate visible tiles
    const visibleTiles = calculateVisibleTiles(gameStateBufferRead);

    // Draw grid overlay
      drawGridOverlay(gameStateBufferRead);


    // Draw only visible tiles
    drawMainMap(gameStateBufferRead, visibleTiles);

    // Highlight selected or hovered tiles
    drawTileHighlights(ctx, gameStateBufferRead);

    if (toggleDraw) { drawMiniMap(gameStateBufferRead); } 

    // Toggle for next frame
    toggleDraw = !toggleDraw;
}


