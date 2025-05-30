    // WFC.js - Wave Function Collapse algorithm for terrain generation
    import { INITIALISE, TERRAIN_TILE, COLLAPSE_RULES } from '../FilePathRouter.js';

    class WFC {
        constructor(gridSize = 36) {
            this.gridSize = gridSize;
            this.grid = new Array(gridSize * gridSize).fill(null);
            this.entropy = new Array(gridSize * gridSize).fill(null);
            this.possibleTiles = new Array(gridSize * gridSize).fill(null);
            
            // WFC state tracking
            this.collapsedTiles = new Set();  // Cells that have been collapsed to a single tile
            this.untouchedTiles = new Set();  // Cells that haven't been processed yet
            this.superpositionTiles = new Map();  // Set of possible tile types
            this.neighbourCells = new Set();  // Set of neighbour cells
            
            // Visualization state
            this.generationStep = 0;  // Track current step in generation process
            this.lastUpdatedCell = null;  // Track which cell was last updated
            this.isGenerating = false;  // Flag to indicate if generation is in progress
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
                TERRAIN_TILE.TileType.T_JUNCTION_LEFT
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

            // Second pass: Update neighbors of pre-placed tiles
            for (let y = 0; y < this.gridSize; y++) {
                for (let x = 0; x < this.gridSize; x++) {
                    const index = y * this.gridSize + x;
                    if (this.collapsedTiles.has(index)) {
                        // Get neighbors of this collapsed cell
                        const neighbors = this.getNeighbourCells(index);
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

            console.log('Initialization complete:');
            console.log('Collapsed tiles:', this.collapsedTiles.size);
            console.log('Superposition tiles:', this.superpositionTiles.size);
            console.log('Sample entropy values:', this.entropy.slice(0, 10));
        }

        generateWFC() {
            console.log("Generate clicked");
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
                console.log("Generation step: " + this.generationStep);
                let cell = this.findLowestEntropyCell();
                
                // Log the selected cell and its entropy
                const x = cell % this.gridSize;
                const y = Math.floor(cell / this.gridSize);
                const possibleTiles = this.superpositionTiles.get(cell);
                console.log(`Selected cell (${x},${y}) with entropy: ${possibleTiles ? possibleTiles.size : 0}`);
                console.log(`Possible tiles: ${possibleTiles ? Array.from(possibleTiles).join(', ') : 'none'}`);
                
                this.collapseCell(cell);
                this.propagateConstraints(cell);
                this.generationStep++;
                iterationCount++;
            }
            
            console.log(`WFC completed after ${iterationCount} iterations`);
            if (iterationCount >= MAX_ITERATIONS) {
                console.log("WFC stopped due to reaching maximum iterations");
            }
            
            return this.grid; // fully collapsed with valid constraints
        }


        // Update entropy for a cell based on its possible tiles
        updateEntropy(index = null) {
            if (index !== null) {
                // Update single cell
                const possibleTiles = this.superpositionTiles.get(index) || this.possibleTiles[index];
                if (!possibleTiles) {
                    this.entropy[index] = 0;
                    return;
                }
                this.entropy[index] = possibleTiles.size;
            } else {
                // Update all cells
                for (let i = 0; i < this.gridSize * this.gridSize; i++) {
                    const possibleTiles = this.superpositionTiles.get(i) || this.possibleTiles[i];
                    this.entropy[i] = possibleTiles ? possibleTiles.size : 0;
                }
            }
        }

        // Find the cell with the lowest entropy
        findLowestEntropyCell() {
            let lowestEntropy = Infinity;
            let lowestEntropyCell = null;

            // Only consider cells in superposition
            for (const [index, possibleTiles] of this.superpositionTiles) {
                if (possibleTiles.size < lowestEntropy) {
                    lowestEntropy = possibleTiles.size;
                    lowestEntropyCell = index;
                }
            }

            return lowestEntropyCell;
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

            return neighbors;
        }

        superPositionTileSetEmpty() {
            // Return true if there are no more cells in superposition
            return this.superpositionTiles.size === 0;
        }

        collapseCell(cell) {
            // Get the possible tiles for this cell
            const possibleTiles = this.superpositionTiles.get(cell);
            if (!possibleTiles || possibleTiles.size === 0) {
                console.log(`No possible tiles to collapse at cell ${cell}`);
                return;
            }

            // Convert Set to Array for random selection
            const tileArray = Array.from(possibleTiles);
            
            // Randomly select one tile
            const selectedTile = tileArray[Math.floor(Math.random() * tileArray.length)];
            
            // Update the grid and remove from superposition
            this.grid[cell] = selectedTile;
            this.superpositionTiles.delete(cell);
            this.collapsedTiles.add(cell);
            
            console.log(`Collapsed cell ${cell} to tile: ${selectedTile}`);
        }

        propagateConstraints(cell) {
            // Get the neighbour cells that are still in superposition
            const neighbors = this.getNeighbourCells(cell);
            
            // For each neighbor that's still in superposition
            for (const neighborIndex of neighbors) {
                if (this.superpositionTiles.has(neighborIndex)) {
                    // For now, just update entropy without actual constraint checking
                    this.updateEntropy(neighborIndex);
                }
            }
        }

        reset() {
            // Resets grid, entropy, and tile possibilities
        }
    }

    // Export a singleton instance
    export const wfc = new WFC();