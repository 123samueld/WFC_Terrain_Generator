// Initialise.js
import { } from './Simulation.js';
import { inputState, handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick } from './Input.js';
import { createTerrainTile, TileType } from './TerrainTile.js';
import { GameState } from './GameState.js';

let canvasRef, ctxRef;
let gameStateBufferA;
let gameStateBufferB;
let gameStateBufferRead;
let gameStateBufferWrite;
export let terrainTiles = {};
export let miniMapCanvasRef, miniMapCtxRef;

export const mapOrigin = {
    x: 100,   // Adjust based on your desired anchor
    y: -350
  };

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

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvasRef.addEventListener('mousemove', handleMouseMove);
    canvasRef.addEventListener('click', handleMouseClick);
    
    // Prevent context menu on right-click
    canvasRef.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
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
        
        /* Buildings */
        
            //Buildings
    // Power Station - tileHeightOverSpill: 65px
    // Steel Foundry - tileHeightOverSpill: 131px
    //CHEMICAL_PLANT: 'Chemical_Plant' // tileHeightOverSpill: 30px
    // Train Station - tileHeightOverSpill: 14px
    // Oil Refinery - tileHeightOverSpill: 53px

        const isometricBuildingSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/01_Buildings/';
        const cartesianBuildingSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/01_Buildings/';
        
        // Power Plant
        const powerPlantIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '01_Power_Plant.png');
        const powerPlantCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '01_Power_Plant.png');
        terrainTiles[TileType.POWER_PLANT] = createTerrainTile(TileType.POWER_PLANT, powerPlantIsometric, powerPlantCartesian);
        terrainTiles[TileType.POWER_PLANT].tileHeightSpillOver = 65;
        terrainTiles[TileType.POWER_PLANT].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        
        // Factorum
        const factorumIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '02_Factorum.png');
        const factorumCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '02_Factorum.png');
        terrainTiles[TileType.FACTORUM] = createTerrainTile(TileType.FACTORUM, factorumIsometric, factorumCartesian);
        terrainTiles[TileType.FACTORUM].tileHeightSpillOver = 131;
        terrainTiles[TileType.FACTORUM].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        
  

        // Chem Plant
        const chemicalPlantIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '03_Chem_Plant.png');
        const chemicalPlantCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '03_Chem_Plant.png');
        terrainTiles[TileType.CHEMICAL_PLANT] = createTerrainTile(TileType.CHEMICAL_PLANT, chemicalPlantIsometric, chemicalPlantCartesian);
        terrainTiles[TileType.CHEMICAL_PLANT].tileHeightSpillOver = 30;
        terrainTiles[TileType.CHEMICAL_PLANT].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';

        // Train Station
        const trainStationIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '04_Train_Station.png');
        const trainStationCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '04_Train_Station.png');
        terrainTiles[TileType.TRAIN_STATION] = createTerrainTile(TileType.TRAIN_STATION, trainStationIsometric, trainStationCartesian);
        terrainTiles[TileType.TRAIN_STATION].tileHeightSpillOver = 14;
        terrainTiles[TileType.TRAIN_STATION].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        
        
        // Promethium Refinery
        const promethiumRefineryIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '05_Promethium_Refinery.png');
        const promethiumRefineryCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '05_Promethium_Refinery.png');
        terrainTiles[TileType.PROMETHIUM_REFINERY] = createTerrainTile(TileType.PROMETHIUM_REFINERY, promethiumRefineryIsometric, promethiumRefineryCartesian);
        terrainTiles[TileType.PROMETHIUM_REFINERY].tileHeightSpillOver = 53;
        terrainTiles[TileType.PROMETHIUM_REFINERY].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        
        

        /* Roads */
        const isometricRoadSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/02_Roads/';
        const cartesianRoadSpritesAddressPrefix = 'Assets/Nested_Menu_Icons/03_Road_Menu_Icons/';
        // Cross 
        const crossIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + '01_Cross.png');
        const crossCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '01_Cross.png');
       
        terrainTiles[TileType.CROSS] = createTerrainTile(TileType.CROSS, crossIsometric, crossCartesian);
 
        // Straight Latitude 
        const straightLatIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + '02_Straight_Latitude.png');
        const straightLatCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '02_Straight_Latitude.png');
        terrainTiles[TileType.STRAIGHT_LATITUDE] = createTerrainTile(TileType.STRAIGHT_LATITUDE, straightLatIsometric, straightLatCartesian);

        // Straight Longitude 
        const straightLongIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + '03_Straight_Longitude.png');
        const straightLongCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '03_Straight_Longitude.png');
        terrainTiles[TileType.STRAIGHT_LONGITUDE] = createTerrainTile(TileType.STRAIGHT_LONGITUDE, straightLongIsometric, straightLongCartesian);

        /* Train Tracks */
        const isometricTrainTrackSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/03_Train_Tracks/';
        const cartesianTrainTrackSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/03_Train_Tracks/';


        /* Power Lines */
        const isometricPowerLineSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/04_Power_Lines/';
        const cartesianPowerLineSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/04_Power_Lines/';

        /* Pipes */
        const isometricPipeSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/05_Pipes/';
        const cartesianPipeSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/05_Pipes/';



    } catch (error) {
        console.error('Error loading terrain tiles:', error);
    }
}