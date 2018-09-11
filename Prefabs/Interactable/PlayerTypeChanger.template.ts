import { masterPiece } from "../../src/Popova/Popova";
import * as types from "../../ObjectTypes";
import * as prefabs from "../Prefabs";

import * as _player from "../Player/_Player.template";
import * as firemage from "../Player/FireMage.template";
import * as god from "../Player/God.template";

/**
 * Get master piece for player type changer object
 * @param object The player type changer object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function playerTypeChangerMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    var customRenderSize = 2;
    return {
        palette: ["#888888", "#bbbbbb"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: object.width * prefabs.renderSize / customRenderSize,
            height: object.height * prefabs.renderSize / customRenderSize,
            swatch: 0
        }, {
            cellX: 1,
            cellY: 1,
            width: (object.width - 1) * prefabs.renderSize / customRenderSize,
            height: (object.height - 1) * prefabs.renderSize / customRenderSize,
            swatch: 1
        },],
        customRenderSize: customRenderSize,
    }
}

/**
 * Get little man for player type changer object
 * @param object The player type changer object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
export function littleManMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    var objCopy = object;
    objCopy.width = 2;
    objCopy.height = 3;

    var playerTypeChangerMasterPiece = _player.playerMasterPiece(objCopy, renderOffsetX, renderOffsetY);
    playerTypeChangerMasterPiece.customRenderSize = 2;
    switch (object.newPlayerType) {
        case types.Player.FIRE_MAGE:
            playerTypeChangerMasterPiece = firemage.firemagePlayerMasterPiece(objCopy, renderOffsetX, renderOffsetY);
            playerTypeChangerMasterPiece.customRenderSize = 2;
            break;
        case types.Player.GOD:
            playerTypeChangerMasterPiece = god.godPlayerMasterPiece(objCopy, renderOffsetX, renderOffsetY);
            playerTypeChangerMasterPiece.customRenderSize = 1;
            break;
    }

    return playerTypeChangerMasterPiece;
}
