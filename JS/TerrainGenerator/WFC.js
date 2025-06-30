    // WFC.js - Wave Function Collapse functions for terrain generation
    import { 
        INITIALISE, 
        WFC_INITIALIZATION, 
        TERRAIN_TILE, 
        WFC_RULES, 
        GENERATION_PROCESS_VISUALISER,
        GENERATION_STATE,
        JS
    } from '../FilePathRouter.js';

    class WFC {
        constructor(gridSize = 36) {
            this.gridSize = gridSize;
            this.grid = new Array(gridSize * gridSize).fill(null);
            this.entropy = new Array(gridSize * gridSize).fill(null);
            this.possibleTiles = new Array(gridSize * gridSize).fill(null);
                       
            // State history tracking
            this.stateHistory = [];  // Array to store state snapshots
            this.currentHistoryIndex = -1;  // Current position in history
        }

        // Initialize the WFC grid
        initialize() {
            return WFC_INITIALIZATION.initialize(this);
        }

        // Save current state to history
        saveState() {
            // Create a deep copy of the current state
            const state = {
                grid: [...this.grid],
                entropy: [...this.entropy],
                possibleTiles: this.possibleTiles.map(tiles => tiles ? new Set(tiles) : null),
                collapsedTiles: new Set(GENERATION_STATE.collapsedTiles),
                setTiles: new Set(GENERATION_STATE.setTiles),
                untouchedTiles: new Set(GENERATION_STATE.untouchedTiles),
                superpositionTiles: new Map(GENERATION_STATE.superpositionTiles),
                currentStep: GENERATION_STATE.currentStep,
                lastUpdatedCell: GENERATION_STATE.lastUpdatedCell
            };

            // Remove any future states if we're not at the end of history
            if (this.currentHistoryIndex < this.stateHistory.length - 1) {
                this.stateHistory = this.stateHistory.slice(0, this.currentHistoryIndex + 1);
            }

            // Add new state to history
            this.stateHistory.push(state);
            this.currentHistoryIndex = this.stateHistory.length - 1;
        }

        // Restore state from history
        restoreState(index) {
            if (index < 0 || index >= this.stateHistory.length) {
                return false;
            }

            const state = this.stateHistory[index];
            
            // Restore all state properties
            this.grid = [...state.grid];
            this.entropy = [...state.entropy];
            this.possibleTiles = state.possibleTiles.map(tiles => tiles ? new Set(tiles) : null);
            GENERATION_STATE.collapsedTiles = new Set(state.collapsedTiles);
            GENERATION_STATE.setTiles = new Set(state.setTiles);
            GENERATION_STATE.untouchedTiles = new Set(state.untouchedTiles);
            GENERATION_STATE.superpositionTiles = new Map(state.superpositionTiles);
            GENERATION_STATE.currentStep = state.Step;
            GENERATION_STATE.lastUpdatedCell = state.lastUpdatedCell;

            this.currentHistoryIndex = index;
            return true;
        }

        // Step back one state
        stepBack() {
            if (this.currentHistoryIndex > 0) {
                const success = this.restoreState(this.currentHistoryIndex - 1);
                return success;
            }
            
            return false;
        }

        // Maybe used in initialisation and regular WFC steps?
        getRoadTileTypes() {
            return [
                TERRAIN_TILE.TileType.CROSS,
                TERRAIN_TILE.TileType.STRAIGHT_LATITUDE,
                TERRAIN_TILE.TileType.STRAIGHT_LONGITUDE,
                TERRAIN_TILE.TileType.L_CURVE_TOP_LEFT,
                TERRAIN_TILE.TileType.L_CURVE_TOP_RIGHT,
                TERRAIN_TILE.TileType.L_CURVE_BOTTOM_LEFT,
                TERRAIN_TILE.TileType.L_CURVE_BOTTOM_RIGHT,
                TERRAIN_TILE.TileType.T_JUNCTION_TOP,
                TERRAIN_TILE.TileType.T_JUNCTION_RIGHT,
                TERRAIN_TILE.TileType.T_JUNCTION_BOTTOM,
                TERRAIN_TILE.TileType.T_JUNCTION_LEFT,
                TERRAIN_TILE.TileType.DIAGONAL_TOP_LEFT,
                TERRAIN_TILE.TileType.DIAGONAL_TOP_RIGHT,
                TERRAIN_TILE.TileType.DIAGONAL_BOTTOM_LEFT,
                TERRAIN_TILE.TileType.DIAGONAL_BOTTOM_RIGHT
            ];
        }


        // Maybe used in initialisation and regular WFC steps?
        processSetTiles() {
            for (const index of GENERATION_STATE.collapsedTiles) {
                const neighbors = this.getNeighbourCells(index);
                const allCollapsed = neighbors.every(n => GENERATION_STATE.collapsedTiles.has(n));
                if (allCollapsed) {
                    const ix = index % this.gridSize;
                    const iy = Math.floor(index / this.gridSize);
                    GENERATION_STATE.setTiles.add(index);
                }
            }
        }

        // Maybe used in initialisation and regular WFC steps?
        propagateFromCollapsedTiles(roadTileTypes) {
            const terrainTiles = INITIALISE.getTerrainTiles();
            const processedNeighbors = new Set();
        
            for (const index of GENERATION_STATE.collapsedTiles) {
                const currentTileType = this.grid[index];
                const currentTile = terrainTiles[currentTileType];
                if (!currentTile) continue;
        
                const neighbors = this.getNeighbourCells(index);
                const ix = index % this.gridSize;
                const iy = Math.floor(index / this.gridSize);
        
                for (const neighborIndex of neighbors) {
                    if (processedNeighbors.has(neighborIndex)) continue;
                    processedNeighbors.add(neighborIndex);
        
                    if (!GENERATION_STATE.superpositionTiles.has(neighborIndex)) continue;
        
                    const direction = this.getDirectionBetween(index, neighborIndex);
                    const validTiles = this.getValidTilesForNeighbor(index, neighborIndex, direction, terrainTiles);
                    const nx = neighborIndex % this.gridSize;
                    const ny = Math.floor(neighborIndex / this.gridSize);
                    const currentSet = GENERATION_STATE.superpositionTiles.get(neighborIndex);
                    const intersection = new Set([...currentSet].filter(t => validTiles.has(t)));
        
                    GENERATION_STATE.superpositionTiles.set(neighborIndex, intersection);
                    const nx2 = neighborIndex % this.gridSize;
                    const ny2 = Math.floor(neighborIndex / this.gridSize);
                }
            }
        }

        // Maybe used in initialisation and regular WFC steps?
        getDirectionBetween(currentIndex, neighborIndex) {
            const cx = currentIndex % this.gridSize;
            const cy = Math.floor(currentIndex / this.gridSize);
            const nx = neighborIndex % this.gridSize;
            const ny = Math.floor(neighborIndex / this.gridSize);
        
            if (nx < cx) return 'west';
            if (nx > cx) return 'east';
            if (ny < cy) return 'north';
            if (ny > cy) return 'south';
            return null;
        }

        // Maybe used in initialisation and regular WFC steps?
        getValidTilesForNeighbor(currentIndex, neighborIndex, direction, terrainTiles) {
            const currentTileType = this.grid[currentIndex];
            const currentTile = terrainTiles[currentTileType];
        
            const possibleTiles = GENERATION_STATE.superpositionTiles.get(neighborIndex);
            const valid = new Set();
        
            for (const tileType of possibleTiles) {
                const neighborTile = terrainTiles[tileType];
                if (neighborTile && WFC_RULES.propagationRules(currentTile, neighborTile, direction)) {
                    valid.add(tileType);
                }
            }
        
            return valid;
        }
        

        generateWFC() {
            // Set generation state to true before starting
            GENERATION_STATE.isGenerating = true;
            
            // Add a small delay to allow popup to render
            setTimeout(() => {
                this.performGeneration();
            }, 200); // 200ms delay
        }
        
        async performGeneration() {
            // Get access to game state buffers
            const { read, write } = INITIALISE.getGameStateBuffers();
            this.gameStateRead = read;
            this.gameStateWrite = write;
            
            // Initialize the grid
            this.initialize();
            
            // Main WFC loop
            while (!this.superPositionTileSetEmpty()) {
                // Save state before each iteration
                this.saveState();
                
                let cell = this.findLowestEntropyCell();
                
                // Check if we found a valid cell to collapse
                if (cell === null) {
                    break;
                }
                
                this.collapseCell(cell);
                this.propagateConstraints(cell);
                GENERATION_STATE.generationStep++;
                
                // Yield control to browser every 10 steps to allow UI updates
                if (GENERATION_STATE.generationStep % 10 === 0) {
                    // Use setTimeout to yield control to the browser
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
            
            // Set generation state to false when complete
            GENERATION_STATE.isGenerating = false;
            GENERATION_STATE.shouldShowGenerationPopup = false; // Reset popup flag when generation is complete
            
            return this.grid; // fully collapsed with valid constraints
        }

        // Update entropy for a cell based on its possible tiles
        updateEntropy(index = null) {
            if (index !== null) {
                // Update single cell
                if (GENERATION_STATE.collapsedTiles.has(index)) {
                    // For collapsed cells, calculate entropy based on neighbors
                    const neighbors = this.getNeighbourCells(index);
                    let totalNeighborEntropy = 0;
                    for (const neighborIndex of neighbors) {
                        const possibleTiles = GENERATION_STATE.superpositionTiles.get(neighborIndex);
                        if (possibleTiles) {
                            totalNeighborEntropy += possibleTiles.size;
                        }
                    }
                    this.entropy[index] = totalNeighborEntropy;
                } else {
                    // For cells in superposition, use number of possible tiles
                    const possibleTiles = GENERATION_STATE.superpositionTiles.get(index) || this.possibleTiles[index];
                    this.entropy[index] = possibleTiles ? possibleTiles.size : 0;
                }
            } else {
                // Update all cells
                for (let i = 0; i < this.gridSize * this.gridSize; i++) {
                    if (GENERATION_STATE.collapsedTiles.has(i)) {
                        // For collapsed cells, calculate entropy based on neighbors
                        const neighbors = this.getNeighbourCells(i);
                        let totalNeighborEntropy = 0;
                        for (const neighborIndex of neighbors) {
                            const possibleTiles = GENERATION_STATE.superpositionTiles.get(neighborIndex);
                            if (possibleTiles) {
                                totalNeighborEntropy += possibleTiles.size;
                            }
                        }
                        this.entropy[i] = totalNeighborEntropy;
                    } else {
                        // For cells in superposition, use number of possible tiles
                        const possibleTiles = GENERATION_STATE.superpositionTiles.get(i) || this.possibleTiles[i];
                        this.entropy[i] = possibleTiles ? possibleTiles.size : 0;
                    }
                }
            }
        }

        // Find the cell with the lowest entropy
        findLowestEntropyCell() {
            let lowestEntropy = Infinity;
            let lowestEntropyCells = [];

            // Search through superposition tiles to find lowest entropy
            for (const [index, possibleTiles] of GENERATION_STATE.superpositionTiles) {
                const entropy = possibleTiles.size;
                
                if (entropy < lowestEntropy) {
                    lowestEntropy = entropy;
                    lowestEntropyCells = [index];
                } else if (entropy === lowestEntropy) {
                    lowestEntropyCells.push(index);
                }
            }

            if (lowestEntropyCells.length === 0) {
                return null;
            }

            const selectedIndex = lowestEntropyCells[Math.floor(Math.random() * lowestEntropyCells.length)];
            return selectedIndex;
        }

        getNeighbourCells(cell) {
            const x = cell % this.gridSize;
            const y = Math.floor(cell / this.gridSize);
            const neighbors = [];

            // Check all four directions
            if (x > 0) neighbors.push(cell - 1);                    // Left
            if (x < this.gridSize - 1) neighbors.push(cell + 1);   // Right
            if (y > 0) neighbors.push(cell - this.gridSize);       // Top
            if (y < this.gridSize - 1) neighbors.push(cell + this.gridSize); // Bottom

            // Return ALL neighbors - don't filter out collapsed or set tiles
            // The constraint propagation will handle which neighbors need processing
            const validNeighbors = neighbors.filter(neighborIndex => 
                neighborIndex >= 0 && neighborIndex < this.gridSize * this.gridSize
            );

            // Update the neighbourCells Set with the new valid neighbors
            GENERATION_STATE.neighbourCells.clear();
            validNeighbors.forEach(index => {
                const nx = index % this.gridSize;
                const ny = Math.floor(index / this.gridSize);
                GENERATION_STATE.neighbourCells.add({ x: nx, y: ny });
            });

            return validNeighbors;
        }

        superPositionTileSetEmpty() {
            // Return true if there are no more cells in superposition
            return GENERATION_STATE.superpositionTiles.size === 0;
        }

        // Collapses current cell by using collapse rules. 
        // Handles some housekeeping for moving around cell data between sets.
        collapseCell(cell) {
            // Get the possible tiles for this cell from superposition
            const possibleTiles = GENERATION_STATE.superpositionTiles.get(cell);
            if (!possibleTiles || possibleTiles.size === 0) {
                return;
            }

            // Use WFCRules to select a tile from the possible tiles
            const selectedTile = WFC_RULES.collapseRules(possibleTiles);
            
            // Update the grid with the selected tile
            this.grid[cell] = selectedTile;
            
            // Update the game state with the selected tile
            const x = cell % this.gridSize;
            const y = Math.floor(cell / this.gridSize);
            const { write } = INITIALISE.getGameStateBuffers();
            write.setTile(x, y, selectedTile);
            
            // Remove from superposition since we've made a choice
            GENERATION_STATE.superpositionTiles.delete(cell);
            
            // Add to collapsedTiles
            GENERATION_STATE.collapsedTiles.add(cell);
            GENERATION_STATE.tilesCompleted++;
        }

        // Get's current cells neighbours.
        // Applies constraint rules to neighbours.
        // Calls update for neighbour entropies.
        propagateConstraints(cell) {
            const currentTileType = this.grid[cell];
            if (!currentTileType) return;
         
            const terrainTiles = INITIALISE.getTerrainTiles();
            const currentTile = terrainTiles[currentTileType];
            if (!currentTile) return;

            // Get tile type name
            const currentTileName = Object.keys(TERRAIN_TILE.TileType).find(key => 
                TERRAIN_TILE.TileType[key] === currentTileType
            );
         
            const neighbors = this.getNeighbourCells(cell);
         
            for (const neighborIndex of neighbors) {
                if (GENERATION_STATE.superpositionTiles.has(neighborIndex)) {
                    const currentX = cell % this.gridSize;
                    const currentY = Math.floor(cell / this.gridSize);
                    const neighborX = neighborIndex % this.gridSize;
                    const neighborY = Math.floor(neighborIndex / this.gridSize);
         
                    let direction;
                    if (neighborX < currentX) direction = 'west';
                    else if (neighborX > currentX) direction = 'east';
                    else if (neighborY < currentY) direction = 'north';
                    else if (neighborY > currentY) direction = 'south';
         
                    const possibleTiles = GENERATION_STATE.superpositionTiles.get(neighborIndex);
                    const validTiles = new Set();
         
                    for (const tileType of possibleTiles) {
                        const neighborTile = terrainTiles[tileType];
                        if (neighborTile && WFC_RULES.propagationRules(currentTile, neighborTile, direction)) {
                            validTiles.add(tileType);
                        }
                    }
         
                    // Only log if entropy has changed
                    const oldEntropy = possibleTiles.size;
                    const newEntropy = validTiles.size;
                    if (newEntropy !== oldEntropy) {
                        // Convert tile type numbers to names
                        const validTileNames = Array.from(validTiles).map(type => 
                            Object.keys(TERRAIN_TILE.TileType).find(key => 
                                TERRAIN_TILE.TileType[key] === type
                            )
                        );
                    }
         
                    GENERATION_STATE.superpositionTiles.set(neighborIndex, validTiles);
                    this.updateEntropy(neighborIndex);
                }
            }
         
            for (const collapsedIndex of GENERATION_STATE.collapsedTiles) {
                const collapsedNeighbors = this.getNeighbourCells(collapsedIndex);
                const allNeighborsCollapsed = collapsedNeighbors.every(neighborIndex =>
                    GENERATION_STATE.collapsedTiles.has(neighborIndex) || GENERATION_STATE.setTiles.has(neighborIndex)
                );
         
                if (allNeighborsCollapsed) {
                    GENERATION_STATE.collapsedTiles.delete(collapsedIndex);
                    GENERATION_STATE.setTiles.add(collapsedIndex);
                    const tileType = this.grid[collapsedIndex];
                    const tileName = Object.keys(TERRAIN_TILE.TileType).find(key => 
                        TERRAIN_TILE.TileType[key] === tileType
                    );
                }
            }
        }
        

        reset() {
            // Resets grid, entropy, and tile possibilities
            this.grid = new Array(this.gridSize * this.gridSize).fill(null);
            this.entropy = new Array(this.gridSize * this.gridSize).fill(null);
            this.possibleTiles = new Array(this.gridSize * this.gridSize).fill(null);
            GENERATION_STATE.collapsedTiles.clear();
            GENERATION_STATE.setTiles.clear();
            GENERATION_STATE.untouchedTiles.clear();
            GENERATION_STATE.superpositionTiles.clear();
            GENERATION_STATE.neighbourCells.clear();
            GENERATION_STATE.currentStep = 0;
            GENERATION_STATE.tilesCompleted = 0; // Reset tiles completed counter
            GENERATION_STATE.lastUpdatedCell = null;
            GENERATION_STATE.isGenerating = false;
            GENERATION_STATE.shouldShowGenerationPopup = false; // Reset popup flag
            
            // Clear state history
            this.stateHistory = [];
            this.currentHistoryIndex = -1;
        }

        undo() {
            // Reset WFC state
            this.reset();
            
            // Clear game state buffers
            const { read, write } = INITIALISE.getGameStateBuffers();
            
            // Clear all tiles in the game state
            for (let x = 0; x < this.gridSize; x++) {
                for (let y = 0; y < this.gridSize; y++) {
                    write.setTile(x, y, null);
                    read.setTile(x, y, null);
                }
            }
            
            console.log('WFC state and map cleared');
        }

        // Reset visualization state
        resetVisualization() {
            GENERATION_STATE.isGenerating = false;
            GENERATION_STATE.currentStep = 0;
            GENERATION_STATE.lastUpdatedCell = null;
            GENERATION_STATE.shouldShowGenerationPopup = false; // Reset popup flag
            GENERATION_PROCESS_VISUALISER.clearHighlights();
            
            // Clear state history
            this.stateHistory = [];
            this.currentHistoryIndex = -1;
        }

        // Get road socket configuration for a terrain tile at given coordinates
        getTerrainTileRoadSockets(cell) {
            // Get the tile type for the current cell
            const tileType = this.grid[cell];
            
            // Get the terrain tiles from INITIALISE
            const terrainTiles = INITIALISE.getTerrainTiles();
            
            // Get the terrain tile object
            const terrainTile = terrainTiles[tileType];
            
            // Get the road sockets
            const roadSockets = terrainTile?.roadSockets;
            
            if (!terrainTile || !roadSockets) {
                return null;
            }
            
            return roadSockets;
        }

        // Step-by-step generation for visualization
        generateStep(cellIndex = null) {
            
            // Save state before making changes
            this.saveState();

            // Check if we're done
            if (this.superPositionTileSetEmpty()) {
                return false;
            }

            // If no cellIndex provided, find the cell with lowest entropy
            if (!cellIndex) {
                cellIndex = this.findLowestEntropyCell();
                if (cellIndex === null) {
                    return false;
                }
            }

            // Get socket configuration before collapsing
            const tileRoadSockets = this.getTerrainTileRoadSockets(cellIndex);
            if (tileRoadSockets) {
            }

            // Get neighbors before collapsing
            const neighbors = this.getNeighbourCells(cellIndex);
            
            // Collapse the cell
            this.collapseCell(cellIndex);
            
            // Process each neighbor
            for (const neighborIndex of neighbors) {
                this.propagateConstraints(neighborIndex);
            }

            GENERATION_STATE.currentStep++;
            return true;
        }
    }

    // Export a singleton instance
    export const wfc = new WFC();