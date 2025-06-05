import { TERRAIN_GENERATOR, INITIALISE } from '../FilePathRouter.js';
import { options } from '../Options.js';
import { terrainStateDisplayItems } from './TerrainStateDisplayItems.js';

class TerrainStateDisplay {
    constructor() {
        this.displayElement = document.getElementById('terrainGeneratorStateDisplay');
        this.menuContent = document.getElementById('generatorDisplayMenuContent');
        this.titleElement = document.getElementById('generatorDisplayMenuHeader');
        this.stateInfoElement = document.getElementById('stateInfo');
        this.lastHighlightedNeighbors = new Set();
        
        // Create initial display items
        this.createDisplayItems('wfc');
    }

    createDisplayItems(displayType) {
        const displayData = terrainStateDisplayItems[displayType];
        if (!displayData) return;

        // Update title
        this.titleElement.textContent = displayData.title;

        // Clear existing items
        this.stateInfoElement.innerHTML = '';

        // Create info rows
        displayData.items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'info-row';
            row.innerHTML = `
                <span class="info-label">${item.label}</span>
                <span class="info-value" id="${item.id}Value">${item.value}</span>
            `;
            this.stateInfoElement.appendChild(row);
        });
    }

    updatePotentialNeighborsGrid(wfc) {
        // Check if neighbors have changed
        const currentNeighbors = wfc.neighbourCells;
        if (this.lastHighlightedNeighbors.size === currentNeighbors.size && 
            [...this.lastHighlightedNeighbors].every(n => currentNeighbors.has(n))) {
            return; // No change in neighbors
        }

        console.log('Updating Potential Neighbors grid');
        this.lastHighlightedNeighbors = new Set(currentNeighbors);

        // Initialize the neighbors grid with road icons
        const roadIcons = [
            './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/01_Cross.png',
            './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/02_Straight.png',
            './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/03_T.png',
            './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/04_L.png',
            './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/05_Diagonal.png'
        ];

        // Clear existing content
        for (let i = 0; i < 12; i++) {
            const cell = document.getElementById(`neighbor${i}`);
            if (cell) {
                cell.innerHTML = '';
            }
        }

        // Add road icons to first 5 cells
        for (let i = 0; i < 5; i++) {
            const cell = document.getElementById(`neighbor${i}`);
            if (cell) {
                console.log('Adding icon to cell:', i);
                const img = document.createElement('img');
                img.src = roadIcons[i];
                img.style.width = '80%';
                img.style.height = '80%';
                img.style.objectFit = 'contain';
                cell.appendChild(img);
            } else {
                console.log('Cell not found:', i);
            }
        }
    }

    update() {
        // Update display state based on visualization flag
        if (options.visualiseTerrainGenerationProcess) {
            this.displayElement.classList.add('active');
        } else {
            this.displayElement.classList.remove('active');
        }

        // Update values if WFC is active
        if (options.visualiseTerrainGenerationProcess) {
            const wfc = TERRAIN_GENERATOR.wfc;
            if (wfc) {
                document.getElementById('currentStepValue').textContent = wfc.generationStep;
                document.getElementById('collapsedTilesValue').textContent = wfc.collapsedTiles.size;
                document.getElementById('superpositionTilesValue').textContent = wfc.superPositionTileSet.size;
                document.getElementById('setTilesValue').textContent = wfc.setTiles.size;
                document.getElementById('historyIndexValue').textContent = wfc.currentHistoryIndex;
                document.getElementById('historyLengthValue').textContent = wfc.stateHistory.length;

                // Update potential neighbors grid if we have highlighted neighbors
                if (wfc.neighbourCells && wfc.neighbourCells.size > 0) {
                    this.updatePotentialNeighborsGrid(wfc);
                } else {
                    // Clear the grid if no neighbor is highlighted
                    for (let i = 0; i < 12; i++) {
                        const cell = document.getElementById(`neighbor${i}`);
                        if (cell) {
                            cell.innerHTML = '';
                        }
                    }
                    this.lastHighlightedNeighbors.clear();
                }
            }
        }
    }
}

export const terrainStateDisplay = new TerrainStateDisplay(); 