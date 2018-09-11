var flamePillarSpeed = 0;
var flamePillarWidth = 6;
var flamePillarHeight = 12;
var flamePillarHitBoxWidth = 6;
var flamePillarHitBoxHeight = 12;
var flamePillarDamage = 16;
var flamePillarTickIncrease = 2;
var flamePillarStunDuration = 1500;

var flamePillarTriggerDelay = 500;
var flamePillarTimeout = 1000;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    var firemage = require("../Player/FireMage");
    var collisions = require("../../Collisions");
    
    return {
        ...base,
        subtype: types.Projectile.FLAME_PILLAR_PROJECTILE,
        x: posX,
        y: posY,
        velocityX: flamePillarSpeed,
        velocityY: flamePillarSpeed,
        facing: 0,
        width: flamePillarWidth,
        height: flamePillarHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: flamePillarHitBoxWidth,
        hitboxHeight: flamePillarHitBoxHeight,
        damage: flamePillarDamage,
        initTime: Date.now(),
        triggered: false,
        update: (obs, selfId, delta) => {
            var newTime = Date.now();

            // If timeout is passed, delete item
            if (obs[selfId] && newTime - obs[selfId].initTime >= flamePillarTimeout) {
                delete obs[selfId];
            }

            // If trigger delay elapsed, check for object collisions
            if (obs[selfId] && newTime - obs[selfId].initTime >= flamePillarTriggerDelay) {
                obs[selfId].triggered = true;
                collisions.checkCollisions(selfId, obs, prefabs.renderSize, (srcId, collisionId) => {
                    if (obs[srcId] && collisionId != srcId && collisionId != obs[srcId].source){
                        obs[srcId].onHit(obs, srcId, collisionId);
                    }
                });
            }
        },
        onHit: (obs, srcId, collisionId) => {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.ENEMY:
                    obs[collisionId].addStatusEffect(obs, collisionId, types.StatusEffects.STUNNED, flamePillarStunDuration);
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                    if (obs[srcId]) {
                        if (obs[collisionId] && obs[collisionId].damage) {
                            firemage.increaseFireTick(
                                obs,
                                obs[srcId].source,
                                (obs[collisionId].type === types.ObjectTypes.PLAYER || obs[collisionId].type === types.ObjectTypes.ENEMY) ? flamePillarTickIncrease : 0
                            );

                            const damage = obs[srcId].damage;
                            const fireDamage = obs[obs[srcId].source].fireTicks ? obs[obs[srcId].source].fireTicks * firemage.fireTickDamage: 0;

                            obs[collisionId].damage(obs, collisionId, damage, types.DamageTypes.NORMAL);
                            if (fireDamage && obs[collisionId]) obs[collisionId].damage( obs, collisionId, fireDamage, types.DamageTypes.FIRE);
                        }
                        delete obs[srcId];
                    }
                    break;
            }
        },
    }
}

module.exports = {
    generateNew: generateNew,
}
