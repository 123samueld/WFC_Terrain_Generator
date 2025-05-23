// GameState.js
import { TileType } from './TerrainTile.js';

export class GameState {
    constructor(gridSize = 36) {
        this.gridSize = gridSize;
        this.grid = new Array(gridSize * gridSize).fill(null);
        this.camera = { x: 0, y: 0 };
    }

    // Get tile at grid coordinates
    getTile(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
            return null;
        }
        return this.grid[y * this.gridSize + x];
    }

    // Set tile at grid coordinates
    setTile(x, y, tileType) {
        if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
            const index = y * this.gridSize + x;
            this.grid[index] = tileType;
        }
    }

    // Initialize a test pattern
    initializeTestPattern() {
        // Clear the grid
        this.grid.fill(null);
        
        // Set up a 2x2 test pattern
        this.setTile(0, 0, TileType.CROSS);
        this.setTile(0, 1, TileType.STRAIGHT_LATITUDE);
        this.setTile(1, 1, TileType.STRAIGHT_LONGITUDE);
        this.setTile(1, 0, TileType.STRAIGHT_LATITUDE);
        this.setTile(2, 2, TileType.CHEMICAL_PLANT);
    }

    resetGrid(){
        // Clear the grid
        this.grid.fill(null);
    }
} 