// Input.js
import { isometricToCartesian } from './Math.js';


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
        isOverCanvas: false
    },
    offset: { x: 0, y: 0 }, // Single offset for both scroll and grid
    selectedTile: null // Store the currently selected tile coordinates
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
}

export function handleKeyUp(e) {
    const key = e.key.toLowerCase();
    if (key in inputState.keys) {
        inputState.keys[key] = false;
    }
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
                
        updateEdgeScrolling(inputState.mouse.x, inputState.mouse.y);
    } else {
        // Reset scroll values when mouse leaves canvas
        inputState.offset.x = 0;
        inputState.offset.y = 0;
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
            inputState.offset.x = -SCROLL_SPEED_FAST;
        } else {
            inputState.offset.x = -SCROLL_SPEED_SLOW;
        }
    } else if (distFromRight < EDGE_ZONE_2) {
        if (distFromRight < EDGE_ZONE_1) {
            inputState.offset.x = SCROLL_SPEED_FAST;
        } else {
            inputState.offset.x = SCROLL_SPEED_SLOW;
        }
    }

    // Handle vertical scrolling with adjusted zones
    if (distFromTop < EDGE_ZONE_2) {
        if (distFromTop < EDGE_ZONE_1) {
            inputState.offset.y = -SCROLL_SPEED_FAST;
        } else {
            inputState.offset.y = -SCROLL_SPEED_SLOW;
        }
    } else if (distFromBottom < EDGE_ZONE_2) {
        if (distFromBottom < EDGE_ZONE_1) {
            inputState.offset.y = SCROLL_SPEED_FAST;
        } else {
            inputState.offset.y = SCROLL_SPEED_SLOW;
        }
    }
}

// Event handler for mouse click
export function handleMouseClick(e) {
    if (!inputState.mouse.isOverCanvas) return;

    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    
    // Get mouse position relative to canvas, accounting for canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Convert screen coordinates to isometric coordinates
    const screenToIsoX = mouseX - canvas.width / 2;
    const screenToIsoY = mouseY - canvas.height / 2;

    // Convert isometric coordinates to cartesian grid coordinates
    const cartCoords = isometricToCartesian(screenToIsoX, screenToIsoY);

    // Round to nearest grid cell
    const gridX = Math.round(cartCoords.x);
    const gridY = Math.round(cartCoords.y);

    // Update selected tile
    inputState.selectedTile = { x: gridX, y: gridY };
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


