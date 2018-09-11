import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for horizontal castle wall object base
 * @param object The horizontal wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function castleWallHorizBaseMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#222222"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.hitboxWidth,
        height: object.hitboxHeight,
        facing: object.facing,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: object.hitboxWidth,
            height: object.hitboxHeight,
            swatch: 0
        }]
    }
}

/**
 * Get master piece for horizontal castle wall object cover
 * @param object The horizontal castle wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function castleWallHorizCoverMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#333333", "#FAF0E6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [
            { cellX: 0, cellY: -object.height / 2 ,width: object.width, height: object.height, swatch: 0 },
            { cellX: 103, cellY: 1 , width: 1, height: 2, swatch: 1 },
            { cellX: 103, cellY: 2 , width: 2, height: 1, swatch: 1 },
            { cellX: 107, cellY: 1 , width: 1, height: 2, swatch: 1 },
            { cellX: 106, cellY: 2 , width: 2, height: 1, swatch: 1 },
            { cellX: 103, cellY: -2 , width: 1, height: 2, swatch: 1 },
            { cellX: 103, cellY: -2 , width: 2, height: 1, swatch: 1 },
            { cellX: 107, cellY: -2 , width: 1, height: 2, swatch: 1 },
            { cellX: 106, cellY: -2 , width: 2, height: 1, swatch: 1 },

            { cellX: 33, cellY: -1 , width: 3, height: 3, swatch: 1 },
            { cellX: 70, cellY: -1 , width: 3, height: 3, swatch: 1 },
            { cellX: 140, cellY: -1 , width: 3, height: 3, swatch: 1 },
            { cellX: 175, cellY: -1 , width: 3, height: 3, swatch: 1 },
        ]
    }
}
