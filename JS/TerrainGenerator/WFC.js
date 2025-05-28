// WFC.js - Wave Function Collapse algorithm for terrain generation
import { INITIALISE, TERRAIN_TILE } from '../FilePathRouter.js';

class WFC {
    constructor(gridSize = 36) {
        this.gridSize = gridSize;
        this.grid = new Array(gridSize * gridSize).fill(null);
        this.entropy = new Array(gridSize * gridSize).fill(null);
        this.possibleTiles = new Array(gridSize * gridSize).fill(null);

        // WFC state tracking
        this.collapsedTiles = new Set();
        this.untouchedTiles = new Set();
        this.superpositionTiles = new Set();
        
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

        // Initialize all cells and track their states
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const index = y * this.gridSize + x;
                const tileType = read.getTile(x, y);
                
                if (tileType) {
                    // If there's a pre-placed tile, add it to collapsedTiles
                    this.collapsedTiles.add(index);
                    this.grid[index] = tileType;
                    this.possibleTiles[index] = new Set([tileType]);
                } else {
                    // If no tile is placed, add to untouchedTiles
                    this.untouchedTiles.add(index);
                    this.possibleTiles[index] = new Set(roadTileTypes);
                }
                this.updateEntropy(index);
            }
        }
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

        // Log the state of our sets
        console.log('WFC Generation Started:');
        console.log('Collapsed Tiles:', Array.from(this.collapsedTiles).map(index => {
            const x = index % this.gridSize;
            const y = Math.floor(index / this.gridSize);
            return `(${x},${y})`;
        }));
        console.log('Untouched Tiles:', Array.from(this.untouchedTiles).map(index => {
            const x = index % this.gridSize;
            const y = Math.floor(index / this.gridSize);
            return `(${x},${y})`;
        }));
        console.log('Total Collapsed:', this.collapsedTiles.size);
        console.log('Total Untouched:', this.untouchedTiles.size);
    }

    // Visualisation helper methods
    updateEntropy(index) {
        // Updates entropy value for a single cell
    }

    isFullyCollapsed() {
        // Returns true if all cells are reduced to 1 possible tile
    }

    findLowestEntropyCell() {
        // Returns the index of the next cell to collapse
    }

    collapseTile(index) {
        // Collapses a single tile by selecting one option
    }

    propagateConstraints(startIndex) {
        // Propagates constraints from the collapsed tile outward
    }

    getNeighborIndices(index) {
        // Returns neighbor indices and directions
    }

    filterPossibleTilesByAdjacency(sourceIndex, targetIndex, direction) {
        // Narrows down possible tiles in the target cell based on adjacency rules
    }

    isPreCollapsed(index) {
        // Returns true if the tile at index was pre-placed (e.g., a building)
    }

    applyInitialConstraintsFromPrePlacedTiles() {
        // Applies constraints around pre-placed buildings before running WFC
    }

    reset() {
        // Resets grid, entropy, and tile possibilities
    }
}

// Export a singleton instance
export const wfc = new WFC();