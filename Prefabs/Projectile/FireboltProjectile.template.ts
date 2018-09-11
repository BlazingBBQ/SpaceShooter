import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for firebolt projectile
 * @param object The firebolt projectile object
 * @param renderOffsetX Horizontal offset for rendering the objects
 * @param renderOffsetY Vertical offset for rendering the objects
 */
export function fireboltProjectileMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#CD5C5C", "#FF8C00"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 1,
            cellY: 0,
            width: 1,
            height: object.height,
            swatch: 0
        }, {
            cellX: 0,
            cellY: 1,
            width: object.width,
            height: 1,
            swatch: 0
        }, {
            cellX: 0.5,
            cellY: 0.5,
            width: 2,
            height: 2,
            swatch: 0
        }, {
            cellX: 1,
            cellY: 1,
            width: 1,
            height: 1,
            swatch: 1
        },]
    }
}
