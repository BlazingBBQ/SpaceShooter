import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for castle floor object
 * @param object The castle floor object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function castleFloorMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#B6B6B6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 0, cellY: 0, width: object.width, height: object.height, swatch: 0 },
        ],
    }
}
