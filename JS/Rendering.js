//Rendering.js
import { getCanvasContext, getTerrainTiles, miniMapCanvasRef, mapOrigin, getOverlaySprites } from './Initialise.js';
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
import { TERRAIN_GENERATOR, GENERATION_PROCESS_VISUALISER, TERRAIN_STATE_DISPLAY, GENERATION_STATE } from './FilePathRouter.js';
import { options } from './Options.js';

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

// Helper function to get terrain tile from menu item
function getTerrainTileFromMenuItem(selectedMenuItem) {
    if (!selectedMenuItem) return null;
    
    const terrainTiles = getTerrainTiles();
    let terrainTile = null;
    
    // If there's a currentVariant (from cycling), use that first
    if (selectedMenuItem.currentVariant) {
        terrainTile = terrainTiles[selectedMenuItem.currentVariant];
    }
    // Check if it's a building (has tileType property)
    else if (selectedMenuItem.tileType) {
        terrainTile = terrainTiles[selectedMenuItem.tileType];
    }
    // Check if it's a road (use text to find tile type)
    else if (selectedMenuItem.text) {
        let tileType;
        
        // Otherwise use the default mapping
        const roadTextToTileType = {
            'Cross': 'cross',
            'Straight': 'straight_latitude', // Default to latitude for now
            'T': 't_junction_top', // Default to top for now
            'L': 'l_curve_top_left', // Default to top-left for now
            'Diagonal': 'diagonal_top_left', // Default to top-left for now
            'Forest': 'Flora_Forest',
            'Lake_Middle': 'Lake_Middle',
            'Bank': 'Lake_Bank_N',
            'Destroy': 'Destroy'
        };
        
        tileType = roadTextToTileType[selectedMenuItem.text];
        
        if (tileType) {
            terrainTile = terrainTiles[tileType];
        }
    }
    
    return terrainTile;
}


// Draw selected and hovered tile highlights including if a menu item is selected
function drawTileHighlights(ctx, gameStateBufferRead) {
    // Disable highlights if modals are open
    if (options.disableMapScrolling) return;
    
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
        if (selectedMenuItem) {
            const terrainTile = getTerrainTileFromMenuItem(selectedMenuItem);
            
            // Check if this is destroy mode
            if (selectedMenuItem.text === 'Destroy') {
                // For destroy mode user red highlight
                drawTileHighlight(ctx, screenX, screenY, 'rgba(255, 0, 0, 0.6)', 3);

                // Calculate sprite position using the actual grid position
                const spriteIsoCoords = cartesianToIsometric(spriteX, y);
                const spriteScreenX = ctx.canvas.width / 2 + spriteIsoCoords.x - gameStateBufferRead.camera.x;
                const spriteScreenY = ctx.canvas.height / 2 + spriteIsoCoords.y - gameStateBufferRead.camera.y;
                
                terrainTile.draw(ctx, spriteScreenX, spriteScreenY, 'isometric');
            
            } else {
                
                if (terrainTile) {
                    // Calculate sprite position using the actual grid position
                    const spriteIsoCoords = cartesianToIsometric(spriteX, y);
                    const spriteScreenX = ctx.canvas.width / 2 + spriteIsoCoords.x - gameStateBufferRead.camera.x;
                    const spriteScreenY = ctx.canvas.height / 2 + spriteIsoCoords.y - gameStateBufferRead.camera.y;
                    
                    // Draw the sprite with 50% opacity
                    ctx.globalAlpha = 0.5;
                    terrainTile.draw(ctx, spriteScreenX, spriteScreenY, 'isometric');
                    ctx.globalAlpha = 1.0;
                    
                    // Draw arrow overlay if it's a river tile
                    drawRiverArrowOverlay(ctx, selectedMenuItem, spriteScreenX, spriteScreenY);
                }
            }
        } else {
            // Draw hover effect with thinner line if no menu item is selected
            drawTileHighlight(ctx, screenX, screenY, 'rgba(255, 255, 255, 0.4)', 2);
        }
    }
}

// Draw river arrow overlay in the top right of the tile
function drawRiverArrowOverlay(ctx, selectedMenuItem, spriteScreenX, spriteScreenY) {
    // Check if the selected item is a river type
    if (!selectedMenuItem.text || (!selectedMenuItem.text.includes('Clockwise') && !selectedMenuItem.text.includes('Anti-Clockwise'))) {
        return;
    }
    
    const overlaySprites = getOverlaySprites();
    let arrowSprite = null;
        
    // Determine which arrow to use based on the selected river type
    if (selectedMenuItem.text.includes('Anti-Clockwise')) {
        arrowSprite = overlaySprites.riverAntiClockwiseArrow;
    } else if (selectedMenuItem.text.includes('Clockwise')) {
        arrowSprite = overlaySprites.riverClockwiseArrow;
    }
    
    if (arrowSprite) {
        // Calculate position for top right corner of the tile
        // Isometric tile dimensions: width = 100, height = 50
        const arrowSize = 35; // Size of the arrow sprite
        const arrowX = spriteScreenX + 165; // Right side of tile minus arrow width
        const arrowY = spriteScreenY; // Top of tile minus arrow height
        
        // Draw the arrow with full opacity
        ctx.globalAlpha = 1.0;
        ctx.drawImage(arrowSprite, arrowX, arrowY, arrowSize, arrowSize);
    } else {
        console.log('No arrow sprite found');
    }
}

// Render generation status - redraw the progress elements each frame
function renderGenerationStatus() {
    const generationProgress = document.getElementById('generationProgress');
    
    if (!generationProgress) return;
    
    // Only update if generation is active
    if (GENERATION_STATE.shouldShowGenerationPopup && GENERATION_STATE.isGenerating) {
        // Clear and recreate the progress elements
        generationProgress.innerHTML = '';
        
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'generationProgressBar';
        progressBar.className = 'progress-bar';
        
        // Create progress fill
        const progressFill = document.createElement('div');
        progressFill.id = 'generationProgressFill';
        progressFill.className = 'progress-fill';
        
        // Calculate progress percentage based on actual WFC progress
        const totalTiles = 1296; // Total grid size
        const tilesCompleted = GENERATION_STATE.tilesCompleted;
        const percentage = Math.min(Math.round((tilesCompleted / totalTiles) * 100), 100);
        
        // Set progress fill width
        progressFill.style.width = percentage + '%';
        
        // Create sparks element at the head of the progress bar
        const sparksElement = document.createElement('div');
        sparksElement.id = 'progressSparks';
        sparksElement.className = 'progress-sparks';
        sparksElement.style.left = percentage + '%';
        
        // Create progress text
        const progressText = document.createElement('div');
        progressText.id = 'generationProgressText';
        progressText.textContent = `${percentage}%`;
        
        // Assemble the elements
        progressBar.appendChild(progressFill);
        progressBar.appendChild(sparksElement);
        generationProgress.appendChild(progressBar);
        generationProgress.appendChild(progressText);
    }
}

// Draw WFC generation visualization
function drawWFCVisualization(ctx, gameStateBufferRead) {
    if (!options.visualiseTerrainGenerationProcess) return;
    GENERATION_PROCESS_VISUALISER.generationProcessVisualiser.draw(ctx, gameStateBufferRead.camera);
    TERRAIN_STATE_DISPLAY.terrainStateDisplay.openOrCloseTerrainDisplay();
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

    // 14 columns and rows = 7 tiles in each direction from center (extended by 1)
    const RANGE = 7;

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

    // Draw WFC generation visualization if active
    drawWFCVisualization(ctx, gameStateBufferRead);

    // Highlight selected or hovered tiles
    drawTileHighlights(ctx, gameStateBufferRead);

    // Render generation status (progress bar and text)
    renderGenerationStatus();

    if (toggleDraw) { drawMiniMap(gameStateBufferRead); } 

    // Toggle for next frame
    toggleDraw = !toggleDraw;
}

// Change mouse cursor to destroy image
export function setDestroyCursor() {
    document.body.style.cursor = 'url("Assets/Terrain_Tile_Sprites/Isometric/Destroy.png") 16 16, auto';
}

// Reset mouse cursor to default
export function resetCursor() {
    document.body.style.cursor = 'default';
}


