var healTextColor = "#00CC00FF";

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.CombatText.HEAL_TEXT,
        color: healTextColor,
    }
}

module.exports = {
    generateNew: generateNew,
}
