/**
 * FilePathRouter.js
 *
 * Centralised module for managing file import paths across the whole project.
 * All imports should reference paths defined here to promote consistency
 * and simplify maintenance. If a file is moved or renamed, only this file
 * needs to be updated.
 *
 * Example of usage in Rendering.js:
 *   import { math } from './FilePathRouter.js';
 *   const iso = math.cartesianToIsometric(x, y);
 */

export * as JS from './Main.js';
export * as BUILD_MENU from './BuildMenu.js';
export * as GAME_STATE from './GameState.js';
export * as HOTKEY_MANAGER from './HotkeyManager.js';
export * as INITIALISE from './Initialise.js';
export * as INPUT from './Input.js';
export * as MATH from './Math.js';
export * as MENU_ITEMS from './MenuItems.js';
export * as OPTIONS from './Options.js';
export * as PROFILING_TOOLS from './ProfilingTools.js';
export * as RENDERING from './Rendering.js';
export * as SIMULATION from './Simulation.js';
export * as TERRAIN_TILE from './TerrainTile.js';
export * as WFC_INITIALIZATION from './TerrainGenerator/WFC_Initialization.js';
export { wfc as TERRAIN_GENERATOR } from './TerrainGenerator/WFC.js';
export * as WFC_RULES from './TerrainGenerator/WFCRules.js';  
export * as GENERATION_PROCESS_VISUALISER from './TerrainGenerator/GenerationProcessVisualiser.js';
export * as TERRAIN_STATE_DISPLAY from './TerrainGenerator/TerrainStateDisplay.js';

/** Non-JS file paths (HTML, assets, docs, etc.) */
export const PATHS = {
    HTML: {
      INDEX: './index.html',
      CSS: './index.css'
    },
  
    ASSETS: {
      ROOT: './Assets/',
      FONTS: {
        LATIN_CONDENSED: './Assets/LatinCondensed.ttf'
      },
      BACKGROUNDS: {
        SCRATCHED_METAL: './Assets/scratched_metal.jpg',
        METAL: './Assets/metal_background.jpg'
      },
      UI: {
        TITLE_PLAQUE: './Assets/title_plaque.png'
      },
      MENU_ICONS: {
        ROOT: './Assets/Nested_Menu_Icons/',
        TEMPLATE: './Assets/Nested_Menu_Icons/Template.png',
        MAIN: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/',
        BUILD_OPTIONS: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/',
        GENERATE_OPTIONS: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/02_Generate_Options_Menu_Icons/',
        POPULATION_OPTIONS: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/03_Population_Options_Menu_Icons/',
        VISUALISATION_OPTIONS: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/02_Generate_Options_Menu_Icons/04_Visualise_Process_Menu_Icons/',
        BUILDINGS: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/01_Buildings_Menu_Icons/',
        ROADS: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/02_Road_Menu_Icons/',
        TRAIN_TRACKS: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/03_Train_Tracks_Menu_Icons/',
        POWER_LINES: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/04_Power_Lines_Menu_Icons/',
        PIPES: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/05_Pipes_Menu_Icons/',
        FAUNA: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/06_Fauna_Menu_Icons/',
        FLORA: './Assets/Nested_Menu_Icons/01_Main_Menu_Icons/01_Build_Options_Menu_Icons/07_Flora_Menu_Icons/',
      },
      TERRAIN: {
        ROOT: './Assets/Terrain_Tile_Sprites/',
        ISOMETRIC: './Assets/Terrain_Tile_Sprites/Isometric/',
        CARTESIAN: './Assets/Terrain_Tile_Sprites/Cartesian/'
      }
    },
  
    DOCS: {
      README: './README.md',
      TODO: './TODO.md',
      PERFORMANCE: './PerformanceEnhancements.md'
    },

    JS: {
        ROOT: './JS/'
    }
};

