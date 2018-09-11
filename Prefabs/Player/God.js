var godSpeed = 0.28;
var godHealth = 350;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    
    return { 
        ...base,
        subtype: types.Player.GOD,
        maxHealth: godHealth,
        health: godHealth,
        currentEquipment: 0,
        equipment: [
            prefabs.newEquipment(obs, types.EquipmentTypes.BLASTER),
            prefabs.newEquipment(obs, types.EquipmentTypes.SCANNER),
            prefabs.newEquipment(obs, types.EquipmentTypes.BUILDER, { type: types.ObjectTypes.TERRAIN, subtype: types.Terrain.TREE }),
            prefabs.newEquipment(obs, types.EquipmentTypes.BINOCULARS),
        ],
    }
}

module.exports = {
    generateNew: generateNew,
}
