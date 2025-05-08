// Math.js

// Constants for isometric tile dimensions
export const ISOMETRIC_TILE_WIDTH = 200;
export const ISOMETRIC_TILE_HEIGHT = 100;

/**
 * Transforms Cartesian coordinates to Isometric coordinates
 * @param {number} x - Cartesian x coordinate
 * @param {number} y - Cartesian y coordinate
 * @returns {Object} Object containing isometric x and y coordinates
 */
export function cartesianToIsometric(x, y) {
    return {
        x: (x - y) * (ISOMETRIC_TILE_WIDTH / 2),
        y: (x + y) * (ISOMETRIC_TILE_HEIGHT / 2)
    };
} 