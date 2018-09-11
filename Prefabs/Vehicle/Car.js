var carSpeed = 0.35;
var carWidth = 10;
var carHeight = 16;
var carHitboxWidth = 10;
var carHitboxHeight = 16;
var carHealth = 200;
var carViewRange = 1 / 3;
var carColors = [
    "#DC143C",      // Crimson
    "#006400",      // Dark Green
    "#FF69B4",      // Hot Pink
    "#FFD700",      // Gold
    "#708090",      // Slate Gray
    "#00BFFF",      // Deep Sky Blue
    "#0000CD",      // Medium Blue
    "#FF4500",      // Orange Red
    "#8B008B",      // Dark Magenta
];

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    var prefabs = require("../Prefabs");
    var carColor = Math.floor(Math.random() * (carColors.length));
    var vehicleId = src + ":" + types.ObjectTypes.VEHICLE + ":" + types.Vehicle.CAR + ":" + posX + ":" + posY;
    
    prefabs.generateNew(obs, vehicleId, posX, posY, types.ObjectTypes.INTERACTABLE, types.Interactable.CAR_ENTER);

    obs[vehicleId] =  {
        ...base,
        subtype: types.Vehicle.CAR,
        speed: carSpeed,
        width: carWidth,
        height: carHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: carHitboxWidth,
        hitboxHeight: carHitboxHeight,
        health: carHealth,
        maxHealth: carHealth,
        carColor: carColors[carColor],
        viewRange: carViewRange,
        interactableId: vehicleId + ":" + types.ObjectTypes.INTERACTABLE + ":" + types.Interactable.CAR_ENTER,
    };
    return;
}

module.exports = {
    generateNew: generateNew,
}
