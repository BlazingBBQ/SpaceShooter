import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for gravestone object
 * @param object The gravestone object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function graveStoneMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#888888"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 0,
            cellY: 1,
            width: object.width,
            height: 1,
            swatch: 0,
        }, {
            cellX: 1,
            cellY: 0,
            width: 1,
            height: object.height,
            swatch: 0,
        }]
    }
}
