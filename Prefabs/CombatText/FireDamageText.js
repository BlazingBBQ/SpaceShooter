var fireDamageTextColor = "#FF0000FF";

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.CombatText.FIRE_DAMAGE_TEXT,
        color: fireDamageTextColor,
    }
}

module.exports = {
    generateNew: generateNew,
}
