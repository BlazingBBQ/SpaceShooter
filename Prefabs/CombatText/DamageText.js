var damageTextColor = "#555555FF";

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.CombatText.DAMAGE_TEXT,
        color: damageTextColor,
    }
}

module.exports = {
    generateNew: generateNew,
}
