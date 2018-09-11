import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for spike trap object
 * @param object The spike trap object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function spikeTrapMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#808080"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 1,
            cellY: 0,
            width: 1,
            height: 2,
            swatch: 0
        }, {
            cellX: 3,
            cellY: 0,
            width: 1,
            height: 2,
            swatch: 0
        }, {
            cellX: 0,
            cellY: 3,
            width: 1,
            height: 2,
            swatch: 0
        }, {
            cellX: 2,
            cellY: 3,
            width: 1,
            height: 2,
            swatch: 0
        }, {
            cellX: 4,
            cellY: 3,
            width: 1,
            height: 2,
            swatch: 0
        },]
    };
}
