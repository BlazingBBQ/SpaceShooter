var flameBarrierCooldown = 8000;
var flameBarrierInvulnDuration = 500;

function generateNew(obs) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");

    return {
        type: types.Abilities.FLAME_BARRIER,
        cooldown: flameBarrierCooldown,
        lastcast: undefined,
        cast: (obs, sourceId, abilityIndex, targetX, targetY) => {
            var newTime = Date.now();
            if (!obs[sourceId].abilities[abilityIndex].lastcast
                || newTime - obs[sourceId].abilities[abilityIndex].lastcast >= obs[sourceId].abilities[abilityIndex].cooldown) {
                obs[sourceId].abilities[abilityIndex].lastcast = newTime;
                obs[sourceId].addStatusEffect(obs, sourceId, types.StatusEffects.INVULNERABLE, flameBarrierInvulnDuration);
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
