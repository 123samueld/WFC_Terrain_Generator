// BuildMenu.js
import { hotkeyManager } from './HotkeyManager.js';
import { menuItems } from './MenuItems.js';
import { inputState } from './Input.js';
import { getGameStateBuffers } from './Initialise.js';
import { wfc } from './TerrainGenerator/WFC.js';
import { 
    GENERATION_PROCESS_VISUALISER, 
    GENERATION_STATE,
    TERRAIN_STATE_DISPLAY,
    RENDERING
} from './FilePathRouter.js';
import { options } from './Options.js';
import { generationProcessVisualiser } from './TerrainGenerator/GenerationProcessVisualiser.js';
import { getRiverFlowDirection } from './TerrainTile.js';


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
            "Pipes",
            "Flora",
            "Landscape",
            "Water",
            "Lake",
            "River"
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
            b: this.actionB,
            shift: this.rotateSelectedDirection
        };
        this.selectedMenuItem = null;
        this.destroyMode = false; // Destroy mode flag
        
        // Road cycling state
        this.roadVariants = {
            'Straight': ['straight_latitude', 'straight_longitude'],
            'T': ['t_junction_top', 't_junction_right', 't_junction_bottom', 't_junction_left'],
            'L': ['l_curve_top_right', 'l_curve_bottom_right', 'l_curve_bottom_left', 'l_curve_top_left'],
            'Diagonal': ['diagonal_top_right', 'diagonal_bottom_right', 'diagonal_bottom_left', 'diagonal_top_left'],
            'Bank': ['Lake_Bank_N', 'Lake_Bank_NE', 'Lake_Bank_E', 'Lake_Bank_SE', 'Lake_Bank_S', 'Lake_Bank_SW', 'Lake_Bank_W', 'Lake_Bank_NW'],
            'Clockwise\nRivers': ['River_NS', 'River_NE', 'River_EW', 'River_ES', 'River_SW', 'River_WN'],
            'Anti-Clockwise\nRivers': ['River_NW', 'River_WE', 'River_WS', 'River_SN', 'River_SE', 'River_EN'],
            'Bridges': ['Bridge_River_NS', 'Bridge_River_SN', 'Bridge_River_WE', 'Bridge_River_EW']
        };
        this.currentRoadVariantIndex = 0;
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

    getDestroyMode() {
        return this.destroyMode;
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
    
            // If we're leaving the Visualise Generation Process menu, close the terrain display
            if (this.activeMenu === 'Visualise Generation Process') {
                options.visualiseTerrainGenerationProcess = false;
                this.isVisualisationMenu = false;
                TERRAIN_STATE_DISPLAY.terrainStateDisplay.openOrCloseTerrainDisplay();
                console.log("Visualisation disabled via menu close");
            }
    
            // Reset state
            this.activeMenu = 'Main';
            this.menuChain = [];
            
            // Reset destroy mode and cursor when closing menu
            this.destroyMode = false;
            document.body.style.cursor = 'default';
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
                
                // Make unused menu items 50% transparent
                const unusedItems = [
                    'Train\nTracks', 
                    'Power\nLines', 
                    'Pipes', 
                    'Fauna', 
                    'Population\nOptions', 
                    'Adjust\nWeights', 
                    'Tree',
                    'Save\nOptions'
                ];
                if (unusedItems.includes(item.text)) {
                    button.style.opacity = '0.5';
                    span.style.opacity = '0.5';
                } else {
                    button.style.opacity = '1.0';
                    span.style.opacity = '1.0';
                }
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
                        // Show confirmation popup instead of directly generating
                        GENERATION_STATE.generateMap = true;
                        this.showGenerateMapConfirmation();
                        break;
                    case 'weights':
                        // TODO: Implement weight adjustment
                        break;
                    case 'undo':
                        // Show confirmation popup instead of directly undoing
                        GENERATION_STATE.deleteMap = true;
                        this.showDeleteMapConfirmation();
                        break;
                }
            }
            // Handle Visualise Generation Process menu actions
            else if (menuName === 'Visualise Generation Process') {
                switch (selectedItem.action) {
                    case 'step_back':
                        generationProcessVisualiser.stepBack();
                        TERRAIN_STATE_DISPLAY.terrainStateDisplay.update();
                        break;
                    case 'play':
                        // If this is the first step, run initialization
                        if (GENERATION_STATE.currentStep === 0) {
                            generationProcessVisualiser.firstStep();
                            GENERATION_STATE.isGenerating = true;
                        }
                        generationProcessVisualiser.play();
                        TERRAIN_STATE_DISPLAY.terrainStateDisplay.update();
                        break;
                    case 'pause':
                        generationProcessVisualiser.pause();
                        TERRAIN_STATE_DISPLAY.terrainStateDisplay.update();
                        break;
                    case 'step_forward':
                        // If this is the first step, run initialization
                        if (GENERATION_STATE.currentStep === 0) {
                            generationProcessVisualiser.firstStep();
                            GENERATION_STATE.isGenerating = true;
                        }
                        generationProcessVisualiser.stepForward();
                        TERRAIN_STATE_DISPLAY.terrainStateDisplay.update();
                        break;
                    case 'play_speed':
                        const modal = document.getElementById('playSpeedModal');
                        const closeBtn = modal.querySelector('.modal-close');
                        const select = document.getElementById('modalPlaySpeedSelect');
                        const setSpeedBtn = document.getElementById('setSpeedBtn');
                        
                        // Set initial value to current divider
                        select.value = GENERATION_STATE.playSpeedDivider;
                        
                        // Add change event listener for select
                        select.onchange = (e) => {
                            // Just update the select value, don't change options yet
                            select.value = e.target.value;
                        };
                        
                        // Add click event listener for Set Speed button
                        setSpeedBtn.onclick = () => {
                            const dividerValue = parseInt(select.value);
                            // Update the playSpeedDivider in GenerationState
                            GENERATION_STATE.playSpeedDivider = dividerValue;
                            generationProcessVisualiser.setPlaySpeed(dividerValue);
                            modal.style.display = 'none';
                            // Remove escape key listener when modal closes
                            document.removeEventListener('keydown', handleEscape);
                        };
                        
                        // Function to handle escape key
                        const handleEscape = (event) => {
                            if (event.key === 'Escape') {
                                modal.style.display = 'none';
                                // Remove the event listener when modal closes
                                document.removeEventListener('keydown', handleEscape);
                            }
                        };
                        
                        // Add escape key listener when modal opens
                        document.addEventListener('keydown', handleEscape);
                        
                        // Show modal
                        modal.style.display = 'block';
                        
                        // Close button handler
                        closeBtn.onclick = () => {
                            modal.style.display = 'none';
                            // Remove escape key listener when modal closes
                            document.removeEventListener('keydown', handleEscape);
                        };
                        
                        // Click outside to close
                        window.onclick = (event) => {
                            if (event.target === modal) {
                                modal.style.display = 'none';
                                // Remove escape key listener when modal closes
                                document.removeEventListener('keydown', handleEscape);
                            }
                        };
                        break;
                }
            }
            // Handle Save Options menu actions
            else if (menuName === 'Save Options') {
                switch (selectedItem.action) {
                    case 'save':
                        // TODO: Implement save functionality
                        console.log('Save action triggered');
                        break;
                    case 'load':
                        // TODO: Implement load functionality
                        console.log('Load action triggered');
                        break;
                    case 'export_map':
                        // TODO: Implement export map functionality
                        console.log('Export map action triggered');
                        break;
                }
            }
            return;
        }

        // Handle leaf menu item (tile placement)
        if (menuData.isLeafMenu) {
            // Check if this is a destroy action
            if (selectedItem.text === 'Destroy') {
                this.destroyMode = true;
                this.selectedMenuItem = selectedItem;
                // Change cursor to destroy icon
                RENDERING.setDestroyCursor();
                return;
            }
            
            // Reset destroy mode when selecting a non-destroy item
            this.destroyMode = false;
            this.selectedMenuItem = selectedItem;
            // Reset cursor to default
            document.body.style.cursor = 'default';
            
            // Reset variant index when selecting a new item
            this.currentRoadVariantIndex = 0;
            
            // Clear any previous variant
            if (this.selectedMenuItem.currentVariant) {
                delete this.selectedMenuItem.currentVariant;
            }
            
            // Check if this is a river tile and log the flow direction
            if (selectedItem.text === 'Clockwise\nRivers' || selectedItem.text === 'Anti-Clockwise\nRivers') {
                const variants = this.roadVariants[selectedItem.text];
                if (variants && variants.length > 0) {
                    getRiverFlowDirection(variants[0]); // Log the default variant
                }
            }
            
            return;
        }
        
        // Handle Destroy buttons in non-leaf menus (Build Options, Landscape, Water)
        if (selectedItem.text === 'Destroy') {
            this.destroyMode = true;
            this.selectedMenuItem = selectedItem;
            // Change cursor to destroy icon
            RENDERING.setDestroyCursor();
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
            TERRAIN_STATE_DISPLAY.terrainStateDisplay.update();
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

    rotateSelectedDirection() {
        // Only cycle if a road item is selected
        if (!this.selectedMenuItem || !this.selectedMenuItem.text) return;
        
        const roadText = this.selectedMenuItem.text;
        const variants = this.roadVariants[roadText];
        
        if (variants) {
            // Cycle to next variant
            this.currentRoadVariantIndex = (this.currentRoadVariantIndex + 1) % variants.length;
            
            // Update the selectedMenuItem to reflect the new variant
            // We'll store the current variant in a custom property
            this.selectedMenuItem.currentVariant = variants[this.currentRoadVariantIndex];
            
            // Check if this is a river or bridge tile and log the flow direction
            if (roadText === 'Clockwise\nRivers' || roadText === 'Anti-Clockwise\nRivers' || roadText === 'Bridges') {
                getRiverFlowDirection(this.selectedMenuItem.currentVariant);
            }
        }
    }

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
            TERRAIN_STATE_DISPLAY.terrainStateDisplay.openOrCloseTerrainDisplay();
            console.log("Visualisation disabled");
        }
    
        // Update activeMenu and regenerate the menu
        this.activeMenu = previousMenu;
        this.generateDynamicMenu(previousMenu);
        
        // Reset destroy mode and cursor when navigating back
        this.destroyMode = false;
        document.body.style.cursor = 'default';
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

        // Initialize Options button
        const optionsButton = document.getElementById('optionsButton');
        if (optionsButton) {
            optionsButton.addEventListener('click', () => {
                this.showOptionsModal();
            });
        }
    }

    showDeleteMapConfirmation() {
        const confirmBtn = document.getElementById('confirmDelete');
        const cancelBtn = document.getElementById('cancelDelete');
        
        // Set state to show popup
        GENERATION_STATE.deleteMap = true;
        
        // Confirm button handler
        confirmBtn.onclick = () => {
            wfc.undo();
            GENERATION_STATE.deleteMap = false;
        };
        
        // Cancel button handler
        cancelBtn.onclick = () => {
            GENERATION_STATE.deleteMap = false;
        };
        
        // Click outside to close
        window.onclick = (event) => {
            const deleteMapPopup = document.getElementById('deleteMapPopup');
            if (event.target === deleteMapPopup) {
                GENERATION_STATE.deleteMap = false;
            }
        };
        
        // Escape key to close
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                GENERATION_STATE.deleteMap = false;
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    showGenerateMapConfirmation() {
        const confirmBtn = document.getElementById('confirmGenerate');
        const cancelBtn = document.getElementById('cancelGenerate');
        
        // Set state to show popup
        GENERATION_STATE.generateMap = true;
        
        // Confirm button handler
        confirmBtn.onclick = () => {
            // Set generation state to true before starting
            GENERATION_STATE.shouldShowGenerationPopup = true;
            
            // Start generation
            wfc.generateWFC();
            
            // Close the modal
            GENERATION_STATE.generateMap = false;
        };
        
        // Cancel button handler
        cancelBtn.onclick = () => {
            GENERATION_STATE.generateMap = false;
        };
        
        // Click outside to close
        window.onclick = (event) => {
            const generateMapPopup = document.getElementById('generateMapPopup');
            if (event.target === generateMapPopup) {
                GENERATION_STATE.generateMap = false;
            }
        };
        
        // Escape key to close
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                GENERATION_STATE.generateMap = false;
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    showOptionsModal() {
        const modal = document.getElementById('optionsModal');
        const closeBtn = modal.querySelector('.modal-close');
        
        // Disable map scrolling when modal opens
        options.disableMapScrolling = true;
        
        // Function to handle escape key
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
                // Re-enable map scrolling when modal closes
                options.disableMapScrolling = false;
                // Remove the event listener when modal closes
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        // Add escape key listener when modal opens
        document.addEventListener('keydown', handleEscape);
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listeners for options buttons
        const volumeButton = document.getElementById('volumeButton');
        const displayGridButton = document.getElementById('displayGridButton');
        const hotkeysButton = document.getElementById('hotkeysButton');
        const aboutButton = document.getElementById('aboutButton');
        
        // Volume button handler - removed since button is inactive
        // volumeButton.onclick = () => {
        //     console.log('Volume button clicked, current volume:', options.volume);
        //     // TODO: Implement volume control functionality
        //     alert(`Current volume: ${options.volume}`);
        // };
        
        // Display Grid button handler - removed since button is inactive
        // displayGridButton.onclick = () => {
        //     console.log('Display Grid button clicked, current displayGrid:', options.displayGrid);
        //     // TODO: Implement grid toggle functionality
        //     alert(`Display Grid is currently: ${options.displayGrid ? 'ON' : 'OFF'}`);
        // };
        
        // Hotkeys button handler
        hotkeysButton.onclick = () => {
            // Hide options modal
            modal.style.display = 'none';
            // Remove escape key listener when modal closes
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('click', handleOutsideClick);
            
            // Show hotkeys modal
            this.showHotkeysModal();
        };
        
        // About button handler
        aboutButton.onclick = () => {
            // Hide options modal
            modal.style.display = 'none';
            // Remove escape key listener when modal closes
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('click', handleOutsideClick);
            
            // Show about modal
            this.showAboutModal();
        };
        
        // Close button handler
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            // Re-enable map scrolling when modal closes
            options.disableMapScrolling = false;
            // Remove escape key listener when modal closes
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Click outside to close
        const handleOutsideClick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                // Re-enable map scrolling when modal closes
                options.disableMapScrolling = false;
                // Remove escape key listener when modal closes
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('click', handleOutsideClick);
            }
        };
        document.addEventListener('click', handleOutsideClick);
    }

    showHotkeysModal() {
        const modal = document.getElementById('hotkeysModal');
        const closeBtn = modal.querySelector('.modal-close');
        
        // Function to handle escape key
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
                // Re-enable map scrolling when modal closes
                options.disableMapScrolling = false;
                // Remove the event listener when modal closes
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        // Add escape key listener when modal opens
        document.addEventListener('keydown', handleEscape);
        
        // Show modal
        modal.style.display = 'block';
        
        // Close button handler
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            // Re-enable map scrolling when modal closes
            options.disableMapScrolling = false;
            // Remove escape key listener when modal closes
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Click outside to close
        const handleOutsideClick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                // Re-enable map scrolling when modal closes
                options.disableMapScrolling = false;
                // Remove escape key listener when modal closes
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('click', handleOutsideClick);
            }
        };
        document.addEventListener('click', handleOutsideClick);
    }

    showAboutModal() {
        const modal = document.getElementById('aboutModal');
        const closeBtn = modal.querySelector('.modal-close');
        
        // Function to handle escape key
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
                // Re-enable map scrolling when modal closes
                options.disableMapScrolling = false;
                // Remove the event listener when modal closes
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        // Add escape key listener when modal opens
        document.addEventListener('keydown', handleEscape);
        
        // Show modal
        modal.style.display = 'block';
        
        // Close button handler
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            // Re-enable map scrolling when modal closes
            options.disableMapScrolling = false;
            // Remove escape key listener when modal closes
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Click outside to close
        const handleOutsideClick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                // Re-enable map scrolling when modal closes
                options.disableMapScrolling = false;
                // Remove escape key listener when modal closes
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('click', handleOutsideClick);
            }
        };
        document.addEventListener('click', handleOutsideClick);
    }
}

export const buildMenu = new BuildMenu();

// Initialize event listeners after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    buildMenu.initializeMenu();
});
