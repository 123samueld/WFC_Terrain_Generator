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

/**
 * Transforms Isometric coordinates to Cartesian coordinates
 * @param {number} isoX - Isometric x coordinate
 * @param {number} isoY - Isometric y coordinate
 * @returns {Object} Object containing cartesian x and y coordinates
 */
export function isometricToCartesian(isoX, isoY) {
    return {
        x: ((isoX / (ISOMETRIC_TILE_WIDTH / 2) + isoY / (ISOMETRIC_TILE_HEIGHT / 2)) / 2) - 1,
        y: (isoY / (ISOMETRIC_TILE_HEIGHT / 2) - isoX / (ISOMETRIC_TILE_WIDTH / 2)) / 2
    };
}
