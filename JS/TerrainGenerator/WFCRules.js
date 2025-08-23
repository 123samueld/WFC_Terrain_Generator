// WFCRules.js - Rules for Wave Function Collapse algorithm
import { TERRAIN_TILE } from '../FilePathRouter.js';

// Collapse rules determine which tile to select from possible tiles
export function collapseRules(possibleTiles) {
    // Convert Set to Array for random selection
    const tilesArray = Array.from(possibleTiles);
    
    // Check if grass field is available
    const grassFieldTile = tilesArray.find(tile => tile === 'Grass_Field');
    
    if (grassFieldTile) {
        // If only grass field is available, choose it
        if (tilesArray.length === 1) {
            return grassFieldTile;
        }
        
        // If grass field is available along with road tiles, prefer grass (70% chance)
        // This creates more natural terrain with grass filling empty spaces
        if (Math.random() < 0.7) {
            return grassFieldTile;
        }
    }
    
    // Otherwise, randomly select from available tiles
    const randomIndex = Math.floor(Math.random() * tilesArray.length);
    return tilesArray[randomIndex];
}

// Propagation rules determine which tiles are allowed for neighbors
export function propagationRules(currentTile, neighborTile, direction) {
    if (!currentTile || !neighborTile) {
        return false;
    }

    const oppositeDirection = {
        'north': 'south',
        'south': 'north',
        'east': 'west',
        'west': 'east'
    }[direction];

    const currentWantsConnection = currentTile.roadSockets[direction];
    const neighborAcceptsConnection = neighborTile.roadSockets[oppositeDirection];

    // Only fail if current tile wants a connection but neighbor doesn't match
    if (currentWantsConnection) {
        return neighborAcceptsConnection === true;
    }

    // Otherwise (current doesn't want a connection), neighbor can have anything
    return true;
}


// Export the functions
export const WFC_RULES = {
    collapseRules,
    propagationRules
};

