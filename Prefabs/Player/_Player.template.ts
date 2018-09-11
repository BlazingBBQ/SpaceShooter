import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for player object
 * @param object The player object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function playerMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#abab9a", "#775050", "#AAAAAA", "#000080"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [{
            cellX: 0,
            cellY: 2,
            width: 4,
            height: 2,
            swatch: 3
        }, {
            cellX: 1,
            cellY: 0,
            width: 2,
            height: 2,
            swatch: 0
        }, {
            cellX: 0,
            cellY: 3,
            width: 1,
            height: 1,
            swatch: 2
        }, {
            cellX: 3,
            cellY: 3,
            width: 1,
            height: 1,
            swatch: 2
        }, {
            cellX: 1,
            cellY: 4,
            width: 1,
            height: 2,
            swatch: 1
        }, {
            cellX: 2,
            cellY: 4,
            width: 1,
            height: 2,
            swatch: 1
        }],
    }
}
