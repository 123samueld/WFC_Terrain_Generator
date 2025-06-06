// Collapse Rules

export const applyCollapseRules_03_01 = (cell) => {
    // Applies collapse rules to a cell
}

export const analyseCellSockets = (cellIndex, terrainTiles, grid, gridSize) => {
    // Get the current cell's tile type
    const currentTileType = grid[cellIndex];
    if (!currentTileType) {
        console.log("No tile type found for cell");
        return null;
    }

    // Get the terrain tile configuration
    const currentTile = terrainTiles[currentTileType];
    if (!currentTile) {
        console.log("No terrain tile configuration found");
        return null;
    }

    // Calculate grid coordinates
    const x = cellIndex % gridSize;
    const y = Math.floor(cellIndex / gridSize);

    // Get neighbor indices
    const neighbors = {
        north: y > 0 ? (y - 1) * gridSize + x : null,
        east: x < gridSize - 1 ? y * gridSize + (x + 1) : null,
        south: y < gridSize - 1 ? (y + 1) * gridSize + x : null,
        west: x > 0 ? y * gridSize + (x - 1) : null
    };

    // Get socket configurations
    const socketConfig = {
        terrainType: currentTileType,
        sockets: {
            north: currentTile.roadSockets.north,
            east: currentTile.roadSockets.east,
            south: currentTile.roadSockets.south,
            west: currentTile.roadSockets.west
        },
        neighbors: neighbors
    };

    console.log("Cell socket analysis:", socketConfig);
    return socketConfig;
}