function generateNew(obs, src, posX, posY) {
    var types = require("../../ObjectTypes");
    var collisions = require("../../Collisions");
    var prefabs = require("../Prefabs");

    return {
        type: types.ObjectTypes.TRIGGER,
        x: posX,
        y: posY,
        update: (obs, selfId, delta) => {
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, (srcId, collisionId) => {
                if (obs[srcId] && collisionId != srcId){
                    obs[srcId].onTrigger(obs, srcId, collisionId);
                }
            });
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
