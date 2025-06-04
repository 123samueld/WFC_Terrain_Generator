import { TERRAIN_GENERATOR } from '../FilePathRouter.js';
import { options } from '../Options.js';

class TerrainStateDisplay {
    constructor() {
        this.displayElement = document.getElementById('terrainGeneratorStateDisplay');
        this.menuContent = document.getElementById('generatorDisplayMenuContent');
        this.currentStepValue = document.getElementById('currentStepValue');
        this.collapsedTilesValue = document.getElementById('collapsedTilesValue');
        this.superpositionTilesValue = document.getElementById('superpositionTilesValue');
        this.setTilesValue = document.getElementById('setTilesValue');
        this.historyIndexValue = document.getElementById('historyIndexValue');
        this.historyLengthValue = document.getElementById('historyLengthValue');
    }

    update() {
        // Update display state based on visualization flag
        if (options.visualiseTerrainGenerationProcess) {
            this.displayElement.classList.add('active');
        } else {
            this.displayElement.classList.remove('active');
        }
    }
}

export const terrainStateDisplay = new TerrainStateDisplay(); 