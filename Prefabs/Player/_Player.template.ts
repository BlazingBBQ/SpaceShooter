import { masterPiece, StrokeTypes } from "../../src/Popova/Popova";

/**
 * Get master piece for player object
 * @param object The player object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
export function playerMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
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
            path: 'M 8 32 L 8 32 Q 4 12 16 0 Q 28 12 24 32 Q 16 16 8 32', 
            params: { fill: '#992222', fillStyle: 'solid', strokeWidth: 0.2 }
        }]
    }
}
