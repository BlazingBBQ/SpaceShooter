var castleWallHorizWidth = 210;
var castleWallHorizHeight = 12;
var castleWallHorizHitboxWidth = 210;
var castleWallHorizHitboxHeight = 2;
var castleWallHorizHealth = 2500;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.Terrain.CASTLE_WALL_HORIZ,
        width: castleWallHorizWidth,
        height: castleWallHorizHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: castleWallHorizHitboxWidth,
        hitboxHeight: castleWallHorizHitboxHeight,
        health: castleWallHorizHealth,
        maxHealth: castleWallHorizHealth,
    };
}

module.exports = {
    generateNew: generateNew,
}
