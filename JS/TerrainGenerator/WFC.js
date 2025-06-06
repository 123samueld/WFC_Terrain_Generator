    // WFC.js - Wave Function Collapse algorithm for terrain generation
    import { INITIALISE, TERRAIN_TILE, COLLAPSE_RULES,GENERATION_PROCESS_VISUALISER } from '../FilePathRouter.js';

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
                console.log(`Removing ${this.stateHistory.length - (this.currentHistoryIndex + 1)} future states`);
                this.stateHistory = this.stateHistory.slice(0, this.currentHistoryIndex + 1);
            }

            // Add new state to history
            this.stateHistory.push(state);
            this.currentHistoryIndex = this.stateHistory.length - 1;

        }

        // Restore state from history
        restoreState(index) {

            
            if (index < 0 || index >= this.stateHistory.length) {
                console.log(`Invalid history index`);
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
            console.log(`\n=== Stepping Back ===`);
            console.log(`Current history index: ${this.currentHistoryIndex}`);
            console.log(`History length: ${this.stateHistory.length}`);
            
            if (this.currentHistoryIndex > 0) {
                const success = this.restoreState(this.currentHistoryIndex - 1);
                console.log(`Step back ${success ? 'successful' : 'failed'}`);
                return success;
            }
            
            console.log(`Cannot step back - already at initial state`);
            return false;
        }

        // Initialize the WFC grid with all possible tiles
        initialize() {
            // Get access to game state to check for pre-placed tiles
            const { read } = INITIALISE.getGameStateBuffers();
            
            // Only use road-related tile types
            const roadTileTypes = [
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

            // First pass: Initialize all cells and identify pre-placed tiles
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    const index = y * this.gridSize + x;
                    const tileType = read.getTile(x, y);
                    
                    if (tileType) {
                        // If there's a pre-placed tile, add it to collapsedTiles
                        this.collapsedTiles.add(index);
                        this.grid[index] = tileType;
                        this.possibleTiles[index] = new Set([tileType]);
                        this.entropy[index] = 1; // Collapsed cells have entropy of 1
                    } else {
                        // If no tile is placed, add to untouchedTiles and initialize superposition
                        this.untouchedTiles.add(index);
                        this.possibleTiles[index] = new Set(roadTileTypes);
                        this.superpositionTiles.set(index, new Set(roadTileTypes));
                        this.entropy[index] = roadTileTypes.length; // Initial entropy is number of possible tiles
                    }
                }
            }

            // Second pass: Check neighbors of pre-placed tiles and categorize them
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    const index = y * this.gridSize + x;
                    if (this.collapsedTiles.has(index)) {
                        // Get neighbors of this collapsed cell
                        const neighbors = this.getNeighbourCells(index);
                        
                        // Check if all neighbors are also collapsed
                        const allNeighborsCollapsed = neighbors.every(neighborIndex => this.collapsedTiles.has(neighborIndex));
                        
                        if (allNeighborsCollapsed) {
                            // If all neighbors are collapsed, add to setTiles
                            this.setTiles.add(index);
                        }
                        
                        // Update neighbors that are in superposition
                        for (const neighborIndex of neighbors) {
                            if (this.superpositionTiles.has(neighborIndex)) {
                                // For now, just reduce entropy by 1 for each collapsed neighbor
                                // This will be replaced with proper constraint checking later
                                const currentEntropy = this.entropy[neighborIndex];
                                this.entropy[neighborIndex] = Math.max(1, currentEntropy - 1);
                            }
                        }
                    }
                }
            }

            // Save initial state
            this.saveState();
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
            let lowestEntropyCells = [];  // Array to store cells with equal lowest entropy

            // Only consider cells that are in collapsedTiles (have a terrain type)
            for (const index of this.collapsedTiles) {
                // Skip cells that are already in setTiles
                if (this.setTiles.has(index)) continue;

                const entropy = this.entropy[index];
                
                if (entropy < lowestEntropy) {
                    // Found a new lowest entropy
                    lowestEntropy = entropy;
                    lowestEntropyCells = [index];
                } else if (entropy === lowestEntropy) {
                    // Found another cell with the same lowest entropy
                    lowestEntropyCells.push(index);
                }
            }

            // If no valid cells found, return null
            if (lowestEntropyCells.length === 0) {
                return null;
            }

            // Randomly select from cells with equal lowest entropy
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

        collapseCell(cell) {
            // Get the possible tiles for this cell
            const possibleTiles = this.superpositionTiles.get(cell);
            if (!possibleTiles || possibleTiles.size === 0) {
                return;
            }

            // Convert Set to Array for random selection
            const tileArray = Array.from(possibleTiles);
            
            // Randomly select one tile
            const selectedTile = tileArray[Math.floor(Math.random() * tileArray.length)];
            
            // Update the grid and remove from superposition
            this.grid[cell] = selectedTile;
            this.superpositionTiles.delete(cell);
            
            // Add to collapsedTiles
            this.collapsedTiles.add(cell);
            
            // Check if all neighbors are collapsed
            const neighbors = this.getNeighbourCells(cell);
            const allNeighborsCollapsed = neighbors.every(neighborIndex => this.collapsedTiles.has(neighborIndex));
            
            // If all neighbors are collapsed, move from collapsedTiles to setTiles
            if (allNeighborsCollapsed) {
                this.collapsedTiles.delete(cell);
                this.setTiles.add(cell);
            }
        }

        propagateConstraints(cell) {
            // Get the current cell's tile type and its socket configuration
            const currentTileType = this.grid[cell];
            if (!currentTileType) return;

            const currentTile = TERRAIN_TILE.terrainTiles[currentTileType];
            if (!currentTile) return;

            // Get the neighbour cells that are still in superposition
            const neighbors = this.getNeighbourCells(cell);
            
            // For each neighbor that's still in superposition
            for (const neighborIndex of neighbors) {
                if (this.superpositionTiles.has(neighborIndex)) {
                    // Determine the direction of this neighbor relative to the current cell
                    const currentX = cell % this.gridSize;
                    const currentY = Math.floor(cell / this.gridSize);
                    const neighborX = neighborIndex % this.gridSize;
                    const neighborY = Math.floor(neighborIndex / this.gridSize);
                    
                    // Determine which direction this neighbor is in
                    let direction;
                    if (neighborX < currentX) direction = 'west';
                    else if (neighborX > currentX) direction = 'east';
                    else if (neighborY < currentY) direction = 'north';
                    else if (neighborY > currentY) direction = 'south';
                    
                    // Get the opposite direction for socket matching
                    const oppositeDirection = {
                        'north': 'south',
                        'south': 'north',
                        'east': 'west',
                        'west': 'east'
                    }[direction];
                    
                    // Get the current cell's socket state for this direction
                    const currentSocketState = currentTile.roadSockets[direction];
                    
                    // Filter the neighbor's possible tiles to only those that have matching sockets
                    const possibleTiles = this.superpositionTiles.get(neighborIndex);
                    if (possibleTiles) {
                        const validTiles = new Set();
                        for (const tileType of possibleTiles) {
                            const tile = TERRAIN_TILE.terrainTiles[tileType];
                            if (tile && tile.roadSockets[oppositeDirection] === currentSocketState) {
                                validTiles.add(tileType);
                            }
                        }
                        
                        // Update the neighbor's possible tiles
                        this.superpositionTiles.set(neighborIndex, validTiles);
                        this.updateEntropy(neighborIndex);
                    }
                }
            }

            // After propagating constraints, check if any collapsed cells should be moved to setTiles
            for (const collapsedIndex of this.collapsedTiles) {
                const collapsedNeighbors = this.getNeighbourCells(collapsedIndex);
                const allNeighborsCollapsed = collapsedNeighbors.every(neighborIndex => 
                    this.collapsedTiles.has(neighborIndex) || this.setTiles.has(neighborIndex)
                );
                
                if (allNeighborsCollapsed) {
                    this.collapsedTiles.delete(collapsedIndex);
                    this.setTiles.add(collapsedIndex);
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

        // Step-by-step generation for visualization
        generateStep() {
            // Save state before making changes
            this.saveState();

            // Check if we're done
            if (this.superPositionTileSetEmpty()) {
                return false;
            }

            // Find the cell with lowest entropy
            let cellIndex = this.findLowestEntropyCell();
            if (cellIndex === null) {
                return false;
            }

            // Collapse the cell and propagate constraints
            this.collapseCell(cellIndex);
            this.propagateConstraints(cellIndex);
            this.generationStep++;

            return true;
        }

        // Process a complete step including neighbor handling
        processStep(cellIndex) {
            if (!cellIndex) {
                cellIndex = this.findLowestEntropyCell();
                if (cellIndex === null) return false;
            }

            // Get neighbors before collapsing
            const neighbors = this.getNeighbourCells(cellIndex);
            
            // Collapse the cell
            this.collapseCell(cellIndex);
            
            // Process each neighbor
            for (const neighborIndex of neighbors) {
                this.propagateConstraints(neighborIndex);
            }

            return true;
        }
    }

    // Export a singleton instance
    export const wfc = new WFC();