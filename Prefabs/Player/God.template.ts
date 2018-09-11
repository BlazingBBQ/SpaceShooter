import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for god player object
 * @param object The god player object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function godPlayerMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {    // Skin,      Shirt,    Pants
        palette: ["#D2B48C", "#F0FFFF", "#800080"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 2, cellY: 0, width: 4, height: 4, swatch: 0 },
            { cellX: 0, cellY: 4, width: 8, height: 4, swatch: 1 },
            { cellX: 2, cellY: 4, width: 4, height: 8, swatch: 2 },
            { cellX: 0, cellY: 6, width: 2, height: 2, swatch: 0 },
            { cellX: 6, cellY: 6, width: 2, height: 2, swatch: 0 },
            { cellX: 3, cellY: 4, width: 2, height: 3, swatch: 1 },
        ],
        customRenderSize: 2
    }
}
