import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for fire pillar projectile
 * @param object The fire pillar projectile object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function flamePillarProjectileMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#E67E00D9", "#FF6933D9", "#FF8C00D9", "#FFA500D9"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 1,
            cellY: 0,
            width: object.width - 2,
            height: object.height,
            swatch: object.triggered ? 1 : 0
        }, {
            cellX: 0,
            cellY: 1,
            width: object.width,
            height: object.height - 1,
            swatch: object.triggered ? 1 : 0
        }, {
            cellX: 0,
            cellY: 3,
            width: 2,
            height: 1,
            swatch: object.triggered ? 3 : 2
        }, {
            cellX: 2,
            cellY: 4,
            width: 2,
            height: 1,
            swatch: object.triggered ? 3 : 2
        }, {
            cellX: 4,
            cellY: 5,
            width: 2,
            height: 1,
            swatch: object.triggered ? 3 : 2
        }, {
            cellX: 0,
            cellY: 7,
            width: 2,
            height: 1,
            swatch: object.triggered ? 3 : 2
        }, {
            cellX: 2,
            cellY: 8,
            width: 2,
            height: 1,
            swatch: object.triggered ? 3 : 2
        }, {
            cellX: 4,
            cellY: 9,
            width: 2,
            height: 1,
            swatch: object.triggered ? 3 : 2
        },]
    }
}
