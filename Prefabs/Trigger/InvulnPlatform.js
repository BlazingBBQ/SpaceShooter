var invulnPlatformWidth = 16;
var invulnPlatformHeight = 16;
var invulnPlatformBuffDuration = 150;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    
    return {
        ...base,
        subtype: types.Trigger.INVULN_PLATFORM,
        width: invulnPlatformWidth,
        height: invulnPlatformHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: invulnPlatformWidth,
        hitboxHeight: invulnPlatformHeight,
        onTrigger: (obs, selfRef, triggerId) => {
            if (obs[triggerId]) {
                if (obs[triggerId].statusEffects) {
                    obs[triggerId].addStatusEffect(obs, triggerId, types.StatusEffects.INVULNERABLE, invulnPlatformBuffDuration);
                }
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
