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
        y: 0
    }
};

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
    inputState.mouse.x = e.clientX;
    inputState.mouse.y = e.clientY;
}

// Get current keyboard state
function getKeyboardInput() {
    return inputState.keys;
}

// Get current mouse position
function getMouseInput() {
    return inputState.mouse;
}

// Main function to get all input states
export function getInput() {
    return {
        keyboard: getKeyboardInput(),
        mouse: getMouseInput()
    };
} 