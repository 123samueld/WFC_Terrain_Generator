// TerrainTile.js

export class TerrainTile {
    constructor(name, isometricSprite, cartesianSprite) {
        this.name = name;
        this.isometricSprite = isometricSprite;
        this.cartesianSprite = cartesianSprite;
    }

    draw(ctx, x, y, projection = 'isometric') {
        const sprite = projection === 'isometric' ? this.isometricSprite : this.cartesianSprite;
        if (sprite) {
            ctx.drawImage(sprite, x, y);
        }
    }
}

// Tile types enum
export const TileType = {
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
    T_JUNCTION_LEFT: 't_junction_left'
};

// Factory function to create terrain tiles
export function createTerrainTile(type, isometricSprite, cartesianSprite) {
    return new TerrainTile(type, isometricSprite, cartesianSprite);
} 