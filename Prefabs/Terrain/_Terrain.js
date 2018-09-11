function generateNew(obs, src, posX, posY) {
    var types = require("../../ObjectTypes");
    var utils = require("../PrefabUtils");

    return {
        type: types.ObjectTypes.TERRAIN,
        x: posX,
        y: posY,
        update: (obs, selfId, delta) => { },
        deathrattle: (obs, selfId) => {
            if (obs[selfId]) delete obs[selfId];
        },
        damage: utils.damage,
    };
}

module.exports = {
    generateNew: generateNew,
}
