// Initialise.js
import { } from './Simulation.js';
import { inputState, handleKeyDown, handleKeyUp, handleMouseMove } from './Input.js';
import { createTerrainTile, TileType } from './TerrainTile.js';
import { GameState } from './GameState.js';

let canvasRef, ctxRef;
let gameStateBufferA;
let gameStateBufferB;
let gameStateBufferRead;
let gameStateBufferWrite;
let terrainTiles = {};
export let miniMapCanvasRef, miniMapCtxRef;

export function getGameStateBuffers() {
    return {
        read: gameStateBufferRead,
        write: gameStateBufferWrite
    };
}

export function getTerrainTiles() {
    return terrainTiles;
}

export function getSprites() {
    return sprites;
}

export function initGameCanvas() {
    canvasRef = document.getElementById('gameCanvas');
    ctxRef = canvasRef.getContext('2d');

    canvasRef.width = 1200;
    canvasRef.height = 800;
}

export function initMiniMapCanvas() {
    miniMapCanvasRef = document.getElementById('miniMapCanvas');
    miniMapCtxRef = miniMapCanvasRef.getContext('2d');

    miniMapCanvasRef.width = 300;
    miniMapCanvasRef.height = 150;
}

export function initCanvas() {
    initGameCanvas();
    initMiniMapCanvas();
}

export function getCanvasContext() {
    return ctxRef;
}

export function initGrid() {
    const GRID_SIZE = 36; // 36x36 grid
    const totalCells = GRID_SIZE * GRID_SIZE;

    // Create a flat array initialized to null (no tile assigned)
    const grid = new Array(totalCells).fill(null);

    return { 
        gridSize: GRID_SIZE,
        grid: grid
    };
}

// Set up keyboard event listeners
function initKeyboard() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

// Set up mouse event listeners
function initMouse() {
    window.addEventListener('mousemove', handleMouseMove);
}

export function initInput() {
    initKeyboard();
    initMouse();
}

export function initGameState() {
    // Create game state buffers
    gameStateBufferA = new GameState();
    gameStateBufferB = new GameState();
    
    // Initialize test pattern in buffer A
    gameStateBufferA.initializeTestPattern();
    
    // Set up buffer references
    gameStateBufferRead = gameStateBufferA;
    gameStateBufferWrite = gameStateBufferB;
}

// Load a single sprite
function loadSprite(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

// Load all terrain tiles
export async function loadTerrainTiles() {
    try {
        
        // Load Cross tile
        const crossIsometric = await loadSprite('Assets/Terrain_Tile_Sprites/Isometric/Cross.png');
        const crossCartesian = await loadSprite('Assets/Terrain_Tile_Sprites/Cartesian/Cross.png');
       
        terrainTiles[TileType.CROSS] = createTerrainTile(TileType.CROSS, crossIsometric, crossCartesian);
 
        // Load Straight Latitude tile
        const straightLatIsometric = await loadSprite('Assets/Terrain_Tile_Sprites/Isometric/Straight_Latitude.png');
        const straightLatCartesian = await loadSprite('Assets/Terrain_Tile_Sprites/Cartesian/Straight_Latitude.png');
        terrainTiles[TileType.STRAIGHT_LATITUDE] = createTerrainTile(TileType.STRAIGHT_LATITUDE, straightLatIsometric, straightLatCartesian);

        // Load Straight Longitude tile
        const straightLongIsometric = await loadSprite('Assets/Terrain_Tile_Sprites/Isometric/Straight_Longitude.png');
        const straightLongCartesian = await loadSprite('Assets/Terrain_Tile_Sprites/Cartesian/Straight_Longitude.png');
        terrainTiles[TileType.STRAIGHT_LONGITUDE] = createTerrainTile(TileType.STRAIGHT_LONGITUDE, straightLongIsometric, straightLongCartesian);

        // TODO: Load L-curves and T-junctions
        // We'll need to load these from their respective subdirectories

    } catch (error) {
        console.error('Error loading terrain tiles:', error);
    }
}