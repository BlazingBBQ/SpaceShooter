var watchTowerWidth = 16.5;
var watchTowerHeight = 58.5;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    
    return {
        ...base,
        subtype: types.Decoration.WATCH_TOWER,
        width: watchTowerWidth,
        height: watchTowerHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: watchTowerWidth,
        hitboxHeight: watchTowerHeight,
    };
}

module.exports = {
    generateNew: generateNew,
}
