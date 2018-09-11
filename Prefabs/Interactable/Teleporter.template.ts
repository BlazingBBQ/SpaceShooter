import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for teleporter object
 * @param object The teleporter object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function teleporterMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#DA70D6", "#BA55D3"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            {cellX: 0, cellY: 0, width: 10, height: 10, swatch: 0},
            {cellX: 1, cellY: 1, width: 8, height: 8, swatch: 1},
            {cellX: 2, cellY: 2, width: 6, height: 6, swatch: 0},
            {cellX: 3, cellY: 3, width: 4, height: 4, swatch: 1},
            {cellX: 4, cellY: 4, width: 2, height: 2, swatch: 0},
        ],
        customRenderSize: 2,
    }
}
