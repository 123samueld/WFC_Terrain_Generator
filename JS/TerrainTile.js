// TerrainTile.js

// Utility types for resource management
export const UtilityType = {
    POWER: 'power',
    OIL: 'oil',
    ORE: 'ore',
    PEOPLE: 'people'
};

export class TerrainTile {
    constructor(name, isometricSprite, cartesianSprite, tileHeightSpillOver, area) {
        this.name = name;
        this.isometricSprite = isometricSprite;
        this.cartesianSprite = cartesianSprite;
        this.tileHeightSpillOver = 0; 
        this.area = 1;
        this.miniMapTileColour = 'rgba(0, 255, 0, 0.8)';
        
        // Road sockets
        this.roadSockets = {
            north: false,
            east: false,
            south: false,
            west: false
        };

        // Train line sockets
        this.trackSockets = {
            north: false,
            east: false,
            south: false,
            west: false
        };

        // Power line sockets
        this.powerSockets = {
            north: false,
            east: false,
            south: false,
            west: false
        };

        // Pipe line sockets
        this.pipeSockets = {
            north: false,
            east: false,
            south: false,
            west: false
        };

        // Utilities system
        this.utilities = {
            delivered: {
                [UtilityType.POWER]: 0,  // Power required
                [UtilityType.OIL]: 0,    // Oil required
                [UtilityType.ORE]: 0,    // Ore required
                [UtilityType.PEOPLE]: 0  // People required
            },
            // Positive value is supply, negative value is demand
            supply_demand: {
                [UtilityType.POWER]: 0,  // Power produced
                [UtilityType.OIL]: 0,    // Oil produced
                [UtilityType.ORE]: 0,    // Ore produced
                [UtilityType.PEOPLE]: 0  // People produced
            }
        };

        // Arrays for future use
        this.scenery = [];  // Will store scenery objects
        this.population = [];  // Will store population objects
    }

    // Socket management
    setRoadSockets(north, east, south, west) {
        this.roadSockets.north = north;
        this.roadSockets.east = east;
        this.roadSockets.south = south;
        this.roadSockets.west = west;
    }

    setTrackSockets(north, east, south, west) {
        this.trackSockets.north = north;
        this.trackSockets.east = east;
        this.trackSockets.south = south;
        this.trackSockets.west = west;
    }

    setPowerSockets(north, east, south, west) {
        this.powerSockets.north = north;
        this.powerSockets.east = east;
        this.powerSockets.south = south;
        this.powerSockets.west = west;
    }

    setPipeSockets(north, east, south, west) {
        this.pipeSockets.north = north;
        this.pipeSockets.east = east;
        this.pipeSockets.south = south;
        this.pipeSockets.west = west;
    }

    // Getter for road socket configuration
    getRoadSockets() {
        console.log("Road sockets:", this.roadSockets);
        return {
            terrainType: this.name,
            sockets: this.roadSockets
        };
    }

    // Utility management
    setSupplyDemand(power = 0, oil = 0, ore = 0, people = 0) {
        this.utilities.supply_demand[UtilityType.POWER] = power;
        this.utilities.supply_demand[UtilityType.OIL] = oil;
        this.utilities.supply_demand[UtilityType.ORE] = ore;
        this.utilities.supply_demand[UtilityType.PEOPLE] = people;
    }

    getSupplyDemand(utilityType) {
        return this.utilities.supply_demand[utilityType];
    }

    setDelivered(power = 0, oil = 0, ore = 0, people = 0) {
        this.utilities.delivered[UtilityType.POWER] = power;
        this.utilities.delivered[UtilityType.OIL] = oil;
        this.utilities.delivered[UtilityType.ORE] = ore;
        this.utilities.delivered[UtilityType.PEOPLE] = people;
    }

    getDelivered(utilityType) {
        return this.utilities.delivered[utilityType];
    }

    draw(ctx, x, y, projection = 'isometric') {
        const sprite = projection === 'isometric' ? this.isometricSprite : this.cartesianSprite;
        if (sprite) {
            ctx.drawImage(sprite, x, y - this.tileHeightSpillOver);
        }
    }
}

// Tile types enum
export const TileType = {
    // Roads
    CROSS: 'cross',
    STRAIGHT_LATITUDE: 'straight_latitude',
    STRAIGHT_LONGITUDE: 'straight_longitude',
    L_CURVE_TOP_LEFT: 'l_curve_top_left',
    L_CURVE_TOP_RIGHT: 'l_curve_top_right',
    L_CURVE_BOTTOM_LEFT: 'l_curve_bottom_left',
    L_CURVE_BOTTOM_RIGHT: 'l_curve_bottom_right',
    DIAGONAL_TOP_LEFT: 'diagonal_top_left',
    DIAGONAL_TOP_RIGHT: 'diagonal_top_right',
    DIAGONAL_BOTTOM_LEFT: 'diagonal_bottom_left',
    DIAGONAL_BOTTOM_RIGHT: 'diagonal_bottom_right',
    T_JUNCTION_TOP: 't_junction_top',
    T_JUNCTION_RIGHT: 't_junction_right',
    T_JUNCTION_BOTTOM: 't_junction_bottom',
    T_JUNCTION_LEFT: 't_junction_left',

    // Buildings
    POWER_PLANT: 'Power_Plant',
    FACTORUM: 'Factorum',
    CHEMICAL_PLANT: 'Chemical_Plant',
    TRAIN_STATION: 'Train_Station',
    PROMETHIUM_REFINERY: 'Promethium_Refinery',
    HAB_BLOCK: 'Hab_Block',

    // Flora
    FLORA_FOREST: 'Flora_Forest',
    FLORA_TREE: 'Flora_Tree',

    // Lake
    LAKE_MIDDLE: 'Lake_Middle',

    // Lake Banks
    LAKE_BANK_N: 'Lake_Bank_N',
    LAKE_BANK_NE: 'Lake_Bank_NE',
    LAKE_BANK_E: 'Lake_Bank_E',
    LAKE_BANK_SE: 'Lake_Bank_SE',
    LAKE_BANK_S: 'Lake_Bank_S',
    LAKE_BANK_SW: 'Lake_Bank_SW',
    LAKE_BANK_W: 'Lake_Bank_W',
    LAKE_BANK_NW: 'Lake_Bank_NW',


    /* River */
    // Clockwise flow
    RIVER_NS: 'River_NS',
    RIVER_NE: 'River_NE',
    RIVER_EW: 'River_EW',
    RIVER_ES: 'River_ES',
    RIVER_SW: 'River_SW',
    RIVER_WN: 'River_WN',

    // Anti-clockwise flow
    RIVER_NW: 'River_NW',
    RIVER_WE: 'River_WE',
    RIVER_WS: 'River_WS',
    RIVER_SN: 'River_SN',
    RIVER_SE: 'River_SE',
    RIVER_EN: 'River_EN',

    // River to Lake (4 orientations)
    RIVER_TO_LAKE_NS: 'River_To_Lake_NS',
    RIVER_TO_LAKE_EW: 'River_To_Lake_EW',
    RIVER_TO_LAKE_SN: 'River_To_Lake_SN',
    RIVER_TO_LAKE_WE: 'River_To_Lake_WE',

    // Lake to River (4 orientations)
    LAKE_TO_RIVER_SN: 'Lake_To_River_SN',
    LAKE_TO_RIVER_WE: 'Lake_To_River_WE',
    LAKE_TO_RIVER_NS: 'Lake_To_River_NS',
    LAKE_TO_RIVER_EW: 'Lake_To_River_EW',

    // Bridges
    BRIDGE_RIVER_NS: 'Bridge_River_NS',
    BRIDGE_RIVER_SN: 'Bridge_River_SN',
    BRIDGE_RIVER_WE: 'Bridge_River_WE',
    BRIDGE_RIVER_EW: 'Bridge_River_EW',

    // Special
    DESTROY: 'Destroy'
};

// Factory function to create terrain tiles
export function createTerrainTile(type, isometricSprite, cartesianSprite, tileHeightSpillOver, area) {
    return new TerrainTile(type, isometricSprite, cartesianSprite, tileHeightSpillOver, area);
}

// Function to get river flow direction from river tile name
export function getRiverFlowDirection(riverTileName) {
    // River tile sprite dimensions
    const TILE_WIDTH = 200;
    const TILE_HEIGHT = 100;
    const ARROW_SIZE = 60; // Size of arrow sprite
    
    // Hard-coded offset values for each side (center of each edge)
    const sideOffsets = {
        'north': { x: TILE_WIDTH, y: 0 },
        'east': { x: TILE_WIDTH + 25, y: TILE_HEIGHT},
        'south': { x: 50, y: TILE_HEIGHT },
        'west': { x: 50, y: 0},
        'center': { x: TILE_WIDTH, y: TILE_HEIGHT / 2 }  // Center of the tile
    };
    
    const flowDirections = {
        // Clockwise flow
        'River_NS': { from: 'north', to: 'south' },
        'River_NE': { from: 'north', to: 'east' },
        'River_EW': { from: 'east', to: 'west' },
        'River_ES': { from: 'east', to: 'south' },
        'River_SW': { from: 'south', to: 'west' },
        'River_WN': { from: 'west', to: 'north' },
        
        // Anti-clockwise flow
        'River_NW': { from: 'north', to: 'west' },
        'River_WE': { from: 'west', to: 'east' },
        'River_WS': { from: 'west', to: 'south' },
        'River_SN': { from: 'south', to: 'north' },
        'River_SE': { from: 'south', to: 'east' },
        'River_EN': { from: 'east', to: 'north' },
        
        // Bridge flow directions
        'Bridge_River_NS': { from: 'north', to: 'south' },
        'Bridge_River_SN': { from: 'south', to: 'north' },
        'Bridge_River_WE': { from: 'west', to: 'east' },
        'Bridge_River_EW': { from: 'east', to: 'west' },

        // River to Lake flow directions
        'River_To_Lake_NS': { from: 'north', to: 'center' },
        'River_To_Lake_EW': { from: 'east', to: 'center' },
        'River_To_Lake_SN': { from: 'south', to: 'center' },
        'River_To_Lake_WE': { from: 'west', to: 'center' },

        // Lake to River flow directions
        'Lake_To_River_SN': { from: 'south', to: 'center' },
        'Lake_To_River_WE': { from: 'west', to: 'center' },
        'Lake_To_River_NS': { from: 'north', to: 'center' },
        'Lake_To_River_EW': { from: 'east', to: 'center' }
    };
    
    const direction = flowDirections[riverTileName];
    if (!direction) {
        console.warn(`No flow direction found for river tile: ${riverTileName}`);
        return null;
    }
    
    // Get the XY coordinates for the two sides
    const fromOffset = sideOffsets[direction.from];
    const toOffset = sideOffsets[direction.to];
    
    // Calculate arrow positions (centered on the coordinates)
    const coordinates = {
        from: { 
            x: fromOffset.x - ARROW_SIZE, 
            y: fromOffset.y - ARROW_SIZE / 2 
        },
        to: { 
            x: toOffset.x - ARROW_SIZE, 
            y: toOffset.y - ARROW_SIZE / 2 
        }
    };
    
    return coordinates;
}

// Function to get river arrow coordinates from menu item
export function getRiverArrowCoordinates(selectedMenuItem) {
    // Check if the selected item is a river, bridge, or river to lake type
    if (!selectedMenuItem.text || (!selectedMenuItem.text.includes('Clockwise') && !selectedMenuItem.text.includes('Anti-Clockwise') && !selectedMenuItem.text.includes('Bridges') && !selectedMenuItem.text.includes('River to'))) {
        return null;
    }
    
    // Get the current river tile type
    let riverTileName = null;
    
    // If there's a currentVariant (from cycling), use that first
    if (selectedMenuItem.currentVariant) {
        riverTileName = selectedMenuItem.currentVariant;
    } else {
        // Use default mapping for initial selection
        const roadTextToTileType = {
            'Clockwise\nRivers': 'River_NS',
            'Anti-Clockwise\nRivers': 'River_NW',
            'Bridges': 'Bridge_River_NS',
            'River to\nLake': 'River_To_Lake_NS'
        };
        riverTileName = roadTextToTileType[selectedMenuItem.text];
    }
    
    if (!riverTileName) {
        return null;
    }
    

    
    return getRiverFlowDirection(riverTileName);
}

// Function to get river arrow screen coordinates from menu item and sprite position
export function getRiverArrowScreenCoordinates(selectedMenuItem, spriteScreenX, spriteScreenY) {
    const coordinates = getRiverArrowCoordinates(selectedMenuItem);
    if (!coordinates) {
        return null;
    }
    
    // Add sprite screen position to the relative coordinates
    return {
        from: { 
            x: spriteScreenX + coordinates.from.x, 
            y: spriteScreenY + coordinates.from.y 
        },
        to: { 
            x: spriteScreenX + coordinates.to.x, 
            y: spriteScreenY + coordinates.to.y 
        }
    };
}

// Hardcoded mapping of river tile types to arrow sprites
export const RIVER_ARROW_MAPPING = {
    // Clockwise flow rivers
    'River_NS': {
        from: 'arrowNS',  // North to South - entry arrow pointing North
        to: 'arrowNS'     // North to South - exit arrow pointing South
    },
    'River_NE': {
        from: 'arrowNS',  // North to East - entry arrow pointing North
        to: 'arrowWE'     // North to East - exit arrow pointing East
    },
    'River_EW': {
        from: 'arrowEW',  // East to West - entry arrow pointing East
        to: 'arrowEW'     // East to West - exit arrow pointing West
    },
    'River_ES': {
        from: 'arrowEW',  // East to South - entry arrow pointing East
        to: 'arrowNS'     // East to South - exit arrow pointing South
    },
    'River_SW': {
        from: 'arrowSN',  // South to West - entry arrow pointing South
        to: 'arrowEW'     // South to West - exit arrow pointing West
    },
    'River_WN': {
        from: 'arrowWE',  // West to North - entry arrow pointing West
        to: 'arrowSN'     // West to North - exit arrow pointing North
    },
    
    // Anti-clockwise flow rivers
    'River_NW': {
        from: 'arrowNS',  // North to West - entry arrow pointing North
        to: 'arrowEW'     // North to West - exit arrow pointing West
    },
    'River_WE': {
        from: 'arrowWE',  // West to East - entry arrow pointing West
        to: 'arrowWE'     // West to East - exit arrow pointing East
    },
    'River_WS': {
        from: 'arrowWE',  // West to South - entry arrow pointing West
        to: 'arrowNS'     // West to South - exit arrow pointing South
    },
    'River_SN': {
        from: 'arrowSN',  // South to North - entry arrow pointing South
        to: 'arrowSN'     // South to North - exit arrow pointing North
    },
    'River_SE': {
        from: 'arrowSN',  // South to East - entry arrow pointing South
        to: 'arrowWE'     // South to East - exit arrow pointing East
    },
    'River_EN': {
        from: 'arrowEW',  // East to North - entry arrow pointing East
        to: 'arrowSN'     // East to North - exit arrow pointing North
    },
    
    // Bridge flow directions
    'Bridge_River_NS': {
        from: 'arrowNS',  // North to South - entry arrow pointing North
        to: 'arrowNS'     // North to South - exit arrow pointing South
    },
    'Bridge_River_SN': {
        from: 'arrowSN',  // South to North - entry arrow pointing South
        to: 'arrowSN'     // South to North - exit arrow pointing North
    },
    'Bridge_River_WE': {
        from: 'arrowWE',  // West to East - entry arrow pointing West
        to: 'arrowWE'     // West to East - exit arrow pointing East
    },
    'Bridge_River_EW': {
        from: 'arrowEW',  // East to West - entry arrow pointing East
        to: 'arrowEW'     // East to West - exit arrow pointing West
    },

    // River to Lake flow directions
    'River_To_Lake_NS': {
        from: 'arrowNS',  // North to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    },
    'River_To_Lake_EW': {
        from: 'arrowEW',  // East to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    },
    'River_To_Lake_SN': {
        from: 'arrowSN',  // South to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    },
    'River_To_Lake_WE': {
        from: 'arrowWE',  // West to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    },

    // Lake to River flow directions
    'Lake_To_River_SN': {
        from: 'arrowSN',  // South to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    },
    'Lake_To_River_WE': {
        from: 'arrowWE',  // West to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    },
    'Lake_To_River_NS': {
        from: 'arrowNS',  // North to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    },
    'Lake_To_River_EW': {
        from: 'arrowEW',  // East to Lake - entry arrow pointing towards center
        to: null          // No exit arrow (flows into lake)
    }
};

// Function to get arrow sprites for a specific river tile
export function getRiverArrowSprites(riverTileName) {
    return RIVER_ARROW_MAPPING[riverTileName] || null;
}

// Function to get river arrow data with sprite information
export function getRiverArrowData(selectedMenuItem, spriteScreenX, spriteScreenY) {
    const coordinates = getRiverArrowScreenCoordinates(selectedMenuItem, spriteScreenX, spriteScreenY);
    if (!coordinates) {
        return null;
    }
    
    // Get the current river tile type
    let riverTileName = null;
    if (selectedMenuItem.currentVariant) {
        riverTileName = selectedMenuItem.currentVariant;
    } else {
        const roadTextToTileType = {
            'Clockwise\nRivers': 'River_NS',
            'Anti-Clockwise\nRivers': 'River_NW',
            'Bridges': 'Bridge_River_NS',
            'River to\nLake': 'River_To_Lake_NS'
        };
        riverTileName = roadTextToTileType[selectedMenuItem.text];
    }
    
    if (!riverTileName) {
        return null;
    }
    
    // Get the arrow sprites for this river tile
    const arrowSprites = getRiverArrowSprites(riverTileName);
    if (!arrowSprites) {
        return null;
    }
    

    
    return {
        coordinates: coordinates,
        arrowSprites: arrowSprites
    };
} 