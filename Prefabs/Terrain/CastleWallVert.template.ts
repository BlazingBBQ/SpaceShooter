import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for vertical castle wall object
 * @param object The vertical castle wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function castleWallVertMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#333333", "#FAF0E6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.hitboxWidth,
        height: object.hitboxHeight,
        facing: object.facing,
        strokes: [
            { cellX: 0, cellY: 0, width: object.hitboxWidth, height: object.hitboxHeight, swatch: 0 },
            { cellX: 3, cellY: 33, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 70, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 105, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 140, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 175, width: 2, height: 2, swatch: 1 },
        ]
    }
}
