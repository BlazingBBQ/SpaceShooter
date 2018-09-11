var treeWidth = 4;
var treeHeight = 8;
var treeHitboxWidth = 4;
var treeHitboxHeight = 8;
var treeHealth = 200;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.Terrain.TREE,
        width: treeWidth,
        height: treeHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: treeHitboxWidth,
        hitboxHeight: treeHitboxHeight,
        health: treeHealth,
        maxHealth: treeHealth,
    };
}

module.exports = {
    generateNew: generateNew,
}
