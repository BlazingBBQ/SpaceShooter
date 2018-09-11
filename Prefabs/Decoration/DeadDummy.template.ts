import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for dead dummy object
 * @param object The dead dummy object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function deadDummyMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#A52A2A"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            {cellX: 3, cellY: 0, width: 2, height: 4, swatch: 0},
        ],
        customRenderSize: 2,
    }
}
