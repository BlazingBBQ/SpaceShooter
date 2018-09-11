import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for invuln platform object
 * @param object The invuln platform object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function invulnPlatformMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        palette: ["#E5E5E5", "#222222", "#888888", "#ADD8E6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            {cellX: 2, cellY: 0, width: 12, height: 16, swatch: 0},
            {cellX: 0, cellY: 2, width: 16, height: 12, swatch: 0},
            {cellX: 2, cellY: 0, width: 12, height: 1, swatch: 1},
            {cellX: 0, cellY: 2, width: 1, height: 12, swatch: 1},
            {cellX: 2, cellY: 15, width: 12, height: 1, swatch: 1},
            {cellX: 15, cellY: 2, width: 1, height: 12, swatch: 1},
            {cellX: 1, cellY: 1, width: 1, height: 1, swatch: 1},
            {cellX: 14, cellY: 1, width: 1, height: 1, swatch: 1},
            {cellX: 1, cellY: 14, width: 1, height: 1, swatch: 1},
            {cellX: 14, cellY: 14, width: 1, height: 1, swatch: 1},
            {cellX: 3, cellY: 3, width: 10, height: 6, swatch: 3},
            {cellX: 4, cellY: 8, width: 8, height: 3, swatch: 3},
            {cellX: 5, cellY: 10, width: 6, height: 2, swatch: 3},
            {cellX: 3, cellY: 3, width: 10, height: 1, swatch: 2},
            {cellX: 3, cellY: 3, width: 1, height: 6, swatch: 2},
            {cellX: 12, cellY: 3, width: 1, height: 6, swatch: 2},
            {cellX: 6, cellY: 12, width: 4, height: 1, swatch: 2},
            {cellX: 4, cellY: 9, width: 1, height: 2, swatch: 2},
            {cellX: 11, cellY: 9, width: 1, height: 2, swatch: 2},
            {cellX: 5, cellY: 11, width: 1, height: 1, swatch: 2},
            {cellX: 10, cellY: 11, width: 1, height: 1, swatch: 2},
        ],
    }
}

// Creeper face...
// {cellX: 0, cellY: 0, width: 16, height: 16, swatch: 0},
// {cellX: 2, cellY: 2, width: 4, height: 4, swatch: 1},
// {cellX: 10, cellY: 2, width: 4, height: 4, swatch: 1},
// {cellX: 6, cellY: 6, width: 4, height: 6, swatch: 1},
// {cellX: 4, cellY: 8, width: 2, height: 6, swatch: 1},
// {cellX: 10, cellY: 8, width: 2, height: 6, swatch: 1},
