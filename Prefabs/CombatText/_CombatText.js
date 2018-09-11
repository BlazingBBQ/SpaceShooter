var combatTextAnimationSpeed = 0.05;
var combatTextFontSize = 9;
var combatTextColor = "#000000FF";
var combatTextDuration = 300;

function generateNew(obs, src, posX, posY, params) {
    var types = require("../../ObjectTypes");

    const x = obs[src] ? obs[src].x + (Math.random() - 0.5) * obs[src].width * 4: posX;
    const y = obs[src] ? obs[src].y - Math.random() * obs[src].height * 3 - obs[src].height * 3 : posY;
    const angle = obs[src] ? Math.atan2(y - obs[src].y, x - obs[src].x) : 0;

    return {
        type: types.ObjectTypes.COMBAT_TEXT,
        x: x,
        y: y,
        angle: angle,
        text: params.text,
        size: combatTextFontSize,
        color: combatTextColor,
        facing: angle * 180 / Math.PI + 90,
        initTime: Date.now(),
        duration: combatTextDuration,
        hitboxType: types.HitboxTypes.NONE,
        animationSpeed: combatTextAnimationSpeed,
        update: (obs, selfId, delta) => {
            obs[selfId].velocityX = Math.cos(angle) * obs[selfId].animationSpeed;
            obs[selfId].velocityY = Math.sin(angle) * obs[selfId].animationSpeed;

            const newTime = Date.now();
            const lifeTime = newTime - obs[selfId].initTime;

            obs[selfId].x += obs[selfId].velocityX * delta;
            obs[selfId].y += obs[selfId].velocityY * delta;

            var newOpacity = Math.max((1 - lifeTime / obs[selfId].duration) * 255, 0).toString(16).substring(0, 2).replace(".", "");
            if (newOpacity.length <= 1) newOpacity = "0" + newOpacity;
            obs[selfId].color = obs[selfId].color.substring(0, 7) + newOpacity;

            if (obs[selfId] && lifeTime >= obs[selfId].duration) {
                delete obs[selfId];
            }
        },
    };
}

module.exports = {
    generateNew: generateNew,
}
