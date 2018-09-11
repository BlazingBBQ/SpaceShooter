import { masterPiece } from "../../../src/Popova/Popova";

/**
 * Get master piece for stunned status effect
 * @param object The stunned object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function stunnedStatusEffectMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number, renderSize: number): masterPiece {
    return {
        palette: ["#FFFF00"],
        posX: object.x - renderOffsetX,
        posY: object.y - object.height / 2 - renderOffsetY,
        width: object.width,
        height: 6,
        facing: 0,
        strokes: [{
            cellX: 1,
            cellY: 0,
            width: 1,
            height: 3,
            swatch: 0
        }, {
            cellX: 0,
            cellY: 1,
            width: 3,
            height: 1,
            swatch: 0
        }, {
            cellX: 3,
            cellY: 4,
            width: 1,
            height: 3,
            swatch: 0
        }, {
            cellX: 2,
            cellY: 5,
            width: 3,
            height: 1,
            swatch: 0
        }, {
            cellX: 5,
            cellY: 1,
            width: 1,
            height: 3,
            swatch: 0
        }, {
            cellX: 4,
            cellY: 2,
            width: 3,
            height: 1,
            swatch: 0
        }, ],
        customRenderSize: 2,
    }
}
