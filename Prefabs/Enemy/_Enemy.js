var enemySpeed = 0.2;
var enemyHealth = 300;
var enemyWidth = 4;
var enemyHeight = 6;

function generateNew(obs, src, posX, posY) {
    var types = require("../../ObjectTypes");
    var collisions = require("../../Collisions");
    var prefabs = require("../Prefabs");
    var utils = require("../PrefabUtils");

    return {
        type: types.ObjectTypes.ENEMY,
        subtype: types.Enemy.TARGET_DUMMY,
        x: posX,
        y: posY,
        velocityX: 0,
        velocityY: 0,
        speed: enemySpeed,
        width: enemyWidth,
        height: enemyHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: enemyWidth,
        hitboxHeight: enemyHeight,
        health: enemyHealth,
        maxHealth: enemyHealth,
        statusEffects: { },
        deathrattle: (obs, selfRef) => {
            prefabs.generateNew(obs, selfRef, obs[selfRef].x, obs[selfRef].y + 1 * obs[selfRef].height / 3 * prefabs.renderSize, types.ObjectTypes.DECORATION, types.Decoration.DEAD_DUMMY);
            delete obs[selfRef];
        },
        update: (obs, selfId, delta) => {
            obs[selfId].updateStatusEffects(obs, selfId);
            
            // Check collisions with terrain and reposition accordingly
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, (srcId, collisionId) => {
                if (obs[srcId] && collisionId != srcId){
                    switch (obs[collisionId].type) {        // Should collide with players?
                        case types.ObjectTypes.VEHICLE:
                        case types.ObjectTypes.TERRAIN:
                        case types.ObjectTypes.PLAYER:
                        case types.ObjectTypes.ENEMY:
                            collisions.pushBack(obs, srcId, collisionId, prefabs.renderSize);
                            break;
                    }
                }
            });
        },
        heal: (obs, selfId, amount) => {
            if (obs[selfId]) {
                var healAmount = obs[selfId].health + amount >= obs[selfId].maxHealth
                    ? obs[selfId].maxHealth - obs[selfId].health
                    : amount;
                obs[selfId].health += healAmount
                prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, types.CombatText.HEAL_TEXT, { text: "+" + healAmount });
            }
        },
        damage: (obs, selfId, amount, damageType) => {
            if (checkStatusEffect(obs, selfId, types.StatusEffects.INVULNERABLE)) {
                prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, types.CombatText.INVULNERABLE_TEXT, { text: "* " + amount });
            } else {
                utils.damage(obs, selfId, amount, damageType);
            }
        },
        updateStatusEffects: (obs, selfId) => {
            var newTime = Date.now();

            statusEffectCheckHelper(obs, selfId, types.StatusEffects.STUNNED, newTime);
            statusEffectCheckHelper(obs, selfId, types.StatusEffects.INVULNERABLE, newTime);
        },
        addStatusEffect: (obs, id, effect, duration) => {
            var newTime = Date.now();
            
            // Only replace the current status effect last cast and duration if the new duration is longer than what's left
            if (
                !obs[id].statusEffects[effect] ||
                obs[id].statusEffects[effect].duration - (newTime - obs[id].statusEffects[effect].last) < duration
            ) {
                obs[id].statusEffects[effect] = { };
                obs[id].statusEffects[effect].last = newTime;
                obs[id].statusEffects[effect].duration = duration;
            }
        },
    };
}

function statusEffectCheckHelper(obs, id, effect, newTime) {
    if (
        obs[id].statusEffects[effect] &&
        newTime - obs[id].statusEffects[effect].last >= obs[id].statusEffects[effect].duration
    ) {
        delete obs[id].statusEffects[effect];
    }
}

function checkStatusEffect(obs, id, effect) {
    return obs[id].statusEffects[effect];
}

function checkStatusEffectObject(object, effect) {
    return object.statusEffects[effect];
}

module.exports = {
    generateNew: generateNew,
    checkStatusEffect: checkStatusEffectObject,
}
