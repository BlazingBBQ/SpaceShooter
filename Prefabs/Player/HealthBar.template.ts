import { masterPiece } from "../../src/Popova/Popova";

/**
 * Get master piece for object's health bar
 * @param object The object that needs a health bar
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 * @param cubeSize The cube render size, required when drawing free hand
 */
export function healthBarMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number, cubeSize: number): masterPiece {
    return {
        palette: ["#00a400", "#FF0000"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY - (object.height + 2) * cubeSize / 2,
        width: object.width,
        height: 1,
        facing: 0,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: object.health / object.maxHealth * object.width * cubeSize,
            height: cubeSize * 3 / 4,
            swatch: (object.health > object.maxHealth / 3) ? 0 : 1,
        },],
        customRenderSize: 1
    };
}
