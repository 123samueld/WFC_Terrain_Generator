// WFC.js - Wave Function Collapse algorithm for terrain generation
import { TERRAIN_TILE } from '../FilePathRouter.js';
import { getGameStateBuffers } from '../Initialise.js';

class WFC {
    constructor(gridSize, patternSize = 2) {
        this.gridSize = gridSize;
        this.patternSize = patternSize;
        this.grid = new Array(gridSize * gridSize).fill(null);
        
        // Get access to game state buffers
        const { read, write } = getGameStateBuffers();
        this.gameStateRead = read;
        this.gameStateWrite = write;
    }
}

export default WFC; 