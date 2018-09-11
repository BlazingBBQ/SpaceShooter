var carEnterWidth = 24;
var carEnterHeight = 24;
var carEnterHitboxWidth = 24;
var carEnterHitboxHeight = 24;

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.Interactable.CAR_ENTER,
        width: carEnterWidth,
        height: carEnterHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: carEnterHitboxWidth,
        hitboxHeight: carEnterHitboxHeight,
        vehicleId: src,
        onInteract: (obs, selfRef, interactId) => {
            if (obs[interactId] &&
                obs[interactId].type === types.ObjectTypes.PLAYER &&
                obs[obs[selfRef].vehicleId].rider == undefined
            ) {
                obs[obs[selfRef].vehicleId].rider = obs[interactId];
                obs[interactId] = obs[obs[selfRef].vehicleId];
                delete obs[obs[selfRef].vehicleId];
                obs[selfRef].vehicleId = interactId;
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
