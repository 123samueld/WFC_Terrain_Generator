import { 
    TERRAIN_GENERATOR, 
    INITIALISE, TERRAIN_TILE, 
    GENERATION_PROCESS_VISUALISER,
    PATHS
     
} from '../FilePathRouter.js';
import { options } from '../Options.js';
import { terrainStateDisplayItems } from './TerrainStateDisplayItems.js';
import { GENERATION_STATE } from './GenerationState.js';

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
        // Clear existing content
        for (let i = 0; i < 16; i++) {
            const cell = document.getElementById(`neighbor${i}`);
            if (cell) {
                cell.innerHTML = '';
                cell.style.backgroundColor = '';
            }
        }

        // Get the superposition tiles for the current cell
        let superpositionTiles = new Set();
        if (GENERATION_STATE.currentCell) {
            const cellIndex = GENERATION_STATE.currentCell.x + (GENERATION_STATE.currentCell.y * 36);
            superpositionTiles = GENERATION_STATE.superpositionTiles.get(cellIndex) || new Set();
        }
        
        if (superpositionTiles && superpositionTiles.size > 0) {
            // Convert Set to Array and display up to 16 tiles
            const tileArray = Array.from(superpositionTiles).slice(0, 16);
            
            tileArray.forEach((tileNumber, index) => {
                const cell = document.getElementById(`neighbor${index}`);
                if (cell) {
                    
                    // Use the mapping function to get the correct cartesian icon
                    const iconPath = GENERATION_PROCESS_VISUALISER.generationProcessVisualiser.getCartesianIconForSuperpositionTile(tileNumber);
                    
                    if (iconPath) {
                        const img = document.createElement('img');
                        img.src = iconPath;
                        img.style.width = '80%';
                        img.style.height = '80%';
                        img.style.objectFit = 'contain';
                        
                        // Get rotation value and apply it
                        const tileInfo = GENERATION_PROCESS_VISUALISER.generationProcessVisualiser.convertTileTypeToNewIndex(tileNumber);
                        if (tileInfo && tileInfo.rotation !== undefined) {
                            img.style.transform = `rotate(${tileInfo.rotation}deg)`;
                        }
                        
                        // Add error handling for image loading
                        img.onerror = () => {
                            const tileName = GENERATION_PROCESS_VISUALISER.generationProcessVisualiser.getTileTypeNameForSuperpositionTile(tileNumber);
                            cell.innerHTML = tileName;
                            cell.style.backgroundColor = '#ffcccc';
                        };
                        
                        cell.appendChild(img);
                    } else {
                        // If no cartesian icon available, show text
                        const tileName = GENERATION_PROCESS_VISUALISER.generationProcessVisualiser.getTileTypeNameForSuperpositionTile(tileNumber);

                        cell.innerHTML = tileName;
                        cell.style.backgroundColor = '#cccccc';
                        cell.style.display = 'flex';
                        cell.style.alignItems = 'center';
                        cell.style.justifyContent = 'center';
                        cell.style.fontSize = '10px';
                        cell.style.textAlign = 'center';
                    }
                } else {
                    console.log(`❌ Grid cell neighbor${index} not found in DOM`);
                }
            });
        }
    }

    openOrCloseTerrainDisplay() {
        // Update display state based on visualization flag
        if (options.visualiseTerrainGenerationProcess) {
            this.displayElement.classList.add('active');
        } else {
            this.displayElement.classList.remove('active');
        }
    }

    update() {
        
        // Simple update - just get current cell coordinates and update DOM
        let x = 0, y = 0;
        
        if (GENERATION_STATE.currentCell !== null) {
            x = GENERATION_STATE.currentCell.x;
            y = GENERATION_STATE.currentCell.y;
        }
        
        // Update Current Cell
        const currentCellElement = document.getElementById('currentCellValue');
        if (currentCellElement) {
            currentCellElement.textContent = `(${x}, ${y})`;
            currentCellElement.style.color = '#000';
        } else {
            console.error('currentCellValue element not found');
        }
        
        // Update Current Step
        const currentStepElement = document.getElementById('currentStepValue');
        if (currentStepElement) {
            currentStepElement.textContent = GENERATION_STATE.currentStep;
            currentStepElement.style.color = '#000';
        } else {
            console.error('currentStepValue element not found');
        }
        
        // Update Current Neighbour
        let neighborX = 0, neighborY = 0;
        if (GENERATION_STATE.currentNeighbor !== null) {
            neighborX = GENERATION_STATE.currentNeighbor.x;
            neighborY = GENERATION_STATE.currentNeighbor.y;
        }
        
        const currentNeighbourElement = document.getElementById('currentNeighbourValue');
        if (currentNeighbourElement) {
            currentNeighbourElement.textContent = `(${neighborX}, ${neighborY})`;
            currentNeighbourElement.style.color = '#000';
        } else {
            console.error('currentNeighbourValue element not found');
        }
        
        // Update the Superposition Options gri
        this.updatePotentialNeighborsGrid();
    }
}

export const terrainStateDisplay = new TerrainStateDisplay(); 