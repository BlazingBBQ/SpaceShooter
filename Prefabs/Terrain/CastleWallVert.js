var castleWallVertWidth = 8;
var castleWallVertHeight = 210;
var castleWallVertHitboxWidth = 8;
var castleWallVertHitboxHeight = 210;
var castleWallVertHealth = 2500;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.Terrain.CASTLE_WALL_VERT,
        width: castleWallVertWidth,
        height: castleWallVertHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: castleWallVertHitboxWidth,
        hitboxHeight: castleWallVertHitboxHeight,
        health: castleWallVertHealth,
        maxHealth: castleWallVertHealth,
    };
}

module.exports = {
    generateNew: generateNew,
}
