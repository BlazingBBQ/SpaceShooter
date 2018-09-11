import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for scanner ui icon
 * @param posX Horizontal icon position
 * @param posY Vertical icon position
 */
export function scannerUIMasterPiece(posX: number, posY: number): masterPiece {
    return {
        palette: ["#FFFFFF", "#3399FF"],
        posX: posX,
        posY: posY,
        width: 3,
        height: 3,
        facing: 0,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: 3,
            height: 3,
            swatch: 0
        }, {
            cellX: -1,
            cellY: 1,
            width: 5,
            height: 1,
            swatch: 0
        }, {
            cellX: 1,
            cellY: 1,
            width: 1,
            height: 1,
            swatch: 1
        },]
    };
}
