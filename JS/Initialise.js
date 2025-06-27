// Initialise.js
import { } from './Simulation.js';
import { inputState, handleKeyDown, handleKeyUp, handleMouseMove, handleMouseClick, handleMouseWheel } from './Input.js';
import { createTerrainTile, TileType, UtilityType } from './TerrainTile.js';
import { GameState } from './GameState.js';
import { PATHS } from './FilePathRouter.js';

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
    canvasRef.addEventListener('mousedown', handleMouseClick);
    canvasRef.addEventListener('wheel', handleMouseWheel);
    
    // Prevent context menu on right-click
    canvasRef.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
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
        
        const isometricBuildingSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/01_Buildings/';
        const cartesianBuildingSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/01_Buildings/';
        
        // Power Plant
        const powerPlantIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '01_Power_Plant.png');
        const powerPlantCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '01_Power_Plant.png');
        terrainTiles[TileType.POWER_PLANT] = createTerrainTile(TileType.POWER_PLANT, powerPlantIsometric, powerPlantCartesian);
        terrainTiles[TileType.POWER_PLANT].tileHeightSpillOver = 65;
        terrainTiles[TileType.POWER_PLANT].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        terrainTiles[TileType.POWER_PLANT].setSupplyDemand(100, 0, 0, -10); // Produces power, requires people
        terrainTiles[TileType.POWER_PLANT].setRoadSockets(false, true, false, false);

        // Factorum
        const factorumIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '02_Factorum.png');
        const factorumCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '02_Factorum.png');
        terrainTiles[TileType.FACTORUM] = createTerrainTile(TileType.FACTORUM, factorumIsometric, factorumCartesian);
        terrainTiles[TileType.FACTORUM].tileHeightSpillOver = 131;
        terrainTiles[TileType.FACTORUM].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        terrainTiles[TileType.FACTORUM].setSupplyDemand(-20, 0, 50, -20); // Requires power and people, produces steel
        terrainTiles[TileType.FACTORUM].setRoadSockets(false, true, true, false);

        // Chem Plant
        const chemicalPlantIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '03_Chem_Plant.png');
        const chemicalPlantCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '03_Chem_Plant.png');
        terrainTiles[TileType.CHEMICAL_PLANT] = createTerrainTile(TileType.CHEMICAL_PLANT, chemicalPlantIsometric, chemicalPlantCartesian);
        terrainTiles[TileType.CHEMICAL_PLANT].tileHeightSpillOver = 30;
        terrainTiles[TileType.CHEMICAL_PLANT].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        terrainTiles[TileType.CHEMICAL_PLANT].setSupplyDemand(-30, -20, 0, -15); // Requires power, oil, and people, produces chemicals
        terrainTiles[TileType.CHEMICAL_PLANT].setRoadSockets(false, false, true, false);

        // Train Station
        const trainStationIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '04_Train_Station.png');
        const trainStationCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '04_Train_Station.png');
        terrainTiles[TileType.TRAIN_STATION] = createTerrainTile(TileType.TRAIN_STATION, trainStationIsometric, trainStationCartesian);
        terrainTiles[TileType.TRAIN_STATION].tileHeightSpillOver = 14;
        terrainTiles[TileType.TRAIN_STATION].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        terrainTiles[TileType.TRAIN_STATION].setSupplyDemand(-10, 0, 0, -5); // Requires power and people, produces people
        terrainTiles[TileType.TRAIN_STATION].setRoadSockets(true, false, true, false);

        // Promethium Refinery
        const promethiumRefineryIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '05_Promethium_Refinery.png');
        const promethiumRefineryCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '05_Promethium_Refinery.png');
        terrainTiles[TileType.PROMETHIUM_REFINERY] = createTerrainTile(TileType.PROMETHIUM_REFINERY, promethiumRefineryIsometric, promethiumRefineryCartesian);
        terrainTiles[TileType.PROMETHIUM_REFINERY].tileHeightSpillOver = 53;
        terrainTiles[TileType.PROMETHIUM_REFINERY].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        terrainTiles[TileType.PROMETHIUM_REFINERY].setSupplyDemand(-40, -30, 0, -25); // Requires power, oil, and people, produces promethium
        terrainTiles[TileType.PROMETHIUM_REFINERY].setRoadSockets(false, false, true, false);

        // Hab Block
        const habBlockIsometric = await loadSprite(isometricBuildingSpritesAddressPrefix + '06_Hab_Block.png');
        const habBlockCartesian = await loadSprite(isometricBuildingSpritesAddressPrefix + '06_Hab_Block.png');
        terrainTiles[TileType.HAB_BLOCK] = createTerrainTile(TileType.HAB_BLOCK, habBlockIsometric, habBlockCartesian);
        terrainTiles[TileType.HAB_BLOCK].tileHeightSpillOver = 123;
        terrainTiles[TileType.HAB_BLOCK].miniMapTileColour =  'rgba(136, 152, 160, 0.8)';
        terrainTiles[TileType.HAB_BLOCK].setSupplyDemand(-5, 0, 0, 50); // Requires power, produces people
        terrainTiles[TileType.HAB_BLOCK].setRoadSockets(true, true, true, true);

        /* Roads */
        const isometricRoadSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/02_Roads/';
        const cartesianRoadSpritesAddressPrefix = PATHS.ASSETS.MENU_ICONS.ROADS;

        
        //Road Tile Icons
        const crossCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '01_Cross.png');
        const straightCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '02_Straight.png');
        const tCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '03_T.png');
        const lCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '04_L.png');
        const diagonalCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '05_Diagonal.png');

        // Cross 
        const crossIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + '01_Cross.png');


        terrainTiles[TileType.CROSS] = createTerrainTile(TileType.CROSS, crossIsometric, crossCartesian);
        terrainTiles[TileType.CROSS].setRoadSockets(true, true, true, true);
 



        // Straight Latitude 
        const straightLatIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + '02_Straight_Latitude.png');
        const straightLatCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '02_Straight_Latitude.png');
        terrainTiles[TileType.STRAIGHT_LATITUDE] = createTerrainTile(TileType.STRAIGHT_LATITUDE, straightLatIsometric, straightLatCartesian);
        terrainTiles[TileType.STRAIGHT_LATITUDE].setRoadSockets(false, true, false, true);

        // Straight Longitude 
        const straightLongIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + '03_Straight_Longitude.png');
        const straightLongCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + '03_Straight_Longitude.png');
        terrainTiles[TileType.STRAIGHT_LONGITUDE] = createTerrainTile(TileType.STRAIGHT_LONGITUDE, straightLongIsometric, straightLongCartesian);
        terrainTiles[TileType.STRAIGHT_LONGITUDE].setRoadSockets(true, false, true, false);






        // L Curve Top Right (NE)
        const lCurveTopRightIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'L_Curves/04_NE.png');
        const lCurveTopRightCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'L_Curves/04_NE.png');
        terrainTiles[TileType.L_CURVE_TOP_RIGHT] = createTerrainTile(TileType.L_CURVE_TOP_RIGHT, lCurveTopRightIsometric, lCurveTopRightCartesian);
        terrainTiles[TileType.L_CURVE_TOP_RIGHT].setRoadSockets(true, true, false, false); // NE

        // L Curve Bottom Right (ES)
        const lCurveBottomRightIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'L_Curves/01_ES.png');
        const lCurveBottomRightCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'L_Curves/01_ES.png');
        terrainTiles[TileType.L_CURVE_BOTTOM_RIGHT] = createTerrainTile(TileType.L_CURVE_BOTTOM_RIGHT, lCurveBottomRightIsometric, lCurveBottomRightCartesian);
        terrainTiles[TileType.L_CURVE_BOTTOM_RIGHT].setRoadSockets(false, true, true, false); // ES

        // L Curve Top Left (WN)
        const lCurveTopLeftIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'L_Curves/03_WN.png');
        const lCurveTopLeftCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'L_Curves/03_WN.png');
        terrainTiles[TileType.L_CURVE_TOP_LEFT] = createTerrainTile(TileType.L_CURVE_TOP_LEFT, lCurveTopLeftIsometric, lCurveTopLeftCartesian);
        terrainTiles[TileType.L_CURVE_TOP_LEFT].setRoadSockets(true, false, false, true); // WN

        // L Curve Bottom Left (SW)
        const lCurveBottomLeftIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'L_Curves/02_SW.png');
        const lCurveBottomLeftCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'L_Curves/02_SW.png');
        terrainTiles[TileType.L_CURVE_BOTTOM_LEFT] = createTerrainTile(TileType.L_CURVE_BOTTOM_LEFT, lCurveBottomLeftIsometric, lCurveBottomLeftCartesian);
        terrainTiles[TileType.L_CURVE_BOTTOM_LEFT].setRoadSockets(false, false, true, true); // SW



        // Diagonal Top Right (NE)
        const diagonalTopRighttIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'Diagonals/04_NE.png');
        terrainTiles[TileType.DIAGONAL_TOP_RIGHT] = createTerrainTile(TileType.DIAGONAL_TOP_RIGHT, diagonalTopRighttIsometric, diagonalCartesian);
        terrainTiles[TileType.DIAGONAL_TOP_RIGHT].setRoadSockets(true, true, false, false); // NE Top Right

        // Diagonal Bottom Right (ES)
        const diagonalBottomRightIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'Diagonals/01_ES.png');
        terrainTiles[TileType.DIAGONAL_BOTTOM_RIGHT] = createTerrainTile(TileType.DIAGONAL_BOTTOM_RIGHT, diagonalBottomRightIsometric, diagonalCartesian); 
        terrainTiles[TileType.DIAGONAL_BOTTOM_RIGHT].setRoadSockets(false, true, true, false); // ES Bottom Right

        // Diagonal Bottom Left (SW)
        const diagonalBottomLeftIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'Diagonals/02_SW.png');
        terrainTiles[TileType.DIAGONAL_BOTTOM_LEFT] = createTerrainTile(TileType.DIAGONAL_BOTTOM_LEFT, diagonalBottomLeftIsometric, diagonalCartesian);
        terrainTiles[TileType.DIAGONAL_BOTTOM_LEFT].setRoadSockets(false, false, true, true); // SW Bottom Left

        // Diagonal Top Left (WN)
        const diagonalTopLeftIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'Diagonals/03_WN.png');
        terrainTiles[TileType.DIAGONAL_TOP_LEFT] = createTerrainTile(TileType.DIAGONAL_TOP_LEFT, diagonalTopLeftIsometric, diagonalCartesian);
        terrainTiles[TileType.DIAGONAL_TOP_LEFT].setRoadSockets(true, false, false, true); // WN Top Left





        // T Junction Top (ESW)
        const tJunctionTopIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'T_Junctions/01_ESW.png');
        const tJunctionTopCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'T_Junctions/01_ESW.png');
        terrainTiles[TileType.T_JUNCTION_TOP] = createTerrainTile(TileType.T_JUNCTION_TOP, tJunctionTopIsometric, tJunctionTopCartesian);
        terrainTiles[TileType.T_JUNCTION_TOP].setRoadSockets(false, true, true, true); // ESW

        // T Junction Right (SWN)
        const tJunctionRightIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'T_Junctions/02_SWN.png');
        const tJunctionRightCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'T_Junctions/02_SWN.png');
        terrainTiles[TileType.T_JUNCTION_RIGHT] = createTerrainTile(TileType.T_JUNCTION_RIGHT, tJunctionRightIsometric, tJunctionRightCartesian);
        terrainTiles[TileType.T_JUNCTION_RIGHT].setRoadSockets(true, false, true, true); // SWN

        // T Junction Bottom (WNE)
        const tJunctionBottomIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'T_Junctions/03_WNE.png');
        const tJunctionBottomCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'T_Junctions/03_WNE.png');
        terrainTiles[TileType.T_JUNCTION_BOTTOM] = createTerrainTile(TileType.T_JUNCTION_BOTTOM, tJunctionBottomIsometric, tJunctionBottomCartesian);
        terrainTiles[TileType.T_JUNCTION_BOTTOM].setRoadSockets(true, true, false, true); // WNE

        // T Junction Left (NES)
        const tJunctionLeftIsometric = await loadSprite(isometricRoadSpritesAddressPrefix + 'T_Junctions/04_NES.png');
        const tJunctionLeftCartesian = await loadSprite(cartesianRoadSpritesAddressPrefix + 'T_Junctions/04_NES.png');
        terrainTiles[TileType.T_JUNCTION_LEFT] = createTerrainTile(TileType.T_JUNCTION_LEFT, tJunctionLeftIsometric, tJunctionLeftCartesian);
        terrainTiles[TileType.T_JUNCTION_LEFT].setRoadSockets(true, true, true, false); // NES





        /* Train Tracks */
        const isometricTrainTrackSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/03_Train_Tracks/';
        const cartesianTrainTrackSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/03_Train_Tracks/';

        /* Power Lines */
        const isometricPowerLineSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/04_Power_Lines/';
        const cartesianPowerLineSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/04_Power_Lines/';

        /* Pipes */
        const isometricPipeSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/05_Pipes/';
        const cartesianPipeSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Cartesian/05_Pipes/';

        /* Flora */
        const isometricFloraSpritesAddressPrefix = 'Assets/Terrain_Tile_Sprites/Isometric/07_Flora/';

        // Forest
        const forestIsometric = await loadSprite(isometricFloraSpritesAddressPrefix + '01_Forest.png');
        const forestCartesian = await loadSprite(PATHS.ASSETS.MENU_ICONS.FLORA + '01_Forest.png');
        terrainTiles[TileType.FLORA_FOREST] = createTerrainTile(TileType.FLORA_FOREST, forestIsometric, forestCartesian);
        terrainTiles[TileType.FLORA_FOREST].miniMapTileColour = 'rgba(52, 191, 47, 0.42)';
        terrainTiles[TileType.FLORA_FOREST].tileHeightSpillOver = 32;
    
    } catch (error) {
        console.error('Error loading terrain tiles:', error);
    }
}