var teleporterWidth = 5;
var teleporterHeight = 5;
var teleporterHitboxWidth = 5;
var teleporterHitboxHeight = 5;

function generateNew(obs, src, posX, posY, base, params) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.Interactable.TELEPORTER,
        width: teleporterWidth,
        height: teleporterHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: teleporterHitboxWidth,
        hitboxHeight: teleporterHitboxHeight,
        destX: params.destX,
        destY: params.destY,
        onInteract: (obs, selfRef, interactId) => {
            if (obs[interactId]) {
                obs[interactId].x = obs[selfRef].destX;
                obs[interactId].y = obs[selfRef].destY;
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
