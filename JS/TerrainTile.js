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
    HAB_BLOCK: 'Hab_Block'
};

// Factory function to create terrain tiles
export function createTerrainTile(type, isometricSprite, cartesianSprite, tileHeightSpillOver, area) {
    return new TerrainTile(type, isometricSprite, cartesianSprite, tileHeightSpillOver, area);
} 