// BuildMenu.js
import { hotkeyManager } from './HotkeyManager.js';

class BuildMenu {
    constructor() {
        this.bindings = {
            q: this.actionQ,
            w: this.actionW,
            e: this.actionE,
            r: this.actionR,
            a: this.actionA,
            s: this.actionS,
            d: this.actionD,
            f: this.actionF,
            z: this.back, // Back button
            x: this.actionX,
            c: this.actionC,
            v: this.actionV
        };
    }

    // Define actions for each key
    actionQ() {
        console.log("Action Q triggered");
        // Implement action for Q
    }

    actionW() {
        console.log("Action W triggered");
        // Implement action for W
    }

    actionE() {
        console.log("Action E triggered");
        // Implement action for E
    }

    actionR() {
        console.log("Action R triggered");
        // Implement action for R
    }

    actionA() {
        console.log("Action A triggered");
        // Implement action for A
    }

    actionS() {
        console.log("Action S triggered");
        // Implement action for S
    }

    actionD() {
        console.log("Action D triggered");
        // Implement action for D
    }

    actionF() {
        console.log("Action F triggered");
        // Implement action for F
    }

    back() {
        console.log("Back action triggered");
        // Implement back action
    }

    actionX() {
        console.log("Action X triggered");
        // Implement action for X
    }

    actionC() {
        console.log("Action C triggered");
        // Implement action for C
    }

    actionV() {
        console.log("Action V triggered");
        // Implement action for V
    }

    // Method to register key bindings
    registerBindings() {
        for (const [key, action] of Object.entries(this.bindings)) {
            hotkeyManager.register(key, action.bind(this), `Action for ${key}`);
        }
    }

    // Method to link buttons to actions
    linkButtons() {
        document.getElementById('btnQ').addEventListener('click', this.actionQ.bind(this));
        document.getElementById('btnW').addEventListener('click', this.actionW.bind(this));
        document.getElementById('btnE').addEventListener('click', this.actionE.bind(this));
        document.getElementById('btnR').addEventListener('click', this.actionR.bind(this));
        document.getElementById('btnA').addEventListener('click', this.actionA.bind(this));
        document.getElementById('btnS').addEventListener('click', this.actionS.bind(this));
        document.getElementById('btnD').addEventListener('click', this.actionD.bind(this));
        document.getElementById('btnF').addEventListener('click', this.actionF.bind(this));
        document.getElementById('btnZ').addEventListener('click', this.back.bind(this));
        document.getElementById('btnX').addEventListener('click', this.actionX.bind(this));
        document.getElementById('btnC').addEventListener('click', this.actionC.bind(this));
        document.getElementById('btnV').addEventListener('click', this.actionV.bind(this));
    }
}

// Export an instance of BuildMenu
export const buildMenu = new BuildMenu();