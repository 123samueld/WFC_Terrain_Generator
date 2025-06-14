    // WFC.js - Wave Function Collapse algorithm for terrain generation
    import { INITIALISE, WFC_INITIALIZATION, TERRAIN_TILE, WFC_RULES, GENERATION_PROCESS_VISUALISER } from '../FilePathRouter.js';

    class WFC {
        constructor(gridSize = 36) {
            this.gridSize = gridSize;
            this.grid = new Array(gridSize * gridSize).fill(null);
            this.entropy = new Array(gridSize * gridSize).fill(null);
            this.possibleTiles = new Array(gridSize * gridSize).fill(null);
            
            // WFC state tracking
            this.collapsedTiles = new Set();  // Cells that have been collapsed to a single tile
            this.setTiles = new Set();        // Cells that are collapsed AND all neighbors are collapsed
            this.untouchedTiles = new Set();  // Cells that haven't been processed yet
            this.superpositionTiles = new Map();  // Set of possible tile types
            this.neighbourCells = new Set();  // Set of neighbour cells
            
            // Visualization state
            this.generationStep = 0;  // Track current step in generation process
            this.lastUpdatedCell = null;  // Track which cell was last updated
            this.isGenerating = false;  // Flag to indicate if generation is in progress

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
                collapsedTiles: new Set(this.collapsedTiles),
                setTiles: new Set(this.setTiles),
                untouchedTiles: new Set(this.untouchedTiles),
                superpositionTiles: new Map(this.superpositionTiles),
                generationStep: this.generationStep,
                lastUpdatedCell: this.lastUpdatedCell
            };

            // Remove any future states if we're not at the end of history
            if (this.currentHistoryIndex < this.stateHistory.length - 1) {
                console.log(`GENERATION: Removing ${this.stateHistory.length - (this.currentHistoryIndex + 1)} future states`);
                this.stateHistory = this.stateHistory.slice(0, this.currentHistoryIndex + 1);
            }

            // Add new state to history
            this.stateHistory.push(state);
            this.currentHistoryIndex = this.stateHistory.length - 1;
        }

        // Restore state from history
        restoreState(index) {
            if (index < 0 || index >= this.stateHistory.length) {
                console.log(`GENERATION: Invalid history index`);
                return false;
            }

            const state = this.stateHistory[index];
            
            // Restore all state properties
            this.grid = [...state.grid];
            this.entropy = [...state.entropy];
            this.possibleTiles = state.possibleTiles.map(tiles => tiles ? new Set(tiles) : null);
            this.collapsedTiles = new Set(state.collapsedTiles);
            this.setTiles = new Set(state.setTiles);
            this.untouchedTiles = new Set(state.untouchedTiles);
            this.superpositionTiles = new Map(state.superpositionTiles);
            this.generationStep = state.generationStep;
            this.lastUpdatedCell = state.lastUpdatedCell;

            this.currentHistoryIndex = index;
            return true;
        }

        // Step back one state
        stepBack() {
            console.log(`\nGENERATION: === Stepping Back ===`);
            console.log(`GENERATION: Current history index: ${this.currentHistoryIndex}`);
            console.log(`GENERATION: History length: ${this.stateHistory.length}`);
            
            if (this.currentHistoryIndex > 0) {
                const success = this.restoreState(this.currentHistoryIndex - 1);
                console.log(`GENERATION: Step back ${success ? 'successful' : 'failed'}`);
                return success;
            }
            
            console.log(`GENERATION: Cannot step back - already at initial state`);
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
            console.log("INITIALIZE 2: Starting processSetTiles");
            for (const index of this.collapsedTiles) {
                const neighbors = this.getNeighbourCells(index);
                const allCollapsed = neighbors.every(n => this.collapsedTiles.has(n));
                if (allCollapsed) {
                    const ix = index % this.gridSize;
                    const iy = Math.floor(index / this.gridSize);
                    console.log("INITIALIZE 2.1: Cell", `(${ix},${iy})`, "moved to setTiles");
                    this.setTiles.add(index);
                }
            }
            console.log("INITIALIZE 2.2: Finished processSetTiles");
        }

        // Maybe used in initialisation and regular WFC steps?
        propagateFromCollapsedTiles(roadTileTypes) {
            console.log("INITIALIZE 3: Starting propagateFromCollapsedTiles");
            const terrainTiles = INITIALISE.getTerrainTiles();
            const processedNeighbors = new Set();
        
            for (const index of this.collapsedTiles) {
                const currentTileType = this.grid[index];
                const currentTile = terrainTiles[currentTileType];
                if (!currentTile) continue;
        
                const neighbors = this.getNeighbourCells(index);
                const ix = index % this.gridSize;
                const iy = Math.floor(index / this.gridSize);
                console.log("INITIALIZE 3.1: Processing neighbors for cell", `(${ix},${iy})`, "with tile type", currentTileType);
        
                for (const neighborIndex of neighbors) {
                    if (processedNeighbors.has(neighborIndex)) continue;
                    processedNeighbors.add(neighborIndex);
        
                    if (!this.superpositionTiles.has(neighborIndex)) continue;
        
                    const direction = this.getDirectionBetween(index, neighborIndex);
                    const validTiles = this.getValidTilesForNeighbor(index, neighborIndex, direction, terrainTiles);
                    const nx = neighborIndex % this.gridSize;
                    const ny = Math.floor(neighborIndex / this.gridSize);
                    console.log("INITIALIZE 3.1.5: Valid tiles for cell", `(${nx},${ny})`, ":", Array.from(validTiles).map(type =>
                        Object.keys(TERRAIN_TILE.TileType).find(key => TERRAIN_TILE.TileType[key] === type)
                    ));
                    const currentSet = this.superpositionTiles.get(neighborIndex);
                    const intersection = new Set([...currentSet].filter(t => validTiles.has(t)));
        
                    this.superpositionTiles.set(neighborIndex, intersection);
                    const nx2 = neighborIndex % this.gridSize;
                    const ny2 = Math.floor(neighborIndex / this.gridSize);
                    console.log("INITIALIZE 3.2: Updated neighbor", `(${nx2},${ny2})`, "entropy to", intersection.size);
                }
            }
            console.log("INITIALIZE 3.3: Finished propagateFromCollapsedTiles");
        }

        // Maybe used in initialisation and regular WFC steps?
        getDirectionBetween(currentIndex, neighborIndex) {
            console.log("INITIALIZE 4: Starting getDirectionBetween");
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
            console.log("INITIALIZE 5: Starting getValidTilesForNeighbor");
            const currentTileType = this.grid[currentIndex];
            const currentTile = terrainTiles[currentTileType];
            console.log("INITIALIZE 5.1: Current tile type", currentTileType);
            console.log("INITIALIZE 5.2: Current tile", currentTile);
        
            const possibleTiles = this.superpositionTiles.get(neighborIndex);
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
            // Get access to game state buffers
            const { read, write } = INITIALISE.getGameStateBuffers();
            this.gameStateRead = read;
            this.gameStateWrite = write;
            
            // Initialize the grid
            this.initialize();
            
            // Set visualisation state
            this.isGenerating = true;
            this.generationStep = 0;
            
            // Main WFC loop
            let iterationCount = 0;
            const MAX_ITERATIONS = 150;
            
            while (!this.superPositionTileSetEmpty() && iterationCount < MAX_ITERATIONS) {
                // Save state before each iteration
                this.saveState();
                
                let cell = this.findLowestEntropyCell();
                
                this.collapseCell(cell);
                this.propagateConstraints(cell);
                this.generationStep++;
                iterationCount++;
            }
            
            return this.grid; // fully collapsed with valid constraints
        }

        // Update entropy for a cell based on its possible tiles
        updateEntropy(index = null) {
            if (index !== null) {
                // Update single cell
                if (this.collapsedTiles.has(index)) {
                    // For collapsed cells, calculate entropy based on neighbors
                    const neighbors = this.getNeighbourCells(index);
                    let totalNeighborEntropy = 0;
                    for (const neighborIndex of neighbors) {
                        const possibleTiles = this.superpositionTiles.get(neighborIndex);
                        if (possibleTiles) {
                            totalNeighborEntropy += possibleTiles.size;
                        }
                    }
                    this.entropy[index] = totalNeighborEntropy;
                } else {
                    // For cells in superposition, use number of possible tiles
                    const possibleTiles = this.superpositionTiles.get(index) || this.possibleTiles[index];
                    this.entropy[index] = possibleTiles ? possibleTiles.size : 0;
                }
            } else {
                // Update all cells
                for (let i = 0; i < this.gridSize * this.gridSize; i++) {
                    if (this.collapsedTiles.has(i)) {
                        // For collapsed cells, calculate entropy based on neighbors
                        const neighbors = this.getNeighbourCells(i);
                        let totalNeighborEntropy = 0;
                        for (const neighborIndex of neighbors) {
                            const possibleTiles = this.superpositionTiles.get(neighborIndex);
                            if (possibleTiles) {
                                totalNeighborEntropy += possibleTiles.size;
                            }
                        }
                        this.entropy[i] = totalNeighborEntropy;
                    } else {
                        // For cells in superposition, use number of possible tiles
                        const possibleTiles = this.superpositionTiles.get(i) || this.possibleTiles[i];
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
            for (const [index, possibleTiles] of this.superpositionTiles) {
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

            // Filter to only include neighbors that are still in superposition
            const validNeighbors = neighbors.filter(neighborIndex => 
                this.superpositionTiles.has(neighborIndex) && 
                !this.collapsedTiles.has(neighborIndex) &&
                !this.setTiles.has(neighborIndex)
            );

            // Update the neighbourCells Set with the new valid neighbors
            this.neighbourCells.clear();
            validNeighbors.forEach(index => {
                const nx = index % this.gridSize;
                const ny = Math.floor(index / this.gridSize);
                this.neighbourCells.add({ x: nx, y: ny });
            });

            return validNeighbors;
        }

        superPositionTileSetEmpty() {
            // Return true if there are no more cells in superposition
            return this.superpositionTiles.size === 0;
        }

        // Collapses current cell by using collapse rules. 
        // Handles some housekeeping for moving around cell data between sets.
        collapseCell(cell) {
            // Get the possible tiles for this cell from superposition
            const possibleTiles = this.superpositionTiles.get(cell);
            if (!possibleTiles || possibleTiles.size === 0) {
                return;
            }

            // Use WFCRules to select a tile from the possible tiles
            const selectedTile = WFC_RULES.collapseRules(possibleTiles);
            
            // Update the grid with the selected tile
            this.grid[cell] = selectedTile;
            
            // Remove from superposition since we've made a choice
            this.superpositionTiles.delete(cell);
            
            // Add to collapsedTiles
            this.collapsedTiles.add(cell);
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
            console.log("GENERATION 2.0: Processing cell", cell, "with tile type", currentTileName);
         
            const neighbors = this.getNeighbourCells(cell);
         
            for (const neighborIndex of neighbors) {
                if (this.superpositionTiles.has(neighborIndex)) {
                    const currentX = cell % this.gridSize;
                    const currentY = Math.floor(cell / this.gridSize);
                    const neighborX = neighborIndex % this.gridSize;
                    const neighborY = Math.floor(neighborIndex / this.gridSize);
         
                    let direction;
                    if (neighborX < currentX) direction = 'west';
                    else if (neighborX > currentX) direction = 'east';
                    else if (neighborY < currentY) direction = 'north';
                    else if (neighborY > currentY) direction = 'south';
         
                    const possibleTiles = this.superpositionTiles.get(neighborIndex);
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
                        console.log("GENERATION 2.1: Cell", neighborIndex, "valid tiles:", validTileNames);
                    }
         
                    this.superpositionTiles.set(neighborIndex, validTiles);
                    this.updateEntropy(neighborIndex);
                }
            }
         
            for (const collapsedIndex of this.collapsedTiles) {
                const collapsedNeighbors = this.getNeighbourCells(collapsedIndex);
                const allNeighborsCollapsed = collapsedNeighbors.every(neighborIndex =>
                    this.collapsedTiles.has(neighborIndex) || this.setTiles.has(neighborIndex)
                );
         
                if (allNeighborsCollapsed) {
                    this.collapsedTiles.delete(collapsedIndex);
                    this.setTiles.add(collapsedIndex);
                    const tileType = this.grid[collapsedIndex];
                    const tileName = Object.keys(TERRAIN_TILE.TileType).find(key => 
                        TERRAIN_TILE.TileType[key] === tileType
                    );
                    console.log("GENERATION 2.2: Cell", collapsedIndex, "moved to setTiles with type", tileName);
                }
            }
        }
        

        reset() {
            // Resets grid, entropy, and tile possibilities
            this.grid = new Array(this.gridSize * this.gridSize).fill(null);
            this.entropy = new Array(this.gridSize * this.gridSize).fill(null);
            this.possibleTiles = new Array(this.gridSize * this.gridSize).fill(null);
            this.collapsedTiles.clear();
            this.setTiles.clear();
            this.untouchedTiles.clear();
            this.superpositionTiles.clear();
            this.neighbourCells.clear();
            this.generationStep = 0;
            this.lastUpdatedCell = null;
            this.isGenerating = false;
            
            // Clear state history
            this.stateHistory = [];
            this.currentHistoryIndex = -1;
        }

        // Reset visualization state
        resetVisualization() {
            this.isGenerating = false;
            this.generationStep = 0;
            this.lastUpdatedCell = null;
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
            console.log("GENERATION: generateStep()");
            
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
                console.log("GENERATION: Socket configuration before collapse:", tileRoadSockets);
            }

            // Get neighbors before collapsing
            const neighbors = this.getNeighbourCells(cellIndex);
            
            // Collapse the cell
            this.collapseCell(cellIndex);
            
            // Process each neighbor
            for (const neighborIndex of neighbors) {
                this.propagateConstraints(neighborIndex);
            }

            this.generationStep++;
            return true;
        }
    }

    // Export a singleton instance
    export const wfc = new WFC();