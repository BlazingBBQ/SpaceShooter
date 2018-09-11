function generateNew(obs, params = { }) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");

    return {
        type: types.EquipmentTypes.BLASTER,
        use: (obs, sourceId, targetX, targetY) => {
            prefabs.generateNew(obs, sourceId, targetX, targetY, types.ObjectTypes.PROJECTILE, types.Projectile.BASIC_PROJECTILE);
        },
        onEquip: (obs, sourceId) => { },
        onDequip: (obs, sourceId) => { },
    };
}

module.exports = {
    generateNew: generateNew,
}
