import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for binoculars ui icon
 * @param posX Horizontal icon position
 * @param posY Vertical icon position
 */
export function binocularsUIMasterPiece(posX: number, posY: number): masterPiece {
    return {
        palette: ["#000000", "#333333"],
        posX: posX,
        posY: posY,
        width: 3,
        height: 3,
        facing: -45,
        strokes: [ {
            cellX: 0,
            cellY: 1,
            width: 3,
            height: 1,
            swatch: 1
        }, {
            cellX: 0,
            cellY: 0,
            width: 1,
            height: 3,
            swatch: 0
        }, {
            cellX: 2,
            cellY: 0,
            width: 1,
            height: 3,
            swatch: 0
        },]
    };
}
