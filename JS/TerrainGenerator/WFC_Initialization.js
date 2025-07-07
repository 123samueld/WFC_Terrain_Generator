// WFC_Initialization.js

import { 
    INITIALISE, 
    TERRAIN_TILE, 
    TERRAIN_GENERATOR, 
    WFC_RULES ,
    GENERATION_STATE
} from '../FilePathRouter.js';

export function initialize(wfcInstance) {
    const { read } = INITIALISE.getGameStateBuffers();
    const roadTileTypes = wfcInstance.getRoadTileTypes();

    // Set visualisation state
    GENERATION_STATE.isGenerating = true;
    GENERATION_STATE.currentStep = 0;

    initializeCells(wfcInstance, read, roadTileTypes);
    wfcInstance.processSetTiles();
    wfcInstance.propagateFromCollapsedTiles(roadTileTypes);
    wfcInstance.saveState();
}

export function initializeCells(wfcInstance, read, roadTileTypes) {
    // First pass: Set up initial state
    for (let y = 0; y < wfcInstance.gridSize; y++) {
        for (let x = 0; x < wfcInstance.gridSize; x++) {
            const index = y * wfcInstance.gridSize + x;
            const tileType = read.getTile(x, y);

            if (tileType) {
                // If there's already a tile here, preserve it completely
                const ix = index % wfcInstance.gridSize;
                const iy = Math.floor(index / wfcInstance.gridSize);
                GENERATION_STATE.collapsedTiles.add(index);
                wfcInstance.grid[index] = tileType;
                wfcInstance.possibleTiles[index] = new Set([tileType]);
                wfcInstance.entropy[index] = 1;
                
                // Ensure the game state is updated with the existing tile
                const { write } = INITIALISE.getGameStateBuffers();
                write.setTile(x, y, tileType);
            } else {
                // Only empty cells should be used for road generation
                const ix = index % wfcInstance.gridSize;
                const iy = Math.floor(index / wfcInstance.gridSize);
                GENERATION_STATE.untouchedTiles.add(index);
                wfcInstance.possibleTiles[index] = new Set(roadTileTypes);
                GENERATION_STATE.superpositionTiles.set(index, new Set(roadTileTypes));
                wfcInstance.entropy[index] = roadTileTypes.length;
            }
        }
    }

    // Second pass: Check neighbors and move tiles to setTiles if appropriate
    for (const index of GENERATION_STATE.collapsedTiles) {
        const neighbors = wfcInstance.getNeighbourCells(index);
        const allNeighborsCollapsed = neighbors.every(neighborIndex =>
            GENERATION_STATE.collapsedTiles.has(neighborIndex) || GENERATION_STATE.setTiles.has(neighborIndex)
        );

        if (allNeighborsCollapsed) {
            GENERATION_STATE.collapsedTiles.delete(index);
            GENERATION_STATE.setTiles.add(index);
        }
    }
}