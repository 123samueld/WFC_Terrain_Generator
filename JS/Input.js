// Input.js
import { isometricToCartesian } from './Math.js';
import { getGameStateBuffers, terrainTiles } from './Initialise.js';
import { hotkeyManager } from './HotkeyManager.js';
import { buildMenu } from './BuildMenu.js';
import { options } from './Options.js';
// Input state object to store current input values
export const inputState = {
    keys: {
        w: false,
        a: false,
        s: false,
        d: false
    },
    mouse: {
        x: 0,
        y: 0,
        isOverCanvas: false,
        hoveredTile: null
    },
    offset: { x: 0, y: 0 },
    selectedTile: null,
    showDeleteMenu: false,
    deleteMenuPosition: { x: 0, y: 0 }
};

// Constants for edge scrolling
const EDGE_ZONE_1 = 75;  // First buffer zone (0-75px)
const EDGE_ZONE_2 = 150; // Second buffer zone (75-150px)
const SCROLL_SPEED_FAST = 15;
const SCROLL_SPEED_SLOW = 8;

// Event handlers for keyboard
export function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    if (key in inputState.keys) {
        inputState.keys[key] = true;
    }
    hotkeyManager.handleKeyDown(key);
}

export function handleKeyUp(e) {
    const key = e.key.toLowerCase();
    if (key in inputState.keys) {
        inputState.keys[key] = false;
    }
    hotkeyManager.handleKeyUp(key);
}

// Event handler for mouse
export function handleMouseMove(e) {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    
    // Check if mouse is over canvas
    const isOverCanvas = e.clientX >= rect.left && 
                        e.clientX <= rect.right && 
                        e.clientY >= rect.top && 
                        e.clientY <= rect.bottom;
    
    inputState.mouse.isOverCanvas = isOverCanvas;
    
    if (isOverCanvas) {
        // Get mouse position relative to canvas, accounting for canvas scaling
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        inputState.mouse.x = (e.clientX - rect.left) * scaleX;
        inputState.mouse.y = (e.clientY - rect.top) * scaleY;
        
        // Update hovered tile
        updateHoveredTile(inputState.mouse.x, inputState.mouse.y);
                
        updateEdgeScrolling(inputState.mouse.x, inputState.mouse.y);
    } else {
        // Reset scroll values and hovered tile when mouse leaves canvas
        inputState.offset.x = 0;
        inputState.offset.y = 0;
        inputState.mouse.hoveredTile = null;
    }
}

// Update edge scrolling based on mouse position
function updateEdgeScrolling(mouseX, mouseY) {
    const canvas = document.getElementById('gameCanvas');
    
    // Reset scroll values
    inputState.offset.x = 0;
    inputState.offset.y = 0;

    // Only calculate scroll if mouse is over canvas
    if (!inputState.mouse.isOverCanvas) return;

    // Add a small offset to ensure we catch edge cases
    const EDGE_OFFSET = 2;
    
    // Calculate distances from edges with offset
    const distFromLeft = Math.max(0, mouseX - EDGE_OFFSET);
    const distFromRight = Math.max(0, canvas.width - mouseX - EDGE_OFFSET);
    const distFromTop = Math.max(0, mouseY - EDGE_OFFSET);
    const distFromBottom = Math.max(0, canvas.height - mouseY - EDGE_OFFSET);

    // Handle horizontal scrolling with adjusted zones
    if (distFromLeft < EDGE_ZONE_2) {
        if (distFromLeft < EDGE_ZONE_1) {
            inputState.offset.x = -SCROLL_SPEED_FAST * options.scrollSpeed;
        } else {
            inputState.offset.x = -SCROLL_SPEED_SLOW * options.scrollSpeed;
        }
    } else if (distFromRight < EDGE_ZONE_2) {
        if (distFromRight < EDGE_ZONE_1) {
            inputState.offset.x = SCROLL_SPEED_FAST * options.scrollSpeed;
        } else {
            inputState.offset.x = SCROLL_SPEED_SLOW * options.scrollSpeed;
        }
    }

    // Handle vertical scrolling with adjusted zones
    if (distFromTop < EDGE_ZONE_2) {
        if (distFromTop < EDGE_ZONE_1) {
            inputState.offset.y = -SCROLL_SPEED_FAST * options.scrollSpeed;
        } else {
            inputState.offset.y = -SCROLL_SPEED_SLOW * options.scrollSpeed;
        }
    } else if (distFromBottom < EDGE_ZONE_2) {
        if (distFromBottom < EDGE_ZONE_1) {
            inputState.offset.y = SCROLL_SPEED_FAST * options.scrollSpeed;
        } else {
            inputState.offset.y = SCROLL_SPEED_SLOW * options.scrollSpeed;
        }
    }
}

function updateHoveredTile(mouseX, mouseY) {
    const canvas = document.getElementById('gameCanvas');
    const { read: gameStateBufferRead } = getGameStateBuffers();

    // --- 1. Center mouse coords relative to canvas center ---
    const centeredX = mouseX - canvas.width / 2;
    const centeredY = mouseY - canvas.height / 2;

    // --- 2. Offset by mapOrigin and camera ---
    const worldX = centeredX + gameStateBufferRead.camera.x;
    const worldY = centeredY + gameStateBufferRead.camera.y;

    // --- 3. Convert to cartesian grid ---
    const cartCoords = isometricToCartesian(worldX, worldY);

    // --- 4. Round to nearest tile ---
    const gridX = Math.round(cartCoords.x);
    const gridY = Math.round(cartCoords.y);

    // --- 5. Save to state ---
    inputState.mouse.hoveredTile = { x: gridX, y: gridY };
}

// Event handler for mouse click
export function handleMouseClick(e) {
    if (!inputState.mouse.isOverCanvas) return;

    // Right click to show delete menu
    if (e.button === 2) {
        const tileType = getGameStateBuffers().read.getTile(inputState.mouse.hoveredTile.x, inputState.mouse.hoveredTile.y);
        if (tileType) {
            inputState.showDeleteMenu = true;
            inputState.deleteMenuPosition = { x: e.clientX, y: e.clientY };
        }
        return;
    }

    // Left click to select or place
    if (e.button === 0) {
        // If delete menu is showing, handle its options
        if (inputState.showDeleteMenu) {
            const menuX = inputState.deleteMenuPosition.x;
            const menuY = inputState.deleteMenuPosition.y;
            
            // Check if click is within delete menu bounds
            if (e.clientX >= menuX && e.clientX <= menuX + 100 &&
                e.clientY >= menuY && e.clientY <= menuY + 60) {
                
                // Check which option was clicked
                if (e.clientY < menuY + 30) { // Yes option
                    getGameStateBuffers().write.setTile(
                        inputState.mouse.hoveredTile.x,
                        inputState.mouse.hoveredTile.y,
                        null
                    );
                }
                // No option just closes the menu
                inputState.showDeleteMenu = false;
                return;
            }
            // Click outside menu just closes it
            inputState.showDeleteMenu = false;
        }

        // Handle tile placement
        if (inputState.mouse.hoveredTile && buildMenu.getSelectedMenuItem()) {
            const tileType = buildMenu.getSelectedMenuItem().tileType;

            
            if (tileType && terrainTiles[tileType]) {
                getGameStateBuffers().write.setTile(
                    inputState.mouse.hoveredTile.x,
                    inputState.mouse.hoveredTile.y,
                    tileType
                );
                // Reset selected tile after placement
                buildMenu.selectedMenuItem = null;
            } else {
                console.log("ERROR: Tile type not found in terrainTiles:", tileType);
            }
        }
    }
}

// Get current keyboard state
function getKeyboardInput() {
    return inputState.keys;
}

// Get current mouse position
function getMouseInput() {
    return inputState.mouse;
}

// Get current scroll values
function getScrollInput() {
    return inputState.offset;
}

// Main function to get all input states
export function getInput() {
    return {
        keyboard: getKeyboardInput(),
        mouse: getMouseInput(),
        scroll: getScrollInput()
    };
}

export function updateCameraPosition(gameStateBufferWrite) {
    const newY = gameStateBufferWrite.camera.y + inputState.offset.y;
    const newX = gameStateBufferWrite.camera.x + inputState.offset.x;

    gameStateBufferWrite.camera.y = Math.max(400, Math.min(3200, newY));
    gameStateBufferWrite.camera.x = Math.max(-2900, Math.min(3100, newX));
}

// Function to initialize event listeners
export function initEventListeners() {
    buildMenu.registerBindings();
    buildMenu.linkButtons();
}


