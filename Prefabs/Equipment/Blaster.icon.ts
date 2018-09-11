import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for blaster ui icon
 * @param posX Horizontal icon position
 * @param posY Vertical icon position
 */
export function blasterUIMasterPiece(posX: number, posY: number): masterPiece {
    return {
        palette: ["#000000"],
        posX: posX,
        posY: posY,
        width: 3,
        height: 2,
        facing: -45,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: 1,
            height: 2,
            swatch: 0
        }, {
            cellX: 0,
            cellY: 0,
            width: 3,
            height: 1,
            swatch: 0
        },]
    };
}
