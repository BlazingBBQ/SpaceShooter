var castleFloorWidth = 200;
var castleFloorHeight = 210;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    
    return {
        ...base,
        subtype: types.Decoration.CASTLE_FLOOR,
        width: castleFloorWidth,
        height: castleFloorHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: castleFloorWidth,
        hitboxHeight: castleFloorHeight,
    };
}

module.exports = {
    generateNew: generateNew,
}
