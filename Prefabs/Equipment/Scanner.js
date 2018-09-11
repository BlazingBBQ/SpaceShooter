function generateNew(obs, params = { }) {
    var types = require("../../ObjectTypes");
    var collisions = require("../../Collisions");
    var prefabs = require("../Prefabs");

    return {
        type: types.EquipmentTypes.SCANNER,
        use: (obs, sourceId, targetX, targetY) => {
            // Replaces all builders with this build type...
            collisions.checkClickCollisions(targetX, targetY, obs, prefabs.renderSize, (collisionId) => {
                if (obs[collisionId].subtype != types.Interactable.CAR_ENTER) {
                    obs[sourceId].equipment = obs[sourceId].equipment.map((item) => {
                        if (item.type == types.EquipmentTypes.BUILDER) {
                            item = prefabs.newEquipment(obs, types.EquipmentTypes.BUILDER, { type: obs[collisionId].type, subtype: obs[collisionId].subtype });
                        }
                        return item;
                    });
                }
            });
        },
        onEquip: (obs, sourceId) => { },
        onDequip: (obs, sourceId) => { },
    };
}

module.exports = {
    generateNew: generateNew,
}
