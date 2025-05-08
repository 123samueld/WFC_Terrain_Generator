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
    scroll: {
        x: 0,
        y: 0
    }
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
        
        // Debug logging for mouse position calculation
        console.log('Mouse Position Calculation:', {
            clientX: e.clientX,
            rectLeft: rect.left,
            scaleX: scaleX,
            calculatedX: inputState.mouse.x,
            canvasWidth: canvas.width,
            rectWidth: rect.width
        });
        
        updateEdgeScrolling(inputState.mouse.x, inputState.mouse.y);
    } else {
        // Reset scroll values when mouse leaves canvas
        inputState.scroll.x = 0;
        inputState.scroll.y = 0;
    }
}

// Update edge scrolling based on mouse position
function updateEdgeScrolling(mouseX, mouseY) {
    const canvas = document.getElementById('gameCanvas');
    
    // Reset scroll values
    inputState.scroll.x = 0;
    inputState.scroll.y = 0;

    // Only calculate scroll if mouse is over canvas
    if (!inputState.mouse.isOverCanvas) return;

    // Add a small offset to ensure we catch edge cases
    const EDGE_OFFSET = 2;
    
    // Calculate distances from edges with offset
    const distFromLeft = Math.max(0, mouseX - EDGE_OFFSET);
    const distFromRight = Math.max(0, canvas.width - mouseX - EDGE_OFFSET);
    const distFromTop = Math.max(0, mouseY - EDGE_OFFSET);
    const distFromBottom = Math.max(0, canvas.height - mouseY - EDGE_OFFSET);

    // Debug logging
    console.log('Mouse Position:', { x: mouseX, y: mouseY });
    console.log('Canvas Dimensions:', { width: canvas.width, height: canvas.height });
    console.log('Distances:', {
        left: distFromLeft,
        right: distFromRight,
        top: distFromTop,
        bottom: distFromBottom
    });

    // Handle horizontal scrolling with adjusted zones
    if (distFromLeft < EDGE_ZONE_2) {
        // First zone (0-75px)
        if (distFromLeft < EDGE_ZONE_1) {
            inputState.scroll.x = -SCROLL_SPEED_FAST;
            console.log('Fast scroll left');
        }
        // Second zone (75-150px)
        else {
            inputState.scroll.x = -SCROLL_SPEED_SLOW;
            console.log('Slow scroll left');
        }
    }
    else if (distFromRight < EDGE_ZONE_2) {
        // First zone (0-75px)
        if (distFromRight < EDGE_ZONE_1) {
            inputState.scroll.x = SCROLL_SPEED_FAST;
            console.log('Fast scroll right');
        }
        // Second zone (75-150px)
        else {
            inputState.scroll.x = SCROLL_SPEED_SLOW;
            console.log('Slow scroll right');
        }
    }

    // Handle vertical scrolling with adjusted zones
    if (distFromTop < EDGE_ZONE_2) {
        // First zone (0-75px)
        if (distFromTop < EDGE_ZONE_1) {
            inputState.scroll.y = -SCROLL_SPEED_FAST;
        }
        // Second zone (75-150px)
        else {
            inputState.scroll.y = -SCROLL_SPEED_SLOW;
        }
    }
    else if (distFromBottom < EDGE_ZONE_2) {
        // First zone (0-75px)
        if (distFromBottom < EDGE_ZONE_1) {
            inputState.scroll.y = SCROLL_SPEED_FAST;
        }
        // Second zone (75-150px)
        else {
            inputState.scroll.y = SCROLL_SPEED_SLOW;
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
    return inputState.scroll;
}

// Main function to get all input states
export function getInput() {
    return {
        keyboard: getKeyboardInput(),
        mouse: getMouseInput(),
        scroll: getScrollInput()
    };
} 