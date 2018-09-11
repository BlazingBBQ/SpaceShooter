var spikeTrapWidth = 5;
var spikeTrapHeight = 5;
var spikeTrapHitboxWidth = 5;
var spikeTrapHitboxHeight = 5;
var spikeTrapDamage = 20;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    
    return {
        ...base,
        subtype: types.Trigger.SPIKE_TRAP,
        width: spikeTrapWidth,
        height: spikeTrapHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: spikeTrapHitboxWidth,
        hitboxHeight: spikeTrapHitboxHeight,
        onTrigger: (obs, selfRef, triggerId) => {
            if (obs[triggerId] && (
                obs[triggerId].type == types.ObjectTypes.PLAYER ||
                obs[triggerId].type == types.ObjectTypes.VEHICLE ||
                obs[triggerId].type == types.ObjectTypes.ENEMY
            )) {
                if (obs[triggerId].damage) {
                    obs[triggerId].damage(obs, triggerId, spikeTrapDamage, types.DamageTypes.NORMAL);
                }
                delete obs[selfRef];
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
