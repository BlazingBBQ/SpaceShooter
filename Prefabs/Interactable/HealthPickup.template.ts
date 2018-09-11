import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for health pickup object
 * @param object The health pickup object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function healthPickupMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#FFFFFF", "#FF0000"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: object.width,
            height: object.height,
            swatch: 0
        }, {
            cellX: 0,
            cellY: 1,
            width: object.width,
            height: 1,
            swatch: 1
        }, {
            cellX: 1,
            cellY: 0,
            width: 1,
            height: object.height,
            swatch: 1
        }]
    }
}
