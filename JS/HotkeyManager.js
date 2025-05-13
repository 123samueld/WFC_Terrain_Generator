// HotkeyManager.js
class HotkeyManager {
    constructor() {
        this.hotkeys = new Map();
        this.enabled = true;
    }

    // Register a new hotkey
    register(key, callback, description = '') {
        const normalizedKey = key.toLowerCase();
        this.hotkeys.set(normalizedKey, {
            callback,
            description,
            isPressed: false
        });
    }

    // Unregister a hotkey
    unregister(key) {
        const normalizedKey = key.toLowerCase();
        this.hotkeys.delete(normalizedKey);
    }

    // Handle key down events
    handleKeyDown(key) {
        if (!this.enabled) return;
        
        const normalizedKey = key.toLowerCase();
        const hotkey = this.hotkeys.get(normalizedKey);
        
        if (hotkey && !hotkey.isPressed) {
            hotkey.isPressed = true;
            hotkey.callback();
        }
    }

    // Handle key up events
    handleKeyUp(key) {
        const normalizedKey = key.toLowerCase();
        const hotkey = this.hotkeys.get(normalizedKey);
        
        if (hotkey) {
            hotkey.isPressed = false;
        }
    }

    // Enable/disable hotkey handling
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    // Get all registered hotkeys
    getHotkeys() {
        return Array.from(this.hotkeys.entries()).map(([key, data]) => ({
            key,
            description: data.description
        }));
    }
}

// Create and export a singleton instance
export const hotkeyManager = new HotkeyManager(); 