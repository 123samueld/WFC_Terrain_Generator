// BuildMenu.js
import { hotkeyManager } from './HotkeyManager.js';

class BuildMenu {
    constructor() {
        this.activeMenu = "Main";
        this.menuChain = [];
        this.nestedMenus = [
            "Main", 
            "Roads", 
            "Buildings", 
            "Train_Tracks", 
            "Power_Lines", 
            "Pipes"
        ];

        this.menuItems_Main = {
            isLeafMenu: false,
            items: [
                {
                    id: 0,
                    image: './Assets/Nested_Menu_Icons/Main_Menu_Icons/Roads.png',
                    text: 'Roads',
                    menu: 'Main'
                },
                {
                    id: 1,
                    image: './Assets/Nested_Menu_Icons/Main_Menu_Icons/Buildings.png',
                    text: 'Buildings',
                    menu: 'Main'
                },
                {
                    id: 2,
                    placeholder: true
                },
                {
                    id: 3,
                    placeholder: true
                },
                {
                    id: 4,
                    placeholder: true
                },
                {
                    id: 5,
                    placeholder: true
                },
                {
                    id: 9,
                    placeholder: true
                },
                {
                    id: 7,
                    placeholder: true
                },
                {
                    id: 8,
                    image: './Assets/Nested_Menu_Icons/Main_Menu_Icons/Back.png',
                    text: 'Back',
                    menu: 'Main'
                },
                {
                    id: 9,
                    placeholder: true
                },
                {
                    id: 10,
                    placeholder: true
                },
                {
                    id: 11,
                    placeholder: true
                }
            ]
        };
        
        this.menuItems_Roads = {
            isLeafMenu: true,
            items: [
                {
                    id: 0,
                    image: './Assets/Nested_Menu_Icons/Road_Menu_Icons/L_Curves/01_ES.png',
                    text: 'L_ES',
                    menu: 'Roads'
                },
                {
                    id: 1,
                    image: './Assets/Nested_Menu_Icons/Road_Menu_Icons/L_Curves/02_SW.png',
                    text: 'L_SW',
                    menu: 'Roads'
                },
                {
                    id: 2,
                    image: './Assets/Nested_Menu_Icons/Road_Menu_Icons/L_Curves/03_WN.png',
                    text: 'L_WN',
                    menu: 'Roads'
                },
                {
                    id: 3,
                    image: './Assets/Nested_Menu_Icons/Road_Menu_Icons/L_Curves/04_NE.png',
                    text: 'L_NE',
                    menu: 'Roads'
                },
                {
                    id: 4,
                    placeholder: true
                },
                {
                    id: 5,
                    placeholder: true
                },
                {
                    id: 6,
                    placeholder: true
                },
                {
                    id: 7,
                    placeholder: true
                },
                {
                    id: 8,
                    image: './Assets/Nested_Menu_Icons/Road_Menu_Icons/Back.png',
                    text: 'Back',
                    menu: 'Roads'
                },
                {
                    id: 9,
                    placeholder: true
                },
                {
                    id: 10,
                    placeholder: true
                },
                {
                    id: 11,
                    placeholder: true
                }
            ]
        };
        
        

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
        const menuPropertyName = `menuItems_${activeMenu}`;
        const menuData = this[menuPropertyName];
    
        if (!menuData || !Array.isArray(menuData.items)) {
            console.warn(`Menu items for '${activeMenu}' not found.`);
            return;
        } else {
            console.log(`Generating menu: ${menuPropertyName}`);
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
    
        const menuData = this[`menuItems_${menuName}`];
    
        if (!menuData || !Array.isArray(menuData.items)) {
            console.warn(`Menu '${menuName}' not found or malformed.`);
            return;
        }
    
        // Early out if current menu is a leaf
        if (menuData.isLeafMenu) {
            console.log(`'${menuName}' is a leaf menu. No further navigation.`);
            return;
        }
    
        const selectedItem = menuData.items[keyPressedID];
    
        if (!selectedItem) {
            console.warn(`No menu item at index '${keyPressedID}' in menu '${menuName}'.`);
            return;
        }
    
        const nextMenuName = selectedItem.text;
    
        const nextMenuData = this[`menuItems_${nextMenuName}`];
        if (!nextMenuData || !Array.isArray(nextMenuData.items)) {
            console.warn(`Submenu '${nextMenuName}' not found or malformed.`);
            return;
        }
    
        // Navigate to the selected menu (even if it's a leaf)
        this.menuChain.push(nextMenuName);
        this.activeMenu = nextMenuName;
        this.generateDynamicMenu(nextMenuName);
    
        if (nextMenuData.isLeafMenu) {
            console.log(`'${nextMenuName}' is a leaf menu.`);
            // Optional: handle leaf menu logic here
        }
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
        console.log("Back action triggered");
    
        // Remove the current (active) menu from the chain
        this.menuChain.pop();
    
        // Decide what the new active menu should be
        const previousMenu = this.menuChain.length > 0
            ? this.menuChain[this.menuChain.length - 1]
            : 'Main';
    
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

