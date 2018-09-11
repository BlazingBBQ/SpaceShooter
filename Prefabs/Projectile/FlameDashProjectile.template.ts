import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for fire dash projectile
 * @param object The fire dash projectile object
 * @param renderOffsetX Horizontal offset for rendering the objects
 * @param renderOffsetY Vertical offset for rendering the objects
 */
export function flameDashProjectileMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    const customRenderSize = 2;
    
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
            width: 2,
            height: object.height  * customRenderSize,
            swatch: 0
        }, {
            cellX: 0,
            cellY: 1,
            width: object.width * customRenderSize,
            height: 2,
            swatch: 0
        }, {
            cellX: 0.5,
            cellY: 0.5,
            width: 3,
            height: 3,
            swatch: 0
        }, {
            cellX: 1,
            cellY: 1,
            width: 2,
            height: 2,
            swatch: 1
        },],
        customRenderSize: customRenderSize,
    }
}
