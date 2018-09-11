var flameDashSpeed = 0.14;
var flameDashWidth = 2;
var flameDashHeight = 2;
var flameDashHitBoxRadius = 1;
var flameDashDamage = 6;
var flameDashTickIncrease = 2;
var flameDashTrackingRadius = 150;
var flameDashMaxProjDistance = flameDashTrackingRadius * 2;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    var firemage = require("../Player/FireMage");
    var collisions = require("../../Collisions");

    var trackId = undefined;
    var smallestDist = undefined;

    collisions.checkCollisionsByDistance(src, obs, flameDashTrackingRadius, (srcId, collisionId, dist) => {
        if (obs[collisionId] && obs[srcId] && srcId !== collisionId) {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.ENEMY:
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                    if (!trackId || dist < smallestDist) {
                        trackId = collisionId;
                        smallestDist = dist;
                    }
                    break;
            }
        }
    });
    if (!trackId) return;
    
    return {
        ...base,
        subtype: types.Projectile.FLAME_DASH_PROJECTILE,
        velocityX: 0,
        velocityY: 0,
        width: flameDashWidth,
        height: flameDashHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: flameDashHitBoxRadius,
        hitboxHeight: flameDashHitBoxRadius,
        damage: flameDashDamage,
        trackId: trackId,
        maxProjDist: flameDashMaxProjDistance,
        update: (obs, selfId, delta) => {
            if (obs[selfId] && obs[obs[selfId].trackId]) {
                const dist = Math.sqrt(
                    Math.pow(obs[selfId].x - obs[obs[selfId].trackId].x, 2) +
                    Math.pow(obs[selfId].y - obs[obs[selfId].trackId].y, 2));

                if (dist > flameDashTrackingRadius) {
                    delete obs[selfId];
                } else {
                    var angle = Math.atan2(
                        obs[obs[selfId].trackId].y - obs[selfId].y,
                        obs[obs[selfId].trackId].x - obs[selfId].x);
                    
                    obs[selfId].velocityX = Math.cos(angle) * flameDashSpeed,
                    obs[selfId].velocityY = Math.sin(angle) * flameDashSpeed,

                    // Calculate projectile movement
                    obs[selfId].x += obs[selfId].velocityX * delta;
                    obs[selfId].y += obs[selfId].velocityY * delta;
                    obs[selfId].dist += Math.sqrt(
                        Math.pow(obs[selfId].velocityX * delta, 2) +
                        Math.pow(obs[selfId].velocityY * delta, 2));

                    collisions.checkCollisions(selfId, obs, prefabs.renderSize, (srcId, collisionId) => {
                        if (obs[srcId] && collisionId != srcId && collisionId != obs[srcId].source){
                            obs[srcId].onHit(obs, srcId, collisionId);
                        }
                    });
                    if (obs[selfId]) {
                        if (obs[selfId].dist > obs[selfId].maxProjDist) {
                            delete obs[selfId];
                        }
                    }
                }
            } else {
                if (obs[selfId]) delete obs[selfId];
            }
        },
        onHit: (obs, srcId, collisionId) => {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                case types.ObjectTypes.ENEMY:
                    if (obs[srcId]) {
                        if (obs[collisionId] && obs[collisionId].damage) {
                            firemage.increaseFireTick(
                                obs,
                                obs[srcId].source,
                                (obs[collisionId].type === types.ObjectTypes.PLAYER || obs[collisionId].type === types.ObjectTypes.ENEMY) ? flameDashTickIncrease : 0
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
