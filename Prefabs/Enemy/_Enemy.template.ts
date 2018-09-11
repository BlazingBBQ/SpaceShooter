import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for enemy object
 * @param object The enemy object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function enemyMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#A52A2A", "#FF0000", "#FFFFFF"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            {cellX: 3, cellY: 0, width: 2, height: 12, swatch: 0},
            {cellX: 0, cellY: 4, width: 8, height: 2, swatch: 0},
            {cellX: 1, cellY: 3, width: 6, height: 6, swatch: 2},
            {cellX: 2, cellY: 4, width: 4, height: 4, swatch: 1},
            {cellX: 3, cellY: 5, width: 2, height: 2, swatch: 2},
        ],
        customRenderSize: 2,
    }
}
