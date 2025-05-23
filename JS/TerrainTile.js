// TerrainTile.js

export class TerrainTile {
    constructor(name, isometricSprite, cartesianSprite, tileHeightSpillOver, area) {
        this.name = name;
        this.isometricSprite = isometricSprite;
        this.cartesianSprite = cartesianSprite;
        this.tileHeightSpillOver = 0; 
        this.area = 1;
        this.miniMapTileColour = 'rgba(0, 255, 0, 0.8)';
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
    T_JUNCTION_TOP: 't_junction_top',
    T_JUNCTION_RIGHT: 't_junction_right',
    T_JUNCTION_BOTTOM: 't_junction_bottom',
    T_JUNCTION_LEFT: 't_junction_left',

    // Buildings
    POWER_PLANT: 'Power_Plant',
    FACTORUM: 'Factorum',
    CHEMICAL_PLANT: 'Chemical_Plant',
    TRAIN_STATION: 'Train_Station',
    PROMETHIUM_REFINERY: 'Promethium_Refinery'
        //Buildings
    // Power Station - tileHeightOverSpill: 65px
    // Steel Foundry - tileHeightOverSpill: 131px
    //CHEMICAL_PLANT: 'Chemical_Plant' // tileHeightOverSpill: 30px
    // Train Station - tileHeightOverSpill: 14px
    // Oil Refinery - tileHeightOverSpill: 53px
};

// Factory function to create terrain tiles
export function createTerrainTile(type, isometricSprite, cartesianSprite, tileHeightSpillOver, area) {
    return new TerrainTile(type, isometricSprite, cartesianSprite, tileHeightSpillOver, area);
} 