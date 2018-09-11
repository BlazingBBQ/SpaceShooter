function generateNew(obs, src, posX, posY) {
    var types = require("../../ObjectTypes");

    return {
        type: types.ObjectTypes.INTERACTABLE,
        x: posX,
        y: posY,
        update: (obs, selfId, delta) => { },
    };
}

module.exports = {
    generateNew: generateNew,
}
