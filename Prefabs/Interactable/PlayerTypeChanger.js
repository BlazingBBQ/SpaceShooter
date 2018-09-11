var playerTypeChangerWidth = 5;
var playerTypeChangerHeight = 5;
var playerTypeChangerHitboxWidth = 5;
var playerTypeChangerHitboxHeight = 5;

function generateNew(obs, src, posX, posY, base, params = { }) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    
    return {
        ...base,
        subtype: types.Interactable.PLAYER_TYPE_CHANGER,
        width: playerTypeChangerWidth,
        height: playerTypeChangerHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: playerTypeChangerHitboxWidth,
        hitboxHeight: playerTypeChangerHitboxHeight,
        newPlayerType: params.newType,
        onInteract: (obs, selfRef, interactId) => {
            if (obs[interactId].type === types.ObjectTypes.PLAYER && obs[interactId].subtype !== obs[selfRef].newPlayerType) {
                prefabs.generateNew(obs, interactId, obs[interactId].x, obs[interactId].y, types.ObjectTypes.PLAYER, obs[selfRef].newPlayerType);
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
