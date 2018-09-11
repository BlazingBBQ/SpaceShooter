function generateNew(obs, params = { }) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");

    return {
        type: types.EquipmentTypes.BUILDER,
        use: (obs, sourceId, targetX, targetY) => {
            prefabs.generateNew(obs, sourceId, targetX, targetY, params.type, params.subtype);
        },
        onEquip: (obs, sourceId) => { },
        onDequip: (obs, sourceId) => { },
    };
}

module.exports = {
    generateNew: generateNew,
}
