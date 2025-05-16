// BuildMenu.js
import { hotkeyManager } from './HotkeyManager.js';

class BuildMenu {
    constructor() {
        this.activeMenu = "Roads";
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
                    id: '0',
                    image: './Assets/Nested_Menu_Icons/Main_Menu_Icons/Roads.png',
                    text: 'Roads',
                    link: '#',
                    menu: 'Main',
                    action: () => { console.log('Roads button selected'); }
                },
                {
                    id: '1',
                    image: './Assets/Nested_Menu_Icons/Main_Menu_Icons/Buildings.png',
                    text: 'Buildings',
                    link: '#',
                    menu: 'Main',
                    action: () => { console.log('Building button selected'); }
                },
                {
                    id: '8',
                    image: './Assets/Nested_Menu_Icons/Main_Menu_Icons/Back.png',
                    text: 'Back',
                    link: '#',
                    menu: 'Main',
                    action: () => { console.log('Back button selected'); }
                }
            ]
        };
        
        this.menuItems_Roads = {
            isLeafMenu: true,
            items: [
                {
                    id: '0',
                    image: './Assets/Nested_Menu_Icons/Road_Menu_Icons/Cross.png',
                    text: 'Cross',
                    link: '#',
                    menu: 'Roads',
                    action: () => { console.log('Cross tile selected'); }
                },
                {
                    id: '8',
                    image: './Assets/Nested_Menu_Icons/Road_Menu_Icons/Back.png',
                    text: 'Back',
                    link: '#',
                    menu: 'Roads',
                    action: () => { console.log('Back button selected'); }
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
            z: this.back,
            x: this.actionX,
            c: this.actionC,
            v: this.actionV,
            b: this.actionB
        };
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
    
        // Update the menu header text
        const menuHeader = document.getElementById('menuHeader');
        if (menuHeader) {
            menuHeader.innerText = activeMenu;
        }
    
        // Update Q button (first item)
        const itemQ = menuData.items[0];
        if (itemQ) {
            const qButton = document.getElementById('btnQ');
            const qButtonText = document.getElementById('QButtonText');
    
            if (qButton) {
                qButton.style.backgroundImage = `url('${itemQ.image}')`;
                qButton.onclick = itemQ.action;
            }
    
            if (qButtonText) {
                qButtonText.innerText = itemQ.text;
            }
        }
    
        // Update W button (second item)
        const itemW = menuData.items[1];
        if (itemW) {
            const wButton = document.getElementById('btnW');
            const wButtonText = document.getElementById('WButtonText');
    
            if (wButton) {
                wButton.style.backgroundImage = `url('${itemW.image}')`;
                wButton.onclick = itemW.action;
            }
    
            if (wButtonText) {
                wButtonText.innerText = itemW.text;
            }
        }
    }
    
    // Method to toggle the build menu
    toggleMenu() {
        const menuContent = document.getElementById('menuContent');
        const topLine = document.getElementById('topLine');
        const menuHeader = document.getElementById('menuHeader'); // Get the menuHeader element

        if (menuContent.style.opacity === '1') {
            menuContent.style.opacity = '0'; // Hide the menu content
            menuContent.style.height = '1px'; // Set height to minimal
            topLine.style.transform = 'translateY(0)'; // Move top line back down
        } else {
            menuContent.style.opacity = '1'; // Show the menu content
            menuContent.style.height = '500px'; // Set height to visible
        }

        // Update the menu header to reflect the active menu
        if (menuHeader) {
            menuHeader.innerText = this.activeMenu; // Set the header text to activeMenu
        }
    }

    handleMenuAction(menuName) {
        const menuData = this[`menuItems_${menuName}`];
    
        if (!menuData || !Array.isArray(menuData.items)) {
            console.warn(`Menu '${menuName}' not found or malformed.`);
            return;
        }
    
        if (!menuData.isLeafMenu) {
            this.menuChain.push(menuName);
            this.generateDynamicMenu(menuName);
        } else {
            console.log(`'${menuName}' is a leaf menu.`);
        }
    }

    // === Action Methods ===
    actionQ() { this.handleMenuAction(this.activeMenu); }
    actionW() { console.log("Action W triggered"); }
    actionE() { console.log("Action E triggered"); }
    actionR() { console.log("Action R triggered"); }
    actionA() { console.log("Action A triggered"); }
    actionS() { console.log("Action S triggered"); }
    actionD() { console.log("Action D triggered"); }
    actionF() { console.log("Action F triggered"); }
    actionZ() { this.back(); }
    actionX() { console.log("Action X triggered"); }
    actionC() { console.log("Action C triggered"); }
    actionV() { console.log("Action V triggered"); }
    actionB() {
        this.toggleMenu(); 
    }

    back() {
        console.log("Back action triggered");
    
        // Remove the current menu from the chain
        this.menuChain.pop();
    
        if (this.menuChain.length > 0) {
            // Go back to the previous menu
            const previousMenu = this.menuChain[this.menuChain.length - 1];
            this.handleMenuAction(previousMenu);
        } else {
            // If the chain is empty, go back to the main menu
            this.handleMenuAction('Main');
        }
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

