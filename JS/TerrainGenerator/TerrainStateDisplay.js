import { TERRAIN_GENERATOR, INITIALISE, TERRAIN_TILE, GENERATION_PROCESS_VISUALISER } from '../FilePathRouter.js';
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
        // Get the current step state from the visualizer
        const stepState = GENERATION_PROCESS_VISUALISER.generationProcessVisualiser.stepState;
        
        // Clear existing content
        for (let i = 0; i < 16; i++) {
            const cell = document.getElementById(`neighbor${i}`);
            if (cell) {
                cell.innerHTML = '';
                cell.style.backgroundColor = '';
            }
        }

        // Map of road types to their icon paths
        const roadIcons = {
            [TERRAIN_TILE.TileType.CROSS]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/cross.png',
            [TERRAIN_TILE.TileType.STRAIGHT_LATITUDE]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/straight_latitude.png',
            [TERRAIN_TILE.TileType.STRAIGHT_LONGITUDE]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/straight_longitude.png',
            [TERRAIN_TILE.TileType.T_JUNCTION_TOP]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/t_junction_top.png',
            [TERRAIN_TILE.TileType.T_JUNCTION_RIGHT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/t_junction_right.png',
            [TERRAIN_TILE.TileType.T_JUNCTION_BOTTOM]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/t_junction_bottom.png',
            [TERRAIN_TILE.TileType.T_JUNCTION_LEFT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/t_junction_left.png',
            [TERRAIN_TILE.TileType.L_CURVE_TOP_LEFT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/l_curve_top_left.png',
            [TERRAIN_TILE.TileType.L_CURVE_TOP_RIGHT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/l_curve_top_right.png',
            [TERRAIN_TILE.TileType.L_CURVE_BOTTOM_LEFT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/l_curve_bottom_left.png',
            [TERRAIN_TILE.TileType.L_CURVE_BOTTOM_RIGHT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/l_curve_bottom_right.png',
            [TERRAIN_TILE.TileType.DIAGONAL_TOP_LEFT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/diagonal_top_left.png',
            [TERRAIN_TILE.TileType.DIAGONAL_TOP_RIGHT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/diagonal_top_right.png',
            [TERRAIN_TILE.TileType.DIAGONAL_BOTTOM_LEFT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/diagonal_bottom_left.png',
            [TERRAIN_TILE.TileType.DIAGONAL_BOTTOM_RIGHT]: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/Generator_Display_Road_Icons/diagonal_bottom_right.png'
        };

        // Display all road types as placeholders
        const allRoadTypes = Object.keys(roadIcons);
        allRoadTypes.forEach((roadType, index) => {
            if (index < 16) { // Only use first 16 cells
                const cell = document.getElementById(`neighbor${index}`);
                if (cell) {
                    const img = document.createElement('img');
                    img.src = roadIcons[roadType];
                    img.style.width = '80%';
                    img.style.height = '80%';
                    img.style.objectFit = 'contain';
                    
                    // Add error handling for image loading
                    img.onerror = () => {
                        console.error(`Failed to load road icon: ${roadIcons[roadType]}`);
                        cell.innerHTML = `Road ${roadType}`;
                        cell.style.backgroundColor = '#ffcccc';
                    };
                    
                    img.onload = () => {
                        console.log(`Successfully loaded road icon: ${roadIcons[roadType]}`);
                    };
                    
                    cell.appendChild(img);
                }
            }
        });

        // If we have potential neighbor road types, display them
        if (stepState.potentialNeighborRoadTypes && stepState.potentialNeighborRoadTypes.length > 0) {
            console.log('Updating Potential Neighbors grid with road types:', stepState.potentialNeighborRoadTypes);
            
            // Add road icons for each neighbor's possible road types
            stepState.potentialNeighborRoadTypes.forEach((roadTypes, index) => {
                const cell = document.getElementById(`neighbor${index}`);
                if (cell && roadTypes.length > 0) {
                    
                    // Create a container for multiple road types
                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.flexWrap = 'wrap';
                    container.style.justifyContent = 'center';
                    container.style.alignItems = 'center';
                    container.style.gap = '2px';
                    
                    // Add icons for each possible road type
                    roadTypes.forEach(roadType => {
                        const iconPath = roadIcons[roadType];
                        if (iconPath) {
                            const img = document.createElement('img');
                            img.src = iconPath;
                            img.style.width = '40%';
                            img.style.height = '40%';
                            img.style.objectFit = 'contain';
                            
                            // Add error handling for image loading
                            img.onerror = () => {
                                console.error(`Failed to load road icon: ${iconPath}`);
                                cell.innerHTML = `Road ${roadType}`;
                                cell.style.backgroundColor = '#ffcccc';
                            };
                            
                            img.onload = () => {
                                console.log(`Successfully loaded road icon: ${iconPath}`);
                            };
                            
                            container.appendChild(img);
                        }
                    });
                    
                    cell.appendChild(container);
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
        console.log('update() called');
        console.log('Generation state from update(), current cell:', GENERATION_STATE.currentCell);
        
        // Simple update - just get current cell coordinates and update DOM
        let x = 0, y = 0;
        
        if (GENERATION_STATE.currentCell !== null) {
            x = GENERATION_STATE.currentCell.x;
            y = GENERATION_STATE.currentCell.y;
            console.log('Deconstructed x:', x, 'y:', y);
        }
        
        // Update Current Cell
        const currentCellElement = document.getElementById('currentCellValue');
        if (currentCellElement) {
            currentCellElement.textContent = `(${x}, ${y})`;
            currentCellElement.style.color = '#000';
            console.log('Updated Current Cell DOM with:', `(${x}, ${y})`);
        } else {
            console.error('currentCellValue element not found');
        }
        
        // Update Current Step
        const currentStepElement = document.getElementById('currentStepValue');
        if (currentStepElement) {
            currentStepElement.textContent = GENERATION_STATE.currentStep;
            currentStepElement.style.color = '#000';
            console.log('Updated Current Step DOM with:', GENERATION_STATE.currentStep);
        } else {
            console.error('currentStepValue element not found');
        }
        
        // Update Current Neighbour
        let neighborX = 0, neighborY = 0;
        if (GENERATION_STATE.currentNeighbor !== null) {
            neighborX = GENERATION_STATE.currentNeighbor.x;
            neighborY = GENERATION_STATE.currentNeighbor.y;
            console.log('Deconstructed neighbor x:', neighborX, 'y:', neighborY);
        }
        
        const currentNeighbourElement = document.getElementById('currentNeighbourValue');
        if (currentNeighbourElement) {
            currentNeighbourElement.textContent = `(${neighborX}, ${neighborY})`;
            currentNeighbourElement.style.color = '#000';
            console.log('Updated Current Neighbour DOM with:', `(${neighborX}, ${neighborY})`);
        } else {
            console.error('currentNeighbourValue element not found');
        }
    }
}

export const terrainStateDisplay = new TerrainStateDisplay(); 