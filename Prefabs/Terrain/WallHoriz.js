var wallHorizWidth = 20;
var wallHorizHeight = 12;
var wallHorizHitboxWidth = 20;
var wallHorizHitboxHeight = 2;
var wallHorizHealth = 250;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.Terrain.WALL_HORIZ,
        width: wallHorizWidth,
        height: wallHorizHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: wallHorizHitboxWidth,
        hitboxHeight: wallHorizHitboxHeight,
        health: wallHorizHealth,
        maxHealth: wallHorizHealth,
    };
}

module.exports = {
    generateNew: generateNew,
}
