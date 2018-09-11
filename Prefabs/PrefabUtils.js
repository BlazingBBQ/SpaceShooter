var types = require("../ObjectTypes");
var prefabs = require("./Prefabs");

function damage(obs, selfId, amount, damageType) {
    var types = require("../ObjectTypes");
    var prefabs = require("./Prefabs");

    obs[selfId].health -= amount;

    var textType = undefined;
    switch (damageType) {
        case types.DamageTypes.NORMAL:
            textType = types.CombatText.DAMAGE_TEXT;
            break;
        case types.DamageTypes.FIRE:
            textType = types.CombatText.FIRE_DAMAGE_TEXT;
            break;
    }
    if (textType) prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, textType, { text: "-" + amount });

    if (obs[selfId].health <= 0){
        obs[selfId].deathrattle(obs, selfId);
    }
}

module.exports = {
    damage: damage,
}
