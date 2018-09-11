var deadDummyWidth = 4;
var deadDummyHeight = 2;
var deadDummyHitboxWidth = 4;
var deadDummyHitboxHeight = 2;
var deadDummyHealth = 1000;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    
    return {
        ...base,
        subtype: types.Decoration.DEAD_DUMMY,
        width: deadDummyWidth,
        height: deadDummyHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: deadDummyHitboxWidth,
        hitboxHeight: deadDummyHitboxHeight,
        health: deadDummyHealth,
        maxHealth: deadDummyHealth,
        update: (obs, selfId, delta) => {
            if (obs[selfId]) {
                obs[selfId].health -= deadDummyHealth / delta / 8;
                if (obs[selfId].health <= 0) {
                    obs[selfId].deathrattle(obs, selfId);
                }
            }
        },
        deathrattle: (obs, selfId) => {
            if (obs[selfId]) {
                prefabs.generateNew(obs, selfId, obs[selfId].x, obs[selfId].y - obs[selfId].height * prefabs.renderSize, types.ObjectTypes.ENEMY, types.Enemy.TARGET_DUMMY);
                delete obs[selfId];
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
