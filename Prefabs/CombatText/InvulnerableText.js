var invulnerableTextColor = "#AAAA0088";    // TODO: More visible color...

function generateNew(obs, src, posX, posY, base) {
    var types = require("../../ObjectTypes");
    
    return {
        ...base,
        subtype: types.CombatText.INVULNERABLE_TEXT,
        color: invulnerableTextColor,
    }
}

module.exports = {
    generateNew: generateNew,
}
