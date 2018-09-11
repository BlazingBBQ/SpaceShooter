import { masterPiece, StrokeTypes } from "../../src/Popova/Popova";

/**
 * Get master piece for basic projectile
 * @param object The projectile object
 * @param renderOffsetX Horizontal offset for rendering the objects
 * @param renderOffsetY Vertical offset for rendering the objects
 */
export function projectileMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    /* return {
        // Remove comments for rainbow bullets
        // palette: ["#FF6666", "#66FF66", "#6666FF", "#FFFF66", "#FF66FF", "#66FFFF"],
        palette: ["#222222"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: object.width,
            height: object.height,
            // swatch: Math.floor(Math.random() * 6)
            swatch: 0
        }]
    }   */

    return {
        palette: ["#999999"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        shadowHeight: 6,
        strokes: [{
            type: StrokeTypes.SVG,
            path: 'M 14 6 Q 16 8 14 10 Q 7 15 0 13 Q 5 8 0 4 Q 8 1 14 6 Z', 
            params: { fill: '#992222', fillStyle: 'solid', strokeWidth: 0.2 }
        }]
    }
}
