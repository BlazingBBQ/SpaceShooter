var shootCooldown = 600;

function generateNew(obs) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");

    return {
        type: types.Abilities.SHOOT,
        cooldown: shootCooldown,
        lastcast: undefined,
        cast: (obs, sourceId, abilityIndex, targetX, targetY) => {
            var newTime = Date.now();
            if (!obs[sourceId].abilities[abilityIndex].lastcast
                || newTime - obs[sourceId].abilities[abilityIndex].lastcast >= obs[sourceId].abilities[abilityIndex].cooldown) {
                obs[sourceId].abilities[abilityIndex].lastcast = newTime;
                
                var obj = obs[sourceId];

                prefabs.generateNew(
                    obs,
                    sourceId,
                    obj.x + Math.sin(2 * Math.PI * obj.facing / 360),
                    obj.y - Math.cos(2 * Math.PI * obj.facing / 360),
                    types.ObjectTypes.PROJECTILE,
                    types.Projectile.BASIC_PROJECTILE,
                );
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
