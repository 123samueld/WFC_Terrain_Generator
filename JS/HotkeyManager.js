// HotkeyManager.js
export class HotkeyManager {
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

    // Method to link buttons for the build menu
    linkBuildMenuButtons(buildMenu) {
        document.getElementById('btnQ').addEventListener('click', buildMenu.actionQ.bind(buildMenu));
        document.getElementById('btnW').addEventListener('click', buildMenu.actionW.bind(buildMenu));
        document.getElementById('btnE').addEventListener('click', buildMenu.actionE.bind(buildMenu));
        document.getElementById('btnR').addEventListener('click', buildMenu.actionR.bind(buildMenu));
        document.getElementById('btnA').addEventListener('click', buildMenu.actionA.bind(buildMenu));
        document.getElementById('btnS').addEventListener('click', buildMenu.actionS.bind(buildMenu));
        document.getElementById('btnD').addEventListener('click', buildMenu.actionD.bind(buildMenu));
        document.getElementById('btnF').addEventListener('click', buildMenu.actionF.bind(buildMenu));
        document.getElementById('btnZ').addEventListener('click', buildMenu.back.bind(buildMenu));
        document.getElementById('btnX').addEventListener('click', buildMenu.actionX.bind(buildMenu));
        document.getElementById('btnC').addEventListener('click', buildMenu.actionC.bind(buildMenu));
        document.getElementById('btnV').addEventListener('click', buildMenu.actionV.bind(buildMenu));
    }
}

// Create and export a singleton instance
export const hotkeyManager = new HotkeyManager(); 