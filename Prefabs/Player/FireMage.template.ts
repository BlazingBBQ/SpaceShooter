import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for firemage player object
 * @param object The firemage player object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function firemagePlayerMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {    // Skin,      Pants,     Shirt,      Face
        palette: ["#D2B48C", "#A52A2A", "#DC143C", "#dbc3a3"],
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
            swatch: 2
        }, {
            cellX: 1,
            cellY: 0,
            width: 2,
            height: 4,
            swatch: 0
        }, {
            cellX: 1,
            cellY: 0,
            width: 2,
            height: 2,
            swatch: 3
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
        }, {
            cellX: 1,
            cellY: 0,
            width: 0.5,
            height: 6,
            swatch: 2
        }, {
            cellX: 2.5,
            cellY: 0,
            width: 0.5,
            height: 6,
            swatch: 2
        }, {
            cellX: 1,
            cellY: 0,
            width: 2,
            height: 0.5,
            swatch: 2
        },],
    }
}
