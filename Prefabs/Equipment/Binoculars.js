var binocularsViewRange = 2;

function generateNew(obs, params = { }) {
    var types = require("../../ObjectTypes");

    return {
        type: types.EquipmentTypes.BINOCULARS,
        use: (obs, sourceId, targetX, targetY) => { },
        onEquip: (obs, sourceId) => {
            obs[sourceId].prevViewRange = obs[sourceId].viewRange;
            obs[sourceId].viewRange = binocularsViewRange;
        },
        onDequip: (obs, sourceId) => {
            obs[sourceId].viewRange = obs[sourceId].prevViewRange;
            delete obs[sourceId].prevViewRange;
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
