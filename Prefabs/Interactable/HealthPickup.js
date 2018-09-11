var healthPickupWidth = 3;
var healthPickupHeight = 3;
var healthPickupHitboxWidth = 3;
var healthPickupHitboxHeight = 3;
var healthPickupHealing = 40;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.Interactable.HEALTH_PICKUP,
        width: healthPickupWidth,
        height: healthPickupHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: healthPickupHitboxWidth,
        hitboxHeight: healthPickupHitboxHeight,
        onInteract: (obs, selfRef, interactId) => {
            if (obs[interactId].heal) {
                obs[interactId].heal(obs, interactId, healthPickupHealing);
            }
            delete obs[selfRef];
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
