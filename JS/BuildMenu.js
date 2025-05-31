// BuildMenu.js
import { hotkeyManager } from './HotkeyManager.js';
import { menuItems } from './MenuItems.js';
import { inputState } from './Input.js';
import { getGameStateBuffers } from './Initialise.js';
import { wfc } from './TerrainGenerator/WFC.js';
import { GENERATION_PROCESS_VISUALISER, OPTIONS } from './FilePathRouter.js';
import { options } from './Options.js';


class BuildMenu {
    constructor() {
        this.activeMenu = "Main";
        this.menuChain = [];
        this.nestedMenus = [
            "Main",
            "Build Options",
            "Buildings", 
            "Roads", 
            "Train Tracks", 
            "Power Lines", 
            "Pipes"
        ];
        this.isVisualisationMenu = false;  // Add flag for visualisation menu state

        // Store menu items
        this.menuItems = menuItems;
        
        // Preload menu icons
        this.preloadMenuIcons();

        this.bindings = {
            q: this.actionQ,
            w: this.actionW,
            e: this.actionE,
            r: this.actionR,
            a: this.actionA,
            s: this.actionS,
            d: this.actionD,
            f: this.actionF,
            z: this.actionZ,
            x: this.actionX,
            c: this.actionC,
            v: this.actionV,
            b: this.actionB
        };
        this.selectedMenuItem = null;
    }

    preloadMenuIcons() {
        // Create a Set to store unique image paths
        const imagePaths = new Set();
        
        // Collect all unique image paths from menu items
        Object.values(this.menuItems).forEach(menu => {
            menu.items.forEach(item => {
                if (item.image) {
                    imagePaths.add(item.image);
                }
            });
        });
        
        // Preload each image
        imagePaths.forEach(path => {
            const img = new Image();
            img.src = path;
        });
    }

    getSelectedMenuItem() {
        return this.selectedMenuItem;
    }

    // Method to toggle the build menu
    toggleMenu() {
        const menuContent = document.getElementById('menuContent');
        const topLine = document.getElementById('topLine');
        const menuHeader = document.getElementById('menuHeader');
    
        const isOpen = menuContent.style.opacity === '1';
    
        if (isOpen) {
            // Closing the menu
            menuContent.style.opacity = '0';
            menuContent.style.height = '1px';
            topLine.style.transform = 'translateY(0)';
    
            // Reset state
            this.activeMenu = 'Main';
            this.menuChain = [];
        } else {
            // Opening the menu
            menuContent.style.opacity = '1';
            menuContent.style.height = '500px';
    
            // Always start with main menu
            this.activeMenu = 'Main';
            this.menuChain = ['Main'];
            this.generateDynamicMenu('Main');
        }
    
        // Update header regardless of open/close
        if (menuHeader) {
            menuHeader.innerText = this.activeMenu;
        }
    }
    

    generateDynamicMenu(activeMenu) {
        const menuData = this.menuItems[activeMenu];
    
        if (!menuData || !Array.isArray(menuData.items)) {
            return;
        }
    
        // Update header
        const menuHeader = document.getElementById('menuHeader');
        if (menuHeader) {
            menuHeader.innerText = activeMenu;
        }
    
        // Build a fast lookup table from ID
        const itemById = {};
        for (const item of menuData.items) {
            itemById[item.id] = item;
        }
    
        const keyLabels = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F', 'Z', 'X', 'C', 'V']; // total 12
        for (let i = 0; i < keyLabels.length; i++) {
            const key = keyLabels[i];
            const item = itemById[i]; // Use map instead of find
    
            const button = document.getElementById(`btn${key}`);
            const span = document.getElementById(`${key}ButtonText`);
    
            if (!button || !span) continue;
    
            if (!item || item.placeholder) {
                button.classList.add('placeholder');
                span.innerText = '';
                button.style.backgroundImage = '';
            } else {
                button.classList.remove('placeholder');
                span.innerText = item.text || '';
                button.style.backgroundImage = item.image ? `url('${item.image}')` : '';
            }
        }
    }
    

    
    handleMenuAction(menuName, keyPressedID) {
        if (keyPressedID === 8) {
            this.back();
            return;
        }
    
        const menuData = this.menuItems[menuName];
    
        if (!menuData || !Array.isArray(menuData.items)) {
            console.warn(`Menu '${menuName}' not found or malformed.`);
            return;
        }
    
        const selectedItem = menuData.items[keyPressedID];
    
        if (!selectedItem) {
            console.warn(`No menu item at index '${keyPressedID}' in menu '${menuName}'.`);
            return;
        }

        // Handle menu actions
        if (selectedItem.action) {
            // Handle Generate Options menu actions
            if (menuName === 'Generate Options') {
                switch (selectedItem.action) {
                    case 'generate':
                        wfc.generateWFC();
                        break;
                    case 'weights':
                        // TODO: Implement weight adjustment
                        break;
                    case 'undo':
                        // TODO: Implement undo functionality
                        break;
                }
            }
            // Handle Visualise Generation Process menu actions
            else if (menuName === 'Visualise Generation Process') {
                switch (selectedItem.action) {
                    case 'step_back':
                        console.log('Step back in visualization');
                        // TODO: Implement step back
                        break;
                    case 'play':
                        console.log('Play visualization');
                        // TODO: Implement play
                        break;
                    case 'pause':
                        console.log('Pause visualization');
                        // TODO: Implement pause
                        break;
                    case 'step_forward':
                        console.log('Step forward in visualization');
                        // TODO: Implement step forward
                        break;
                    case 'play_speed':
                        const modal = document.getElementById('playSpeedModal');
                        const closeBtn = modal.querySelector('.modal-close');
                        const select = document.getElementById('playSpeedSelect');
                        const setSpeedBtn = document.getElementById('setSpeedBtn');
                        
                        // Set initial value
                        select.value = options.playSpeed;
                        
                        // Add change event listener for select
                        select.onchange = (e) => {
                            // Just update the select value, don't change options yet
                            select.value = e.target.value;
                        };
                        
                        // Add click event listener for Set Speed button
                        setSpeedBtn.onclick = () => {
                            options.playSpeed = parseInt(select.value);
                            console.log(`Play speed set to ${options.playSpeed}`);
                            modal.style.display = 'none';
                        };
                        
                        // Show modal
                        modal.style.display = 'block';
                        
                        // Close button handler
                        closeBtn.onclick = () => {
                            modal.style.display = 'none';
                        };
                        
                        // Click outside to close
                        window.onclick = (event) => {
                            if (event.target === modal) {
                                modal.style.display = 'none';
                            }
                        };
                        break;
                }
            }
            return;
        }

        // Handle leaf menu item (tile placement)
        if (menuData.isLeafMenu) {
            this.selectedMenuItem = selectedItem;
            return;
        }
    
        const nextMenuName = selectedItem.nextMenu;
        if (!nextMenuName) {
            console.warn(`No next menu specified for item in menu '${menuName}'.`);
            return;
        }

        // Set visualization flag when entering visualization menu
        if (nextMenuName === 'Visualise Generation Process') {
            options.visualiseTerrainGenerationProcess = true;
            this.isVisualisationMenu = true;
            console.log("Visualisation enabled");   
        }
    
        // Navigate to the selected menu
        this.menuChain.push(nextMenuName);
        this.activeMenu = nextMenuName;
        this.generateDynamicMenu(nextMenuName);
    }
    
    

    // === Action Methods ===
    actionQ() { this.handleMenuAction(this.activeMenu, 0); }
    actionW() { this.handleMenuAction(this.activeMenu, 1); }
    actionE() { this.handleMenuAction(this.activeMenu, 2); }
    actionR() { this.handleMenuAction(this.activeMenu, 3); }
    actionA() { this.handleMenuAction(this.activeMenu, 4); }
    actionS() { this.handleMenuAction(this.activeMenu, 5); }
    actionD() { this.handleMenuAction(this.activeMenu, 6); }
    actionF() { this.handleMenuAction(this.activeMenu, 7); }
    actionZ() { this.handleMenuAction(this.activeMenu, 8); }
    actionX() { this.handleMenuAction(this.activeMenu, 9); }
    actionC() { this.handleMenuAction(this.activeMenu, 10); }
    actionV() { this.handleMenuAction(this.activeMenu, 11); }
    actionB() { this.toggleMenu(); }

    back() {    
        // Remove the current (active) menu from the chain
        this.menuChain.pop();
    
        // Decide what the new active menu should be
        const previousMenu = this.menuChain.length > 0
            ? this.menuChain[this.menuChain.length - 1]
            : 'Main';

        // If we're leaving the Visualise Generation Process menu
        if (this.activeMenu === 'Visualise Generation Process') {
            options.visualiseTerrainGenerationProcess = false;
            this.isVisualisationMenu = false;
            console.log("Visualisation disabled");
        }
    
        // Update activeMenu and regenerate the menu
        this.activeMenu = previousMenu;
        this.generateDynamicMenu(previousMenu);
    }
    
    

    registerBindings() {
        for (const [key, action] of Object.entries(this.bindings)) {
            hotkeyManager.register(key, action.bind(this), `Action for ${key}`);
        }
    }

    // Call the linkBuildMenuButtons method from HotkeyManager
    linkButtons() {
        hotkeyManager.linkBuildMenuButtons(this); // Link buttons using HotkeyManager
    }

    initializeMenu() {
        const neonButton = document.getElementById('neonButton');
        if (neonButton) {
            neonButton.addEventListener('click', () => {
                this.toggleMenu(); // Toggle the menu when the neonButton is clicked
                this.dynamicMenu(); // Update the header based on the active menu
            });
        }
    }
}

export const buildMenu = new BuildMenu();

// Initialize event listeners after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    buildMenu.initializeMenu();
});
