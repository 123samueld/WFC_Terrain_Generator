// WFC_Initialization.js

import { INITIALISE, TERRAIN_TILE, TERRAIN_GENERATOR, WFC_RULES } from '../FilePathRouter.js';

export function initialize(wfcInstance) {
    console.log("GENERATION 0: Initialise()");
    const { read } = INITIALISE.getGameStateBuffers();
    const roadTileTypes = wfcInstance.getRoadTileTypes();

    initializeCells(wfcInstance, read, roadTileTypes);
    wfcInstance.processSetTiles();
    wfcInstance.propagateFromCollapsedTiles(roadTileTypes);
    wfcInstance.saveState();
}

export function initializeCells(wfcInstance, read, roadTileTypes) {
    console.log("INITIALIZE 1: Starting initializeCells");
    for (let y = 0; y < wfcInstance.gridSize; y++) {
        for (let x = 0; x < wfcInstance.gridSize; x++) {
            const index = y * wfcInstance.gridSize + x;
            const tileType = read.getTile(x, y);

            if (tileType) {
                const ix = index % wfcInstance.gridSize;
                const iy = Math.floor(index / wfcInstance.gridSize);
                console.log("INITIALIZE 1.1: Cell", `(${ix},${iy})`, "has tile type", tileType);
                wfcInstance.collapsedTiles.add(index);
                wfcInstance.grid[index] = tileType;
                wfcInstance.possibleTiles[index] = new Set([tileType]);
                wfcInstance.entropy[index] = 1;
            } else {
                const ix = index % wfcInstance.gridSize;
                const iy = Math.floor(index / wfcInstance.gridSize);
                console.log("INITIALIZE 1.2: Cell", `(${ix},${iy})`, "is untouched");
                wfcInstance.untouchedTiles.add(index);
                wfcInstance.possibleTiles[index] = new Set(roadTileTypes);
                wfcInstance.superpositionTiles.set(index, new Set(roadTileTypes));
                wfcInstance.entropy[index] = roadTileTypes.length;
            }
        }
    }
    console.log("INITIALIZE 1.3: Finished initializeCells");
}