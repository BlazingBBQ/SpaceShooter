import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for watch tower object
 * @param object The watch tower object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function watchTowerMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    return {
        //          Primary, Secondary, Banner,    Wood dark, Wood light, Flag
        palette: ["#222222", "#333333", "#FAF0E6", "#66320E", "#7F3F12", "#663399"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            {cellX: 5, cellY: 0, width: 1, height: 6, swatch: 3},
            {cellX: 6, cellY: 0, width: 3, height: 2, swatch: 5},
            {cellX: 1, cellY: 6, width: 9, height: 2, swatch: 0},
            {cellX: 0, cellY: 8, width: 11, height: 1, swatch: 1},

            {cellX: 3, cellY: 14, width: 1, height: 1, swatch: 3},
            {cellX: 7, cellY: 14, width: 1, height: 1, swatch: 3},
            {cellX: 1, cellY: 13, width: 9, height: 1, swatch: 4},
            {cellX: 1, cellY: 9, width: 1, height: 6, swatch: 3},
            {cellX: 9, cellY: 9, width: 1, height: 6, swatch: 3},
            
            {cellX: 0, cellY: 15, width: 11, height: 1, swatch: 1},
            {cellX: 1, cellY: 16, width: 9, height: 1, swatch: 0},

            {cellX: 2, cellY: 17, width: 7, height: 22, swatch: 0},
            {cellX: 3, cellY: 19, width: 2, height: 7, swatch: 2},
            {cellX: 3, cellY: 19, width: 1, height: 8, swatch: 2},
            {cellX: 6, cellY: 19, width: 2, height: 7, swatch: 2},
            {cellX: 7, cellY: 19, width: 1, height: 8, swatch: 2},
            {cellX: 3, cellY: 29, width: 2, height: 8, swatch: 2},
            {cellX: 3, cellY: 28, width: 1, height: 9, swatch: 2},
            {cellX: 6, cellY: 29, width: 2, height: 8, swatch: 2},
            {cellX: 7, cellY: 28, width: 1, height: 9, swatch: 2},
        ],
        customRenderSize: 6,
    }
}
