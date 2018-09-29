/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Collisions.js":
/*!***********************!*\
  !*** ./Collisions.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var types = __webpack_require__(/*! ./ObjectTypes */ "./ObjectTypes.js");
module.exports = {
    // Check collisions between all objects
    checkCollisions: function (checkSrc, obs, renderSize, callBack) {
        var src = obs[checkSrc];
        for (id in obs) {
            var check = obs[id];
            var collision = false;
            if (check) {
                switch (src.hitboxType) {
                    case types.HitboxTypes.RECT:
                        switch (check.hitboxType) {
                            case types.HitboxTypes.RECT:
                                collision = checkCollisionRectRect(src, check, renderSize);
                                break;
                            case types.HitboxTypes.CIRC:
                                collision = checkCollisionCircRect(check, src, renderSize);
                                break;
                        }
                        break;
                    case types.HitboxTypes.CIRC:
                        switch (check.hitboxType) {
                            case types.HitboxTypes.RECT:
                                collision = checkCollisionCircRect(src, check, renderSize);
                                break;
                            case types.HitboxTypes.CIRC:
                                collision = checkCollisionCircCirc(src, check, renderSize);
                                break;
                        }
                        break;
                }
                if (collision)
                    callBack(checkSrc, id);
            }
        }
    },
    // Check collisions between all objects by distance
    checkCollisionsByDistance: function (checkSrc, obs, maxDist, callBack) {
        var src = obs[checkSrc];
        for (id in obs) {
            var check = obs[id];
            if (check) {
                var dist = Math.sqrt(Math.pow(src.x - check.x, 2) +
                    Math.pow(src.y - check.y, 2));
                if (dist <= maxDist)
                    callBack(checkSrc, id, dist);
            }
        }
    },
    // Check collisions between click location and all objects
    checkClickCollisions: function (clickX, clickY, obs, renderSize, callBack) {
        for (id in obs) {
            var check = obs[id];
            if (check) {
                var xIn = valueInRange(clickX, check.x - check.hitboxWidth / 2 * renderSize, check.x + check.hitboxWidth / 2 * renderSize) ||
                    valueInRange(clickX, check.x - check.hitboxWidth / 2 * renderSize, check.x + check.hitboxWidth / 2 * renderSize);
                var yIn = valueInRange(clickY, check.y - check.hitboxHeight / 2 * renderSize, check.y + check.hitboxHeight / 2 * renderSize) ||
                    valueInRange(clickY, check.y - check.hitboxHeight / 2 * renderSize, check.y + check.hitboxHeight / 2 * renderSize);
                if (xIn && yIn)
                    callBack(id);
            }
        }
    },
    pushBack: function (obs, srcId, collisionId, renderSize) {
        // Push object back out of collision terrain towards which ever side is the closest to the terrain object
        var distRight = Math.abs((obs[collisionId].x - obs[collisionId].hitboxWidth * renderSize / 2) - (obs[srcId].x + obs[srcId].hitboxWidth * renderSize / 2));
        var distLeft = Math.abs((obs[collisionId].x + obs[collisionId].hitboxWidth * renderSize / 2) - (obs[srcId].x - obs[srcId].hitboxWidth * renderSize / 2));
        var distUp = Math.abs((obs[collisionId].y + obs[collisionId].hitboxHeight * renderSize / 2) - (obs[srcId].y - obs[srcId].hitboxHeight * renderSize / 2));
        var distDown = Math.abs((obs[collisionId].y - obs[collisionId].hitboxHeight * renderSize / 2) - (obs[srcId].y + obs[srcId].hitboxHeight * renderSize / 2));
        if (distRight < distLeft && distRight < distUp && distRight < distDown) {
            obs[srcId].x = obs[srcId].x - distRight;
        }
        if (distLeft < distRight && distLeft < distUp && distLeft < distDown) {
            obs[srcId].x = obs[srcId].x + distLeft;
        }
        if (distUp < distRight && distUp < distLeft && distUp < distDown) {
            obs[srcId].y = obs[srcId].y + distUp;
        }
        if (distDown < distRight && distDown < distLeft && distDown < distUp) {
            obs[srcId].y = obs[srcId].y - distDown;
        }
    },
};
// Collision detection helper, checks if value is between min and max
function valueInRange(value, min, max) {
    return (value >= min) && (value <= max);
}
// Check collision: rect - rect
function checkCollisionRectRect(src, check, renderSize) {
    var xIn = valueInRange(src.x - src.hitboxWidth / 2 * renderSize, check.x - check.hitboxWidth / 2 * renderSize, check.x + check.hitboxWidth / 2 * renderSize) ||
        valueInRange(src.x + src.hitboxWidth / 2 * renderSize, check.x - check.hitboxWidth / 2 * renderSize, check.x + check.hitboxWidth / 2 * renderSize) ||
        valueInRange(check.x - check.hitboxWidth / 2 * renderSize, src.x - src.hitboxWidth / 2 * renderSize, src.x + src.hitboxWidth / 2 * renderSize) ||
        valueInRange(check.x + check.hitboxWidth / 2 * renderSize, src.x - src.hitboxWidth / 2 * renderSize, src.x + src.hitboxWidth / 2 * renderSize);
    var yIn = valueInRange(src.y - src.hitboxHeight / 2 * renderSize, check.y - check.hitboxHeight / 2 * renderSize, check.y + check.hitboxHeight / 2 * renderSize) ||
        valueInRange(src.y + src.hitboxHeight / 2 * renderSize, check.y - check.hitboxHeight / 2 * renderSize, check.y + check.hitboxHeight / 2 * renderSize) ||
        valueInRange(check.y - check.hitboxHeight / 2 * renderSize, src.y - src.hitboxHeight / 2 * renderSize, src.y + src.hitboxHeight / 2 * renderSize) ||
        valueInRange(check.y + check.hitboxHeight / 2 * renderSize, src.y - src.hitboxHeight / 2 * renderSize, src.y + src.hitboxHeight / 2 * renderSize);
    return xIn && yIn;
}
// Check collision: circ - rect
function checkCollisionCircRect(src, check, renderSize) {
    var angle = Math.atan2(src.y - check.y, src.x - check.x);
    var width = Math.abs(Math.cos(angle) * src.hitboxRadius * 2);
    var height = Math.abs(Math.sin(angle) * src.hitboxRadius * 2);
    return checkCollisionRectRect({ x: src.x, y: src.y, hitboxWidth: width, hitboxHeight: height }, check, renderSize);
}
// Check collision: circ - circ
function checkCollisionCircCirc(src, check, renderSize) {
    var angle = Math.atan2(src.y - check.y, src.x - check.x);
    var width = Math.abs(Math.cos(angle) * src.hitboxRadius * 2);
    var height = Math.abs(Math.sin(angle) * src.hitboxRadius * 2);
    return checkCollisionCircRect(check, { x: src.x, y: src.y, hitboxWidth: width, hitboxHeight: height }, renderSize);
}


/***/ }),

/***/ "./ObjectTypes.js":
/*!************************!*\
  !*** ./ObjectTypes.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
    ObjectTypes: {
        PLAYER: "player",
        GRAVESTONE: "gravestone",
        PROJECTILE: "projectile",
        TERRAIN: "terrain",
        INTERACTABLE: "interactable",
        TRIGGER: "trigger",
        VEHICLE: "vehicle",
        COMBAT_TEXT: "combat-text",
        ENEMY: "enemy",
        DECORATION: "decoration",
    },
    Player: {
        HUMAN: "human",
        GOD: "god",
        FIRE_MAGE: "fire-mage",
    },
    Projectile: {
        BASIC_PROJECTILE: "basic-projectile",
        FIREBOLT_PROJECTILE: "firebolt-projectile",
        FLAME_PILLAR_PROJECTILE: "flame-pillar-projectile",
        FLAME_DASH_PROJECTILE: "flame-dash-projectile",
    },
    Terrain: {
        TREE: "tree",
        WALL_HORIZ: "wall-horiz",
        CASTLE_WALL_HORIZ: "castle-wall-horiz",
        CASTLE_WALL_VERT: "castle-wall-vert",
    },
    Interactable: {
        HEALTH_PICKUP: "health-pickup",
        CAR_ENTER: "car-enter",
        PLAYER_TYPE_CHANGER: "player-type-changer",
        TELEPORTER: "teleporter",
    },
    Trigger: {
        SPIKE_TRAP: "spike-trap",
        INVULN_PLATFORM: "invuln-platform",
    },
    Vehicle: {
        CAR: "car",
    },
    Enemy: {
        TARGET_DUMMY: "target-dummy",
    },
    Decoration: {
        DEAD_DUMMY: "dead-dummy",
        WATCH_TOWER: "watch-tower",
        CASTLE_FLOOR: "castle-floor",
    },
    EquipmentTypes: {
        BLASTER: "blaster",
        SCANNER: "scanner",
        BUILDER: "builder",
        BINOCULARS: "binoculars",
    },
    Abilities: {
        FIREBOLT: "firebolt",
        FLAME_PILLAR: "flame-pillar",
        FLAME_DASH: "flame-dash",
        FLAME_BARRIER: "flame-barrier",
    },
    StatusEffects: {
        STUNNED: "stunned",
        INVULNERABLE: "invulnerable",
    },
    CombatText: {
        DAMAGE_TEXT: "damage-text",
        FIRE_DAMAGE_TEXT: "fire-damage-text",
        INVULNERABLE_TEXT: "invulnerable-text",
        HEAL_TEXT: "heal-text",
    },
    HitboxTypes: {
        NONE: "none",
        RECT: "rect",
        CIRC: "circ",
    },
    DamageTypes: {
        NORMAL: "normal-damage",
        FIRE: "fire-damage",
    },
};


/***/ }),

/***/ "./Prefabs/Abilities/Firebolt.js":
/*!***************************************!*\
  !*** ./Prefabs/Abilities/Firebolt.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fireboltCooldown = 600;
function generateNew(obs) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.Abilities.FIREBOLT,
        cooldown: fireboltCooldown,
        lastcast: undefined,
        cast: function (obs, sourceId, abilityIndex, targetX, targetY) {
            var newTime = Date.now();
            if (!obs[sourceId].abilities[abilityIndex].lastcast
                || newTime - obs[sourceId].abilities[abilityIndex].lastcast >= obs[sourceId].abilities[abilityIndex].cooldown) {
                obs[sourceId].abilities[abilityIndex].lastcast = newTime;
                prefabs.generateNew(obs, sourceId, targetX, targetY, types.ObjectTypes.PROJECTILE, types.Projectile.FIREBOLT_PROJECTILE);
            }
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Abilities/FlameBarrier.js":
/*!*******************************************!*\
  !*** ./Prefabs/Abilities/FlameBarrier.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var flameBarrierCooldown = 8000;
var flameBarrierInvulnDuration = 500;
function generateNew(obs) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.Abilities.FLAME_BARRIER,
        cooldown: flameBarrierCooldown,
        lastcast: undefined,
        cast: function (obs, sourceId, abilityIndex, targetX, targetY) {
            var newTime = Date.now();
            if (!obs[sourceId].abilities[abilityIndex].lastcast
                || newTime - obs[sourceId].abilities[abilityIndex].lastcast >= obs[sourceId].abilities[abilityIndex].cooldown) {
                obs[sourceId].abilities[abilityIndex].lastcast = newTime;
                obs[sourceId].addStatusEffect(obs, sourceId, types.StatusEffects.INVULNERABLE, flameBarrierInvulnDuration);
            }
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Abilities/FlameDash.js":
/*!****************************************!*\
  !*** ./Prefabs/Abilities/FlameDash.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var flameDashCooldown = 5000;
function generateNew(obs) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.Abilities.FLAME_DASH,
        cooldown: flameDashCooldown,
        lastcast: undefined,
        cast: function (obs, sourceId, abilityIndex, targetX, targetY) {
            var newTime = Date.now();
            if (!obs[sourceId].abilities[abilityIndex].lastcast
                || newTime - obs[sourceId].abilities[abilityIndex].lastcast >= obs[sourceId].abilities[abilityIndex].cooldown) {
                obs[sourceId].x = targetX;
                obs[sourceId].y = targetY;
                obs[sourceId].abilities[abilityIndex].lastcast = newTime;
                prefabs.generateNew(obs, sourceId, targetX, targetY, types.ObjectTypes.PROJECTILE, types.Projectile.FLAME_DASH_PROJECTILE);
            }
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Abilities/FlamePillar.js":
/*!******************************************!*\
  !*** ./Prefabs/Abilities/FlamePillar.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var flamePillarCooldown = 3000;
function generateNew(obs) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.Abilities.FLAME_PILLAR,
        cooldown: flamePillarCooldown,
        lastcast: undefined,
        cast: function (obs, sourceId, abilityIndex, targetX, targetY) {
            var newTime = Date.now();
            if (!obs[sourceId].abilities[abilityIndex].lastcast
                || newTime - obs[sourceId].abilities[abilityIndex].lastcast >= obs[sourceId].abilities[abilityIndex].cooldown) {
                obs[sourceId].abilities[abilityIndex].lastcast = newTime;
                prefabs.generateNew(obs, sourceId, targetX, targetY, types.ObjectTypes.PROJECTILE, types.Projectile.FLAME_PILLAR_PROJECTILE);
            }
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/CombatText/DamageText.js":
/*!******************************************!*\
  !*** ./Prefabs/CombatText/DamageText.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var damageTextColor = "#555555FF";
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.CombatText.DAMAGE_TEXT, color: damageTextColor });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/CombatText/FireDamageText.js":
/*!**********************************************!*\
  !*** ./Prefabs/CombatText/FireDamageText.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var fireDamageTextColor = "#FF0000FF";
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.CombatText.FIRE_DAMAGE_TEXT, color: fireDamageTextColor });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/CombatText/HealText.js":
/*!****************************************!*\
  !*** ./Prefabs/CombatText/HealText.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var healTextColor = "#00CC00FF";
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.CombatText.HEAL_TEXT, color: healTextColor });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/CombatText/InvulnerableText.js":
/*!************************************************!*\
  !*** ./Prefabs/CombatText/InvulnerableText.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var invulnerableTextColor = "#AAAA0088"; // TODO: More visible color...
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.CombatText.INVULNERABLE_TEXT, color: invulnerableTextColor });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/CombatText/_CombatText.js":
/*!*******************************************!*\
  !*** ./Prefabs/CombatText/_CombatText.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var combatTextAnimationSpeed = 0.05;
var combatTextFontSize = 9;
var combatTextColor = "#000000FF";
var combatTextDuration = 300;
function generateNew(obs, src, posX, posY, params) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var x = obs[src] ? obs[src].x + (Math.random() - 0.5) * obs[src].width * 4 : posX;
    var y = obs[src] ? obs[src].y - Math.random() * obs[src].height * 3 - obs[src].height * 3 : posY;
    var angle = obs[src] ? Math.atan2(y - obs[src].y, x - obs[src].x) : 0;
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
        update: function (obs, selfId, delta) {
            obs[selfId].velocityX = Math.cos(angle) * obs[selfId].animationSpeed;
            obs[selfId].velocityY = Math.sin(angle) * obs[selfId].animationSpeed;
            var newTime = Date.now();
            var lifeTime = newTime - obs[selfId].initTime;
            obs[selfId].x += obs[selfId].velocityX * delta;
            obs[selfId].y += obs[selfId].velocityY * delta;
            var newOpacity = Math.max((1 - lifeTime / obs[selfId].duration) * 255, 0).toString(16).substring(0, 2).replace(".", "");
            if (newOpacity.length <= 1)
                newOpacity = "0" + newOpacity;
            obs[selfId].color = obs[selfId].color.substring(0, 7) + newOpacity;
            if (obs[selfId] && lifeTime >= obs[selfId].duration) {
                delete obs[selfId];
            }
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Decoration/CastleFloor.js":
/*!*******************************************!*\
  !*** ./Prefabs/Decoration/CastleFloor.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var castleFloorWidth = 200;
var castleFloorHeight = 210;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Decoration.CASTLE_FLOOR, width: castleFloorWidth, height: castleFloorHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: castleFloorWidth, hitboxHeight: castleFloorHeight });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Decoration/CastleFloor.template.ts":
/*!****************************************************!*\
  !*** ./Prefabs/Decoration/CastleFloor.template.ts ***!
  \****************************************************/
/*! exports provided: castleFloorMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castleFloorMasterPiece", function() { return castleFloorMasterPiece; });
/**
 * Get master piece for castle floor object
 * @param object The castle floor object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function castleFloorMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#B6B6B6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 0, cellY: 0, width: object.width, height: object.height, swatch: 0 },
        ],
    };
}


/***/ }),

/***/ "./Prefabs/Decoration/DeadDummy.js":
/*!*****************************************!*\
  !*** ./Prefabs/Decoration/DeadDummy.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var deadDummyWidth = 4;
var deadDummyHeight = 2;
var deadDummyHitboxWidth = 4;
var deadDummyHitboxHeight = 2;
var deadDummyHealth = 1000;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Decoration.DEAD_DUMMY, width: deadDummyWidth, height: deadDummyHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: deadDummyHitboxWidth, hitboxHeight: deadDummyHitboxHeight, health: deadDummyHealth, maxHealth: deadDummyHealth, update: function (obs, selfId, delta) {
            if (obs[selfId]) {
                obs[selfId].health -= deadDummyHealth / delta / 8;
                if (obs[selfId].health <= 0) {
                    obs[selfId].deathrattle(obs, selfId);
                }
            }
        }, deathrattle: function (obs, selfId) {
            if (obs[selfId]) {
                prefabs.generateNew(obs, selfId, obs[selfId].x, obs[selfId].y - obs[selfId].height * prefabs.renderSize, types.ObjectTypes.ENEMY, types.Enemy.TARGET_DUMMY);
                delete obs[selfId];
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Decoration/DeadDummy.template.ts":
/*!**************************************************!*\
  !*** ./Prefabs/Decoration/DeadDummy.template.ts ***!
  \**************************************************/
/*! exports provided: deadDummyMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deadDummyMasterPiece", function() { return deadDummyMasterPiece; });
/**
 * Get master piece for dead dummy object
 * @param object The dead dummy object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function deadDummyMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#A52A2A"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 3, cellY: 0, width: 2, height: 4, swatch: 0 },
        ],
        customRenderSize: 2,
    };
}


/***/ }),

/***/ "./Prefabs/Decoration/WatchTower.js":
/*!******************************************!*\
  !*** ./Prefabs/Decoration/WatchTower.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var watchTowerWidth = 16.5;
var watchTowerHeight = 58.5;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Decoration.WATCH_TOWER, width: watchTowerWidth, height: watchTowerHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: watchTowerWidth, hitboxHeight: watchTowerHeight });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Decoration/WatchTower.template.ts":
/*!***************************************************!*\
  !*** ./Prefabs/Decoration/WatchTower.template.ts ***!
  \***************************************************/
/*! exports provided: watchTowerMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watchTowerMasterPiece", function() { return watchTowerMasterPiece; });
/**
 * Get master piece for watch tower object
 * @param object The watch tower object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function watchTowerMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        //          Primary, Secondary, Banner,    Wood dark, Wood light, Flag
        palette: ["#222222", "#333333", "#FAF0E6", "#66320E", "#7F3F12", "#663399"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 5, cellY: 0, width: 1, height: 6, swatch: 3 },
            { cellX: 6, cellY: 0, width: 3, height: 2, swatch: 5 },
            { cellX: 1, cellY: 6, width: 9, height: 2, swatch: 0 },
            { cellX: 0, cellY: 8, width: 11, height: 1, swatch: 1 },
            { cellX: 3, cellY: 14, width: 1, height: 1, swatch: 3 },
            { cellX: 7, cellY: 14, width: 1, height: 1, swatch: 3 },
            { cellX: 1, cellY: 13, width: 9, height: 1, swatch: 4 },
            { cellX: 1, cellY: 9, width: 1, height: 6, swatch: 3 },
            { cellX: 9, cellY: 9, width: 1, height: 6, swatch: 3 },
            { cellX: 0, cellY: 15, width: 11, height: 1, swatch: 1 },
            { cellX: 1, cellY: 16, width: 9, height: 1, swatch: 0 },
            { cellX: 2, cellY: 17, width: 7, height: 22, swatch: 0 },
            { cellX: 3, cellY: 19, width: 2, height: 7, swatch: 2 },
            { cellX: 3, cellY: 19, width: 1, height: 8, swatch: 2 },
            { cellX: 6, cellY: 19, width: 2, height: 7, swatch: 2 },
            { cellX: 7, cellY: 19, width: 1, height: 8, swatch: 2 },
            { cellX: 3, cellY: 29, width: 2, height: 8, swatch: 2 },
            { cellX: 3, cellY: 28, width: 1, height: 9, swatch: 2 },
            { cellX: 6, cellY: 29, width: 2, height: 8, swatch: 2 },
            { cellX: 7, cellY: 28, width: 1, height: 9, swatch: 2 },
        ],
        customRenderSize: 6,
    };
}


/***/ }),

/***/ "./Prefabs/Decoration/_Decoration.js":
/*!*******************************************!*\
  !*** ./Prefabs/Decoration/_Decoration.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return {
        type: types.ObjectTypes.DECORATION,
        x: posX,
        y: posY,
        update: function (obs, selfId, delta) { },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Enemy/_Enemy.js":
/*!*********************************!*\
  !*** ./Prefabs/Enemy/_Enemy.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var enemySpeed = 0.2;
var enemyHealth = 300;
var enemyWidth = 4;
var enemyHeight = 6;
function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var utils = __webpack_require__(/*! ../PrefabUtils */ "./Prefabs/PrefabUtils.js");
    return {
        type: types.ObjectTypes.ENEMY,
        subtype: types.Enemy.TARGET_DUMMY,
        x: posX,
        y: posY,
        velocityX: 0,
        velocityY: 0,
        speed: enemySpeed,
        width: enemyWidth,
        height: enemyHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: enemyWidth,
        hitboxHeight: enemyHeight,
        health: enemyHealth,
        maxHealth: enemyHealth,
        statusEffects: {},
        deathrattle: function (obs, selfRef) {
            prefabs.generateNew(obs, selfRef, obs[selfRef].x, obs[selfRef].y + 1 * obs[selfRef].height / 3 * prefabs.renderSize, types.ObjectTypes.DECORATION, types.Decoration.DEAD_DUMMY);
            delete obs[selfRef];
        },
        update: function (obs, selfId, delta) {
            obs[selfId].updateStatusEffects(obs, selfId);
            // Check collisions with terrain and reposition accordingly
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                if (obs[srcId] && collisionId != srcId) {
                    switch (obs[collisionId].type) { // Should collide with players?
                        case types.ObjectTypes.VEHICLE:
                        case types.ObjectTypes.TERRAIN:
                        case types.ObjectTypes.PLAYER:
                        case types.ObjectTypes.ENEMY:
                            collisions.pushBack(obs, srcId, collisionId, prefabs.renderSize);
                            break;
                    }
                }
            });
        },
        heal: function (obs, selfId, amount) {
            if (obs[selfId]) {
                var healAmount = obs[selfId].health + amount >= obs[selfId].maxHealth
                    ? obs[selfId].maxHealth - obs[selfId].health
                    : amount;
                obs[selfId].health += healAmount;
                prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, types.CombatText.HEAL_TEXT, { text: "+" + healAmount });
            }
        },
        damage: function (obs, selfId, amount, damageType) {
            if (checkStatusEffect(obs, selfId, types.StatusEffects.INVULNERABLE)) {
                prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, types.CombatText.INVULNERABLE_TEXT, { text: "* " + amount });
            }
            else {
                utils.damage(obs, selfId, amount, damageType);
            }
        },
        updateStatusEffects: function (obs, selfId) {
            var newTime = Date.now();
            statusEffectCheckHelper(obs, selfId, types.StatusEffects.STUNNED, newTime);
            statusEffectCheckHelper(obs, selfId, types.StatusEffects.INVULNERABLE, newTime);
        },
        addStatusEffect: function (obs, id, effect, duration) {
            var newTime = Date.now();
            // Only replace the current status effect last cast and duration if the new duration is longer than what's left
            if (!obs[id].statusEffects[effect] ||
                obs[id].statusEffects[effect].duration - (newTime - obs[id].statusEffects[effect].last) < duration) {
                obs[id].statusEffects[effect] = {};
                obs[id].statusEffects[effect].last = newTime;
                obs[id].statusEffects[effect].duration = duration;
            }
        },
    };
}
function statusEffectCheckHelper(obs, id, effect, newTime) {
    if (obs[id].statusEffects[effect] &&
        newTime - obs[id].statusEffects[effect].last >= obs[id].statusEffects[effect].duration) {
        delete obs[id].statusEffects[effect];
    }
}
function checkStatusEffect(obs, id, effect) {
    return obs[id].statusEffects[effect];
}
function checkStatusEffectObject(object, effect) {
    return object.statusEffects[effect];
}
module.exports = {
    generateNew: generateNew,
    checkStatusEffect: checkStatusEffectObject,
};


/***/ }),

/***/ "./Prefabs/Enemy/_Enemy.template.ts":
/*!******************************************!*\
  !*** ./Prefabs/Enemy/_Enemy.template.ts ***!
  \******************************************/
/*! exports provided: enemyMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enemyMasterPiece", function() { return enemyMasterPiece; });
/**
 * Get master piece for enemy object
 * @param object The enemy object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function enemyMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#A52A2A", "#FF0000", "#FFFFFF"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 3, cellY: 0, width: 2, height: 12, swatch: 0 },
            { cellX: 0, cellY: 4, width: 8, height: 2, swatch: 0 },
            { cellX: 1, cellY: 3, width: 6, height: 6, swatch: 2 },
            { cellX: 2, cellY: 4, width: 4, height: 4, swatch: 1 },
            { cellX: 3, cellY: 5, width: 2, height: 2, swatch: 2 },
        ],
        customRenderSize: 2,
    };
}


/***/ }),

/***/ "./Prefabs/Equipment/Binoculars.icon.ts":
/*!**********************************************!*\
  !*** ./Prefabs/Equipment/Binoculars.icon.ts ***!
  \**********************************************/
/*! exports provided: binocularsUIMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "binocularsUIMasterPiece", function() { return binocularsUIMasterPiece; });
/**
 * Get master piece for binoculars ui icon
 * @param posX Horizontal icon position
 * @param posY Vertical icon position
 */
function binocularsUIMasterPiece(posX, posY) {
    return {
        palette: ["#000000", "#333333"],
        posX: posX,
        posY: posY,
        width: 3,
        height: 3,
        facing: -45,
        strokes: [{
                cellX: 0,
                cellY: 1,
                width: 3,
                height: 1,
                swatch: 1
            }, {
                cellX: 0,
                cellY: 0,
                width: 1,
                height: 3,
                swatch: 0
            }, {
                cellX: 2,
                cellY: 0,
                width: 1,
                height: 3,
                swatch: 0
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Equipment/Binoculars.js":
/*!*****************************************!*\
  !*** ./Prefabs/Equipment/Binoculars.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var binocularsViewRange = 2;
function generateNew(obs, params) {
    if (params === void 0) { params = {}; }
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return {
        type: types.EquipmentTypes.BINOCULARS,
        use: function (obs, sourceId, targetX, targetY) { },
        onEquip: function (obs, sourceId) {
            obs[sourceId].prevViewRange = obs[sourceId].viewRange;
            obs[sourceId].viewRange = binocularsViewRange;
        },
        onDequip: function (obs, sourceId) {
            obs[sourceId].viewRange = obs[sourceId].prevViewRange;
            delete obs[sourceId].prevViewRange;
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Equipment/Blaster.icon.ts":
/*!*******************************************!*\
  !*** ./Prefabs/Equipment/Blaster.icon.ts ***!
  \*******************************************/
/*! exports provided: blasterUIMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blasterUIMasterPiece", function() { return blasterUIMasterPiece; });
/**
 * Get master piece for blaster ui icon
 * @param posX Horizontal icon position
 * @param posY Vertical icon position
 */
function blasterUIMasterPiece(posX, posY) {
    return {
        palette: ["#000000"],
        posX: posX,
        posY: posY,
        width: 3,
        height: 2,
        facing: -45,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: 1,
                height: 2,
                swatch: 0
            }, {
                cellX: 0,
                cellY: 0,
                width: 3,
                height: 1,
                swatch: 0
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Equipment/Blaster.js":
/*!**************************************!*\
  !*** ./Prefabs/Equipment/Blaster.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function generateNew(obs, params) {
    if (params === void 0) { params = {}; }
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.EquipmentTypes.BLASTER,
        use: function (obs, sourceId, targetX, targetY) {
            prefabs.generateNew(obs, sourceId, targetX, targetY, types.ObjectTypes.PROJECTILE, types.Projectile.BASIC_PROJECTILE);
        },
        onEquip: function (obs, sourceId) { },
        onDequip: function (obs, sourceId) { },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Equipment/Builder.icon.ts":
/*!*******************************************!*\
  !*** ./Prefabs/Equipment/Builder.icon.ts ***!
  \*******************************************/
/*! exports provided: builderUIMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "builderUIMasterPiece", function() { return builderUIMasterPiece; });
/**
 * Get master piece for builder ui icon
 * @param posX Horizontal icon position
 * @param posY Vertical icon position
 */
function builderUIMasterPiece(posX, posY) {
    return {
        palette: ["#000000", "#935200"],
        posX: posX,
        posY: posY,
        width: 3,
        height: 3,
        facing: -45,
        strokes: [{
                cellX: 1,
                cellY: 0,
                width: 1,
                height: 3,
                swatch: 1
            }, {
                cellX: 0,
                cellY: 0,
                width: 3,
                height: 1,
                swatch: 0
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Equipment/Builder.js":
/*!**************************************!*\
  !*** ./Prefabs/Equipment/Builder.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function generateNew(obs, params) {
    if (params === void 0) { params = {}; }
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.EquipmentTypes.BUILDER,
        use: function (obs, sourceId, targetX, targetY) {
            prefabs.generateNew(obs, sourceId, targetX, targetY, params.type, params.subtype);
        },
        onEquip: function (obs, sourceId) { },
        onDequip: function (obs, sourceId) { },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Equipment/Scanner.icon.ts":
/*!*******************************************!*\
  !*** ./Prefabs/Equipment/Scanner.icon.ts ***!
  \*******************************************/
/*! exports provided: scannerUIMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scannerUIMasterPiece", function() { return scannerUIMasterPiece; });
/**
 * Get master piece for scanner ui icon
 * @param posX Horizontal icon position
 * @param posY Vertical icon position
 */
function scannerUIMasterPiece(posX, posY) {
    return {
        palette: ["#FFFFFF", "#3399FF"],
        posX: posX,
        posY: posY,
        width: 3,
        height: 3,
        facing: 0,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: 3,
                height: 3,
                swatch: 0
            }, {
                cellX: -1,
                cellY: 1,
                width: 5,
                height: 1,
                swatch: 0
            }, {
                cellX: 1,
                cellY: 1,
                width: 1,
                height: 1,
                swatch: 1
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Equipment/Scanner.js":
/*!**************************************!*\
  !*** ./Prefabs/Equipment/Scanner.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function generateNew(obs, params) {
    if (params === void 0) { params = {}; }
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.EquipmentTypes.SCANNER,
        use: function (obs, sourceId, targetX, targetY) {
            // Replaces all builders with this build type...
            collisions.checkClickCollisions(targetX, targetY, obs, prefabs.renderSize, function (collisionId) {
                if (obs[collisionId].subtype != types.Interactable.CAR_ENTER) {
                    obs[sourceId].equipment = obs[sourceId].equipment.map(function (item) {
                        if (item.type == types.EquipmentTypes.BUILDER) {
                            item = prefabs.newEquipment(obs, types.EquipmentTypes.BUILDER, { type: obs[collisionId].type, subtype: obs[collisionId].subtype });
                        }
                        return item;
                    });
                }
            });
        },
        onEquip: function (obs, sourceId) { },
        onDequip: function (obs, sourceId) { },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Gravestone/_Gravestone.js":
/*!*******************************************!*\
  !*** ./Prefabs/Gravestone/_Gravestone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var gravestoneWidth = 3;
var gravestoneHeight = 4;
var gravestoneHitboxWidth = gravestoneWidth;
var gravestoneHitboxHeight = gravestoneHeight;
var gravestoneHealth = 40;
var gravestoneViewRange = 1 / 4;
function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var utils = __webpack_require__(/*! ../PrefabUtils */ "./Prefabs/PrefabUtils.js");
    return {
        type: types.ObjectTypes.GRAVESTONE,
        subtype: obs[src].subtype,
        x: posX,
        y: posY + 1 * prefabs.renderSize,
        velocityX: 0,
        velocityY: 0,
        speed: 0,
        width: gravestoneWidth,
        height: gravestoneHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: gravestoneHitboxWidth,
        hitboxHeight: gravestoneHitboxHeight,
        health: gravestoneHealth,
        maxHealth: gravestoneHealth,
        currentEquipment: undefined,
        equipment: [],
        viewRange: gravestoneViewRange,
        deathrattle: function (obs, selfRef) {
            prefabs.generateNew(obs, selfRef, 0, 0, types.ObjectTypes.PLAYER);
        },
        update: function (obs, selfId, delta) {
            // Check collisions with vehicles and reposition accordingly
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                if (obs[srcId] && collisionId != srcId) {
                    switch (obs[collisionId].type) {
                        case types.ObjectTypes.VEHICLE:
                            // Push object back out of collision vehicle towards which ever side is the closest to the vehicle object
                            collisions.pushBack(obs, srcId, collisionId, prefabs.renderSize);
                            break;
                    }
                }
            });
        },
        mouseDown: function (obs, mouseEvent) { },
        onPlayerInput: function (obs, selfId, playerInput) { },
        damage: utils.damage,
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Gravestone/_Gravestone.template.ts":
/*!****************************************************!*\
  !*** ./Prefabs/Gravestone/_Gravestone.template.ts ***!
  \****************************************************/
/*! exports provided: graveStoneMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "graveStoneMasterPiece", function() { return graveStoneMasterPiece; });
/**
 * Get master piece for gravestone object
 * @param object The gravestone object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function graveStoneMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#888888"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 1,
                width: object.width,
                height: 1,
                swatch: 0,
            }, {
                cellX: 1,
                cellY: 0,
                width: 1,
                height: object.height,
                swatch: 0,
            }]
    };
}


/***/ }),

/***/ "./Prefabs/Interactable/CarEnter.js":
/*!******************************************!*\
  !*** ./Prefabs/Interactable/CarEnter.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var carEnterWidth = 24;
var carEnterHeight = 24;
var carEnterHitboxWidth = 24;
var carEnterHitboxHeight = 24;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.Interactable.CAR_ENTER, width: carEnterWidth, height: carEnterHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: carEnterHitboxWidth, hitboxHeight: carEnterHitboxHeight, vehicleId: src, onInteract: function (obs, selfRef, interactId) {
            if (obs[interactId] &&
                obs[interactId].type === types.ObjectTypes.PLAYER &&
                obs[obs[selfRef].vehicleId].rider == undefined) {
                obs[obs[selfRef].vehicleId].rider = obs[interactId];
                obs[interactId] = obs[obs[selfRef].vehicleId];
                delete obs[obs[selfRef].vehicleId];
                obs[selfRef].vehicleId = interactId;
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Interactable/HealthPickup.js":
/*!**********************************************!*\
  !*** ./Prefabs/Interactable/HealthPickup.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var healthPickupWidth = 3;
var healthPickupHeight = 3;
var healthPickupHitboxWidth = 3;
var healthPickupHitboxHeight = 3;
var healthPickupHealing = 40;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.Interactable.HEALTH_PICKUP, width: healthPickupWidth, height: healthPickupHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: healthPickupHitboxWidth, hitboxHeight: healthPickupHitboxHeight, onInteract: function (obs, selfRef, interactId) {
            if (obs[interactId].heal) {
                obs[interactId].heal(obs, interactId, healthPickupHealing);
            }
            delete obs[selfRef];
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Interactable/HealthPickup.template.ts":
/*!*******************************************************!*\
  !*** ./Prefabs/Interactable/HealthPickup.template.ts ***!
  \*******************************************************/
/*! exports provided: healthPickupMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "healthPickupMasterPiece", function() { return healthPickupMasterPiece; });
/**
 * Get master piece for health pickup object
 * @param object The health pickup object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function healthPickupMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#FFFFFF", "#FF0000"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: object.width,
                height: object.height,
                swatch: 0
            }, {
                cellX: 0,
                cellY: 1,
                width: object.width,
                height: 1,
                swatch: 1
            }, {
                cellX: 1,
                cellY: 0,
                width: 1,
                height: object.height,
                swatch: 1
            }]
    };
}


/***/ }),

/***/ "./Prefabs/Interactable/PlayerTypeChanger.js":
/*!***************************************************!*\
  !*** ./Prefabs/Interactable/PlayerTypeChanger.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var playerTypeChangerWidth = 5;
var playerTypeChangerHeight = 5;
var playerTypeChangerHitboxWidth = 5;
var playerTypeChangerHitboxHeight = 5;
function generateNew(obs, src, posX, posY, base, params) {
    if (params === void 0) { params = {}; }
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Interactable.PLAYER_TYPE_CHANGER, width: playerTypeChangerWidth, height: playerTypeChangerHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: playerTypeChangerHitboxWidth, hitboxHeight: playerTypeChangerHitboxHeight, newPlayerType: params.newType, onInteract: function (obs, selfRef, interactId) {
            if (obs[interactId].type === types.ObjectTypes.PLAYER && obs[interactId].subtype !== obs[selfRef].newPlayerType) {
                prefabs.generateNew(obs, interactId, obs[interactId].x, obs[interactId].y, types.ObjectTypes.PLAYER, obs[selfRef].newPlayerType);
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Interactable/PlayerTypeChanger.template.ts":
/*!************************************************************!*\
  !*** ./Prefabs/Interactable/PlayerTypeChanger.template.ts ***!
  \************************************************************/
/*! exports provided: playerTypeChangerMasterPiece, littleManMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "playerTypeChangerMasterPiece", function() { return playerTypeChangerMasterPiece; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "littleManMasterPiece", function() { return littleManMasterPiece; });
/* harmony import */ var _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
/* harmony import */ var _ObjectTypes__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ObjectTypes__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Prefabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
/* harmony import */ var _Prefabs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Prefabs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Player_Player_template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Player/_Player.template */ "./Prefabs/Player/_Player.template.ts");
/* harmony import */ var _Player_FireMage_template__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Player/FireMage.template */ "./Prefabs/Player/FireMage.template.ts");
/* harmony import */ var _Player_God_template__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Player/God.template */ "./Prefabs/Player/God.template.ts");





/**
 * Get master piece for player type changer object
 * @param object The player type changer object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function playerTypeChangerMasterPiece(object, renderOffsetX, renderOffsetY) {
    var customRenderSize = 2;
    return {
        palette: ["#888888", "#bbbbbb"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: object.width * _Prefabs__WEBPACK_IMPORTED_MODULE_1__["renderSize"] / customRenderSize,
                height: object.height * _Prefabs__WEBPACK_IMPORTED_MODULE_1__["renderSize"] / customRenderSize,
                swatch: 0
            }, {
                cellX: 1,
                cellY: 1,
                width: (object.width - 1) * _Prefabs__WEBPACK_IMPORTED_MODULE_1__["renderSize"] / customRenderSize,
                height: (object.height - 1) * _Prefabs__WEBPACK_IMPORTED_MODULE_1__["renderSize"] / customRenderSize,
                swatch: 1
            },],
        customRenderSize: customRenderSize,
    };
}
/**
 * Get little man for player type changer object
 * @param object The player type changer object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function littleManMasterPiece(object, renderOffsetX, renderOffsetY) {
    var objCopy = object;
    objCopy.width = 2;
    objCopy.height = 3;
    var playerTypeChangerMasterPiece = _Player_Player_template__WEBPACK_IMPORTED_MODULE_2__["playerMasterPiece"](objCopy, renderOffsetX, renderOffsetY);
    playerTypeChangerMasterPiece.customRenderSize = 2;
    switch (object.newPlayerType) {
        case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Player"].FIRE_MAGE:
            playerTypeChangerMasterPiece = _Player_FireMage_template__WEBPACK_IMPORTED_MODULE_3__["firemagePlayerMasterPiece"](objCopy, renderOffsetX, renderOffsetY);
            playerTypeChangerMasterPiece.customRenderSize = 2;
            break;
        case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Player"].GOD:
            playerTypeChangerMasterPiece = _Player_God_template__WEBPACK_IMPORTED_MODULE_4__["godPlayerMasterPiece"](objCopy, renderOffsetX, renderOffsetY);
            playerTypeChangerMasterPiece.customRenderSize = 1;
            break;
    }
    return playerTypeChangerMasterPiece;
}


/***/ }),

/***/ "./Prefabs/Interactable/Teleporter.js":
/*!********************************************!*\
  !*** ./Prefabs/Interactable/Teleporter.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var teleporterWidth = 5;
var teleporterHeight = 5;
var teleporterHitboxWidth = 5;
var teleporterHitboxHeight = 5;
function generateNew(obs, src, posX, posY, base, params) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.Interactable.TELEPORTER, width: teleporterWidth, height: teleporterHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: teleporterHitboxWidth, hitboxHeight: teleporterHitboxHeight, destX: params.destX, destY: params.destY, onInteract: function (obs, selfRef, interactId) {
            if (obs[interactId]) {
                obs[interactId].x = obs[selfRef].destX;
                obs[interactId].y = obs[selfRef].destY;
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Interactable/Teleporter.template.ts":
/*!*****************************************************!*\
  !*** ./Prefabs/Interactable/Teleporter.template.ts ***!
  \*****************************************************/
/*! exports provided: teleporterMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "teleporterMasterPiece", function() { return teleporterMasterPiece; });
/**
 * Get master piece for teleporter object
 * @param object The teleporter object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function teleporterMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#DA70D6", "#BA55D3"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 0, cellY: 0, width: 10, height: 10, swatch: 0 },
            { cellX: 1, cellY: 1, width: 8, height: 8, swatch: 1 },
            { cellX: 2, cellY: 2, width: 6, height: 6, swatch: 0 },
            { cellX: 3, cellY: 3, width: 4, height: 4, swatch: 1 },
            { cellX: 4, cellY: 4, width: 2, height: 2, swatch: 0 },
        ],
        customRenderSize: 2,
    };
}


/***/ }),

/***/ "./Prefabs/Interactable/_Interactable.js":
/*!***********************************************!*\
  !*** ./Prefabs/Interactable/_Interactable.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return {
        type: types.ObjectTypes.INTERACTABLE,
        x: posX,
        y: posY,
        update: function (obs, selfId, delta) { },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Player/FireMage.js":
/*!************************************!*\
  !*** ./Prefabs/Player/FireMage.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var firemageSpeed = 0.18;
var firemageHealth = 64;
var baseFireTicksDuration = 500;
var firemageFireTicksDuration = 750;
var fireTickDamage = 6;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Player.FIRE_MAGE, maxHealth: firemageHealth, health: firemageHealth, speed: firemageSpeed, fireTicksDuration: firemageFireTicksDuration, abilities: [
            prefabs.newAbility(obs, types.Abilities.FIREBOLT),
            prefabs.newAbility(obs, types.Abilities.FLAME_PILLAR),
            prefabs.newAbility(obs, types.Abilities.FLAME_DASH),
            prefabs.newAbility(obs, types.Abilities.FLAME_BARRIER),
        ] });
}
function increaseFireTick(obs, sourceId, amount) {
    var newTime = Date.now();
    if (obs[sourceId].fireTicks && newTime - obs[sourceId].fireTicksLastIncrease < obs[sourceId].fireTicksDuration) {
        obs[sourceId].fireTicks = obs[sourceId].fireTicks + amount;
    }
    else {
        obs[sourceId].fireTicks = amount;
        if (!obs[sourceId].fireTicksDuration) {
            obs[sourceId].fireTicksDuration = baseFireTicksDuration;
        }
    }
    obs[sourceId].fireTicksLastIncrease = newTime;
}
module.exports = {
    generateNew: generateNew,
    increaseFireTick: increaseFireTick,
    fireTickDamage: fireTickDamage,
};


/***/ }),

/***/ "./Prefabs/Player/FireMage.template.ts":
/*!*********************************************!*\
  !*** ./Prefabs/Player/FireMage.template.ts ***!
  \*********************************************/
/*! exports provided: firemagePlayerMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "firemagePlayerMasterPiece", function() { return firemagePlayerMasterPiece; });
/**
 * Get master piece for firemage player object
 * @param object The firemage player object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function firemagePlayerMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#D2B48C", "#A52A2A", "#DC143C", "#dbc3a3"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [{
                cellX: 0,
                cellY: 2,
                width: 4,
                height: 2,
                swatch: 2
            }, {
                cellX: 1,
                cellY: 0,
                width: 2,
                height: 4,
                swatch: 0
            }, {
                cellX: 1,
                cellY: 0,
                width: 2,
                height: 2,
                swatch: 3
            }, {
                cellX: 1,
                cellY: 4,
                width: 1,
                height: 2,
                swatch: 1
            }, {
                cellX: 2,
                cellY: 4,
                width: 1,
                height: 2,
                swatch: 1
            }, {
                cellX: 1,
                cellY: 0,
                width: 0.5,
                height: 6,
                swatch: 2
            }, {
                cellX: 2.5,
                cellY: 0,
                width: 0.5,
                height: 6,
                swatch: 2
            }, {
                cellX: 1,
                cellY: 0,
                width: 2,
                height: 0.5,
                swatch: 2
            },],
    };
}


/***/ }),

/***/ "./Prefabs/Player/God.js":
/*!*******************************!*\
  !*** ./Prefabs/Player/God.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var godSpeed = 0.28;
var godHealth = 350;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Player.GOD, maxHealth: godHealth, health: godHealth, currentEquipment: 0, equipment: [
            prefabs.newEquipment(obs, types.EquipmentTypes.BLASTER),
            prefabs.newEquipment(obs, types.EquipmentTypes.SCANNER),
            prefabs.newEquipment(obs, types.EquipmentTypes.BUILDER, { type: types.ObjectTypes.TERRAIN, subtype: types.Terrain.TREE }),
            prefabs.newEquipment(obs, types.EquipmentTypes.BINOCULARS),
        ] });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Player/God.template.ts":
/*!****************************************!*\
  !*** ./Prefabs/Player/God.template.ts ***!
  \****************************************/
/*! exports provided: godPlayerMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "godPlayerMasterPiece", function() { return godPlayerMasterPiece; });
/**
 * Get master piece for god player object
 * @param object The god player object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function godPlayerMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#D2B48C", "#F0FFFF", "#800080"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 2, cellY: 0, width: 4, height: 4, swatch: 0 },
            { cellX: 0, cellY: 4, width: 8, height: 4, swatch: 1 },
            { cellX: 2, cellY: 4, width: 4, height: 8, swatch: 2 },
            { cellX: 0, cellY: 6, width: 2, height: 2, swatch: 0 },
            { cellX: 6, cellY: 6, width: 2, height: 2, swatch: 0 },
            { cellX: 3, cellY: 4, width: 2, height: 3, swatch: 1 },
        ],
        customRenderSize: 2
    };
}


/***/ }),

/***/ "./Prefabs/Player/HealthBar.template.ts":
/*!**********************************************!*\
  !*** ./Prefabs/Player/HealthBar.template.ts ***!
  \**********************************************/
/*! exports provided: healthBarMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "healthBarMasterPiece", function() { return healthBarMasterPiece; });
/**
 * Get master piece for object's health bar
 * @param object The object that needs a health bar
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 * @param cubeSize The cube render size, required when drawing free hand
 */
function healthBarMasterPiece(object, renderOffsetX, renderOffsetY, cubeSize) {
    return {
        palette: ["#00a400", "#FF0000"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY - (object.height + 4) * cubeSize / 2,
        width: object.width,
        height: 1,
        facing: 0,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: object.health / object.maxHealth * object.width * cubeSize,
                height: cubeSize * 3 / 4,
                swatch: (object.health > object.maxHealth / 3) ? 0 : 1,
            },],
        customRenderSize: 1
    };
}


/***/ }),

/***/ "./Prefabs/Player/StatusEffects/Invulnerable.template.ts":
/*!***************************************************************!*\
  !*** ./Prefabs/Player/StatusEffects/Invulnerable.template.ts ***!
  \***************************************************************/
/*! exports provided: invulnerableStatusEffectMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invulnerableStatusEffectMasterPiece", function() { return invulnerableStatusEffectMasterPiece; });
/* harmony import */ var _src_Popova_Popova__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/Popova/Popova */ "./src/Popova/Popova.ts");

/**
 * Get master piece for invulnerable status effect
 * @param object The invulnerable object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function invulnerableStatusEffectMasterPiece(object, renderOffsetX, renderOffsetY, renderSize) {
    return {
        palette: ["#FFFF0066"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [{
                cellX: object.width / 2,
                cellY: object.height / 2,
                width: object.width,
                height: object.height,
                swatch: 0,
                type: _src_Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["StrokeTypes"].CIRC,
            },],
    };
}


/***/ }),

/***/ "./Prefabs/Player/StatusEffects/Stunned.template.ts":
/*!**********************************************************!*\
  !*** ./Prefabs/Player/StatusEffects/Stunned.template.ts ***!
  \**********************************************************/
/*! exports provided: stunnedStatusEffectMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stunnedStatusEffectMasterPiece", function() { return stunnedStatusEffectMasterPiece; });
/**
 * Get master piece for stunned status effect
 * @param object The stunned object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function stunnedStatusEffectMasterPiece(object, renderOffsetX, renderOffsetY, renderSize) {
    return {
        palette: ["#FFFF00"],
        posX: object.x - renderOffsetX,
        posY: object.y - object.height / 2 - renderOffsetY,
        width: object.width,
        height: 6,
        facing: 0,
        strokes: [{
                cellX: 1,
                cellY: 0,
                width: 1,
                height: 3,
                swatch: 0
            }, {
                cellX: 0,
                cellY: 1,
                width: 3,
                height: 1,
                swatch: 0
            }, {
                cellX: 3,
                cellY: 4,
                width: 1,
                height: 3,
                swatch: 0
            }, {
                cellX: 2,
                cellY: 5,
                width: 3,
                height: 1,
                swatch: 0
            }, {
                cellX: 5,
                cellY: 1,
                width: 1,
                height: 3,
                swatch: 0
            }, {
                cellX: 4,
                cellY: 2,
                width: 3,
                height: 1,
                swatch: 0
            },],
        customRenderSize: 2,
    };
}


/***/ }),

/***/ "./Prefabs/Player/_Player.js":
/*!***********************************!*\
  !*** ./Prefabs/Player/_Player.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var playerSpeed = 0.2;
var playerHealth = 100;
var playerWidth = 8;
var playerHeight = 8;
var playerViewRange = 1 / 2;
function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var utils = __webpack_require__(/*! ../PrefabUtils */ "./Prefabs/PrefabUtils.js");
    return {
        type: types.ObjectTypes.PLAYER,
        subtype: types.Player.HUMAN,
        x: posX,
        y: posY,
        velocityX: 0,
        velocityY: 0,
        speed: playerSpeed,
        width: playerWidth,
        height: playerHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: playerWidth - 2,
        hitboxHeight: playerHeight,
        health: playerHealth,
        maxHealth: playerHealth,
        currentEquipment: undefined,
        equipment: [],
        abilities: [],
        statusEffects: {},
        viewRange: playerViewRange,
        deathrattle: function (obs, selfRef) {
            prefabs.generateNew(obs, selfRef, obs[selfRef].x, obs[selfRef].y, types.ObjectTypes.GRAVESTONE);
        },
        update: function (obs, selfId, delta) {
            obs[selfId].updateStatusEffects(obs, selfId);
            // Calculate player movement
            obs[selfId].x += obs[selfId].velocityX * delta;
            obs[selfId].y += obs[selfId].velocityY * delta;
            // Check collisions with terrain and reposition accordingly
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                if (obs[srcId] && collisionId != srcId) {
                    switch (obs[collisionId].type) { // Should players collide with other players?
                        case types.ObjectTypes.VEHICLE:
                        case types.ObjectTypes.TERRAIN:
                            collisions.pushBack(obs, srcId, collisionId, prefabs.renderSize);
                            break;
                    }
                }
            });
        },
        mouseDown: function (obs, mouseEvent) {
            if (obs[mouseEvent.sourceId].abilities[0] && !checkStatusEffect(obs, mouseEvent.sourceId, types.StatusEffects.STUNNED)) {
                obs[mouseEvent.sourceId].abilities[0].cast(obs, mouseEvent.sourceId, 0, mouseEvent.targetX, mouseEvent.targetY);
            }
        },
        onPlayerInput: function (obs, selfId, playerInput) {
            player = obs[selfId];
            if (checkStatusEffect(obs, selfId, types.StatusEffects.STUNNED)) {
                player.velocityX = 0;
                player.velocityY = 0;
            }
            else {
                var xDir = 0;
                var yDir = 0;
                if (playerInput.left) {
                    xDir -= 1;
                }
                if (playerInput.right) {
                    xDir += 1;
                }
                if (playerInput.up) {
                    yDir -= 1;
                }
                if (playerInput.down) {
                    yDir += 1;
                }
                player.velocityX = xDir * player.speed;
                player.velocityY = yDir * player.speed;
                if (xDir != 0 || yDir != 0) {
                    player.facing = (Math.atan(player.velocityY / player.velocityX) * 57.2958 + 90) + (xDir < 0 ? 180 : 0);
                }
                if (xDir != 0) {
                    player.hitboxWidth = obs[selfId].height;
                    player.hitboxHeight = obs[selfId].width;
                }
                if (yDir != 0) {
                    player.hitboxWidth = obs[selfId].width;
                    player.hitboxHeight = obs[selfId].height;
                }
                if (playerInput.cycleEquipmentForward && !playerInput.cycleEquipmentBackward && obs[selfId].currentEquipment != undefined) {
                    player.equipment[player.currentEquipment].onDequip(obs, selfId);
                    player.currentEquipment = player.currentEquipment + 1 >= player.equipment.length ? 0 : player.currentEquipment + 1;
                    player.equipment[player.currentEquipment].onEquip(obs, selfId);
                }
                if (playerInput.cycleEquipmentBackward && !playerInput.cycleEquipmentForward && obs[selfId].currentEquipment != undefined) {
                    player.equipment[player.currentEquipment].onDequip(obs, selfId);
                    player.currentEquipment = player.currentEquipment - 1 < 0 ? player.equipment.length - 1 : player.currentEquipment - 1;
                    player.equipment[player.currentEquipment].onEquip(obs, selfId);
                }
                if (playerInput.useEquipment && obs[selfId].currentEquipment != undefined) {
                    obs[selfId].equipment[obs[selfId].currentEquipment]
                        .use(obs, selfId, playerInput.targetX, playerInput.targetY);
                }
                if (playerInput.ability1 && obs[selfId].abilities[0]) {
                    obs[selfId].abilities[0].cast(obs, selfId, 0, playerInput.targetX, playerInput.targetY);
                }
                if (playerInput.ability2 && obs[selfId].abilities[1]) {
                    obs[selfId].abilities[1].cast(obs, selfId, 1, playerInput.targetX, playerInput.targetY);
                }
                if (playerInput.ability3 && obs[selfId].abilities[2]) {
                    obs[selfId].abilities[2].cast(obs, selfId, 2, playerInput.targetX, playerInput.targetY);
                }
                if (playerInput.ability4 && obs[selfId].abilities[3]) {
                    obs[selfId].abilities[3].cast(obs, selfId, 3, playerInput.targetX, playerInput.targetY);
                }
                if (playerInput.pickup) {
                    collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                        if (obs[srcId] && collisionId != srcId && obs[collisionId].type == types.ObjectTypes.INTERACTABLE) {
                            obs[collisionId].onInteract(obs, collisionId, srcId);
                        }
                    });
                }
            }
        },
        heal: function (obs, selfId, amount) {
            if (obs[selfId]) {
                var healAmount = obs[selfId].health + amount >= obs[selfId].maxHealth
                    ? obs[selfId].maxHealth - obs[selfId].health
                    : amount;
                obs[selfId].health += healAmount;
                prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, types.CombatText.HEAL_TEXT, { text: "+" + healAmount });
            }
        },
        damage: function (obs, selfId, amount, damageType) {
            if (checkStatusEffect(obs, selfId, types.StatusEffects.INVULNERABLE)) {
                prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, types.CombatText.INVULNERABLE_TEXT, { text: "* " + amount });
            }
            else {
                utils.damage(obs, selfId, amount, damageType);
            }
        },
        updateStatusEffects: function (obs, selfId) {
            var newTime = Date.now();
            statusEffectCheckHelper(obs, selfId, types.StatusEffects.STUNNED, newTime);
            statusEffectCheckHelper(obs, selfId, types.StatusEffects.INVULNERABLE, newTime);
        },
        addStatusEffect: function (obs, id, effect, duration) {
            var newTime = Date.now();
            // Only replace the current status effect last cast and duration if the new duration is longer than what's left
            if (!obs[id].statusEffects[effect] ||
                obs[id].statusEffects[effect].duration - (newTime - obs[id].statusEffects[effect].last) < duration) {
                obs[id].statusEffects[effect] = {};
                obs[id].statusEffects[effect].last = newTime;
                obs[id].statusEffects[effect].duration = duration;
            }
        },
    };
}
function statusEffectCheckHelper(obs, id, effect, newTime) {
    if (obs[id].statusEffects[effect] &&
        newTime - obs[id].statusEffects[effect].last >= obs[id].statusEffects[effect].duration) {
        delete obs[id].statusEffects[effect];
    }
}
function checkStatusEffect(obs, id, effect) {
    return obs[id].statusEffects[effect];
}
function checkStatusEffectObject(object, effect) {
    return object.statusEffects[effect];
}
module.exports = {
    generateNew: generateNew,
    checkStatusEffect: checkStatusEffectObject,
};


/***/ }),

/***/ "./Prefabs/Player/_Player.template.ts":
/*!********************************************!*\
  !*** ./Prefabs/Player/_Player.template.ts ***!
  \********************************************/
/*! exports provided: playerMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "playerMasterPiece", function() { return playerMasterPiece; });
/* harmony import */ var _src_Popova_Popova__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/Popova/Popova */ "./src/Popova/Popova.ts");

/**
 * Get master piece for player object
 * @param object The player object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function playerMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#999999"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        shadowHeight: 6,
        strokes: [{
                type: _src_Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["StrokeTypes"].SVG,
                path: 'M 8 32 L 8 32 Q 4 12 16 0 Q 28 12 24 32 Q 16 16 8 32',
                params: { fill: '#992222', fillStyle: 'solid', strokeWidth: 0.2 }
            }]
    };
}


/***/ }),

/***/ "./Prefabs/PrefabUtils.js":
/*!********************************!*\
  !*** ./Prefabs/PrefabUtils.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var types = __webpack_require__(/*! ../ObjectTypes */ "./ObjectTypes.js");
var prefabs = __webpack_require__(/*! ./Prefabs */ "./Prefabs/Prefabs.js");
function damage(obs, selfId, amount, damageType) {
    var types = __webpack_require__(/*! ../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ./Prefabs */ "./Prefabs/Prefabs.js");
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
    if (textType)
        prefabs.generateNew(obs, selfId, 0, 0, types.ObjectTypes.COMBAT_TEXT, textType, { text: "-" + amount });
    if (obs[selfId].health <= 0) {
        obs[selfId].deathrattle(obs, selfId);
    }
}
module.exports = {
    damage: damage,
};


/***/ }),

/***/ "./Prefabs/Prefabs.js":
/*!****************************!*\
  !*** ./Prefabs/Prefabs.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var types = __webpack_require__(/*! ../ObjectTypes */ "./ObjectTypes.js");
var collisions = __webpack_require__(/*! ../Collisions */ "./Collisions.js");
var utils = __webpack_require__(/*! ./PrefabUtils */ "./Prefabs/PrefabUtils.js");
// ----- Prefabs ----- //
var _player = __webpack_require__(/*! ./Player/_Player */ "./Prefabs/Player/_Player.js");
var god = __webpack_require__(/*! ./Player/God */ "./Prefabs/Player/God.js");
var firemage = __webpack_require__(/*! ./Player/FireMage */ "./Prefabs/Player/FireMage.js");
var _gravestone = __webpack_require__(/*! ./Gravestone/_Gravestone */ "./Prefabs/Gravestone/_Gravestone.js");
var _projectile = __webpack_require__(/*! ./Projectile/_Projectile */ "./Prefabs/Projectile/_Projectile.js");
var fireboltProjectile = __webpack_require__(/*! ./Projectile/FireboltProjectile */ "./Prefabs/Projectile/FireboltProjectile.js");
var flamePillarProjectile = __webpack_require__(/*! ./Projectile/FlamePillarProjectile */ "./Prefabs/Projectile/FlamePillarProjectile.js");
var flameDashProjectile = __webpack_require__(/*! ./Projectile/FlameDashProjectile */ "./Prefabs/Projectile/FlameDashProjectile.js");
var _terrain = __webpack_require__(/*! ./Terrain/_Terrain */ "./Prefabs/Terrain/_Terrain.js");
var tree = __webpack_require__(/*! ./Terrain/Tree */ "./Prefabs/Terrain/Tree.js");
var wallHoriz = __webpack_require__(/*! ./Terrain/WallHoriz */ "./Prefabs/Terrain/WallHoriz.js");
var castleWallHoriz = __webpack_require__(/*! ./Terrain/CastleWallHoriz */ "./Prefabs/Terrain/CastleWallHoriz.js");
var castleWallVert = __webpack_require__(/*! ./Terrain/CastleWallVert */ "./Prefabs/Terrain/CastleWallVert.js");
var _interactable = __webpack_require__(/*! ./Interactable/_Interactable */ "./Prefabs/Interactable/_Interactable.js");
var healthPickup = __webpack_require__(/*! ./Interactable/HealthPickup */ "./Prefabs/Interactable/HealthPickup.js");
var carEnter = __webpack_require__(/*! ./Interactable/CarEnter */ "./Prefabs/Interactable/CarEnter.js");
var playerTypeChanger = __webpack_require__(/*! ./Interactable/PlayerTypeChanger */ "./Prefabs/Interactable/PlayerTypeChanger.js");
var teleporter = __webpack_require__(/*! ./Interactable/Teleporter */ "./Prefabs/Interactable/Teleporter.js");
var _trigger = __webpack_require__(/*! ./Trigger/_Trigger */ "./Prefabs/Trigger/_Trigger.js");
var spikeTrap = __webpack_require__(/*! ./Trigger/SpikeTrap */ "./Prefabs/Trigger/SpikeTrap.js");
var invulnPlatform = __webpack_require__(/*! ./Trigger/InvulnPlatform */ "./Prefabs/Trigger/InvulnPlatform.js");
var _vehicle = __webpack_require__(/*! ./Vehicle/_Vehicle */ "./Prefabs/Vehicle/_Vehicle.js");
var car = __webpack_require__(/*! ./Vehicle/Car */ "./Prefabs/Vehicle/Car.js");
var _decoration = __webpack_require__(/*! ./Decoration/_Decoration */ "./Prefabs/Decoration/_Decoration.js");
var deadDummy = __webpack_require__(/*! ./Decoration/DeadDummy */ "./Prefabs/Decoration/DeadDummy.js");
var watchTower = __webpack_require__(/*! ./Decoration/WatchTower */ "./Prefabs/Decoration/WatchTower.js");
var castleFloor = __webpack_require__(/*! ./Decoration/CastleFloor */ "./Prefabs/Decoration/CastleFloor.js");
var blaster = __webpack_require__(/*! ./Equipment/Blaster */ "./Prefabs/Equipment/Blaster.js");
var scanner = __webpack_require__(/*! ./Equipment/Scanner */ "./Prefabs/Equipment/Scanner.js");
var builder = __webpack_require__(/*! ./Equipment/Builder */ "./Prefabs/Equipment/Builder.js");
var binoculars = __webpack_require__(/*! ./Equipment/Binoculars */ "./Prefabs/Equipment/Binoculars.js");
var firebolt = __webpack_require__(/*! ./Abilities/Firebolt */ "./Prefabs/Abilities/Firebolt.js");
var flamePillar = __webpack_require__(/*! ./Abilities/FlamePillar */ "./Prefabs/Abilities/FlamePillar.js");
var flameDash = __webpack_require__(/*! ./Abilities/FlameDash */ "./Prefabs/Abilities/FlameDash.js");
var flameBarrier = __webpack_require__(/*! ./Abilities/FlameBarrier */ "./Prefabs/Abilities/FlameBarrier.js");
var _combatText = __webpack_require__(/*! ./CombatText/_CombatText */ "./Prefabs/CombatText/_CombatText.js");
var damageText = __webpack_require__(/*! ./CombatText/DamageText */ "./Prefabs/CombatText/DamageText.js");
var fireDamageText = __webpack_require__(/*! ./CombatText/FireDamageText */ "./Prefabs/CombatText/FireDamageText.js");
var invulnerableText = __webpack_require__(/*! ./CombatText/InvulnerableText */ "./Prefabs/CombatText/InvulnerableText.js");
var healText = __webpack_require__(/*! ./CombatText/HealText */ "./Prefabs/CombatText/HealText.js");
var _enemy = __webpack_require__(/*! ./Enemy/_Enemy */ "./Prefabs/Enemy/_Enemy.js");
// Export render size
var renderSize = 4;
module.exports = {
    renderSize: renderSize,
    // Generate a new terrain object
    generateNew: function (obs, src, posX, posY, type, subtype, params) {
        if (params === void 0) { params = {}; }
        var newObj;
        switch (type) {
            case types.ObjectTypes.PLAYER:
                newObj = _player.generateNew(obs, src, posX, posY);
                switch (subtype) {
                    case types.Player.GOD:
                        newObj = god.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Player.FIRE_MAGE:
                        newObj = firemage.generateNew(obs, src, posX, posY, newObj);
                        break;
                }
                obs[src] = newObj;
                return;
            case types.ObjectTypes.GRAVESTONE:
                newObj = _gravestone.generateNew(obs, src, posX, posY);
                obs[src] = newObj;
                return;
            case types.ObjectTypes.PROJECTILE:
                // Generate unique Id for new projectile
                var newId = src.concat(":" + type + ":" + subtype + ":", posX, ":", posY);
                var dup = 0;
                while (obs[newId.concat(":" + dup)]) {
                    dup++;
                }
                newObj = _projectile.generateNew(obs, src, posX, posY);
                switch (subtype) {
                    case types.Projectile.FIREBOLT_PROJECTILE:
                        newObj = fireboltProjectile.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Projectile.FLAME_PILLAR_PROJECTILE:
                        newObj = flamePillarProjectile.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Projectile.FLAME_DASH_PROJECTILE:
                        newObj = flameDashProjectile.generateNew(obs, src, posX, posY, newObj);
                        if (!newObj)
                            return;
                        break;
                }
                obs[newId.concat(":" + dup)] = newObj;
                return;
            case types.ObjectTypes.TERRAIN:
                newObj = _terrain.generateNew(obs, src, posX, posY);
                switch (subtype) {
                    case types.Terrain.TREE:
                        newObj = tree.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Terrain.WALL_HORIZ:
                        newObj = wallHoriz.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Terrain.CASTLE_WALL_HORIZ:
                        newObj = castleWallHoriz.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Terrain.CASTLE_WALL_VERT:
                        newObj = castleWallVert.generateNew(obs, src, posX, posY, newObj);
                        break;
                }
                break;
            case types.ObjectTypes.INTERACTABLE:
                newObj = _interactable.generateNew(obs, src, posX, posY);
                switch (subtype) {
                    case types.Interactable.HEALTH_PICKUP:
                        newObj = healthPickup.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Interactable.CAR_ENTER:
                        newObj = carEnter.generateNew(obs, src, posX, posY, newObj);
                        obs[src + ":" + type + ":" + subtype] = newObj;
                        return;
                    case types.Interactable.PLAYER_TYPE_CHANGER:
                        newObj = playerTypeChanger.generateNew(obs, src, posX, posY, newObj, params);
                        break;
                    case types.Interactable.TELEPORTER:
                        newObj = teleporter.generateNew(obs, src, posX, posY, newObj, { destX: params.destX, destY: params.destY });
                }
                break;
            case types.ObjectTypes.TRIGGER:
                newObj = _trigger.generateNew(obs, src, posX, posY);
                switch (subtype) {
                    case types.Trigger.SPIKE_TRAP:
                        newObj = spikeTrap.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Trigger.INVULN_PLATFORM:
                        newObj = invulnPlatform.generateNew(obs, src, posX, posY, newObj);
                        break;
                }
                break;
            case types.ObjectTypes.VEHICLE:
                newObj = _vehicle.generateNew(obs, src, posX, posY);
                switch (subtype) {
                    case types.Vehicle.CAR:
                        newObj = car.generateNew(obs, src, posX, posY, newObj);
                        return;
                }
                break;
            case types.ObjectTypes.DECORATION:
                newObj = _decoration.generateNew(obs, src, posX, posY);
                switch (subtype) {
                    case types.Decoration.DEAD_DUMMY:
                        newObj = deadDummy.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Decoration.WATCH_TOWER:
                        newObj = watchTower.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.Decoration.CASTLE_FLOOR:
                        newObj = castleFloor.generateNew(obs, src, posX, posY, newObj);
                        break;
                }
                break;
            case types.ObjectTypes.COMBAT_TEXT:
                // Generate unique Id for new combat text
                var newId = src.concat(":" + type + ":" + subtype + ":", posX, ":", posY);
                var dup = 0;
                while (obs[newId.concat(":" + dup)]) {
                    dup++;
                }
                newObj = _combatText.generateNew(obs, src, posX, posY, params);
                switch (subtype) {
                    case types.CombatText.DAMAGE_TEXT:
                        newObj = damageText.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.CombatText.FIRE_DAMAGE_TEXT:
                        newObj = fireDamageText.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.CombatText.INVULNERABLE_TEXT:
                        newObj = invulnerableText.generateNew(obs, src, posX, posY, newObj);
                        break;
                    case types.CombatText.HEAL_TEXT:
                        newObj = healText.generateNew(obs, src, posX, posY, newObj);
                        break;
                }
                obs[newId.concat(":" + dup)] = newObj;
                return;
            case types.ObjectTypes.ENEMY:
                newObj = _enemy.generateNew(obs, src, posX, posY);
                switch (subtype) {
                }
                break;
            default:
                break;
        }
        // TODO: Consider removing this?
        if (!newObj) {
            newObj = {
                type: types.ObjectTypes.TERRAIN,
                subtype: subtype,
                x: posX,
                y: posY,
                width: 6,
                height: 6,
                hitboxType: types.HitboxTypes.RECT,
                hitboxWidth: 6,
                hitboxHeight: 6,
                health: 1,
                maxHealth: 1,
                update: function (obs, selfId, delta) { },
                damage: utils.damage,
                deathrattle: function (obs, selfId) { },
            };
        }
        obs[src + ":" + type + ":" + subtype + ":" + posX + ":" + posY] = newObj;
    },
    newEquipment: function (obs, type, params) {
        if (params === void 0) { params = {}; }
        switch (type) {
            case types.EquipmentTypes.BLASTER:
                return blaster.generateNew(obs, params);
            case types.EquipmentTypes.SCANNER:
                return scanner.generateNew(obs, params);
            case types.EquipmentTypes.BUILDER:
                return builder.generateNew(obs, params);
            case types.EquipmentTypes.BINOCULARS:
                return binoculars.generateNew(obs, params);
        }
    },
    newAbility: function (obs, type, params) {
        if (params === void 0) { params = {}; }
        switch (type) {
            case types.Abilities.FIREBOLT:
                return firebolt.generateNew(obs);
            case types.Abilities.FLAME_PILLAR:
                return flamePillar.generateNew(obs);
            case types.Abilities.FLAME_DASH:
                return flameDash.generateNew(obs);
            case types.Abilities.FLAME_BARRIER:
                return flameBarrier.generateNew(obs);
        }
    },
};


/***/ }),

/***/ "./Prefabs/Projectile/FireboltProjectile.js":
/*!**************************************************!*\
  !*** ./Prefabs/Projectile/FireboltProjectile.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var fireboltSpeed = 0.35;
var fireboltWidth = 3;
var fireboltHeight = 3;
var fireboltHitBoxRadius = 1.5;
var fireboltDamage = 12;
var fireboltTickIncrease = 1;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var firemage = __webpack_require__(/*! ../Player/FireMage */ "./Prefabs/Player/FireMage.js");
    return __assign({}, base, { subtype: types.Projectile.FIREBOLT_PROJECTILE, velocityX: Math.cos(base.angle) * fireboltSpeed, velocityY: Math.sin(base.angle) * fireboltSpeed, width: fireboltWidth, height: fireboltHeight, hitboxType: types.HitboxTypes.CIRC, hitboxRadius: fireboltHitBoxRadius, damage: fireboltDamage, onHit: function (obs, srcId, collisionId) {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                case types.ObjectTypes.ENEMY:
                    if (obs[srcId]) {
                        if (obs[collisionId] && obs[collisionId].damage) {
                            firemage.increaseFireTick(obs, obs[srcId].source, (obs[collisionId].type === types.ObjectTypes.PLAYER || obs[collisionId].type === types.ObjectTypes.ENEMY) ? fireboltTickIncrease : 0);
                            var damage = obs[srcId].damage;
                            var fireDamage = obs[obs[srcId].source].fireTicks ? obs[obs[srcId].source].fireTicks * firemage.fireTickDamage : 0;
                            obs[collisionId].damage(obs, collisionId, damage, types.DamageTypes.NORMAL);
                            if (fireDamage && obs[collisionId])
                                obs[collisionId].damage(obs, collisionId, fireDamage, types.DamageTypes.FIRE);
                        }
                        delete obs[srcId];
                    }
                    break;
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Projectile/FireboltProjectile.template.ts":
/*!***********************************************************!*\
  !*** ./Prefabs/Projectile/FireboltProjectile.template.ts ***!
  \***********************************************************/
/*! exports provided: fireboltProjectileMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fireboltProjectileMasterPiece", function() { return fireboltProjectileMasterPiece; });
/**
 * Get master piece for firebolt projectile
 * @param object The firebolt projectile object
 * @param renderOffsetX Horizontal offset for rendering the objects
 * @param renderOffsetY Vertical offset for rendering the objects
 */
function fireboltProjectileMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#CD5C5C", "#FF8C00"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 1,
                cellY: 0,
                width: 1,
                height: object.height,
                swatch: 0
            }, {
                cellX: 0,
                cellY: 1,
                width: object.width,
                height: 1,
                swatch: 0
            }, {
                cellX: 0.5,
                cellY: 0.5,
                width: 2,
                height: 2,
                swatch: 0
            }, {
                cellX: 1,
                cellY: 1,
                width: 1,
                height: 1,
                swatch: 1
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Projectile/FlameDashProjectile.js":
/*!***************************************************!*\
  !*** ./Prefabs/Projectile/FlameDashProjectile.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var flameDashSpeed = 0.14;
var flameDashWidth = 2;
var flameDashHeight = 2;
var flameDashHitBoxRadius = 1;
var flameDashDamage = 6;
var flameDashTickIncrease = 2;
var flameDashTrackingRadius = 150;
var flameDashMaxProjDistance = flameDashTrackingRadius * 2;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var firemage = __webpack_require__(/*! ../Player/FireMage */ "./Prefabs/Player/FireMage.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var trackId = undefined;
    var smallestDist = undefined;
    collisions.checkCollisionsByDistance(src, obs, flameDashTrackingRadius, function (srcId, collisionId, dist) {
        if (obs[collisionId] && obs[srcId] && srcId !== collisionId) {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.ENEMY:
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                    if (!trackId || dist < smallestDist) {
                        trackId = collisionId;
                        smallestDist = dist;
                    }
                    break;
            }
        }
    });
    if (!trackId)
        return;
    return __assign({}, base, { subtype: types.Projectile.FLAME_DASH_PROJECTILE, velocityX: 0, velocityY: 0, width: flameDashWidth, height: flameDashHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: flameDashHitBoxRadius, hitboxHeight: flameDashHitBoxRadius, damage: flameDashDamage, trackId: trackId, maxProjDist: flameDashMaxProjDistance, update: function (obs, selfId, delta) {
            if (obs[selfId] && obs[obs[selfId].trackId]) {
                var dist = Math.sqrt(Math.pow(obs[selfId].x - obs[obs[selfId].trackId].x, 2) +
                    Math.pow(obs[selfId].y - obs[obs[selfId].trackId].y, 2));
                if (dist > flameDashTrackingRadius) {
                    delete obs[selfId];
                }
                else {
                    var angle = Math.atan2(obs[obs[selfId].trackId].y - obs[selfId].y, obs[obs[selfId].trackId].x - obs[selfId].x);
                    obs[selfId].velocityX = Math.cos(angle) * flameDashSpeed,
                        obs[selfId].velocityY = Math.sin(angle) * flameDashSpeed,
                        // Calculate projectile movement
                        obs[selfId].x += obs[selfId].velocityX * delta;
                    obs[selfId].y += obs[selfId].velocityY * delta;
                    obs[selfId].dist += Math.sqrt(Math.pow(obs[selfId].velocityX * delta, 2) +
                        Math.pow(obs[selfId].velocityY * delta, 2));
                    collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                        if (obs[srcId] && collisionId != srcId && collisionId != obs[srcId].source) {
                            obs[srcId].onHit(obs, srcId, collisionId);
                        }
                    });
                    if (obs[selfId]) {
                        if (obs[selfId].dist > obs[selfId].maxProjDist) {
                            delete obs[selfId];
                        }
                    }
                }
            }
            else {
                if (obs[selfId])
                    delete obs[selfId];
            }
        }, onHit: function (obs, srcId, collisionId) {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                case types.ObjectTypes.ENEMY:
                    if (obs[srcId]) {
                        if (obs[collisionId] && obs[collisionId].damage) {
                            firemage.increaseFireTick(obs, obs[srcId].source, (obs[collisionId].type === types.ObjectTypes.PLAYER || obs[collisionId].type === types.ObjectTypes.ENEMY) ? flameDashTickIncrease : 0);
                            var damage = obs[srcId].damage;
                            var fireDamage = obs[obs[srcId].source].fireTicks ? obs[obs[srcId].source].fireTicks * firemage.fireTickDamage : 0;
                            obs[collisionId].damage(obs, collisionId, damage, types.DamageTypes.NORMAL);
                            if (fireDamage && obs[collisionId])
                                obs[collisionId].damage(obs, collisionId, fireDamage, types.DamageTypes.FIRE);
                        }
                        delete obs[srcId];
                    }
                    break;
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Projectile/FlameDashProjectile.template.ts":
/*!************************************************************!*\
  !*** ./Prefabs/Projectile/FlameDashProjectile.template.ts ***!
  \************************************************************/
/*! exports provided: flameDashProjectileMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flameDashProjectileMasterPiece", function() { return flameDashProjectileMasterPiece; });
/**
 * Get master piece for fire dash projectile
 * @param object The fire dash projectile object
 * @param renderOffsetX Horizontal offset for rendering the objects
 * @param renderOffsetY Vertical offset for rendering the objects
 */
function flameDashProjectileMasterPiece(object, renderOffsetX, renderOffsetY) {
    var customRenderSize = 2;
    return {
        palette: ["#CD5C5C", "#FF8C00"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 1,
                cellY: 0,
                width: 2,
                height: object.height * customRenderSize,
                swatch: 0
            }, {
                cellX: 0,
                cellY: 1,
                width: object.width * customRenderSize,
                height: 2,
                swatch: 0
            }, {
                cellX: 0.5,
                cellY: 0.5,
                width: 3,
                height: 3,
                swatch: 0
            }, {
                cellX: 1,
                cellY: 1,
                width: 2,
                height: 2,
                swatch: 1
            },],
        customRenderSize: customRenderSize,
    };
}


/***/ }),

/***/ "./Prefabs/Projectile/FlamePillarProjectile.js":
/*!*****************************************************!*\
  !*** ./Prefabs/Projectile/FlamePillarProjectile.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var flamePillarSpeed = 0;
var flamePillarWidth = 6;
var flamePillarHeight = 12;
var flamePillarHitBoxWidth = 6;
var flamePillarHitBoxHeight = 12;
var flamePillarDamage = 16;
var flamePillarTickIncrease = 2;
var flamePillarStunDuration = 1500;
var flamePillarTriggerDelay = 500;
var flamePillarTimeout = 1000;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var firemage = __webpack_require__(/*! ../Player/FireMage */ "./Prefabs/Player/FireMage.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    return __assign({}, base, { subtype: types.Projectile.FLAME_PILLAR_PROJECTILE, x: posX, y: posY, velocityX: flamePillarSpeed, velocityY: flamePillarSpeed, facing: 0, width: flamePillarWidth, height: flamePillarHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: flamePillarHitBoxWidth, hitboxHeight: flamePillarHitBoxHeight, damage: flamePillarDamage, initTime: Date.now(), triggered: false, update: function (obs, selfId, delta) {
            var newTime = Date.now();
            // If timeout is passed, delete item
            if (obs[selfId] && newTime - obs[selfId].initTime >= flamePillarTimeout) {
                delete obs[selfId];
            }
            // If trigger delay elapsed, check for object collisions
            if (obs[selfId] && newTime - obs[selfId].initTime >= flamePillarTriggerDelay) {
                obs[selfId].triggered = true;
                collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                    if (obs[srcId] && collisionId != srcId && collisionId != obs[srcId].source) {
                        obs[srcId].onHit(obs, srcId, collisionId);
                    }
                });
            }
        }, onHit: function (obs, srcId, collisionId) {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.ENEMY:
                    obs[collisionId].addStatusEffect(obs, collisionId, types.StatusEffects.STUNNED, flamePillarStunDuration);
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                    if (obs[srcId]) {
                        if (obs[collisionId] && obs[collisionId].damage) {
                            firemage.increaseFireTick(obs, obs[srcId].source, (obs[collisionId].type === types.ObjectTypes.PLAYER || obs[collisionId].type === types.ObjectTypes.ENEMY) ? flamePillarTickIncrease : 0);
                            var damage = obs[srcId].damage;
                            var fireDamage = obs[obs[srcId].source].fireTicks ? obs[obs[srcId].source].fireTicks * firemage.fireTickDamage : 0;
                            obs[collisionId].damage(obs, collisionId, damage, types.DamageTypes.NORMAL);
                            if (fireDamage && obs[collisionId])
                                obs[collisionId].damage(obs, collisionId, fireDamage, types.DamageTypes.FIRE);
                        }
                        delete obs[srcId];
                    }
                    break;
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Projectile/FlamePillarProjectile.template.ts":
/*!**************************************************************!*\
  !*** ./Prefabs/Projectile/FlamePillarProjectile.template.ts ***!
  \**************************************************************/
/*! exports provided: flamePillarProjectileMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flamePillarProjectileMasterPiece", function() { return flamePillarProjectileMasterPiece; });
/**
 * Get master piece for fire pillar projectile
 * @param object The fire pillar projectile object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function flamePillarProjectileMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#E67E00D9", "#FF6933D9", "#FF8C00D9", "#FFA500D9"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 1,
                cellY: 0,
                width: object.width - 2,
                height: object.height,
                swatch: object.triggered ? 1 : 0
            }, {
                cellX: 0,
                cellY: 1,
                width: object.width,
                height: object.height - 1,
                swatch: object.triggered ? 1 : 0
            }, {
                cellX: 0,
                cellY: 3,
                width: 2,
                height: 1,
                swatch: object.triggered ? 3 : 2
            }, {
                cellX: 2,
                cellY: 4,
                width: 2,
                height: 1,
                swatch: object.triggered ? 3 : 2
            }, {
                cellX: 4,
                cellY: 5,
                width: 2,
                height: 1,
                swatch: object.triggered ? 3 : 2
            }, {
                cellX: 0,
                cellY: 7,
                width: 2,
                height: 1,
                swatch: object.triggered ? 3 : 2
            }, {
                cellX: 2,
                cellY: 8,
                width: 2,
                height: 1,
                swatch: object.triggered ? 3 : 2
            }, {
                cellX: 4,
                cellY: 9,
                width: 2,
                height: 1,
                swatch: object.triggered ? 3 : 2
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Projectile/_Projectile.js":
/*!*******************************************!*\
  !*** ./Prefabs/Projectile/_Projectile.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var projectileWidth = 4;
var projectileHeight = 4;
var projectileHitBoxRadius = 1.5;
var baseProjectileDamage = 10;
var projectileSpeed = 0.4;
var maxProjDist = 1600;
function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var angle = Math.atan2(posY - obs[src].y, posX - obs[src].x);
    return {
        type: types.ObjectTypes.PROJECTILE,
        subtype: types.Projectile.BASIC_PROJECTILE,
        source: src,
        x: obs[src].x,
        y: obs[src].y,
        angle: angle,
        velocityX: Math.cos(angle) * projectileSpeed,
        velocityY: Math.sin(angle) * projectileSpeed,
        width: projectileWidth,
        height: projectileHeight,
        hitboxType: types.HitboxTypes.RECT,
        hitboxWidth: projectileHitBoxRadius,
        hitboxHeight: projectileHitBoxRadius,
        facing: angle * 180 / Math.PI,
        dist: 0,
        maxProjDist: maxProjDist,
        damage: baseProjectileDamage,
        update: function (obs, selfId, delta) {
            // Calculate projectile movement
            obs[selfId].x += obs[selfId].velocityX * delta;
            obs[selfId].y += obs[selfId].velocityY * delta;
            obs[selfId].dist += Math.sqrt(Math.pow(obs[selfId].velocityX * delta, 2) +
                Math.pow(obs[selfId].velocityY * delta, 2));
            // TODO: Change projectile collisions to ray cast
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                if (obs[srcId] && collisionId != srcId && collisionId != obs[srcId].source) {
                    obs[srcId].onHit(obs, srcId, collisionId);
                }
            });
            if (obs[selfId]) {
                if (obs[selfId].dist > obs[selfId].maxProjDist) {
                    delete obs[selfId];
                }
            }
        },
        onHit: function (obs, srcId, collisionId) {
            switch (obs[collisionId].type) {
                case types.ObjectTypes.PLAYER:
                case types.ObjectTypes.ENEMY:
                case types.ObjectTypes.GRAVESTONE:
                case types.ObjectTypes.VEHICLE:
                case types.ObjectTypes.TERRAIN:
                    if (obs[srcId]) {
                        if (obs[collisionId] && obs[collisionId].damage) {
                            obs[collisionId].damage(obs, collisionId, obs[srcId].damage, types.DamageTypes.NORMAL);
                        }
                        delete obs[srcId];
                    }
                    break;
            }
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Projectile/_Projectile.template.ts":
/*!****************************************************!*\
  !*** ./Prefabs/Projectile/_Projectile.template.ts ***!
  \****************************************************/
/*! exports provided: projectileMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "projectileMasterPiece", function() { return projectileMasterPiece; });
/* harmony import */ var _src_Popova_Popova__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/Popova/Popova */ "./src/Popova/Popova.ts");

/**
 * Get master piece for basic projectile
 * @param object The projectile object
 * @param renderOffsetX Horizontal offset for rendering the objects
 * @param renderOffsetY Vertical offset for rendering the objects
 */
function projectileMasterPiece(object, renderOffsetX, renderOffsetY) {
    /* return {
        // Remove comments for rainbow bullets
        // palette: ["#FF6666", "#66FF66", "#6666FF", "#FFFF66", "#FF66FF", "#66FFFF"],
        palette: ["#222222"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 0,
            cellY: 0,
            width: object.width,
            height: object.height,
            // swatch: Math.floor(Math.random() * 6)
            swatch: 0
        }]
    }   */
    return {
        palette: ["#999999"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        shadowHeight: 6,
        strokes: [{
                type: _src_Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["StrokeTypes"].SVG,
                path: 'M 14 6 Q 16 8 14 10 Q 7 15 0 13 Q 5 8 0 4 Q 8 1 14 6 Z',
                params: { fill: '#992222', fillStyle: 'solid', strokeWidth: 0.2 }
            }]
    };
}


/***/ }),

/***/ "./Prefabs/Terrain/CastleWallHoriz.js":
/*!********************************************!*\
  !*** ./Prefabs/Terrain/CastleWallHoriz.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var castleWallHorizWidth = 210;
var castleWallHorizHeight = 12;
var castleWallHorizHitboxWidth = 210;
var castleWallHorizHitboxHeight = 2;
var castleWallHorizHealth = 2500;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.Terrain.CASTLE_WALL_HORIZ, width: castleWallHorizWidth, height: castleWallHorizHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: castleWallHorizHitboxWidth, hitboxHeight: castleWallHorizHitboxHeight, health: castleWallHorizHealth, maxHealth: castleWallHorizHealth });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Terrain/CastleWallHoriz.template.ts":
/*!*****************************************************!*\
  !*** ./Prefabs/Terrain/CastleWallHoriz.template.ts ***!
  \*****************************************************/
/*! exports provided: castleWallHorizBaseMasterPiece, castleWallHorizCoverMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castleWallHorizBaseMasterPiece", function() { return castleWallHorizBaseMasterPiece; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castleWallHorizCoverMasterPiece", function() { return castleWallHorizCoverMasterPiece; });
/**
 * Get master piece for horizontal castle wall object base
 * @param object The horizontal wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function castleWallHorizBaseMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#222222"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.hitboxWidth,
        height: object.hitboxHeight,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: object.hitboxWidth,
                height: object.hitboxHeight,
                swatch: 0
            }]
    };
}
/**
 * Get master piece for horizontal castle wall object cover
 * @param object The horizontal castle wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function castleWallHorizCoverMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#333333", "#FAF0E6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [
            { cellX: 0, cellY: -object.height / 2, width: object.width, height: object.height, swatch: 0 },
            { cellX: 103, cellY: 1, width: 1, height: 2, swatch: 1 },
            { cellX: 103, cellY: 2, width: 2, height: 1, swatch: 1 },
            { cellX: 107, cellY: 1, width: 1, height: 2, swatch: 1 },
            { cellX: 106, cellY: 2, width: 2, height: 1, swatch: 1 },
            { cellX: 103, cellY: -2, width: 1, height: 2, swatch: 1 },
            { cellX: 103, cellY: -2, width: 2, height: 1, swatch: 1 },
            { cellX: 107, cellY: -2, width: 1, height: 2, swatch: 1 },
            { cellX: 106, cellY: -2, width: 2, height: 1, swatch: 1 },
            { cellX: 33, cellY: -1, width: 3, height: 3, swatch: 1 },
            { cellX: 70, cellY: -1, width: 3, height: 3, swatch: 1 },
            { cellX: 140, cellY: -1, width: 3, height: 3, swatch: 1 },
            { cellX: 175, cellY: -1, width: 3, height: 3, swatch: 1 },
        ]
    };
}


/***/ }),

/***/ "./Prefabs/Terrain/CastleWallVert.js":
/*!*******************************************!*\
  !*** ./Prefabs/Terrain/CastleWallVert.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var castleWallVertWidth = 8;
var castleWallVertHeight = 210;
var castleWallVertHitboxWidth = 8;
var castleWallVertHitboxHeight = 210;
var castleWallVertHealth = 2500;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.Terrain.CASTLE_WALL_VERT, width: castleWallVertWidth, height: castleWallVertHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: castleWallVertHitboxWidth, hitboxHeight: castleWallVertHitboxHeight, health: castleWallVertHealth, maxHealth: castleWallVertHealth });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Terrain/CastleWallVert.template.ts":
/*!****************************************************!*\
  !*** ./Prefabs/Terrain/CastleWallVert.template.ts ***!
  \****************************************************/
/*! exports provided: castleWallVertMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castleWallVertMasterPiece", function() { return castleWallVertMasterPiece; });
/**
 * Get master piece for vertical castle wall object
 * @param object The vertical castle wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function castleWallVertMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#333333", "#FAF0E6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.hitboxWidth,
        height: object.hitboxHeight,
        facing: object.facing,
        strokes: [
            { cellX: 0, cellY: 0, width: object.hitboxWidth, height: object.hitboxHeight, swatch: 0 },
            { cellX: 3, cellY: 33, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 70, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 105, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 140, width: 2, height: 2, swatch: 1 },
            { cellX: 3, cellY: 175, width: 2, height: 2, swatch: 1 },
        ]
    };
}


/***/ }),

/***/ "./Prefabs/Terrain/Tree.js":
/*!*********************************!*\
  !*** ./Prefabs/Terrain/Tree.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var treeWidth = 4;
var treeHeight = 8;
var treeHitboxWidth = 4;
var treeHitboxHeight = 8;
var treeHealth = 200;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.Terrain.TREE, width: treeWidth, height: treeHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: treeHitboxWidth, hitboxHeight: treeHitboxHeight, health: treeHealth, maxHealth: treeHealth });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Terrain/Tree.template.ts":
/*!******************************************!*\
  !*** ./Prefabs/Terrain/Tree.template.ts ***!
  \******************************************/
/*! exports provided: treeTrunkMasterPiece, treeLeafMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "treeTrunkMasterPiece", function() { return treeTrunkMasterPiece; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "treeLeafMasterPiece", function() { return treeLeafMasterPiece; });
/**
 * Get master piece for tree object
 * @param object The tree object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function treeTrunkMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#993300"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: object.width,
                height: object.height,
                swatch: 0
            },],
    };
}
// TODO: Change leaf rendering depending on tree health
/**
 * Get master piece for tree object's leaves
 * @param object The tree object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function treeLeafMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#228822"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: -2,
                cellY: -4,
                width: object.width * 2,
                height: object.height,
                swatch: 0
            }, {
                cellX: 0,
                cellY: -10,
                width: 4,
                height: 7,
                swatch: 0
            },],
    };
}


/***/ }),

/***/ "./Prefabs/Terrain/WallHoriz.js":
/*!**************************************!*\
  !*** ./Prefabs/Terrain/WallHoriz.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var wallHorizWidth = 20;
var wallHorizHeight = 12;
var wallHorizHitboxWidth = 20;
var wallHorizHitboxHeight = 2;
var wallHorizHealth = 250;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    return __assign({}, base, { subtype: types.Terrain.WALL_HORIZ, width: wallHorizWidth, height: wallHorizHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: wallHorizHitboxWidth, hitboxHeight: wallHorizHitboxHeight, health: wallHorizHealth, maxHealth: wallHorizHealth });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Terrain/WallHoriz.template.ts":
/*!***********************************************!*\
  !*** ./Prefabs/Terrain/WallHoriz.template.ts ***!
  \***********************************************/
/*! exports provided: wallHorizBaseMasterPiece, wallHorizCoverMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wallHorizBaseMasterPiece", function() { return wallHorizBaseMasterPiece; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wallHorizCoverMasterPiece", function() { return wallHorizCoverMasterPiece; });
/**
 * Get master piece for horizontal wall object base
 * @param object The horizontal wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function wallHorizBaseMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#888888"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.hitboxWidth,
        height: object.hitboxHeight,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: object.hitboxWidth,
                height: object.hitboxHeight,
                swatch: 0
            }]
    };
}
// TODO: Add more detail to wall (cobblestone style), change coloring depending on object health
/**
 * Get master piece for horizontal wall object cover
 * @param object The horizontal wall object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function wallHorizCoverMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#A3A3C2BB"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: -object.height / 2,
                width: object.width,
                height: object.height,
                swatch: 0
            }]
    };
}


/***/ }),

/***/ "./Prefabs/Terrain/_Terrain.js":
/*!*************************************!*\
  !*** ./Prefabs/Terrain/_Terrain.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var utils = __webpack_require__(/*! ../PrefabUtils */ "./Prefabs/PrefabUtils.js");
    return {
        type: types.ObjectTypes.TERRAIN,
        x: posX,
        y: posY,
        update: function (obs, selfId, delta) { },
        deathrattle: function (obs, selfId) {
            if (obs[selfId])
                delete obs[selfId];
        },
        damage: utils.damage,
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Terrain/_Terrain.template.ts":
/*!**********************************************!*\
  !*** ./Prefabs/Terrain/_Terrain.template.ts ***!
  \**********************************************/
/*! exports provided: defaultTerrainMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultTerrainMasterPiece", function() { return defaultTerrainMasterPiece; });
/**
 * Get master piece for default terrain object
 * @param object The terrain object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function defaultTerrainMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#FFB3FF"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 0,
                width: object.width,
                height: object.height,
                swatch: 0
            }]
    };
}


/***/ }),

/***/ "./Prefabs/Trigger/InvulnPlatform.js":
/*!*******************************************!*\
  !*** ./Prefabs/Trigger/InvulnPlatform.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var invulnPlatformWidth = 16;
var invulnPlatformHeight = 16;
var invulnPlatformBuffDuration = 150;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Trigger.INVULN_PLATFORM, width: invulnPlatformWidth, height: invulnPlatformHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: invulnPlatformWidth, hitboxHeight: invulnPlatformHeight, onTrigger: function (obs, selfRef, triggerId) {
            if (obs[triggerId]) {
                if (obs[triggerId].statusEffects) {
                    obs[triggerId].addStatusEffect(obs, triggerId, types.StatusEffects.INVULNERABLE, invulnPlatformBuffDuration);
                }
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Trigger/InvulnPlatform.template.ts":
/*!****************************************************!*\
  !*** ./Prefabs/Trigger/InvulnPlatform.template.ts ***!
  \****************************************************/
/*! exports provided: invulnPlatformMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invulnPlatformMasterPiece", function() { return invulnPlatformMasterPiece; });
/**
 * Get master piece for invuln platform object
 * @param object The invuln platform object
 * @param renderOffsetX Horizontal offset for rendering objects
 * @param renderOffsetY Vertical offset for render objects
 */
function invulnPlatformMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#E5E5E5", "#222222", "#888888", "#ADD8E6"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: 0,
        strokes: [
            { cellX: 2, cellY: 0, width: 12, height: 16, swatch: 0 },
            { cellX: 0, cellY: 2, width: 16, height: 12, swatch: 0 },
            { cellX: 2, cellY: 0, width: 12, height: 1, swatch: 1 },
            { cellX: 0, cellY: 2, width: 1, height: 12, swatch: 1 },
            { cellX: 2, cellY: 15, width: 12, height: 1, swatch: 1 },
            { cellX: 15, cellY: 2, width: 1, height: 12, swatch: 1 },
            { cellX: 1, cellY: 1, width: 1, height: 1, swatch: 1 },
            { cellX: 14, cellY: 1, width: 1, height: 1, swatch: 1 },
            { cellX: 1, cellY: 14, width: 1, height: 1, swatch: 1 },
            { cellX: 14, cellY: 14, width: 1, height: 1, swatch: 1 },
            { cellX: 3, cellY: 3, width: 10, height: 6, swatch: 3 },
            { cellX: 4, cellY: 8, width: 8, height: 3, swatch: 3 },
            { cellX: 5, cellY: 10, width: 6, height: 2, swatch: 3 },
            { cellX: 3, cellY: 3, width: 10, height: 1, swatch: 2 },
            { cellX: 3, cellY: 3, width: 1, height: 6, swatch: 2 },
            { cellX: 12, cellY: 3, width: 1, height: 6, swatch: 2 },
            { cellX: 6, cellY: 12, width: 4, height: 1, swatch: 2 },
            { cellX: 4, cellY: 9, width: 1, height: 2, swatch: 2 },
            { cellX: 11, cellY: 9, width: 1, height: 2, swatch: 2 },
            { cellX: 5, cellY: 11, width: 1, height: 1, swatch: 2 },
            { cellX: 10, cellY: 11, width: 1, height: 1, swatch: 2 },
        ],
    };
}
// Creeper face...
// {cellX: 0, cellY: 0, width: 16, height: 16, swatch: 0},
// {cellX: 2, cellY: 2, width: 4, height: 4, swatch: 1},
// {cellX: 10, cellY: 2, width: 4, height: 4, swatch: 1},
// {cellX: 6, cellY: 6, width: 4, height: 6, swatch: 1},
// {cellX: 4, cellY: 8, width: 2, height: 6, swatch: 1},
// {cellX: 10, cellY: 8, width: 2, height: 6, swatch: 1},


/***/ }),

/***/ "./Prefabs/Trigger/SpikeTrap.js":
/*!**************************************!*\
  !*** ./Prefabs/Trigger/SpikeTrap.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var spikeTrapWidth = 5;
var spikeTrapHeight = 5;
var spikeTrapHitboxWidth = 5;
var spikeTrapHitboxHeight = 5;
var spikeTrapDamage = 20;
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return __assign({}, base, { subtype: types.Trigger.SPIKE_TRAP, width: spikeTrapWidth, height: spikeTrapHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: spikeTrapHitboxWidth, hitboxHeight: spikeTrapHitboxHeight, onTrigger: function (obs, selfRef, triggerId) {
            if (obs[triggerId] && (obs[triggerId].type == types.ObjectTypes.PLAYER ||
                obs[triggerId].type == types.ObjectTypes.VEHICLE ||
                obs[triggerId].type == types.ObjectTypes.ENEMY)) {
                if (obs[triggerId].damage) {
                    obs[triggerId].damage(obs, triggerId, spikeTrapDamage, types.DamageTypes.NORMAL);
                }
                delete obs[selfRef];
            }
        } });
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Trigger/SpikeTrap.template.ts":
/*!***********************************************!*\
  !*** ./Prefabs/Trigger/SpikeTrap.template.ts ***!
  \***********************************************/
/*! exports provided: spikeTrapMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "spikeTrapMasterPiece", function() { return spikeTrapMasterPiece; });
/**
 * Get master piece for spike trap object
 * @param object The spike trap object
 * @param renderOffsetX Horizontal offset for rendering the object
 * @param renderOffsetY Vertical offset for rendering the object
 */
function spikeTrapMasterPiece(object, renderOffsetX, renderOffsetY) {
    return {
        palette: ["#808080"],
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 1,
                cellY: 0,
                width: 1,
                height: 2,
                swatch: 0
            }, {
                cellX: 3,
                cellY: 0,
                width: 1,
                height: 2,
                swatch: 0
            }, {
                cellX: 0,
                cellY: 3,
                width: 1,
                height: 2,
                swatch: 0
            }, {
                cellX: 2,
                cellY: 3,
                width: 1,
                height: 2,
                swatch: 0
            }, {
                cellX: 4,
                cellY: 3,
                width: 1,
                height: 2,
                swatch: 0
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Trigger/_Trigger.js":
/*!*************************************!*\
  !*** ./Prefabs/Trigger/_Trigger.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    return {
        type: types.ObjectTypes.TRIGGER,
        x: posX,
        y: posY,
        update: function (obs, selfId, delta) {
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                if (obs[srcId] && collisionId != srcId) {
                    obs[srcId].onTrigger(obs, srcId, collisionId);
                }
            });
        },
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Vehicle/Car.js":
/*!********************************!*\
  !*** ./Prefabs/Vehicle/Car.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var carSpeed = 0.35;
var carWidth = 10;
var carHeight = 16;
var carHitboxWidth = 10;
var carHitboxHeight = 16;
var carHealth = 200;
var carViewRange = 1 / 3;
var carColors = [
    "#DC143C",
    "#006400",
    "#FF69B4",
    "#FFD700",
    "#708090",
    "#00BFFF",
    "#0000CD",
    "#FF4500",
    "#8B008B",
];
function generateNew(obs, src, posX, posY, base) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var carColor = Math.floor(Math.random() * (carColors.length));
    var vehicleId = src + ":" + types.ObjectTypes.VEHICLE + ":" + types.Vehicle.CAR + ":" + posX + ":" + posY;
    prefabs.generateNew(obs, vehicleId, posX, posY, types.ObjectTypes.INTERACTABLE, types.Interactable.CAR_ENTER);
    obs[vehicleId] = __assign({}, base, { subtype: types.Vehicle.CAR, speed: carSpeed, width: carWidth, height: carHeight, hitboxType: types.HitboxTypes.RECT, hitboxWidth: carHitboxWidth, hitboxHeight: carHitboxHeight, health: carHealth, maxHealth: carHealth, carColor: carColors[carColor], viewRange: carViewRange, interactableId: vehicleId + ":" + types.ObjectTypes.INTERACTABLE + ":" + types.Interactable.CAR_ENTER });
    return;
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./Prefabs/Vehicle/Car.template.ts":
/*!*****************************************!*\
  !*** ./Prefabs/Vehicle/Car.template.ts ***!
  \*****************************************/
/*! exports provided: carMasterPiece */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "carMasterPiece", function() { return carMasterPiece; });
function carMasterPiece(object, renderOffsetX, renderOffsetY) {
    var highlightR = parseInt("0x" + object.carColor.substring(1, 3), 16) + 0x33;
    var highlightG = parseInt("0x" + object.carColor.substring(3, 5), 16) + 0x33;
    var highlightB = parseInt("0x" + object.carColor.substring(5, 7), 16) + 0x33;
    return {
        palette: ["#333333"]
            .concat(object.carColor)
            .concat("#" +
            (highlightR > 0xFF ? 0xFF : highlightR).toString(16) +
            (highlightG > 0xFF ? 0xFF : highlightG).toString(16) +
            (highlightB > 0xFF ? 0xFF : highlightB).toString(16)),
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
                cellX: 0,
                cellY: 1,
                width: object.width,
                height: 5,
                swatch: 1
            }, {
                cellX: 1,
                cellY: 0,
                width: object.width - 2,
                height: 5,
                swatch: 1
            }, {
                cellX: 1,
                cellY: 4,
                width: object.width - 2,
                height: 6,
                swatch: 1
            }, {
                cellX: 0,
                cellY: 9,
                width: object.width,
                height: 6,
                swatch: 1
            }, {
                cellX: 1,
                cellY: 9,
                width: object.width - 2,
                height: 7,
                swatch: 1
            }, {
                cellX: 1,
                cellY: 3,
                width: object.width - 2,
                height: 2,
                swatch: 0
            }, {
                cellX: 2,
                cellY: 2,
                width: object.width - 4,
                height: 3,
                swatch: 0
            }, {
                cellX: 1,
                cellY: 10,
                width: object.width - 2,
                height: 3,
                swatch: 0
            }, {
                cellX: 2,
                cellY: 10,
                width: object.width - 4,
                height: 4,
                swatch: 0
            }, {
                cellX: 3,
                cellY: 6,
                width: object.width - 6,
                height: 3,
                swatch: 2
            }, {
                cellX: -1,
                cellY: 6,
                width: 1,
                height: 1,
                swatch: 1
            }, {
                cellX: object.width,
                cellY: 6,
                width: 1,
                height: 1,
                swatch: 1
            },]
    };
}


/***/ }),

/***/ "./Prefabs/Vehicle/_Vehicle.js":
/*!*************************************!*\
  !*** ./Prefabs/Vehicle/_Vehicle.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var defaultVehicleViewRange = 1 / 4;
function generateNew(obs, src, posX, posY) {
    var types = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
    var collisions = __webpack_require__(/*! ../../Collisions */ "./Collisions.js");
    var prefabs = __webpack_require__(/*! ../Prefabs */ "./Prefabs/Prefabs.js");
    var utils = __webpack_require__(/*! ../PrefabUtils */ "./Prefabs/PrefabUtils.js");
    return {
        type: types.ObjectTypes.VEHICLE,
        x: posX,
        y: posY,
        velocityX: 0,
        velocityY: 0,
        facing: 0,
        currentEquipment: undefined,
        equipment: [],
        viewRange: defaultVehicleViewRange,
        rider: undefined,
        deathrattle: function (obs, selfId) {
            if (obs[selfId].rider) {
                delete obs[obs[selfId].interactableId];
                var rider = obs[selfId].rider;
                // Reset velocities and position
                rider.velocityX = 0;
                rider.velocityY = 0;
                rider.x = obs[selfId].x;
                rider.y = obs[selfId].y;
                delete obs[selfId];
                obs[selfId] = rider;
            }
            else {
                delete obs[obs[selfId].interactableId];
                delete obs[selfId];
            }
        },
        update: function (obs, selfId, delta) {
            // Calculate car movement
            obs[selfId].x += obs[selfId].velocityX * delta;
            obs[selfId].y += obs[selfId].velocityY * delta;
            if (obs[obs[selfId].interactableId]) {
                obs[obs[selfId].interactableId].x = obs[selfId].x;
                obs[obs[selfId].interactableId].y = obs[selfId].y;
            }
            // Check collisions with terrain and reposition accordingly
            collisions.checkCollisions(selfId, obs, prefabs.renderSize, function (srcId, collisionId) {
                if (obs[srcId] && collisionId != srcId) {
                    switch (obs[collisionId].type) {
                        case types.ObjectTypes.TERRAIN:
                        case types.ObjectTypes.VEHICLE:
                            collisions.pushBack(obs, srcId, collisionId, prefabs.renderSize);
                            break;
                    }
                }
            });
        },
        mouseDown: function (obs, mouseEvent) { },
        onPlayerInput: function (obs, selfId, playerInput) {
            player = obs[selfId];
            var xDir = 0;
            var yDir = 0;
            if (playerInput.left) {
                xDir -= 1;
            }
            if (playerInput.right) {
                xDir += 1;
            }
            if (playerInput.up) {
                yDir -= 1;
            }
            if (playerInput.down) {
                yDir += 1;
            }
            player.velocityX = xDir * player.speed;
            player.velocityY = yDir * player.speed;
            if (xDir != 0 || yDir != 0) {
                player.facing = (Math.atan(player.velocityY / player.velocityX) * 57.2958 + 90) + (xDir < 0 ? 180 : 0);
            }
            if (xDir != 0) {
                player.hitboxWidth = obs[selfId].height;
                player.hitboxHeight = obs[selfId].width;
            }
            if (yDir != 0) {
                player.hitboxWidth = obs[selfId].width;
                player.hitboxHeight = obs[selfId].height;
            }
            if (playerInput.pickup) {
                var newVechicleId = selfId + ":" + obs[selfId].type + ":" + obs[selfId].subtype + ":" + obs[selfId].x + ":" + obs[selfId].y;
                obs[obs[selfId].interactableId].vehicleId = newVechicleId;
                obs[newVechicleId] = obs[selfId];
                delete obs[selfId];
                obs[selfId] = obs[newVechicleId].rider;
                obs[newVechicleId].rider = undefined;
                // Reset velocities and position
                obs[selfId].velocityX = 0;
                obs[selfId].velocityY = 0;
                obs[newVechicleId].velocityX = 0;
                obs[newVechicleId].velocityY = 0;
                obs[selfId].x = obs[newVechicleId].x + obs[newVechicleId].width / 2 + obs[selfId].width / 2;
                obs[selfId].y = obs[newVechicleId].y;
            }
        },
        damage: utils.damage,
    };
}
module.exports = {
    generateNew: generateNew,
};


/***/ }),

/***/ "./src/Louvre/Louvre.ts":
/*!******************************!*\
  !*** ./src/Louvre/Louvre.ts ***!
  \******************************/
/*! exports provided: renderObjects, renderCurrentEquipment, renderAbilities */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderObjects", function() { return renderObjects; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderCurrentEquipment", function() { return renderCurrentEquipment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderAbilities", function() { return renderAbilities; });
/* harmony import */ var _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../ObjectTypes */ "./ObjectTypes.js");
/* harmony import */ var _ObjectTypes__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ObjectTypes__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Prefabs_Player_Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Prefabs/Player/_Player */ "./Prefabs/Player/_Player.js");
/* harmony import */ var _Prefabs_Player_Player__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Prefabs_Player_Player__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Prefabs_Player_Player_template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Prefabs/Player/_Player.template */ "./Prefabs/Player/_Player.template.ts");
/* harmony import */ var _Prefabs_Player_God_template__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Prefabs/Player/God.template */ "./Prefabs/Player/God.template.ts");
/* harmony import */ var _Prefabs_Player_FireMage_template__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Prefabs/Player/FireMage.template */ "./Prefabs/Player/FireMage.template.ts");
/* harmony import */ var _Prefabs_Player_HealthBar_template__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Prefabs/Player/HealthBar.template */ "./Prefabs/Player/HealthBar.template.ts");
/* harmony import */ var _Prefabs_Player_StatusEffects_Stunned_template__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Prefabs/Player/StatusEffects/Stunned.template */ "./Prefabs/Player/StatusEffects/Stunned.template.ts");
/* harmony import */ var _Prefabs_Player_StatusEffects_Invulnerable_template__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../Prefabs/Player/StatusEffects/Invulnerable.template */ "./Prefabs/Player/StatusEffects/Invulnerable.template.ts");
/* harmony import */ var _Prefabs_Projectile_Projectile_template__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../Prefabs/Projectile/_Projectile.template */ "./Prefabs/Projectile/_Projectile.template.ts");
/* harmony import */ var _Prefabs_Projectile_FireboltProjectile_template__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../Prefabs/Projectile/FireboltProjectile.template */ "./Prefabs/Projectile/FireboltProjectile.template.ts");
/* harmony import */ var _Prefabs_Projectile_FlamePillarProjectile_template__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../Prefabs/Projectile/FlamePillarProjectile.template */ "./Prefabs/Projectile/FlamePillarProjectile.template.ts");
/* harmony import */ var _Prefabs_Projectile_FlameDashProjectile_template__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../Prefabs/Projectile/FlameDashProjectile.template */ "./Prefabs/Projectile/FlameDashProjectile.template.ts");
/* harmony import */ var _Prefabs_Gravestone_Gravestone_template__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../Prefabs/Gravestone/_Gravestone.template */ "./Prefabs/Gravestone/_Gravestone.template.ts");
/* harmony import */ var _Prefabs_Terrain_Terrain_template__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../Prefabs/Terrain/_Terrain.template */ "./Prefabs/Terrain/_Terrain.template.ts");
/* harmony import */ var _Prefabs_Terrain_Tree_template__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../Prefabs/Terrain/Tree.template */ "./Prefabs/Terrain/Tree.template.ts");
/* harmony import */ var _Prefabs_Terrain_WallHoriz_template__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../Prefabs/Terrain/WallHoriz.template */ "./Prefabs/Terrain/WallHoriz.template.ts");
/* harmony import */ var _Prefabs_Terrain_CastleWallHoriz_template__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../Prefabs/Terrain/CastleWallHoriz.template */ "./Prefabs/Terrain/CastleWallHoriz.template.ts");
/* harmony import */ var _Prefabs_Terrain_CastleWallVert_template__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../Prefabs/Terrain/CastleWallVert.template */ "./Prefabs/Terrain/CastleWallVert.template.ts");
/* harmony import */ var _Prefabs_Interactable_HealthPickup_template__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../Prefabs/Interactable/HealthPickup.template */ "./Prefabs/Interactable/HealthPickup.template.ts");
/* harmony import */ var _Prefabs_Interactable_PlayerTypeChanger_template__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../Prefabs/Interactable/PlayerTypeChanger.template */ "./Prefabs/Interactable/PlayerTypeChanger.template.ts");
/* harmony import */ var _Prefabs_Interactable_Teleporter_template__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../Prefabs/Interactable/Teleporter.template */ "./Prefabs/Interactable/Teleporter.template.ts");
/* harmony import */ var _Prefabs_Trigger_SpikeTrap_template__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../Prefabs/Trigger/SpikeTrap.template */ "./Prefabs/Trigger/SpikeTrap.template.ts");
/* harmony import */ var _Prefabs_Trigger_InvulnPlatform_template__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../Prefabs/Trigger/InvulnPlatform.template */ "./Prefabs/Trigger/InvulnPlatform.template.ts");
/* harmony import */ var _Prefabs_Vehicle_Car_template__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../Prefabs/Vehicle/Car.template */ "./Prefabs/Vehicle/Car.template.ts");
/* harmony import */ var _Prefabs_Decoration_DeadDummy_template__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../Prefabs/Decoration/DeadDummy.template */ "./Prefabs/Decoration/DeadDummy.template.ts");
/* harmony import */ var _Prefabs_Decoration_WatchTower_template__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../../Prefabs/Decoration/WatchTower.template */ "./Prefabs/Decoration/WatchTower.template.ts");
/* harmony import */ var _Prefabs_Decoration_CastleFloor_template__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../../Prefabs/Decoration/CastleFloor.template */ "./Prefabs/Decoration/CastleFloor.template.ts");
/* harmony import */ var _Prefabs_Equipment_Binoculars_icon__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../Prefabs/Equipment/Binoculars.icon */ "./Prefabs/Equipment/Binoculars.icon.ts");
/* harmony import */ var _Prefabs_Equipment_Blaster_icon__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../Prefabs/Equipment/Blaster.icon */ "./Prefabs/Equipment/Blaster.icon.ts");
/* harmony import */ var _Prefabs_Equipment_Builder_icon__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../../Prefabs/Equipment/Builder.icon */ "./Prefabs/Equipment/Builder.icon.ts");
/* harmony import */ var _Prefabs_Equipment_Scanner_icon__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../../Prefabs/Equipment/Scanner.icon */ "./Prefabs/Equipment/Scanner.icon.ts");
/* harmony import */ var _Prefabs_Enemy_Enemy_template__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../../Prefabs/Enemy/_Enemy.template */ "./Prefabs/Enemy/_Enemy.template.ts");
































function renderObjects(objects, renderOffsetX, renderOffsetY, renderSize, background, env, foreground, cover, ui) {
    for (var id in objects) {
        var object = objects[id];
        switch (object.type) {
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].PLAYER:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Player"].HUMAN:
                        foreground.draw(_Prefabs_Player_Player_template__WEBPACK_IMPORTED_MODULE_2__["playerMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Player"].GOD:
                        foreground.draw(_Prefabs_Player_God_template__WEBPACK_IMPORTED_MODULE_3__["godPlayerMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Player"].FIRE_MAGE:
                        foreground.draw(_Prefabs_Player_FireMage_template__WEBPACK_IMPORTED_MODULE_4__["firemagePlayerMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                }
                drawStatusEffects(object, renderOffsetX, renderOffsetY, renderSize, cover);
                foreground.draw(_Prefabs_Player_HealthBar_template__WEBPACK_IMPORTED_MODULE_5__["healthBarMasterPiece"](object, renderOffsetX, renderOffsetY, renderSize));
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].PROJECTILE:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Projectile"].BASIC_PROJECTILE:
                        env.draw(_Prefabs_Projectile_Projectile_template__WEBPACK_IMPORTED_MODULE_8__["projectileMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Projectile"].FIREBOLT_PROJECTILE:
                        env.draw(_Prefabs_Projectile_FireboltProjectile_template__WEBPACK_IMPORTED_MODULE_9__["fireboltProjectileMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Projectile"].FLAME_PILLAR_PROJECTILE:
                        env.draw(_Prefabs_Projectile_FlamePillarProjectile_template__WEBPACK_IMPORTED_MODULE_10__["flamePillarProjectileMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Projectile"].FLAME_DASH_PROJECTILE:
                        env.draw(_Prefabs_Projectile_FlameDashProjectile_template__WEBPACK_IMPORTED_MODULE_11__["flameDashProjectileMasterPiece"](object, renderOffsetX, renderOffsetY));
                }
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].GRAVESTONE:
                env.draw(_Prefabs_Gravestone_Gravestone_template__WEBPACK_IMPORTED_MODULE_12__["graveStoneMasterPiece"](object, renderOffsetX, renderOffsetY));
                env.draw(_Prefabs_Player_HealthBar_template__WEBPACK_IMPORTED_MODULE_5__["healthBarMasterPiece"](object, renderOffsetX, renderOffsetY, renderSize));
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].TERRAIN:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Terrain"].TREE:
                        env.draw(_Prefabs_Terrain_Tree_template__WEBPACK_IMPORTED_MODULE_14__["treeTrunkMasterPiece"](object, renderOffsetX, renderOffsetY));
                        cover.draw(_Prefabs_Terrain_Tree_template__WEBPACK_IMPORTED_MODULE_14__["treeLeafMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Terrain"].WALL_HORIZ:
                        env.draw(_Prefabs_Terrain_WallHoriz_template__WEBPACK_IMPORTED_MODULE_15__["wallHorizBaseMasterPiece"](object, renderOffsetX, renderOffsetY));
                        cover.draw(_Prefabs_Terrain_WallHoriz_template__WEBPACK_IMPORTED_MODULE_15__["wallHorizCoverMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Terrain"].CASTLE_WALL_HORIZ:
                        env.draw(_Prefabs_Terrain_CastleWallHoriz_template__WEBPACK_IMPORTED_MODULE_16__["castleWallHorizBaseMasterPiece"](object, renderOffsetX, renderOffsetY));
                        cover.draw(_Prefabs_Terrain_CastleWallHoriz_template__WEBPACK_IMPORTED_MODULE_16__["castleWallHorizCoverMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Terrain"].CASTLE_WALL_VERT:
                        cover.draw(_Prefabs_Terrain_CastleWallVert_template__WEBPACK_IMPORTED_MODULE_17__["castleWallVertMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                }
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].INTERACTABLE:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Interactable"].HEALTH_PICKUP:
                        env.draw(_Prefabs_Interactable_HealthPickup_template__WEBPACK_IMPORTED_MODULE_18__["healthPickupMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Interactable"].PLAYER_TYPE_CHANGER:
                        env.draw(_Prefabs_Interactable_PlayerTypeChanger_template__WEBPACK_IMPORTED_MODULE_19__["playerTypeChangerMasterPiece"](object, renderOffsetX, renderOffsetY));
                        env.draw(_Prefabs_Interactable_PlayerTypeChanger_template__WEBPACK_IMPORTED_MODULE_19__["littleManMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Interactable"].TELEPORTER:
                        env.draw(_Prefabs_Interactable_Teleporter_template__WEBPACK_IMPORTED_MODULE_20__["teleporterMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                }
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].TRIGGER:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Trigger"].SPIKE_TRAP:
                        env.draw(_Prefabs_Trigger_SpikeTrap_template__WEBPACK_IMPORTED_MODULE_21__["spikeTrapMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Trigger"].INVULN_PLATFORM:
                        env.draw(_Prefabs_Trigger_InvulnPlatform_template__WEBPACK_IMPORTED_MODULE_22__["invulnPlatformMasterPiece"](object, renderOffsetX, renderOffsetY));
                }
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].VEHICLE:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Vehicle"].CAR:
                        foreground.draw(_Prefabs_Vehicle_Car_template__WEBPACK_IMPORTED_MODULE_23__["carMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                }
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].DECORATION:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Decoration"].DEAD_DUMMY:
                        env.draw(_Prefabs_Decoration_DeadDummy_template__WEBPACK_IMPORTED_MODULE_24__["deadDummyMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Decoration"].WATCH_TOWER:
                        cover.draw(_Prefabs_Decoration_WatchTower_template__WEBPACK_IMPORTED_MODULE_25__["watchTowerMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Decoration"].CASTLE_FLOOR:
                        background.draw(_Prefabs_Decoration_CastleFloor_template__WEBPACK_IMPORTED_MODULE_26__["castleFloorMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                }
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].COMBAT_TEXT:
                ui.drawText(object.text, object.x - renderOffsetX, object.y - renderOffsetY, object.size, object.color, object.facing);
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["ObjectTypes"].ENEMY:
                switch (object.subtype) {
                    case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["Enemy"].TARGET_DUMMY:
                        foreground.draw(_Prefabs_Enemy_Enemy_template__WEBPACK_IMPORTED_MODULE_31__["enemyMasterPiece"](object, renderOffsetX, renderOffsetY));
                        break;
                }
                foreground.draw(_Prefabs_Player_HealthBar_template__WEBPACK_IMPORTED_MODULE_5__["healthBarMasterPiece"](object, renderOffsetX, renderOffsetY, renderSize));
                drawStatusEffects(object, renderOffsetX, renderOffsetY, renderSize, cover);
                break;
            default:
                env.draw(_Prefabs_Terrain_Terrain_template__WEBPACK_IMPORTED_MODULE_13__["defaultTerrainMasterPiece"](object, renderOffsetX, renderOffsetY));
                break;
        }
    }
}
function renderCurrentEquipment(player, renderOffsetX, renderOffsetY, ui) {
    if (player && player.currentEquipment != undefined) {
        switch (player.equipment[player.currentEquipment].type) {
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["EquipmentTypes"].BLASTER:
                ui.draw(_Prefabs_Equipment_Blaster_icon__WEBPACK_IMPORTED_MODULE_28__["blasterUIMasterPiece"](renderOffsetX, renderOffsetY));
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["EquipmentTypes"].SCANNER:
                ui.draw(_Prefabs_Equipment_Scanner_icon__WEBPACK_IMPORTED_MODULE_30__["scannerUIMasterPiece"](renderOffsetX, renderOffsetY));
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["EquipmentTypes"].BUILDER:
                ui.draw(_Prefabs_Equipment_Builder_icon__WEBPACK_IMPORTED_MODULE_29__["builderUIMasterPiece"](renderOffsetX, renderOffsetY));
                break;
            case _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["EquipmentTypes"].BINOCULARS:
                ui.draw(_Prefabs_Equipment_Binoculars_icon__WEBPACK_IMPORTED_MODULE_27__["binocularsUIMasterPiece"](renderOffsetX, renderOffsetY));
                break;
            default:
                break;
        }
    }
}
function renderAbilities(player, ui) {
    if (player && player.abilities) {
        var iconSize_1 = 48;
        var numAbilities_1 = player.abilities.length;
        var renderWidth_1 = ui.size().width / 2;
        var renderHeight_1 = ui.size().height - iconSize_1;
        // TODO: Move these to their own template files
        player.abilities.forEach(function (ability, index) {
            var iconPosX = renderWidth_1 + (0.5 - numAbilities_1 / 2 + index) * iconSize_1;
            var remaining = (ability.cooldown - (Date.now() - ability.lastcast)) / 1000;
            ui.draw({
                palette: ["#888888", "#CCCCCC", "#BBBBBB"],
                posX: iconPosX,
                posY: renderHeight_1,
                width: 8,
                height: 8,
                facing: 0,
                strokes: [{
                        cellX: 1,
                        cellY: 0,
                        width: 14,
                        height: 16,
                        swatch: 0
                    }, {
                        cellX: 0,
                        cellY: 1,
                        width: 16,
                        height: 14,
                        swatch: 0
                    }, {
                        cellX: 1,
                        cellY: 1,
                        width: 14,
                        height: 14,
                        swatch: (remaining > 0) ? 1 : 2
                    },],
                customRenderSize: 2
            });
            if (remaining > 0) {
                ui.drawText(remaining.toFixed(1), iconPosX, renderHeight_1 + 4, 12, "#EEEEEE");
            }
            else {
                ui.drawText(String(index + 1), iconPosX, renderHeight_1 + 6, 18, "#EEEEEE");
            }
        });
    }
}
function drawStatusEffects(object, renderOffsetX, renderOffsetY, renderSize, cover) {
    if (Object(_Prefabs_Player_Player__WEBPACK_IMPORTED_MODULE_1__["checkStatusEffect"])(object, _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["StatusEffects"].STUNNED)) {
        cover.draw(_Prefabs_Player_StatusEffects_Stunned_template__WEBPACK_IMPORTED_MODULE_6__["stunnedStatusEffectMasterPiece"](object, renderOffsetX, renderOffsetY, renderSize));
    }
    if (Object(_Prefabs_Player_Player__WEBPACK_IMPORTED_MODULE_1__["checkStatusEffect"])(object, _ObjectTypes__WEBPACK_IMPORTED_MODULE_0__["StatusEffects"].INVULNERABLE)) {
        cover.draw(_Prefabs_Player_StatusEffects_Invulnerable_template__WEBPACK_IMPORTED_MODULE_7__["invulnerableStatusEffectMasterPiece"](object, renderOffsetX, renderOffsetY, renderSize));
    }
}


/***/ }),

/***/ "./src/Popova/Popova.ts":
/*!******************************!*\
  !*** ./src/Popova/Popova.ts ***!
  \******************************/
/*! exports provided: StrokeTypes, Popova */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StrokeTypes", function() { return StrokeTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Popova", function() { return Popova; });
var StrokeTypes;
(function (StrokeTypes) {
    StrokeTypes["RECT"] = "stroke-rect";
    StrokeTypes["CIRC"] = "stroke-circ";
    StrokeTypes["SVG"] = "stroke-svg";
})(StrokeTypes || (StrokeTypes = {}));
var Popova = /** @class */ (function () {
    function Popova() {
        this.cubeSize = 12;
        this.shadowColor = "#77777799";
    }
    /**
     * Initializes Popova's canvas
     * @param canvasId Id of html canvas element
     * @param cubeSize Render size for each cube when drawing with cubes
     */
    Popova.prototype.init = function (canvasId, shadowHeight) {
        this.canvas = document.getElementById(canvasId);
        // @ts-ignore   --   Ignores "Cannot find name 'rough'"
        this.rcanvas = rough.canvas(this.canvas);
        this.width = this.canvas.offsetWidth - 4;
        this.height = this.canvas.offsetHeight - 4;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.shadowHeight = shadowHeight;
    };
    /**
     * Renders a grid on the canvas
     * @param spacing Number of pixels between grid lines
    */
    Popova.prototype.drawGrid = function (spacing, offsetX, offsetY) {
        this.ctx.beginPath();
        this.ctx.save();
        // Draw grid on background
        this.ctx.strokeStyle = "#f0e7db";
        for (var x = (!!offsetX) ? offsetX % spacing : 0; x <= this.width; x += spacing) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (var y = (!!offsetY) ? offsetY % spacing : 0; y <= this.height; y += spacing) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
        this.ctx.restore();
    };
    /**
     * Draws a masterpiece to the canvas
     * @param masterPiece Definition for what to draw
     */
    Popova.prototype.draw = function (masterPiece) {
        var _this = this;
        if (this.shadowHeight > 0) { // Render shadows  && (masterPiece.shadowHeight) ? masterPiece.shadowHeight > 0 : true
            this.ctx.save();
            this.prepCanvas(masterPiece.posX + ((masterPiece.shadowHeight) ? masterPiece.shadowHeight : this.shadowHeight), masterPiece.posY + ((masterPiece.shadowHeight) ? masterPiece.shadowHeight : this.shadowHeight), masterPiece.width, masterPiece.height, masterPiece.facing);
            masterPiece.strokes.forEach(function (stroke) {
                _this.renderShadow(stroke, _this.shadowColor, masterPiece.customRenderSize);
            });
            this.ctx.restore();
        }
        this.ctx.save();
        this.prepCanvas(masterPiece.posX, masterPiece.posY, masterPiece.width, masterPiece.height, masterPiece.facing);
        masterPiece.strokes.forEach(function (stroke) {
            _this.renderStroke(stroke, masterPiece.palette, masterPiece.customRenderSize);
        });
        this.ctx.restore();
    };
    /**
     * Centers the canvas on position, and rotates to a certain facing
     * @param positionX The x position of what is being drawn
     * @param positionY The y position of what is being drawn
     * @param width The width of what is being drawn
     * @param height The height of what is being drawn
     * @param degrees Degrees to rotate the canvas by
     * @param customRenderSize Render the master piece with custom cube sizing
     */
    Popova.prototype.prepCanvas = function (positionX, positionY, width, height, degrees, customRenderSize) {
        var renderSize = customRenderSize ? customRenderSize : this.cubeSize;
        this.ctx.beginPath();
        this.ctx.translate(positionX, positionY);
        this.ctx.rotate(degrees * Math.PI / 180);
        this.ctx.translate(-width * renderSize / 2, -height * renderSize / 2);
    };
    /**
     * Renders masterpiece's strokes
     * @param stroke Stroke to render
     * @param palette Contains the master piece's color swatches
     * @param customRenderSize Render the master piece with custom cube sizing
     */
    Popova.prototype.renderStroke = function (stroke, palette, customRenderSize) {
        if (stroke.type && stroke.type === StrokeTypes.CIRC) {
            this.ctx.fillStyle = palette[stroke.swatch];
            this.ctx.arc(stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize), stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize), Math.min(stroke.width, stroke.height) * (customRenderSize ? customRenderSize : this.cubeSize), 0, Math.PI * 2);
            this.ctx.fill();
        }
        else if (stroke.type && stroke.type === StrokeTypes.SVG) {
            this.rcanvas.path(stroke.path, stroke.params);
        }
        else {
            this.ctx.fillStyle = palette[stroke.swatch];
            this.ctx.fillRect(stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize), stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize), stroke.width * (customRenderSize ? customRenderSize : this.cubeSize), stroke.height * (customRenderSize ? customRenderSize : this.cubeSize));
        }
    };
    /**
     * Renders masterpiece shadow
     * @param stroke Stroke to render
     * @param shadowColor Shadow fill color
     * @param customRenderSize Render the master piece with custom cube sizing
     */
    Popova.prototype.renderShadow = function (stroke, shadowColor, customRenderSize) {
        if (stroke.type && stroke.type === StrokeTypes.CIRC) {
            this.ctx.fillStyle = shadowColor;
            this.ctx.arc(stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize), stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize), Math.min(stroke.width, stroke.height) * (customRenderSize ? customRenderSize : this.cubeSize), 0, Math.PI * 2);
            this.ctx.fill();
        }
        else if (stroke.type && stroke.type === StrokeTypes.SVG) {
            this.rcanvas.path(stroke.path, { fill: shadowColor, fillStyle: "solid", strokeWidth: 0.01 });
        }
        else {
            this.ctx.fillStyle = shadowColor;
            this.ctx.fillRect(stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize), stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize), stroke.width * (customRenderSize ? customRenderSize : this.cubeSize), stroke.height * (customRenderSize ? customRenderSize : this.cubeSize));
        }
    };
    /**
     * Erases everything on the canvas
     */
    Popova.prototype.wipeCanvas = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };
    /**
     * Returns the canvas' width and height
     */
    Popova.prototype.size = function () {
        return { width: this.width, height: this.height };
    };
    /**
     * Returns Popova's cube render size
     */
    Popova.prototype.getCubeSize = function () {
        return this.cubeSize;
    };
    /**
     * Sets Popova's cube render size
     * @param size Value for cube render size
     */
    Popova.prototype.setCubeSize = function (size) {
        this.cubeSize = size;
    };
    /**
     * Returns mouse position and if mouse is inside canvas
     * @param evt Mouse movement event, containing position information
     */
    Popova.prototype.getMousePos = function (evt) {
        var rect = this.canvas.getBoundingClientRect();
        var posX = evt.clientX - rect.left;
        var posY = evt.clientY - rect.top;
        var offCanvas = false;
        if (posX < 0) {
            posX = 0;
            offCanvas = true;
        }
        if (posY < 0) {
            posY = 0;
            offCanvas = true;
        }
        if (posX > this.width) {
            posX = this.width;
            offCanvas = true;
        }
        if (posY > this.height) {
            posY = this.height;
            offCanvas = true;
        }
        return {
            x: posX,
            y: posY,
            outOfBounds: offCanvas,
        };
    };
    /**
     * Draw text to the canvas
     * @param text The text to draw
     * @param posX The horizontal position to draw the text
     * @param posY The vertical position to draw the text
     * @param size The font size of the text
     * @param color The color to draw the text
     * @param facing The angle to render the text
     */
    Popova.prototype.drawText = function (text, posX, posY, size, color, facing) {
        this.ctx.save();
        var actualSize = size ? size : 16;
        this.ctx.font = String(actualSize) + "px Arial";
        this.prepCanvas(posX, posY, this.ctx.measureText(text).width, 0, facing, 1);
        this.ctx.fillStyle = color ? color : "black";
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    };
    return Popova;
}());



/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Popova_Popova__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Popova/Popova */ "./src/Popova/Popova.ts");
/* harmony import */ var _Louvre_Louvre__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Louvre/Louvre */ "./src/Louvre/Louvre.ts");


// Socket listener
var socket = io();
var debug = true;
var cubeSize;
var gridSize = 48;
var canvasSize;
var equipmentIconPosX = 976;
var equipmentIconPosY = 726;
var playerId;
var renderOffsetX;
var renderOffsetY;
var cameraMovingToX;
var cameraMovingToY;
var cameraPanSpeed = 0.015;
var mousePos = { x: 0, y: 0, outOfBounds: true };
var playerInput = {
    up: false,
    down: false,
    left: false,
    right: false,
    cycleEquipmentForward: false,
    cycleEquipmentBackward: false,
    useEquipment: false,
    pickup: false,
    ability1: false,
    ability2: false,
    ability3: false,
    ability4: false,
    targetX: mousePos.x,
    targetY: mousePos.y,
};
var KEY_UP = 87; // Default to W
var KEY_DOWN = 83; // Default to S
var KEY_RIGHT = 68; // Default to D
var KEY_LEFT = 65; // Default to A
var KEY_CYCLE_EQUIPMENT_FORWARD = 69; // Default to E
var KEY_CYCLE_EQUIPMENT_BACKWARD = 81; // Default to Q
var KEY_USE_EQUIPMENT = 82; // Default to R
var KEY_PICKUP = 70; // Default to F
var KEY_ABILITY_1 = 49; // Default to 1
var KEY_ABILITY_2 = 50; // Default to 2
var KEY_ABILITY_3 = 51; // Default to 3
var KEY_ABILITY_4 = 52; // Default to 4
var prevTime = 0;
var delta = 0;
// Add listeners to document
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case KEY_UP:
            playerInput.up = true;
            break;
        case KEY_DOWN:
            playerInput.down = true;
            break;
        case KEY_RIGHT:
            playerInput.right = true;
            break;
        case KEY_LEFT:
            playerInput.left = true;
            break;
        case KEY_CYCLE_EQUIPMENT_FORWARD:
            playerInput.cycleEquipmentForward = true;
            break;
        case KEY_CYCLE_EQUIPMENT_BACKWARD:
            playerInput.cycleEquipmentBackward = true;
            break;
        case KEY_USE_EQUIPMENT:
            playerInput.useEquipment = true;
            break;
        case KEY_PICKUP:
            playerInput.pickup = true;
            break;
        case KEY_ABILITY_1:
            playerInput.ability1 = true;
            break;
        case KEY_ABILITY_2:
            playerInput.ability2 = true;
            break;
        case KEY_ABILITY_3:
            playerInput.ability3 = true;
            break;
        case KEY_ABILITY_4:
            playerInput.ability4 = true;
            break;
        default:
            return;
    }
    playerInput.targetX = mousePos.x + renderOffsetX;
    playerInput.targetY = mousePos.y + renderOffsetY;
    socket.emit("playerInput", playerInput);
    // Trigger keys are unset after emission
    playerInput.pickup = false;
    playerInput.cycleEquipmentForward = false;
    playerInput.cycleEquipmentBackward = false;
    playerInput.useEquipment = false;
});
document.addEventListener("keyup", function (event) {
    switch (event.keyCode) {
        case KEY_UP:
            playerInput.up = false;
            break;
        case KEY_DOWN:
            playerInput.down = false;
            break;
        case KEY_RIGHT:
            playerInput.right = false;
            break;
        case KEY_LEFT:
            playerInput.left = false;
            break;
        case KEY_ABILITY_1:
            playerInput.ability1 = false;
            break;
        case KEY_ABILITY_2:
            playerInput.ability2 = false;
            break;
        case KEY_ABILITY_3:
            playerInput.ability3 = false;
            break;
        case KEY_ABILITY_4:
            playerInput.ability4 = false;
            break;
        default:
            return;
    }
    socket.emit("playerInput", playerInput);
});
function onMouseMove(event) {
    mousePos = foreground.getMousePos(event);
}
window.addEventListener("mousemove", onMouseMove, false);
function onMouseClick(event) {
    if (!mousePos.outOfBounds) {
        socket.emit("mouseDown", {
            sourceId: playerId,
            targetX: (mousePos.x + renderOffsetX),
            targetY: (mousePos.y + renderOffsetY),
            playerInput: playerInput,
        });
    }
}
window.addEventListener("click", onMouseClick, false);
// Init canvas
var background = new _Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["Popova"]();
var env = new _Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["Popova"]();
var foreground = new _Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["Popova"]();
var cover = new _Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["Popova"]();
var ui = new _Popova_Popova__WEBPACK_IMPORTED_MODULE_0__["Popova"]();
background.init("background", 2);
env.init("env", 2);
foreground.init("foreground", 2);
cover.init("cover", 2);
ui.init("ui", 0); // Ui doesn't drop a shadow
// Tell the server a new player has joined and handshake
socket.emit("new-player");
socket.on("handshake", function (info) {
    playerId = info.id;
    cubeSize = info.cubeSize;
    background.setCubeSize(cubeSize);
    env.setCubeSize(cubeSize);
    foreground.setCubeSize(cubeSize);
    cover.setCubeSize(cubeSize);
    ui.setCubeSize(cubeSize);
    canvasSize = foreground.size();
    prevTime = Date.now();
    renderOffsetX = 0;
    renderOffsetY = 0;
});
// Interpret state and draw objects
socket.on("state", function (objects) {
    var player = undefined;
    if (playerId && objects[playerId]) {
        player = objects[playerId];
    }
    if (!canvasSize) {
        return;
    }
    foreground.wipeCanvas();
    env.wipeCanvas();
    cover.wipeCanvas();
    ui.wipeCanvas();
    var time = Date.now();
    delta = time - prevTime;
    prevTime = time;
    // Camera smoothing and render offset calculations
    cameraMovingToX = (!!player)
        ? player.x + (mousePos.x - (canvasSize.width / 2)) * player.viewRange - canvasSize.width / 2
        : undefined;
    cameraMovingToY = (!!player)
        ? player.y + (mousePos.y - (canvasSize.height / 2)) * player.viewRange - canvasSize.height / 2
        : undefined;
    renderOffsetX += (!!cameraMovingToX)
        ? (cameraMovingToX - renderOffsetX) * cameraPanSpeed * delta
        : 0;
    renderOffsetY += (!!cameraMovingToY)
        ? (cameraMovingToY - renderOffsetY) * cameraPanSpeed * delta
        : 0;
    // TODO: Draw background map (instead of/with grid)
    if (!!objects) {
        background.wipeCanvas();
        // background.drawGrid(gridSize, -renderOffsetX, -renderOffsetY);
    }
    if (debug) {
        ui.drawText(delta.toString() + "ms", canvasSize.width - 32, 16, 16, "#444444");
    }
    // Render current equipment ui icon
    _Louvre_Louvre__WEBPACK_IMPORTED_MODULE_1__["renderCurrentEquipment"](player, equipmentIconPosX, equipmentIconPosY, ui);
    // Render player's abilities
    _Louvre_Louvre__WEBPACK_IMPORTED_MODULE_1__["renderAbilities"](player, ui);
    // Render objects
    _Louvre_Louvre__WEBPACK_IMPORTED_MODULE_1__["renderObjects"](objects, renderOffsetX, renderOffsetY, cubeSize, background, env, foreground, cover, ui);
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vQ29sbGlzaW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9PYmplY3RUeXBlcy5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0FiaWxpdGllcy9GaXJlYm9sdC5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0FiaWxpdGllcy9GbGFtZUJhcnJpZXIuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9BYmlsaXRpZXMvRmxhbWVEYXNoLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvQWJpbGl0aWVzL0ZsYW1lUGlsbGFyLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvQ29tYmF0VGV4dC9EYW1hZ2VUZXh0LmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvQ29tYmF0VGV4dC9GaXJlRGFtYWdlVGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0NvbWJhdFRleHQvSGVhbFRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9Db21iYXRUZXh0L0ludnVsbmVyYWJsZVRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9Db21iYXRUZXh0L19Db21iYXRUZXh0LmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvRGVjb3JhdGlvbi9DYXN0bGVGbG9vci5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0RlY29yYXRpb24vQ2FzdGxlRmxvb3IudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9EZWNvcmF0aW9uL0RlYWREdW1teS5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0RlY29yYXRpb24vRGVhZER1bW15LnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvRGVjb3JhdGlvbi9XYXRjaFRvd2VyLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvRGVjb3JhdGlvbi9XYXRjaFRvd2VyLnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvRGVjb3JhdGlvbi9fRGVjb3JhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0VuZW15L19FbmVteS5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0VuZW15L19FbmVteS50ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0VxdWlwbWVudC9CaW5vY3VsYXJzLmljb24udHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9FcXVpcG1lbnQvQmlub2N1bGFycy5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0VxdWlwbWVudC9CbGFzdGVyLmljb24udHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9FcXVpcG1lbnQvQmxhc3Rlci5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0VxdWlwbWVudC9CdWlsZGVyLmljb24udHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9FcXVpcG1lbnQvQnVpbGRlci5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0VxdWlwbWVudC9TY2FubmVyLmljb24udHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9FcXVpcG1lbnQvU2Nhbm5lci5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0dyYXZlc3RvbmUvX0dyYXZlc3RvbmUuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9HcmF2ZXN0b25lL19HcmF2ZXN0b25lLnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvSW50ZXJhY3RhYmxlL0NhckVudGVyLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvSW50ZXJhY3RhYmxlL0hlYWx0aFBpY2t1cC5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0ludGVyYWN0YWJsZS9IZWFsdGhQaWNrdXAudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9JbnRlcmFjdGFibGUvUGxheWVyVHlwZUNoYW5nZXIuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9JbnRlcmFjdGFibGUvUGxheWVyVHlwZUNoYW5nZXIudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9JbnRlcmFjdGFibGUvVGVsZXBvcnRlci5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL0ludGVyYWN0YWJsZS9UZWxlcG9ydGVyLnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvSW50ZXJhY3RhYmxlL19JbnRlcmFjdGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9QbGF5ZXIvRmlyZU1hZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9QbGF5ZXIvRmlyZU1hZ2UudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9QbGF5ZXIvR29kLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvUGxheWVyL0dvZC50ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1BsYXllci9IZWFsdGhCYXIudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9QbGF5ZXIvU3RhdHVzRWZmZWN0cy9JbnZ1bG5lcmFibGUudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9QbGF5ZXIvU3RhdHVzRWZmZWN0cy9TdHVubmVkLnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvUGxheWVyL19QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9QbGF5ZXIvX1BsYXllci50ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1ByZWZhYlV0aWxzLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvUHJlZmFicy5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1Byb2plY3RpbGUvRmlyZWJvbHRQcm9qZWN0aWxlLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvUHJvamVjdGlsZS9GaXJlYm9sdFByb2plY3RpbGUudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9Qcm9qZWN0aWxlL0ZsYW1lRGFzaFByb2plY3RpbGUuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9Qcm9qZWN0aWxlL0ZsYW1lRGFzaFByb2plY3RpbGUudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9Qcm9qZWN0aWxlL0ZsYW1lUGlsbGFyUHJvamVjdGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1Byb2plY3RpbGUvRmxhbWVQaWxsYXJQcm9qZWN0aWxlLnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvUHJvamVjdGlsZS9fUHJvamVjdGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1Byb2plY3RpbGUvX1Byb2plY3RpbGUudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9UZXJyYWluL0Nhc3RsZVdhbGxIb3Jpei5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1RlcnJhaW4vQ2FzdGxlV2FsbEhvcml6LnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvVGVycmFpbi9DYXN0bGVXYWxsVmVydC5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1RlcnJhaW4vQ2FzdGxlV2FsbFZlcnQudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9UZXJyYWluL1RyZWUuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9UZXJyYWluL1RyZWUudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9UZXJyYWluL1dhbGxIb3Jpei5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1RlcnJhaW4vV2FsbEhvcml6LnRlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL1ByZWZhYnMvVGVycmFpbi9fVGVycmFpbi5qcyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1RlcnJhaW4vX1RlcnJhaW4udGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9UcmlnZ2VyL0ludnVsblBsYXRmb3JtLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvVHJpZ2dlci9JbnZ1bG5QbGF0Zm9ybS50ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1RyaWdnZXIvU3Bpa2VUcmFwLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvVHJpZ2dlci9TcGlrZVRyYXAudGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9UcmlnZ2VyL19UcmlnZ2VyLmpzIiwid2VicGFjazovLy8uL1ByZWZhYnMvVmVoaWNsZS9DYXIuanMiLCJ3ZWJwYWNrOi8vLy4vUHJlZmFicy9WZWhpY2xlL0Nhci50ZW1wbGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9QcmVmYWJzL1ZlaGljbGUvX1ZlaGljbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xvdXZyZS9Mb3V2cmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BvcG92YS9Qb3BvdmEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNuRUEsSUFBSSxLQUFLLEdBQUcsbUJBQU8sQ0FBQyx1Q0FBZSxDQUFDLENBQUM7QUFFckMsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLHVDQUF1QztJQUN2QyxlQUFlLEVBQUUsVUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxRQUFRO1FBQ2pELElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4QixLQUFLLEVBQUUsSUFBSSxHQUFH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Q0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO2dCQUVySCxJQUFJLEdBQUcsR0FDSCxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO29CQUNsSCxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBRXZILElBQUksR0FBRyxJQUFJLEdBQUc7b0JBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0o7SUFDTCxDQUFDO0lBQ0QsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsVUFBVTtRQUMxQyx5R0FBeUc7UUFDekcsSUFBSSxTQUFTLEdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUosSUFBSSxRQUFRLEdBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUosSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFlBQVksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUosSUFBSSxRQUFRLEdBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFlBQVksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUosSUFBSSxTQUFTLEdBQUcsUUFBUSxJQUFJLFNBQVMsR0FBRyxNQUFNLElBQUksU0FBUyxHQUFHLFFBQVEsRUFBRTtZQUNwRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxRQUFRLEdBQUcsU0FBUyxJQUFJLFFBQVEsR0FBRyxNQUFNLElBQUksUUFBUSxHQUFHLFFBQVEsRUFBRTtZQUNsRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQzFDO1FBQ0QsSUFBSSxNQUFNLEdBQUcsU0FBUyxJQUFJLE1BQU0sR0FBRyxRQUFRLElBQUksTUFBTSxHQUFHLFFBQVEsRUFBRTtZQUM5RCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxRQUFRLEdBQUcsU0FBUyxJQUFJLFFBQVEsR0FBRyxRQUFRLElBQUksUUFBUSxHQUFHLE1BQU0sRUFBRTtZQUNsRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQzFDO0lBQ0wsQ0FBQztDQUNKO0FBRUQscUVBQXFFO0FBQ3JFLHNCQUFzQixLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUc7SUFDakMsT0FBTyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBRUQsK0JBQStCO0FBQy9CLGdDQUFnQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVU7SUFDbEQsSUFBSSxHQUFHLEdBQ0gsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ2xKLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNsSixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDOUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFFbkosSUFBSSxHQUFHLEdBQ0gsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ3JKLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNySixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsWUFBWSxHQUFHLENB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QVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQztRQUMzRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxhQUFhO1FBQzlCLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLGFBQWE7UUFDOUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1FBQ25CLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtRQUNyQixNQUFNLEVBQUUsQ0FBQztRQUNULE9BQU8sRUFBRTtZQUNMLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3BELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3BELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3BELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBRXJELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3BELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBRXBELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBRXJELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1NBQ3hEO1FBQ0QsZ0JBQWdCLEVBQUUsQ0FBQztLQUN0QjtBQUNMLENBQUM7Ozs7Ozs7Ozs7OztBQzVDRCxxQkFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSTtJQUNyQyxJQUFJLEtBQUssR0FBRyxtQkFBTyxDQUFDLDJDQUFtQixDQUFDLENBQUM7SUFFekMsT0FBTztRQUNILElBQUksRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVU7UUFDbEMsQ0FBQyxFQUFFLElBQUk7UUFDUCxDQUFDLEVBQUUsSUFBSTtRQUNQLE1BQU0sRUFBRSxVQUFD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Q0FBQyxNQUFNO2dCQUNyQixNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25DLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2dCQUNuQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUN6QixNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25DLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQyxFQUFFO2dCQUNDLEtBQUssRUFBRSxDQUFDO2dCQUNSLEtBQUssRUFBRSxDQUFDO2dCQUNSLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxDQUFDO2dCQUNULE1BQU0sRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkMsRUFBRTtnQkFDQyxLQUFLLEVBQUUsQ0FBQztnQkFDUixLQUFLLEVBQUUsQ0FBQztnQkFDUixLQUFLLEVBQUUsQ0FBQztnQkFDUixNQUFNLEVBQUUsQ0FBQztnQkFDVCxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25DLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxT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RCxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUN6RCxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUN6RCxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQzFELEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFDMUQsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUMxRCxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBRTFELEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFDekQsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxF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RSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3BELEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3RELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3BELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3BELEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO1lBQ3JELEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENB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O1FBQ1gsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3hCLGlFQUFpRTtLQUNwRTtJQUVELElBQUksS0FBSyxFQUFFO1FBQ1AsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxFQUFFLFVBQVUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDbEY7SUFFRCxtQ0FBbUM7SUFDbkMscUVBQTZCLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRWhGLDRCQUE0QjtJQUM1Qiw4REFBc0IsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFbkMsaUJBQWlCO0lBQ2pCLDREQUFvQixDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEgsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwidmFyIHR5cGVzID0gcmVxdWlyZShcIi4vT2JqZWN0VHlwZXNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8vIENoZWNrIGNvbGxpc2lvbnMgYmV0d2VlbiBhbGwgb2JqZWN0c1xuICAgIGNoZWNrQ29sbGlzaW9uczogKGNoZWNrU3JjLCBvYnMsIHJlbmRlclNpemUsIGNhbGxCYWNrKSA9PiB7XG4gICAgICAgIHZhciBzcmMgPSBvYnNbY2hlY2tTcmNdO1xuXG4gICAgICAgIGZvciAoaWQgaW4gb2JzKSB7XG4gICAgICAgICAgICB2YXIgY2hlY2sgPSBvYnNbaWRdO1xuICAgICAgICAgICAgdmFyIGNvbGxpc2lvbiA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2spIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHNyYy5oaXRib3hUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuSGl0Ym94VHlwZXMuUkVDVDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hlY2suaGl0Ym94VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuSGl0Ym94VHlwZXMuUkVDVDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uID0gY2hlY2tDb2xsaXNpb25SZWN0UmVjdChzcmMsIGNoZWNrLCByZW5kZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5IaXRib3hUeXBlcy5DSVJDOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb24gPSBjaGVja0NvbGxpc2lvbkNpcmNSZWN0KGNoZWNrLCBzcmMsIHJlbmRlclNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkhpdGJveFR5cGVzLkNJUkM6XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNoZWNrLmhpdGJveFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkhpdGJveFR5cGVzLlJFQ1Q6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvbiA9IGNoZWNrQ29sbGlzaW9uQ2lyY1JlY3Qoc3JjLCBjaGVjaywgcmVuZGVyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuSGl0Ym94VHlwZXMuQ0lSQzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uID0gY2hlY2tDb2xsaXNpb25DaXJjQ2lyYyhzcmMsIGNoZWNrLCByZW5kZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY29sbGlzaW9uKSBjYWxsQmFjayhjaGVja1NyYywgaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBDaGVjayBjb2xsaXNpb25zIGJldHdlZW4gYWxsIG9iamVjdHMgYnkgZGlzdGFuY2VcbiAgICBjaGVja0NvbGxpc2lvbnNCeURpc3RhbmNlOiAoY2hlY2tTcmMsIG9icywgbWF4RGlzdCwgY2FsbEJhY2spID0+IHtcbiAgICAgICAgdmFyIHNyYyA9IG9ic1tjaGVja1NyY107XG5cbiAgICAgICAgZm9yIChpZCBpbiBvYnMpIHtcbiAgICAgICAgICAgIHZhciBjaGVjayA9IG9ic1tpZF07XG5cbiAgICAgICAgICAgIGlmIChjaGVjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucG93KHNyYy54IC0gY2hlY2sueCwgMikgK1xuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhzcmMueSAtIGNoZWNrLnksIDIpKTtcblxuICAgICAgICAgICAgICAgIGlmIChkaXN0IDw9IG1heERpc3QpIGNhbGxCYWNrKGNoZWNrU3JjLCBpZCwgZGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIENoZWNrIGNvbGxpc2lvbnMgYmV0d2VlbiBjbGljayBsb2NhdGlvbiBhbmQgYWxsIG9iamVjdHNcbiAgICBjaGVja0NsaWNrQ29sbGlzaW9uczogKGNsaWNrWCwgY2xpY2tZLCBvYnMsIHJlbmRlclNpemUsIGNhbGxCYWNrKSA9PiB7XG4gICAgICAgIGZvciAoaWQgaW4gb2JzKSB7XG4gICAgICAgICAgICB2YXIgY2hlY2sgPSBvYnNbaWRdO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2spIHtcbiAgICAgICAgICAgICAgICB2YXIgeEluID0gXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlSW5SYW5nZShjbGlja1gsIGNoZWNrLnggLSBjaGVjay5oaXRib3hXaWR0aCAvIDIgKiByZW5kZXJTaXplLCBjaGVjay54ICsgY2hlY2suaGl0Ym94V2lkdGggLyAyICogcmVuZGVyU2l6ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVJblJhbmdlKGNsaWNrWCwgY2hlY2sueCAtIGNoZWNrLmhpdGJveFdpZHRoIC8gMiAqIHJlbmRlclNpemUsIGNoZWNrLnggKyBjaGVjay5oaXRib3hXaWR0aCAvIDIgKiByZW5kZXJTaXplKTtcblxuICAgICAgICAgICAgICAgIHZhciB5SW4gPVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZUluUmFuZ2UoY2xpY2tZLCBjaGVjay55IC0gY2hlY2suaGl0Ym94SGVpZ2h0IC8gMiAqIHJlbmRlclNpemUsIGNoZWNrLnkgKyBjaGVjay5oaXRib3hIZWlnaHQgLyAyICogcmVuZGVyU2l6ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVJblJhbmdlKGNsaWNrWSwgY2hlY2sueSAtIGNoZWNrLmhpdGJveEhlaWdodCAvIDIgKiByZW5kZXJTaXplLCBjaGVjay55ICsgY2hlY2suaGl0Ym94SGVpZ2h0IC8gMiAqIHJlbmRlclNpemUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHhJbiAmJiB5SW4pIGNhbGxCYWNrKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcHVzaEJhY2s6IChvYnMsIHNyY0lkLCBjb2xsaXNpb25JZCwgcmVuZGVyU2l6ZSkgPT4ge1xuICAgICAgICAvLyBQdXNoIG9iamVjdCBiYWNrIG91dCBvZiBjb2xsaXNpb24gdGVycmFpbiB0b3dhcmRzIHdoaWNoIGV2ZXIgc2lkZSBpcyB0aGUgY2xvc2VzdCB0byB0aGUgdGVycmFpbiBvYmplY3RcbiAgICAgICAgdmFyIGRpc3RSaWdodCAgID0gTWF0aC5hYnMoKG9ic1tjb2xsaXNpb25JZF0ueCAtIG9ic1tjb2xsaXNpb25JZF0uaGl0Ym94V2lkdGggKiByZW5kZXJTaXplIC8gMikgLSAob2JzW3NyY0lkXS54ICsgb2JzW3NyY0lkXS5oaXRib3hXaWR0aCAqIHJlbmRlclNpemUgLyAyKSk7XG4gICAgICAgIHZhciBkaXN0TGVmdCAgICA9IE1hdGguYWJzKChvYnNbY29sbGlzaW9uSWRdLnggKyBvYnNbY29sbGlzaW9uSWRdLmhpdGJveFdpZHRoICogcmVuZGVyU2l6ZSAvIDIpIC0gKG9ic1tzcmNJZF0ueCAtIG9ic1tzcmNJZF0uaGl0Ym94V2lkdGggKiByZW5kZXJTaXplIC8gMikpO1xuICAgICAgICB2YXIgZGlzdFVwICAgICAgPSBNYXRoLmFicygob2JzW2NvbGxpc2lvbklkXS55ICsgb2JzW2NvbGxpc2lvbklkXS5oaXRib3hIZWlnaHQgKiByZW5kZXJTaXplIC8gMikgLSAob2JzW3NyY0lkXS55IC0gb2JzW3NyY0lkXS5oaXRib3hIZWlnaHQgKiByZW5kZXJTaXplIC8gMikpO1xuICAgICAgICB2YXIgZGlzdERvd24gICAgPSBNYXRoLmFicygob2JzW2NvbGxpc2lvbklkXS55IC0gb2JzW2NvbGxpc2lvbklkXS5oaXRib3hIZWlnaHQgKiByZW5kZXJTaXplIC8gMikgLSAob2JzW3NyY0lkXS55ICsgb2JzW3NyY0lkXS5oaXRib3hIZWlnaHQgKiByZW5kZXJTaXplIC8gMikpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGRpc3RSaWdodCA8IGRpc3RMZWZ0ICYmIGRpc3RSaWdodCA8IGRpc3RVcCAmJiBkaXN0UmlnaHQgPCBkaXN0RG93bikge1xuICAgICAgICAgICAgb2JzW3NyY0lkXS54ID0gb2JzW3NyY0lkXS54IC0gZGlzdFJpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChkaXN0TGVmdCA8IGRpc3RSaWdodCAmJiBkaXN0TGVmdCA8IGRpc3RVcCAmJiBkaXN0TGVmdCA8IGRpc3REb3duKSB7XG4gICAgICAgICAgICBvYnNbc3JjSWRdLnggPSBvYnNbc3JjSWRdLnggKyBkaXN0TGVmdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlzdFVwIDwgZGlzdFJpZ2h0ICYmIGRpc3RVcCA8IGRpc3RMZWZ0ICYmIGRpc3RVcCA8IGRpc3REb3duKSB7XG4gICAgICAgICAgICBvYnNbc3JjSWRdLnkgPSBvYnNbc3JjSWRdLnkgKyBkaXN0VXA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpc3REb3duIDwgZGlzdFJpZ2h0ICYmIGRpc3REb3duIDwgZGlzdExlZnQgJiYgZGlzdERvd24gPCBkaXN0VXApIHtcbiAgICAgICAgICAgIG9ic1tzcmNJZF0ueSA9IG9ic1tzcmNJZF0ueSAtIGRpc3REb3duO1xuICAgICAgICB9XG4gICAgfSxcbn1cblxuLy8gQ29sbGlzaW9uIGRldGVjdGlvbiBoZWxwZXIsIGNoZWNrcyBpZiB2YWx1ZSBpcyBiZXR3ZWVuIG1pbiBhbmQgbWF4XG5mdW5jdGlvbiB2YWx1ZUluUmFuZ2UodmFsdWUsIG1pbiwgbWF4KSB7IFxuICAgIHJldHVybiAodmFsdWUgPj0gbWluKSAmJiAodmFsdWUgPD0gbWF4KTsgXG59XG5cbi8vIENoZWNrIGNvbGxpc2lvbjogcmVjdCAtIHJlY3RcbmZ1bmN0aW9uIGNoZWNrQ29sbGlzaW9uUmVjdFJlY3Qoc3JjLCBjaGVjaywgcmVuZGVyU2l6ZSkge1xuICAgIHZhciB4SW4gPSBcbiAgICAgICAgdmFsdWVJblJhbmdlKHNyYy54IC0gc3JjLmhpdGJveFdpZHRoIC8gMiAqIHJlbmRlclNpemUsIGNoZWNrLnggLSBjaGVjay5oaXRib3hXaWR0aCAvIDIgKiByZW5kZXJTaXplLCBjaGVjay54ICsgY2hlY2suaGl0Ym94V2lkdGggLyAyICogcmVuZGVyU2l6ZSkgfHxcbiAgICAgICAgdmFsdWVJblJhbmdlKHNyYy54ICsgc3JjLmhpdGJveFdpZHRoIC8gMiAqIHJlbmRlclNpemUsIGNoZWNrLnggLSBjaGVjay5oaXRib3hXaWR0aCAvIDIgKiByZW5kZXJTaXplLCBjaGVjay54ICsgY2hlY2suaGl0Ym94V2lkdGggLyAyICogcmVuZGVyU2l6ZSkgfHxcbiAgICAgICAgdmFsdWVJblJhbmdlKGNoZWNrLnggLSBjaGVjay5oaXRib3hXaWR0aCAvIDIgKiByZW5kZXJTaXplLCBzcmMueCAtIHNyYy5oaXRib3hXaWR0aCAvIDIgKiByZW5kZXJTaXplLCBzcmMueCArIHNyYy5oaXRib3hXaWR0aCAvIDIgKiByZW5kZXJTaXplKSB8fFxuICAgICAgICB2YWx1ZUluUmFuZ2UoY2hlY2sueCArIGNoZWNrLmhpdGJveFdpZHRoIC8gMiAqIHJlbmRlclNpemUsIHNyYy54IC0gc3JjLmhpdGJveFdpZHRoIC8gMiAqIHJlbmRlclNpemUsIHNyYy54ICsgc3JjLmhpdGJveFdpZHRoIC8gMiAqIHJlbmRlclNpemUpO1xuXG4gICAgdmFyIHlJbiA9XG4gICAgICAgIHZhbHVlSW5SYW5nZShzcmMueSAtIHNyYy5oaXRib3hIZWlnaHQgLyAyICogcmVuZGVyU2l6ZSwgY2hlY2sueSAtIGNoZWNrLmhpdGJveEhlaWdodCAvIDIgKiByZW5kZXJTaXplLCBjaGVjay55ICsgY2hlY2suaGl0Ym94SGVpZ2h0IC8gMiAqIHJlbmRlclNpemUpIHx8XG4gICAgICAgIHZhbHVlSW5SYW5nZShzcmMueSArIHNyYy5oaXRib3hIZWlnaHQgLyAyICogcmVuZGVyU2l6ZSwgY2hlY2sueSAtIGNoZWNrLmhpdGJveEhlaWdodCAvIDIgKiByZW5kZXJTaXplLCBjaGVjay55ICsgY2hlY2suaGl0Ym94SGVpZ2h0IC8gMiAqIHJlbmRlclNpemUpIHx8XG4gICAgICAgIHZhbHVlSW5SYW5nZShjaGVjay55IC0gY2hlY2suaGl0Ym94SGVpZ2h0IC8gMiAqIHJlbmRlclNpemUsIHNyYy55IC0gc3JjLmhpdGJveEhlaWdodCAvIDIgKiByZW5kZXJTaXplLCBzcmMueSArIHNyYy5oaXRib3hIZWlnaHQgLyAyICogcmVuZGVyU2l6ZSkgfHxcbiAgICAgICAgdmFsdWVJblJhbmdlKGNoZWNrLnkgKyBjaGVjay5oaXRib3hIZWlnaHQgLyAyICogcmVuZGVyU2l6ZSwgc3JjLnkgLSBzcmMuaGl0Ym94SGVpZ2h0IC8gMiAqIHJlbmRlclNpemUsIHNyYy55ICsgc3JjLmhpdGJveEhlaWdodCAvIDIgKiByZW5kZXJTaXplKTtcblxuICAgIHJldHVybiB4SW4gJiYgeUluO1xufVxuXG4vLyBDaGVjayBjb2xsaXNpb246IGNpcmMgLSByZWN0XG5mdW5jdGlvbiBjaGVja0NvbGxpc2lvbkNpcmNSZWN0KHNyYywgY2hlY2ssIHJlbmRlclNpemUpIHtcbiAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKFxuICAgICAgICBzcmMueSAtIGNoZWNrLnksXG4gICAgICAgIHNyYy54IC0gY2hlY2sueCk7XG5cbiAgICB2YXIgd2lkdGggPSBNYXRoLmFicyhNYXRoLmNvcyhhbmdsZSkgKiBzcmMuaGl0Ym94UmFkaXVzICogMik7XG4gICAgdmFyIGhlaWdodCA9IE1hdGguYWJzKE1hdGguc2luKGFuZ2xlKSAqIHNyYy5oaXRib3hSYWRpdXMgKiAyKTtcblxuICAgIHJldHVybiBjaGVja0NvbGxpc2lvblJlY3RSZWN0KFxuICAgICAgICB7IHg6IHNyYy54LCB5OiBzcmMueSwgaGl0Ym94V2lkdGg6IHdpZHRoLCBoaXRib3hIZWlnaHQ6IGhlaWdodCB9LFxuICAgICAgICBjaGVjayxcbiAgICAgICAgcmVuZGVyU2l6ZVxuICAgICk7XG59XG5cbi8vIENoZWNrIGNvbGxpc2lvbjogY2lyYyAtIGNpcmNcbmZ1bmN0aW9uIGNoZWNrQ29sbGlzaW9uQ2lyY0NpcmMoc3JjLCBjaGVjaywgcmVuZGVyU2l6ZSkge1xuICAgIHZhciBhbmdsZSA9IE1hdGguYXRhbjIoXG4gICAgICAgIHNyYy55IC0gY2hlY2sueSxcbiAgICAgICAgc3JjLnggLSBjaGVjay54KTtcblxuICAgIHZhciB3aWR0aCA9IE1hdGguYWJzKE1hdGguY29zKGFuZ2xlKSAqIHNyYy5oaXRib3hSYWRpdXMgKiAyKTtcbiAgICB2YXIgaGVpZ2h0ID0gTWF0aC5hYnMoTWF0aC5zaW4oYW5nbGUpICogc3JjLmhpdGJveFJhZGl1cyAqIDIpO1xuXG4gICAgcmV0dXJuIGNoZWNrQ29sbGlzaW9uQ2lyY1JlY3QoXG4gICAgICAgIGNoZWNrLFxuICAgICAgICB7IHg6IHNyYy54LCB5OiBzcmMueSwgaGl0Ym94V2lkdGg6IHdpZHRoLCBoaXRib3hIZWlnaHQ6IGhlaWdodCB9LFxuICAgICAgICByZW5kZXJTaXplXG4gICAgKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIE9iamVjdFR5cGVzOiB7XG4gICAgICAgIFBMQVlFUjogXCJwbGF5ZXJcIixcbiAgICAgICAgR1JBVkVTVE9ORTogXCJncmF2ZXN0b25lXCIsXG4gICAgICAgIFBST0pFQ1RJTEU6IFwicHJvamVjdGlsZVwiLFxuICAgICAgICBURVJSQUlOOiBcInRlcnJhaW5cIixcbiAgICAgICAgSU5URVJBQ1RBQkxFOiBcImludGVyYWN0YWJsZVwiLFxuICAgICAgICBUUklHR0VSOiBcInRyaWdnZXJcIixcbiAgICAgICAgVkVISUNMRTogXCJ2ZWhpY2xlXCIsXG4gICAgICAgIENPTUJBVF9URVhUOiBcImNvbWJhdC10ZXh0XCIsXG4gICAgICAgIEVORU1ZOiBcImVuZW15XCIsXG4gICAgICAgIERFQ09SQVRJT046IFwiZGVjb3JhdGlvblwiLFxuICAgIH0sXG4gICAgUGxheWVyOiB7XG4gICAgICAgIEhVTUFOOiBcImh1bWFuXCIsXG4gICAgICAgIEdPRDogXCJnb2RcIixcbiAgICAgICAgRklSRV9NQUdFOiBcImZpcmUtbWFnZVwiLFxuICAgIH0sXG4gICAgUHJvamVjdGlsZToge1xuICAgICAgICBCQVNJQ19QUk9KRUNUSUxFOiBcImJhc2ljLXByb2plY3RpbGVcIixcbiAgICAgICAgRklSRUJPTFRfUFJPSkVDVElMRTogXCJmaXJlYm9sdC1wcm9qZWN0aWxlXCIsXG4gICAgICAgIEZMQU1FX1BJTExBUl9QUk9KRUNUSUxFOiBcImZsYW1lLXBpbGxhci1wcm9qZWN0aWxlXCIsXG4gICAgICAgIEZMQU1FX0RBU0hfUFJPSkVDVElMRTogXCJmbGFtZS1kYXNoLXByb2plY3RpbGVcIixcbiAgICB9LFxuICAgIFRlcnJhaW46IHtcbiAgICAgICAgVFJFRTogXCJ0cmVlXCIsXG4gICAgICAgIFdBTExfSE9SSVo6IFwid2FsbC1ob3JpelwiLFxuICAgICAgICBDQVNUTEVfV0FMTF9IT1JJWjogXCJjYXN0bGUtd2FsbC1ob3JpelwiLFxuICAgICAgICBDQVNUTEVfV0FMTF9WRVJUOiBcImNhc3RsZS13YWxsLXZlcnRcIixcbiAgICB9LFxuICAgIEludGVyYWN0YWJsZToge1xuICAgICAgICBIRUFMVEhfUElDS1VQOiBcImhlYWx0aC1waWNrdXBcIixcbiAgICAgICAgQ0FSX0VOVEVSOiBcImNhci1lbnRlclwiLFxuICAgICAgICBQTEFZRVJfVFlQRV9DSEFOR0VSOiBcInBsYXllci10eXBlLWNoYW5nZXJcIixcbiAgICAgICAgVEVMRVBPUlRFUjogXCJ0ZWxlcG9ydGVyXCIsXG4gICAgfSxcbiAgICBUcmlnZ2VyOiB7XG4gICAgICAgIFNQSUtFX1RSQVA6IFwic3Bpa2UtdHJhcFwiLFxuICAgICAgICBJTlZVTE5fUExBVEZPUk06IFwiaW52dWxuLXBsYXRmb3JtXCIsXG4gICAgfSxcbiAgICBWZWhpY2xlOiB7XG4gICAgICAgIENBUjogXCJjYXJcIixcbiAgICB9LFxuICAgIEVuZW15OiB7XG4gICAgICAgIFRBUkdFVF9EVU1NWTogXCJ0YXJnZXQtZHVtbXlcIixcbiAgICB9LFxuICAgIERlY29yYXRpb246IHtcbiAgICAgICAgREVBRF9EVU1NWTogXCJkZWFkLWR1bW15XCIsXG4gICAgICAgIFdBVENIX1RPV0VSOiBcIndhdGNoLXRvd2VyXCIsXG4gICAgICAgIENBU1RMRV9GTE9PUjogXCJjYXN0bGUtZmxvb3JcIixcbiAgICB9LFxuICAgIEVxdWlwbWVudFR5cGVzOiB7XG4gICAgICAgIEJMQVNURVI6IFwiYmxhc3RlclwiLFxuICAgICAgICBTQ0FOTkVSOiBcInNjYW5uZXJcIixcbiAgICAgICAgQlVJTERFUjogXCJidWlsZGVyXCIsXG4gICAgICAgIEJJTk9DVUxBUlM6IFwiYmlub2N1bGFyc1wiLFxuICAgIH0sXG4gICAgQWJpbGl0aWVzOiB7XG4gICAgICAgIEZJUkVCT0xUOiBcImZpcmVib2x0XCIsXG4gICAgICAgIEZMQU1FX1BJTExBUjogXCJmbGFtZS1waWxsYXJcIixcbiAgICAgICAgRkxBTUVfREFTSDogXCJmbGFtZS1kYXNoXCIsXG4gICAgICAgIEZMQU1FX0JBUlJJRVI6IFwiZmxhbWUtYmFycmllclwiLFxuICAgIH0sXG4gICAgU3RhdHVzRWZmZWN0czoge1xuICAgICAgICBTVFVOTkVEOiBcInN0dW5uZWRcIixcbiAgICAgICAgSU5WVUxORVJBQkxFOiBcImludnVsbmVyYWJsZVwiLFxuICAgIH0sXG4gICAgQ29tYmF0VGV4dDoge1xuICAgICAgICBEQU1BR0VfVEVYVDogXCJkYW1hZ2UtdGV4dFwiLFxuICAgICAgICBGSVJFX0RBTUFHRV9URVhUOiBcImZpcmUtZGFtYWdlLXRleHRcIixcbiAgICAgICAgSU5WVUxORVJBQkxFX1RFWFQ6IFwiaW52dWxuZXJhYmxlLXRleHRcIixcbiAgICAgICAgSEVBTF9URVhUOiBcImhlYWwtdGV4dFwiLFxuICAgIH0sXG4gICAgSGl0Ym94VHlwZXM6IHtcbiAgICAgICAgTk9ORTogXCJub25lXCIsXG4gICAgICAgIFJFQ1Q6IFwicmVjdFwiLFxuICAgICAgICBDSVJDOiBcImNpcmNcIixcbiAgICB9LFxuICAgIERhbWFnZVR5cGVzOiB7XG4gICAgICAgIE5PUk1BTDogXCJub3JtYWwtZGFtYWdlXCIsXG4gICAgICAgIEZJUkU6IFwiZmlyZS1kYW1hZ2VcIixcbiAgICB9LFxufSIsInZhciBmaXJlYm9sdENvb2xkb3duID0gNjAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLkFiaWxpdGllcy5GSVJFQk9MVCxcbiAgICAgICAgY29vbGRvd246IGZpcmVib2x0Q29vbGRvd24sXG4gICAgICAgIGxhc3RjYXN0OiB1bmRlZmluZWQsXG4gICAgICAgIGNhc3Q6IChvYnMsIHNvdXJjZUlkLCBhYmlsaXR5SW5kZXgsIHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmICghb2JzW3NvdXJjZUlkXS5hYmlsaXRpZXNbYWJpbGl0eUluZGV4XS5sYXN0Y2FzdFxuICAgICAgICAgICAgICAgIHx8IG5ld1RpbWUgLSBvYnNbc291cmNlSWRdLmFiaWxpdGllc1thYmlsaXR5SW5kZXhdLmxhc3RjYXN0ID49IG9ic1tzb3VyY2VJZF0uYWJpbGl0aWVzW2FiaWxpdHlJbmRleF0uY29vbGRvd24pIHtcbiAgICAgICAgICAgICAgICBvYnNbc291cmNlSWRdLmFiaWxpdGllc1thYmlsaXR5SW5kZXhdLmxhc3RjYXN0ID0gbmV3VGltZTtcbiAgICAgICAgICAgICAgICBwcmVmYWJzLmdlbmVyYXRlTmV3KG9icywgc291cmNlSWQsIHRhcmdldFgsIHRhcmdldFksIHR5cGVzLk9iamVjdFR5cGVzLlBST0pFQ1RJTEUsIHR5cGVzLlByb2plY3RpbGUuRklSRUJPTFRfUFJPSkVDVElMRSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwidmFyIGZsYW1lQmFycmllckNvb2xkb3duID0gODAwMDtcbnZhciBmbGFtZUJhcnJpZXJJbnZ1bG5EdXJhdGlvbiA9IDUwMDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4uL1ByZWZhYnNcIik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiB0eXBlcy5BYmlsaXRpZXMuRkxBTUVfQkFSUklFUixcbiAgICAgICAgY29vbGRvd246IGZsYW1lQmFycmllckNvb2xkb3duLFxuICAgICAgICBsYXN0Y2FzdDogdW5kZWZpbmVkLFxuICAgICAgICBjYXN0OiAob2JzLCBzb3VyY2VJZCwgYWJpbGl0eUluZGV4LCB0YXJnZXRYLCB0YXJnZXRZKSA9PiB7XG4gICAgICAgICAgICB2YXIgbmV3VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAoIW9ic1tzb3VyY2VJZF0uYWJpbGl0aWVzW2FiaWxpdHlJbmRleF0ubGFzdGNhc3RcbiAgICAgICAgICAgICAgICB8fCBuZXdUaW1lIC0gb2JzW3NvdXJjZUlkXS5hYmlsaXRpZXNbYWJpbGl0eUluZGV4XS5sYXN0Y2FzdCA+PSBvYnNbc291cmNlSWRdLmFiaWxpdGllc1thYmlsaXR5SW5kZXhdLmNvb2xkb3duKSB7XG4gICAgICAgICAgICAgICAgb2JzW3NvdXJjZUlkXS5hYmlsaXRpZXNbYWJpbGl0eUluZGV4XS5sYXN0Y2FzdCA9IG5ld1RpbWU7XG4gICAgICAgICAgICAgICAgb2JzW3NvdXJjZUlkXS5hZGRTdGF0dXNFZmZlY3Qob2JzLCBzb3VyY2VJZCwgdHlwZXMuU3RhdHVzRWZmZWN0cy5JTlZVTE5FUkFCTEUsIGZsYW1lQmFycmllckludnVsbkR1cmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJ2YXIgZmxhbWVEYXNoQ29vbGRvd24gPSA1MDAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLkFiaWxpdGllcy5GTEFNRV9EQVNILFxuICAgICAgICBjb29sZG93bjogZmxhbWVEYXNoQ29vbGRvd24sXG4gICAgICAgIGxhc3RjYXN0OiB1bmRlZmluZWQsXG4gICAgICAgIGNhc3Q6IChvYnMsIHNvdXJjZUlkLCBhYmlsaXR5SW5kZXgsIHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmICghb2JzW3NvdXJjZUlkXS5hYmlsaXRpZXNbYWJpbGl0eUluZGV4XS5sYXN0Y2FzdFxuICAgICAgICAgICAgICAgIHx8IG5ld1RpbWUgLSBvYnNbc291cmNlSWRdLmFiaWxpdGllc1thYmlsaXR5SW5kZXhdLmxhc3RjYXN0ID49IG9ic1tzb3VyY2VJZF0uYWJpbGl0aWVzW2FiaWxpdHlJbmRleF0uY29vbGRvd24pIHtcbiAgICAgICAgICAgICAgICBvYnNbc291cmNlSWRdLnggPSB0YXJnZXRYO1xuICAgICAgICAgICAgICAgIG9ic1tzb3VyY2VJZF0ueSA9IHRhcmdldFk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb2JzW3NvdXJjZUlkXS5hYmlsaXRpZXNbYWJpbGl0eUluZGV4XS5sYXN0Y2FzdCA9IG5ld1RpbWU7XG4gICAgICAgICAgICAgICAgcHJlZmFicy5nZW5lcmF0ZU5ldyhvYnMsIHNvdXJjZUlkLCB0YXJnZXRYLCB0YXJnZXRZLCB0eXBlcy5PYmplY3RUeXBlcy5QUk9KRUNUSUxFLCB0eXBlcy5Qcm9qZWN0aWxlLkZMQU1FX0RBU0hfUFJPSkVDVElMRSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwidmFyIGZsYW1lUGlsbGFyQ29vbGRvd24gPSAzMDAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLkFiaWxpdGllcy5GTEFNRV9QSUxMQVIsXG4gICAgICAgIGNvb2xkb3duOiBmbGFtZVBpbGxhckNvb2xkb3duLFxuICAgICAgICBsYXN0Y2FzdDogdW5kZWZpbmVkLFxuICAgICAgICBjYXN0OiAob2JzLCBzb3VyY2VJZCwgYWJpbGl0eUluZGV4LCB0YXJnZXRYLCB0YXJnZXRZKSA9PiB7XG4gICAgICAgICAgICB2YXIgbmV3VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAoIW9ic1tzb3VyY2VJZF0uYWJpbGl0aWVzW2FiaWxpdHlJbmRleF0ubGFzdGNhc3RcbiAgICAgICAgICAgICAgICB8fCBuZXdUaW1lIC0gb2JzW3NvdXJjZUlkXS5hYmlsaXRpZXNbYWJpbGl0eUluZGV4XS5sYXN0Y2FzdCA+PSBvYnNbc291cmNlSWRdLmFiaWxpdGllc1thYmlsaXR5SW5kZXhdLmNvb2xkb3duKSB7XG4gICAgICAgICAgICAgICAgb2JzW3NvdXJjZUlkXS5hYmlsaXRpZXNbYWJpbGl0eUluZGV4XS5sYXN0Y2FzdCA9IG5ld1RpbWU7XG4gICAgICAgICAgICAgICAgcHJlZmFicy5nZW5lcmF0ZU5ldyhvYnMsIHNvdXJjZUlkLCB0YXJnZXRYLCB0YXJnZXRZLCB0eXBlcy5PYmplY3RUeXBlcy5QUk9KRUNUSUxFLCB0eXBlcy5Qcm9qZWN0aWxlLkZMQU1FX1BJTExBUl9QUk9KRUNUSUxFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJ2YXIgZGFtYWdlVGV4dENvbG9yID0gXCIjNTU1NTU1RkZcIjtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuQ29tYmF0VGV4dC5EQU1BR0VfVEVYVCxcbiAgICAgICAgY29sb3I6IGRhbWFnZVRleHRDb2xvcixcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsInZhciBmaXJlRGFtYWdlVGV4dENvbG9yID0gXCIjRkYwMDAwRkZcIjtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuQ29tYmF0VGV4dC5GSVJFX0RBTUFHRV9URVhULFxuICAgICAgICBjb2xvcjogZmlyZURhbWFnZVRleHRDb2xvcixcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsInZhciBoZWFsVGV4dENvbG9yID0gXCIjMDBDQzAwRkZcIjtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuQ29tYmF0VGV4dC5IRUFMX1RFWFQsXG4gICAgICAgIGNvbG9yOiBoZWFsVGV4dENvbG9yLFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwidmFyIGludnVsbmVyYWJsZVRleHRDb2xvciA9IFwiI0FBQUEwMDg4XCI7ICAgIC8vIFRPRE86IE1vcmUgdmlzaWJsZSBjb2xvci4uLlxuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlLFxuICAgICAgICBzdWJ0eXBlOiB0eXBlcy5Db21iYXRUZXh0LklOVlVMTkVSQUJMRV9URVhULFxuICAgICAgICBjb2xvcjogaW52dWxuZXJhYmxlVGV4dENvbG9yLFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwidmFyIGNvbWJhdFRleHRBbmltYXRpb25TcGVlZCA9IDAuMDU7XG52YXIgY29tYmF0VGV4dEZvbnRTaXplID0gOTtcbnZhciBjb21iYXRUZXh0Q29sb3IgPSBcIiMwMDAwMDBGRlwiO1xudmFyIGNvbWJhdFRleHREdXJhdGlvbiA9IDMwMDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIHBhcmFtcykge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcblxuICAgIGNvbnN0IHggPSBvYnNbc3JjXSA/IG9ic1tzcmNdLnggKyAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiBvYnNbc3JjXS53aWR0aCAqIDQ6IHBvc1g7XG4gICAgY29uc3QgeSA9IG9ic1tzcmNdID8gb2JzW3NyY10ueSAtIE1hdGgucmFuZG9tKCkgKiBvYnNbc3JjXS5oZWlnaHQgKiAzIC0gb2JzW3NyY10uaGVpZ2h0ICogMyA6IHBvc1k7XG4gICAgY29uc3QgYW5nbGUgPSBvYnNbc3JjXSA/IE1hdGguYXRhbjIoeSAtIG9ic1tzcmNdLnksIHggLSBvYnNbc3JjXS54KSA6IDA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiB0eXBlcy5PYmplY3RUeXBlcy5DT01CQVRfVEVYVCxcbiAgICAgICAgeDogeCxcbiAgICAgICAgeTogeSxcbiAgICAgICAgYW5nbGU6IGFuZ2xlLFxuICAgICAgICB0ZXh0OiBwYXJhbXMudGV4dCxcbiAgICAgICAgc2l6ZTogY29tYmF0VGV4dEZvbnRTaXplLFxuICAgICAgICBjb2xvcjogY29tYmF0VGV4dENvbG9yLFxuICAgICAgICBmYWNpbmc6IGFuZ2xlICogMTgwIC8gTWF0aC5QSSArIDkwLFxuICAgICAgICBpbml0VGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgZHVyYXRpb246IGNvbWJhdFRleHREdXJhdGlvbixcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuTk9ORSxcbiAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IGNvbWJhdFRleHRBbmltYXRpb25TcGVlZCxcbiAgICAgICAgdXBkYXRlOiAob2JzLCBzZWxmSWQsIGRlbHRhKSA9PiB7XG4gICAgICAgICAgICBvYnNbc2VsZklkXS52ZWxvY2l0eVggPSBNYXRoLmNvcyhhbmdsZSkgKiBvYnNbc2VsZklkXS5hbmltYXRpb25TcGVlZDtcbiAgICAgICAgICAgIG9ic1tzZWxmSWRdLnZlbG9jaXR5WSA9IE1hdGguc2luKGFuZ2xlKSAqIG9ic1tzZWxmSWRdLmFuaW1hdGlvblNwZWVkO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGNvbnN0IGxpZmVUaW1lID0gbmV3VGltZSAtIG9ic1tzZWxmSWRdLmluaXRUaW1lO1xuXG4gICAgICAgICAgICBvYnNbc2VsZklkXS54ICs9IG9ic1tzZWxmSWRdLnZlbG9jaXR5WCAqIGRlbHRhO1xuICAgICAgICAgICAgb2JzW3NlbGZJZF0ueSArPSBvYnNbc2VsZklkXS52ZWxvY2l0eVkgKiBkZWx0YTtcblxuICAgICAgICAgICAgdmFyIG5ld09wYWNpdHkgPSBNYXRoLm1heCgoMSAtIGxpZmVUaW1lIC8gb2JzW3NlbGZJZF0uZHVyYXRpb24pICogMjU1LCAwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDAsIDIpLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xuICAgICAgICAgICAgaWYgKG5ld09wYWNpdHkubGVuZ3RoIDw9IDEpIG5ld09wYWNpdHkgPSBcIjBcIiArIG5ld09wYWNpdHk7XG4gICAgICAgICAgICBvYnNbc2VsZklkXS5jb2xvciA9IG9ic1tzZWxmSWRdLmNvbG9yLnN1YnN0cmluZygwLCA3KSArIG5ld09wYWNpdHk7XG5cbiAgICAgICAgICAgIGlmIChvYnNbc2VsZklkXSAmJiBsaWZlVGltZSA+PSBvYnNbc2VsZklkXS5kdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYnNbc2VsZklkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJ2YXIgY2FzdGxlRmxvb3JXaWR0aCA9IDIwMDtcbnZhciBjYXN0bGVGbG9vckhlaWdodCA9IDIxMDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlLFxuICAgICAgICBzdWJ0eXBlOiB0eXBlcy5EZWNvcmF0aW9uLkNBU1RMRV9GTE9PUixcbiAgICAgICAgd2lkdGg6IGNhc3RsZUZsb29yV2lkdGgsXG4gICAgICAgIGhlaWdodDogY2FzdGxlRmxvb3JIZWlnaHQsXG4gICAgICAgIGhpdGJveFR5cGU6IHR5cGVzLkhpdGJveFR5cGVzLlJFQ1QsXG4gICAgICAgIGhpdGJveFdpZHRoOiBjYXN0bGVGbG9vcldpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IGNhc3RsZUZsb29ySGVpZ2h0LFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgY2FzdGxlIGZsb29yIG9iamVjdFxuICogQHBhcmFtIG9iamVjdCBUaGUgY2FzdGxlIGZsb29yIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXN0bGVGbG9vck1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjQjZCNkI2XCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIHN0cm9rZXM6IFtcbiAgICAgICAgICAgIHsgY2VsbFg6IDAsIGNlbGxZOiAwLCB3aWR0aDogb2JqZWN0LndpZHRoLCBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsIHN3YXRjaDogMCB9LFxuICAgICAgICBdLFxuICAgIH1cbn1cbiIsInZhciBkZWFkRHVtbXlXaWR0aCA9IDQ7XG52YXIgZGVhZER1bW15SGVpZ2h0ID0gMjtcbnZhciBkZWFkRHVtbXlIaXRib3hXaWR0aCA9IDQ7XG52YXIgZGVhZER1bW15SGl0Ym94SGVpZ2h0ID0gMjtcbnZhciBkZWFkRHVtbXlIZWFsdGggPSAxMDAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLkRlY29yYXRpb24uREVBRF9EVU1NWSxcbiAgICAgICAgd2lkdGg6IGRlYWREdW1teVdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGRlYWREdW1teUhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGRlYWREdW1teUhpdGJveFdpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IGRlYWREdW1teUhpdGJveEhlaWdodCxcbiAgICAgICAgaGVhbHRoOiBkZWFkRHVtbXlIZWFsdGgsXG4gICAgICAgIG1heEhlYWx0aDogZGVhZER1bW15SGVhbHRoLFxuICAgICAgICB1cGRhdGU6IChvYnMsIHNlbGZJZCwgZGVsdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChvYnNbc2VsZklkXSkge1xuICAgICAgICAgICAgICAgIG9ic1tzZWxmSWRdLmhlYWx0aCAtPSBkZWFkRHVtbXlIZWFsdGggLyBkZWx0YSAvIDg7XG4gICAgICAgICAgICAgICAgaWYgKG9ic1tzZWxmSWRdLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic1tzZWxmSWRdLmRlYXRocmF0dGxlKG9icywgc2VsZklkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRlYXRocmF0dGxlOiAob2JzLCBzZWxmSWQpID0+IHtcbiAgICAgICAgICAgIGlmIChvYnNbc2VsZklkXSkge1xuICAgICAgICAgICAgICAgIHByZWZhYnMuZ2VuZXJhdGVOZXcob2JzLCBzZWxmSWQsIG9ic1tzZWxmSWRdLngsIG9ic1tzZWxmSWRdLnkgLSBvYnNbc2VsZklkXS5oZWlnaHQgKiBwcmVmYWJzLnJlbmRlclNpemUsIHR5cGVzLk9iamVjdFR5cGVzLkVORU1ZLCB0eXBlcy5FbmVteS5UQVJHRVRfRFVNTVkpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYnNbc2VsZklkXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIGRlYWQgZHVtbXkgb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSBkZWFkIGR1bW15IG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWFkRHVtbXlNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiI0E1MkEyQVwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiAwLFxuICAgICAgICBzdHJva2VzOiBbXG4gICAgICAgICAgICB7Y2VsbFg6IDMsIGNlbGxZOiAwLCB3aWR0aDogMiwgaGVpZ2h0OiA0LCBzd2F0Y2g6IDB9LFxuICAgICAgICBdLFxuICAgICAgICBjdXN0b21SZW5kZXJTaXplOiAyLFxuICAgIH1cbn1cbiIsInZhciB3YXRjaFRvd2VyV2lkdGggPSAxNi41O1xudmFyIHdhdGNoVG93ZXJIZWlnaHQgPSA1OC41O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLkRlY29yYXRpb24uV0FUQ0hfVE9XRVIsXG4gICAgICAgIHdpZHRoOiB3YXRjaFRvd2VyV2lkdGgsXG4gICAgICAgIGhlaWdodDogd2F0Y2hUb3dlckhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IHdhdGNoVG93ZXJXaWR0aCxcbiAgICAgICAgaGl0Ym94SGVpZ2h0OiB3YXRjaFRvd2VySGVpZ2h0LFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3Igd2F0Y2ggdG93ZXIgb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSB3YXRjaCB0b3dlciBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2hUb3dlck1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICAvLyAgICAgICAgICBQcmltYXJ5LCBTZWNvbmRhcnksIEJhbm5lciwgICAgV29vZCBkYXJrLCBXb29kIGxpZ2h0LCBGbGFnXG4gICAgICAgIHBhbGV0dGU6IFtcIiMyMjIyMjJcIiwgXCIjMzMzMzMzXCIsIFwiI0ZBRjBFNlwiLCBcIiM2NjMyMEVcIiwgXCIjN0YzRjEyXCIsIFwiIzY2MzM5OVwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiAwLFxuICAgICAgICBzdHJva2VzOiBbXG4gICAgICAgICAgICB7Y2VsbFg6IDUsIGNlbGxZOiAwLCB3aWR0aDogMSwgaGVpZ2h0OiA2LCBzd2F0Y2g6IDN9LFxuICAgICAgICAgICAge2NlbGxYOiA2LCBjZWxsWTogMCwgd2lkdGg6IDMsIGhlaWdodDogMiwgc3dhdGNoOiA1fSxcbiAgICAgICAgICAgIHtjZWxsWDogMSwgY2VsbFk6IDYsIHdpZHRoOiA5LCBoZWlnaHQ6IDIsIHN3YXRjaDogMH0sXG4gICAgICAgICAgICB7Y2VsbFg6IDAsIGNlbGxZOiA4LCB3aWR0aDogMTEsIGhlaWdodDogMSwgc3dhdGNoOiAxfSxcblxuICAgICAgICAgICAge2NlbGxYOiAzLCBjZWxsWTogMTQsIHdpZHRoOiAxLCBoZWlnaHQ6IDEsIHN3YXRjaDogM30sXG4gICAgICAgICAgICB7Y2VsbFg6IDcsIGNlbGxZOiAxNCwgd2lkdGg6IDEsIGhlaWdodDogMSwgc3dhdGNoOiAzfSxcbiAgICAgICAgICAgIHtjZWxsWDogMSwgY2VsbFk6IDEzLCB3aWR0aDogOSwgaGVpZ2h0OiAxLCBzd2F0Y2g6IDR9LFxuICAgICAgICAgICAge2NlbGxYOiAxLCBjZWxsWTogOSwgd2lkdGg6IDEsIGhlaWdodDogNiwgc3dhdGNoOiAzfSxcbiAgICAgICAgICAgIHtjZWxsWDogOSwgY2VsbFk6IDksIHdpZHRoOiAxLCBoZWlnaHQ6IDYsIHN3YXRjaDogM30sXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHtjZWxsWDogMCwgY2VsbFk6IDE1LCB3aWR0aDogMTEsIGhlaWdodDogMSwgc3dhdGNoOiAxfSxcbiAgICAgICAgICAgIHtjZWxsWDogMSwgY2VsbFk6IDE2LCB3aWR0aDogOSwgaGVpZ2h0OiAxLCBzd2F0Y2g6IDB9LFxuXG4gICAgICAgICAgICB7Y2VsbFg6IDIsIGNlbGxZOiAxNywgd2lkdGg6IDcsIGhlaWdodDogMjIsIHN3YXRjaDogMH0sXG4gICAgICAgICAgICB7Y2VsbFg6IDMsIGNlbGxZOiAxOSwgd2lkdGg6IDIsIGhlaWdodDogNywgc3dhdGNoOiAyfSxcbiAgICAgICAgICAgIHtjZWxsWDogMywgY2VsbFk6IDE5LCB3aWR0aDogMSwgaGVpZ2h0OiA4LCBzd2F0Y2g6IDJ9LFxuICAgICAgICAgICAge2NlbGxYOiA2LCBjZWxsWTogMTksIHdpZHRoOiAyLCBoZWlnaHQ6IDcsIHN3YXRjaDogMn0sXG4gICAgICAgICAgICB7Y2VsbFg6IDcsIGNlbGxZOiAxOSwgd2lkdGg6IDEsIGhlaWdodDogOCwgc3dhdGNoOiAyfSxcbiAgICAgICAgICAgIHtjZWxsWDogMywgY2VsbFk6IDI5LCB3aWR0aDogMiwgaGVpZ2h0OiA4LCBzd2F0Y2g6IDJ9LFxuICAgICAgICAgICAge2NlbGxYOiAzLCBjZWxsWTogMjgsIHdpZHRoOiAxLCBoZWlnaHQ6IDksIHN3YXRjaDogMn0sXG4gICAgICAgICAgICB7Y2VsbFg6IDYsIGNlbGxZOiAyOSwgd2lkdGg6IDIsIGhlaWdodDogOCwgc3dhdGNoOiAyfSxcbiAgICAgICAgICAgIHtjZWxsWDogNywgY2VsbFk6IDI4LCB3aWR0aDogMSwgaGVpZ2h0OiA5LCBzd2F0Y2g6IDJ9LFxuICAgICAgICBdLFxuICAgICAgICBjdXN0b21SZW5kZXJTaXplOiA2LFxuICAgIH1cbn1cbiIsImZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogdHlwZXMuT2JqZWN0VHlwZXMuREVDT1JBVElPTixcbiAgICAgICAgeDogcG9zWCxcbiAgICAgICAgeTogcG9zWSxcbiAgICAgICAgdXBkYXRlOiAob2JzLCBzZWxmSWQsIGRlbHRhKSA9PiB7IH0sXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwidmFyIGVuZW15U3BlZWQgPSAwLjI7XG52YXIgZW5lbXlIZWFsdGggPSAzMDA7XG52YXIgZW5lbXlXaWR0aCA9IDQ7XG52YXIgZW5lbXlIZWlnaHQgPSA2O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgY29sbGlzaW9ucyA9IHJlcXVpcmUoXCIuLi8uLi9Db2xsaXNpb25zXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4uL1ByZWZhYnNcIik7XG4gICAgdmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL1ByZWZhYlV0aWxzXCIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogdHlwZXMuT2JqZWN0VHlwZXMuRU5FTVksXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLkVuZW15LlRBUkdFVF9EVU1NWSxcbiAgICAgICAgeDogcG9zWCxcbiAgICAgICAgeTogcG9zWSxcbiAgICAgICAgdmVsb2NpdHlYOiAwLFxuICAgICAgICB2ZWxvY2l0eVk6IDAsXG4gICAgICAgIHNwZWVkOiBlbmVteVNwZWVkLFxuICAgICAgICB3aWR0aDogZW5lbXlXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBlbmVteUhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGVuZW15V2lkdGgsXG4gICAgICAgIGhpdGJveEhlaWdodDogZW5lbXlIZWlnaHQsXG4gICAgICAgIGhlYWx0aDogZW5lbXlIZWFsdGgsXG4gICAgICAgIG1heEhlYWx0aDogZW5lbXlIZWFsdGgsXG4gICAgICAgIHN0YXR1c0VmZmVjdHM6IHsgfSxcbiAgICAgICAgZGVhdGhyYXR0bGU6IChvYnMsIHNlbGZSZWYpID0+IHtcbiAgICAgICAgICAgIHByZWZhYnMuZ2VuZXJhdGVOZXcob2JzLCBzZWxmUmVmLCBvYnNbc2VsZlJlZl0ueCwgb2JzW3NlbGZSZWZdLnkgKyAxICogb2JzW3NlbGZSZWZdLmhlaWdodCAvIDMgKiBwcmVmYWJzLnJlbmRlclNpemUsIHR5cGVzLk9iamVjdFR5cGVzLkRFQ09SQVRJT04sIHR5cGVzLkRlY29yYXRpb24uREVBRF9EVU1NWSk7XG4gICAgICAgICAgICBkZWxldGUgb2JzW3NlbGZSZWZdO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IChvYnMsIHNlbGZJZCwgZGVsdGEpID0+IHtcbiAgICAgICAgICAgIG9ic1tzZWxmSWRdLnVwZGF0ZVN0YXR1c0VmZmVjdHMob2JzLCBzZWxmSWQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBDaGVjayBjb2xsaXNpb25zIHdpdGggdGVycmFpbiBhbmQgcmVwb3NpdGlvbiBhY2NvcmRpbmdseVxuICAgICAgICAgICAgY29sbGlzaW9ucy5jaGVja0NvbGxpc2lvbnMoc2VsZklkLCBvYnMsIHByZWZhYnMucmVuZGVyU2l6ZSwgKHNyY0lkLCBjb2xsaXNpb25JZCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChvYnNbc3JjSWRdICYmIGNvbGxpc2lvbklkICE9IHNyY0lkKXtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChvYnNbY29sbGlzaW9uSWRdLnR5cGUpIHsgICAgICAgIC8vIFNob3VsZCBjb2xsaWRlIHdpdGggcGxheWVycz9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVkVISUNMRTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVEVSUkFJTjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuUExBWUVSOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5FTkVNWTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25zLnB1c2hCYWNrKG9icywgc3JjSWQsIGNvbGxpc2lvbklkLCBwcmVmYWJzLnJlbmRlclNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGhlYWw6IChvYnMsIHNlbGZJZCwgYW1vdW50KSA9PiB7XG4gICAgICAgICAgICBpZiAob2JzW3NlbGZJZF0pIHtcbiAgICAgICAgICAgICAgICB2YXIgaGVhbEFtb3VudCA9IG9ic1tzZWxmSWRdLmhlYWx0aCArIGFtb3VudCA+PSBvYnNbc2VsZklkXS5tYXhIZWFsdGhcbiAgICAgICAgICAgICAgICAgICAgPyBvYnNbc2VsZklkXS5tYXhIZWFsdGggLSBvYnNbc2VsZklkXS5oZWFsdGhcbiAgICAgICAgICAgICAgICAgICAgOiBhbW91bnQ7XG4gICAgICAgICAgICAgICAgb2JzW3NlbGZJZF0uaGVhbHRoICs9IGhlYWxBbW91bnRcbiAgICAgICAgICAgICAgICBwcmVmYWJzLmdlbmVyYXRlTmV3KG9icywgc2VsZklkLCAwLCAwLCB0eXBlcy5PYmplY3RUeXBlcy5DT01CQVRfVEVYVCwgdHlwZXMuQ29tYmF0VGV4dC5IRUFMX1RFWFQsIHsgdGV4dDogXCIrXCIgKyBoZWFsQW1vdW50IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYW1hZ2U6IChvYnMsIHNlbGZJZCwgYW1vdW50LCBkYW1hZ2VUeXBlKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hlY2tTdGF0dXNFZmZlY3Qob2JzLCBzZWxmSWQsIHR5cGVzLlN0YXR1c0VmZmVjdHMuSU5WVUxORVJBQkxFKSkge1xuICAgICAgICAgICAgICAgIHByZWZhYnMuZ2VuZXJhdGVOZXcob2JzLCBzZWxmSWQsIDAsIDAsIHR5cGVzLk9iamVjdFR5cGVzLkNPTUJBVF9URVhULCB0eXBlcy5Db21iYXRUZXh0LklOVlVMTkVSQUJMRV9URVhULCB7IHRleHQ6IFwiKiBcIiArIGFtb3VudCB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuZGFtYWdlKG9icywgc2VsZklkLCBhbW91bnQsIGRhbWFnZVR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVTdGF0dXNFZmZlY3RzOiAob2JzLCBzZWxmSWQpID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgc3RhdHVzRWZmZWN0Q2hlY2tIZWxwZXIob2JzLCBzZWxmSWQsIHR5cGVzLlN0YXR1c0VmZmVjdHMuU1RVTk5FRCwgbmV3VGltZSk7XG4gICAgICAgICAgICBzdGF0dXNFZmZlY3RDaGVja0hlbHBlcihvYnMsIHNlbGZJZCwgdHlwZXMuU3RhdHVzRWZmZWN0cy5JTlZVTE5FUkFCTEUsIG5ld1RpbWUpO1xuICAgICAgICB9LFxuICAgICAgICBhZGRTdGF0dXNFZmZlY3Q6IChvYnMsIGlkLCBlZmZlY3QsIGR1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICB2YXIgbmV3VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIE9ubHkgcmVwbGFjZSB0aGUgY3VycmVudCBzdGF0dXMgZWZmZWN0IGxhc3QgY2FzdCBhbmQgZHVyYXRpb24gaWYgdGhlIG5ldyBkdXJhdGlvbiBpcyBsb25nZXIgdGhhbiB3aGF0J3MgbGVmdFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XSB8fFxuICAgICAgICAgICAgICAgIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdLmR1cmF0aW9uIC0gKG5ld1RpbWUgLSBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XS5sYXN0KSA8IGR1cmF0aW9uXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XSA9IHsgfTtcbiAgICAgICAgICAgICAgICBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XS5sYXN0ID0gbmV3VGltZTtcbiAgICAgICAgICAgICAgICBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XS5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHN0YXR1c0VmZmVjdENoZWNrSGVscGVyKG9icywgaWQsIGVmZmVjdCwgbmV3VGltZSkge1xuICAgIGlmIChcbiAgICAgICAgb2JzW2lkXS5zdGF0dXNFZmZlY3RzW2VmZmVjdF0gJiZcbiAgICAgICAgbmV3VGltZSAtIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdLmxhc3QgPj0gb2JzW2lkXS5zdGF0dXNFZmZlY3RzW2VmZmVjdF0uZHVyYXRpb25cbiAgICApIHtcbiAgICAgICAgZGVsZXRlIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tTdGF0dXNFZmZlY3Qob2JzLCBpZCwgZWZmZWN0KSB7XG4gICAgcmV0dXJuIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdO1xufVxuXG5mdW5jdGlvbiBjaGVja1N0YXR1c0VmZmVjdE9iamVjdChvYmplY3QsIGVmZmVjdCkge1xuICAgIHJldHVybiBvYmplY3Quc3RhdHVzRWZmZWN0c1tlZmZlY3RdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG4gICAgY2hlY2tTdGF0dXNFZmZlY3Q6IGNoZWNrU3RhdHVzRWZmZWN0T2JqZWN0LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBlbmVteSBvYmplY3RcbiAqIEBwYXJhbSBvYmplY3QgVGhlIGVuZW15IG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlciBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmVteU1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjQTUyQTJBXCIsIFwiI0ZGMDAwMFwiLCBcIiNGRkZGRkZcIl0sXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgIGZhY2luZzogMCxcbiAgICAgICAgc3Ryb2tlczogW1xuICAgICAgICAgICAge2NlbGxYOiAzLCBjZWxsWTogMCwgd2lkdGg6IDIsIGhlaWdodDogMTIsIHN3YXRjaDogMH0sXG4gICAgICAgICAgICB7Y2VsbFg6IDAsIGNlbGxZOiA0LCB3aWR0aDogOCwgaGVpZ2h0OiAyLCBzd2F0Y2g6IDB9LFxuICAgICAgICAgICAge2NlbGxYOiAxLCBjZWxsWTogMywgd2lkdGg6IDYsIGhlaWdodDogNiwgc3dhdGNoOiAyfSxcbiAgICAgICAgICAgIHtjZWxsWDogMiwgY2VsbFk6IDQsIHdpZHRoOiA0LCBoZWlnaHQ6IDQsIHN3YXRjaDogMX0sXG4gICAgICAgICAgICB7Y2VsbFg6IDMsIGNlbGxZOiA1LCB3aWR0aDogMiwgaGVpZ2h0OiAyLCBzd2F0Y2g6IDJ9LFxuICAgICAgICBdLFxuICAgICAgICBjdXN0b21SZW5kZXJTaXplOiAyLFxuICAgIH1cbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgYmlub2N1bGFycyB1aSBpY29uXG4gKiBAcGFyYW0gcG9zWCBIb3Jpem9udGFsIGljb24gcG9zaXRpb25cbiAqIEBwYXJhbSBwb3NZIFZlcnRpY2FsIGljb24gcG9zaXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbm9jdWxhcnNVSU1hc3RlclBpZWNlKHBvc1g6IG51bWJlciwgcG9zWTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiMwMDAwMDBcIiwgXCIjMzMzMzMzXCJdLFxuICAgICAgICBwb3NYOiBwb3NYLFxuICAgICAgICBwb3NZOiBwb3NZLFxuICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICBmYWNpbmc6IC00NSxcbiAgICAgICAgc3Ryb2tlczogWyB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICBzd2F0Y2g6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAyLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LF1cbiAgICB9O1xufVxuIiwidmFyIGJpbm9jdWxhcnNWaWV3UmFuZ2UgPSAyO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHBhcmFtcyA9IHsgfSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLkVxdWlwbWVudFR5cGVzLkJJTk9DVUxBUlMsXG4gICAgICAgIHVzZTogKG9icywgc291cmNlSWQsIHRhcmdldFgsIHRhcmdldFkpID0+IHsgfSxcbiAgICAgICAgb25FcXVpcDogKG9icywgc291cmNlSWQpID0+IHtcbiAgICAgICAgICAgIG9ic1tzb3VyY2VJZF0ucHJldlZpZXdSYW5nZSA9IG9ic1tzb3VyY2VJZF0udmlld1JhbmdlO1xuICAgICAgICAgICAgb2JzW3NvdXJjZUlkXS52aWV3UmFuZ2UgPSBiaW5vY3VsYXJzVmlld1JhbmdlO1xuICAgICAgICB9LFxuICAgICAgICBvbkRlcXVpcDogKG9icywgc291cmNlSWQpID0+IHtcbiAgICAgICAgICAgIG9ic1tzb3VyY2VJZF0udmlld1JhbmdlID0gb2JzW3NvdXJjZUlkXS5wcmV2Vmlld1JhbmdlO1xuICAgICAgICAgICAgZGVsZXRlIG9ic1tzb3VyY2VJZF0ucHJldlZpZXdSYW5nZTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIGJsYXN0ZXIgdWkgaWNvblxuICogQHBhcmFtIHBvc1ggSG9yaXpvbnRhbCBpY29uIHBvc2l0aW9uXG4gKiBAcGFyYW0gcG9zWSBWZXJ0aWNhbCBpY29uIHBvc2l0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBibGFzdGVyVUlNYXN0ZXJQaWVjZShwb3NYOiBudW1iZXIsIHBvc1k6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjMDAwMDAwXCJdLFxuICAgICAgICBwb3NYOiBwb3NYLFxuICAgICAgICBwb3NZOiBwb3NZLFxuICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICBmYWNpbmc6IC00NSxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAwLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSxdXG4gICAgfTtcbn1cbiIsImZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgcGFyYW1zID0geyB9KSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4uL1ByZWZhYnNcIik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiB0eXBlcy5FcXVpcG1lbnRUeXBlcy5CTEFTVEVSLFxuICAgICAgICB1c2U6IChvYnMsIHNvdXJjZUlkLCB0YXJnZXRYLCB0YXJnZXRZKSA9PiB7XG4gICAgICAgICAgICBwcmVmYWJzLmdlbmVyYXRlTmV3KG9icywgc291cmNlSWQsIHRhcmdldFgsIHRhcmdldFksIHR5cGVzLk9iamVjdFR5cGVzLlBST0pFQ1RJTEUsIHR5cGVzLlByb2plY3RpbGUuQkFTSUNfUFJPSkVDVElMRSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXF1aXA6IChvYnMsIHNvdXJjZUlkKSA9PiB7IH0sXG4gICAgICAgIG9uRGVxdWlwOiAob2JzLCBzb3VyY2VJZCkgPT4geyB9LFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgYnVpbGRlciB1aSBpY29uXG4gKiBAcGFyYW0gcG9zWCBIb3Jpem9udGFsIGljb24gcG9zaXRpb25cbiAqIEBwYXJhbSBwb3NZIFZlcnRpY2FsIGljb24gcG9zaXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkZXJVSU1hc3RlclBpZWNlKHBvc1g6IG51bWJlciwgcG9zWTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiMwMDAwMDBcIiwgXCIjOTM1MjAwXCJdLFxuICAgICAgICBwb3NYOiBwb3NYLFxuICAgICAgICBwb3NZOiBwb3NZLFxuICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICBmYWNpbmc6IC00NSxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICAgIHN3YXRjaDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSxdXG4gICAgfTtcbn1cbiIsImZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgcGFyYW1zID0geyB9KSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4uL1ByZWZhYnNcIik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiB0eXBlcy5FcXVpcG1lbnRUeXBlcy5CVUlMREVSLFxuICAgICAgICB1c2U6IChvYnMsIHNvdXJjZUlkLCB0YXJnZXRYLCB0YXJnZXRZKSA9PiB7XG4gICAgICAgICAgICBwcmVmYWJzLmdlbmVyYXRlTmV3KG9icywgc291cmNlSWQsIHRhcmdldFgsIHRhcmdldFksIHBhcmFtcy50eXBlLCBwYXJhbXMuc3VidHlwZSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uRXF1aXA6IChvYnMsIHNvdXJjZUlkKSA9PiB7IH0sXG4gICAgICAgIG9uRGVxdWlwOiAob2JzLCBzb3VyY2VJZCkgPT4geyB9LFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3Igc2Nhbm5lciB1aSBpY29uXG4gKiBAcGFyYW0gcG9zWCBIb3Jpem9udGFsIGljb24gcG9zaXRpb25cbiAqIEBwYXJhbSBwb3NZIFZlcnRpY2FsIGljb24gcG9zaXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYW5uZXJVSU1hc3RlclBpZWNlKHBvc1g6IG51bWJlciwgcG9zWTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiNGRkZGRkZcIiwgXCIjMzM5OUZGXCJdLFxuICAgICAgICBwb3NYOiBwb3NYLFxuICAgICAgICBwb3NZOiBwb3NZLFxuICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIHN0cm9rZXM6IFt7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IC0xLFxuICAgICAgICAgICAgY2VsbFk6IDEsXG4gICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMSxcbiAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICBzd2F0Y2g6IDFcbiAgICAgICAgfSxdXG4gICAgfTtcbn1cbiIsImZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgcGFyYW1zID0geyB9KSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciBjb2xsaXNpb25zID0gcmVxdWlyZShcIi4uLy4uL0NvbGxpc2lvbnNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLkVxdWlwbWVudFR5cGVzLlNDQU5ORVIsXG4gICAgICAgIHVzZTogKG9icywgc291cmNlSWQsIHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICAgICAgICAgIC8vIFJlcGxhY2VzIGFsbCBidWlsZGVycyB3aXRoIHRoaXMgYnVpbGQgdHlwZS4uLlxuICAgICAgICAgICAgY29sbGlzaW9ucy5jaGVja0NsaWNrQ29sbGlzaW9ucyh0YXJnZXRYLCB0YXJnZXRZLCBvYnMsIHByZWZhYnMucmVuZGVyU2l6ZSwgKGNvbGxpc2lvbklkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG9ic1tjb2xsaXNpb25JZF0uc3VidHlwZSAhPSB0eXBlcy5JbnRlcmFjdGFibGUuQ0FSX0VOVEVSKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic1tzb3VyY2VJZF0uZXF1aXBtZW50ID0gb2JzW3NvdXJjZUlkXS5lcXVpcG1lbnQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50eXBlID09IHR5cGVzLkVxdWlwbWVudFR5cGVzLkJVSUxERVIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gcHJlZmFicy5uZXdFcXVpcG1lbnQob2JzLCB0eXBlcy5FcXVpcG1lbnRUeXBlcy5CVUlMREVSLCB7IHR5cGU6IG9ic1tjb2xsaXNpb25JZF0udHlwZSwgc3VidHlwZTogb2JzW2NvbGxpc2lvbklkXS5zdWJ0eXBlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvbkVxdWlwOiAob2JzLCBzb3VyY2VJZCkgPT4geyB9LFxuICAgICAgICBvbkRlcXVpcDogKG9icywgc291cmNlSWQpID0+IHsgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJ2YXIgZ3JhdmVzdG9uZVdpZHRoID0gMztcbnZhciBncmF2ZXN0b25lSGVpZ2h0ID0gNDtcbnZhciBncmF2ZXN0b25lSGl0Ym94V2lkdGggPSBncmF2ZXN0b25lV2lkdGg7XG52YXIgZ3JhdmVzdG9uZUhpdGJveEhlaWdodCA9IGdyYXZlc3RvbmVIZWlnaHQ7XG52YXIgZ3JhdmVzdG9uZUhlYWx0aCA9IDQwO1xudmFyIGdyYXZlc3RvbmVWaWV3UmFuZ2UgPSAxIC8gNDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIGNvbGxpc2lvbnMgPSByZXF1aXJlKFwiLi4vLi4vQ29sbGlzaW9uc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJVdGlsc1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLk9iamVjdFR5cGVzLkdSQVZFU1RPTkUsXG4gICAgICAgIHN1YnR5cGU6IG9ic1tzcmNdLnN1YnR5cGUsXG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1kgKyAxICogcHJlZmFicy5yZW5kZXJTaXplLFxuICAgICAgICB2ZWxvY2l0eVg6IDAsXG4gICAgICAgIHZlbG9jaXR5WTogMCxcbiAgICAgICAgc3BlZWQ6IDAsXG4gICAgICAgIHdpZHRoOiBncmF2ZXN0b25lV2lkdGgsXG4gICAgICAgIGhlaWdodDogZ3JhdmVzdG9uZUhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGdyYXZlc3RvbmVIaXRib3hXaWR0aCxcbiAgICAgICAgaGl0Ym94SGVpZ2h0OiBncmF2ZXN0b25lSGl0Ym94SGVpZ2h0LFxuICAgICAgICBoZWFsdGg6IGdyYXZlc3RvbmVIZWFsdGgsXG4gICAgICAgIG1heEhlYWx0aDogZ3JhdmVzdG9uZUhlYWx0aCxcbiAgICAgICAgY3VycmVudEVxdWlwbWVudDogdW5kZWZpbmVkLFxuICAgICAgICBlcXVpcG1lbnQ6IFtdLFxuICAgICAgICB2aWV3UmFuZ2U6IGdyYXZlc3RvbmVWaWV3UmFuZ2UsXG4gICAgICAgIGRlYXRocmF0dGxlOiAob2JzLCBzZWxmUmVmKSA9PiB7XG4gICAgICAgICAgICBwcmVmYWJzLmdlbmVyYXRlTmV3KG9icywgc2VsZlJlZiwgMCwgMCwgdHlwZXMuT2JqZWN0VHlwZXMuUExBWUVSKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiAob2JzLCBzZWxmSWQsIGRlbHRhKSA9PiB7XG4gICAgICAgICAgICAvLyBDaGVjayBjb2xsaXNpb25zIHdpdGggdmVoaWNsZXMgYW5kIHJlcG9zaXRpb24gYWNjb3JkaW5nbHlcbiAgICAgICAgICAgIGNvbGxpc2lvbnMuY2hlY2tDb2xsaXNpb25zKHNlbGZJZCwgb2JzLCBwcmVmYWJzLnJlbmRlclNpemUsIChzcmNJZCwgY29sbGlzaW9uSWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob2JzW3NyY0lkXSAmJiBjb2xsaXNpb25JZCAhPSBzcmNJZCl7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob2JzW2NvbGxpc2lvbklkXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlZFSElDTEU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHVzaCBvYmplY3QgYmFjayBvdXQgb2YgY29sbGlzaW9uIHZlaGljbGUgdG93YXJkcyB3aGljaCBldmVyIHNpZGUgaXMgdGhlIGNsb3Nlc3QgdG8gdGhlIHZlaGljbGUgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9ucy5wdXNoQmFjayhvYnMsIHNyY0lkLCBjb2xsaXNpb25JZCwgcHJlZmFicy5yZW5kZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBtb3VzZURvd246IChvYnMsIG1vdXNlRXZlbnQpID0+IHsgfSxcbiAgICAgICAgb25QbGF5ZXJJbnB1dDogKG9icywgc2VsZklkLCBwbGF5ZXJJbnB1dCkgPT4geyB9LFxuICAgICAgICBkYW1hZ2U6IHV0aWxzLmRhbWFnZSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIGdyYXZlc3RvbmUgb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSBncmF2ZXN0b25lIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlciBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBncmF2ZVN0b25lTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiM4ODg4ODhcIl0sXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgIGZhY2luZzogb2JqZWN0LmZhY2luZyxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAwLFxuICAgICAgICAgICAgY2VsbFk6IDEsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiAwLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMSxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgICAgICBzd2F0Y2g6IDAsXG4gICAgICAgIH1dXG4gICAgfVxufVxuIiwidmFyIGNhckVudGVyV2lkdGggPSAyNDtcbnZhciBjYXJFbnRlckhlaWdodCA9IDI0O1xudmFyIGNhckVudGVySGl0Ym94V2lkdGggPSAyNDtcbnZhciBjYXJFbnRlckhpdGJveEhlaWdodCA9IDI0O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlLFxuICAgICAgICBzdWJ0eXBlOiB0eXBlcy5JbnRlcmFjdGFibGUuQ0FSX0VOVEVSLFxuICAgICAgICB3aWR0aDogY2FyRW50ZXJXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBjYXJFbnRlckhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGNhckVudGVySGl0Ym94V2lkdGgsXG4gICAgICAgIGhpdGJveEhlaWdodDogY2FyRW50ZXJIaXRib3hIZWlnaHQsXG4gICAgICAgIHZlaGljbGVJZDogc3JjLFxuICAgICAgICBvbkludGVyYWN0OiAob2JzLCBzZWxmUmVmLCBpbnRlcmFjdElkKSA9PiB7XG4gICAgICAgICAgICBpZiAob2JzW2ludGVyYWN0SWRdICYmXG4gICAgICAgICAgICAgICAgb2JzW2ludGVyYWN0SWRdLnR5cGUgPT09IHR5cGVzLk9iamVjdFR5cGVzLlBMQVlFUiAmJlxuICAgICAgICAgICAgICAgIG9ic1tvYnNbc2VsZlJlZl0udmVoaWNsZUlkXS5yaWRlciA9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIG9ic1tvYnNbc2VsZlJlZl0udmVoaWNsZUlkXS5yaWRlciA9IG9ic1tpbnRlcmFjdElkXTtcbiAgICAgICAgICAgICAgICBvYnNbaW50ZXJhY3RJZF0gPSBvYnNbb2JzW3NlbGZSZWZdLnZlaGljbGVJZF07XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ic1tvYnNbc2VsZlJlZl0udmVoaWNsZUlkXTtcbiAgICAgICAgICAgICAgICBvYnNbc2VsZlJlZl0udmVoaWNsZUlkID0gaW50ZXJhY3RJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJ2YXIgaGVhbHRoUGlja3VwV2lkdGggPSAzO1xudmFyIGhlYWx0aFBpY2t1cEhlaWdodCA9IDM7XG52YXIgaGVhbHRoUGlja3VwSGl0Ym94V2lkdGggPSAzO1xudmFyIGhlYWx0aFBpY2t1cEhpdGJveEhlaWdodCA9IDM7XG52YXIgaGVhbHRoUGlja3VwSGVhbGluZyA9IDQwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlLFxuICAgICAgICBzdWJ0eXBlOiB0eXBlcy5JbnRlcmFjdGFibGUuSEVBTFRIX1BJQ0tVUCxcbiAgICAgICAgd2lkdGg6IGhlYWx0aFBpY2t1cFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGhlYWx0aFBpY2t1cEhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGhlYWx0aFBpY2t1cEhpdGJveFdpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IGhlYWx0aFBpY2t1cEhpdGJveEhlaWdodCxcbiAgICAgICAgb25JbnRlcmFjdDogKG9icywgc2VsZlJlZiwgaW50ZXJhY3RJZCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9ic1tpbnRlcmFjdElkXS5oZWFsKSB7XG4gICAgICAgICAgICAgICAgb2JzW2ludGVyYWN0SWRdLmhlYWwob2JzLCBpbnRlcmFjdElkLCBoZWFsdGhQaWNrdXBIZWFsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSBvYnNbc2VsZlJlZl07XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBoZWFsdGggcGlja3VwIG9iamVjdFxuICogQHBhcmFtIG9iamVjdCBUaGUgaGVhbHRoIHBpY2t1cCBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGVhbHRoUGlja3VwTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiNGRkZGRkZcIiwgXCIjRkYwMDAwXCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IG9iamVjdC5mYWNpbmcsXG4gICAgICAgIHN0cm9rZXM6IFt7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIHN3YXRjaDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMSxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgICAgICBzd2F0Y2g6IDFcbiAgICAgICAgfV1cbiAgICB9XG59XG4iLCJ2YXIgcGxheWVyVHlwZUNoYW5nZXJXaWR0aCA9IDU7XG52YXIgcGxheWVyVHlwZUNoYW5nZXJIZWlnaHQgPSA1O1xudmFyIHBsYXllclR5cGVDaGFuZ2VySGl0Ym94V2lkdGggPSA1O1xudmFyIHBsYXllclR5cGVDaGFuZ2VySGl0Ym94SGVpZ2h0ID0gNTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UsIHBhcmFtcyA9IHsgfSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLkludGVyYWN0YWJsZS5QTEFZRVJfVFlQRV9DSEFOR0VSLFxuICAgICAgICB3aWR0aDogcGxheWVyVHlwZUNoYW5nZXJXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBwbGF5ZXJUeXBlQ2hhbmdlckhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IHBsYXllclR5cGVDaGFuZ2VySGl0Ym94V2lkdGgsXG4gICAgICAgIGhpdGJveEhlaWdodDogcGxheWVyVHlwZUNoYW5nZXJIaXRib3hIZWlnaHQsXG4gICAgICAgIG5ld1BsYXllclR5cGU6IHBhcmFtcy5uZXdUeXBlLFxuICAgICAgICBvbkludGVyYWN0OiAob2JzLCBzZWxmUmVmLCBpbnRlcmFjdElkKSA9PiB7XG4gICAgICAgICAgICBpZiAob2JzW2ludGVyYWN0SWRdLnR5cGUgPT09IHR5cGVzLk9iamVjdFR5cGVzLlBMQVlFUiAmJiBvYnNbaW50ZXJhY3RJZF0uc3VidHlwZSAhPT0gb2JzW3NlbGZSZWZdLm5ld1BsYXllclR5cGUpIHtcbiAgICAgICAgICAgICAgICBwcmVmYWJzLmdlbmVyYXRlTmV3KG9icywgaW50ZXJhY3RJZCwgb2JzW2ludGVyYWN0SWRdLngsIG9ic1tpbnRlcmFjdElkXS55LCB0eXBlcy5PYmplY3RUeXBlcy5QTEFZRVIsIG9ic1tzZWxmUmVmXS5uZXdQbGF5ZXJUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSBcIi4uLy4uL09iamVjdFR5cGVzXCI7XG5pbXBvcnQgKiBhcyBwcmVmYWJzIGZyb20gXCIuLi9QcmVmYWJzXCI7XG5cbmltcG9ydCAqIGFzIF9wbGF5ZXIgZnJvbSBcIi4uL1BsYXllci9fUGxheWVyLnRlbXBsYXRlXCI7XG5pbXBvcnQgKiBhcyBmaXJlbWFnZSBmcm9tIFwiLi4vUGxheWVyL0ZpcmVNYWdlLnRlbXBsYXRlXCI7XG5pbXBvcnQgKiBhcyBnb2QgZnJvbSBcIi4uL1BsYXllci9Hb2QudGVtcGxhdGVcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBwbGF5ZXIgdHlwZSBjaGFuZ2VyIG9iamVjdFxuICogQHBhcmFtIG9iamVjdCBUaGUgcGxheWVyIHR5cGUgY2hhbmdlciBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxheWVyVHlwZUNoYW5nZXJNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgdmFyIGN1c3RvbVJlbmRlclNpemUgPSAyO1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiM4ODg4ODhcIiwgXCIjYmJiYmJiXCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IG9iamVjdC5mYWNpbmcsXG4gICAgICAgIHN0cm9rZXM6IFt7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCAqIHByZWZhYnMucmVuZGVyU2l6ZSAvIGN1c3RvbVJlbmRlclNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQgKiBwcmVmYWJzLnJlbmRlclNpemUgLyBjdXN0b21SZW5kZXJTaXplLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDEsXG4gICAgICAgICAgICB3aWR0aDogKG9iamVjdC53aWR0aCAtIDEpICogcHJlZmFicy5yZW5kZXJTaXplIC8gY3VzdG9tUmVuZGVyU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogKG9iamVjdC5oZWlnaHQgLSAxKSAqIHByZWZhYnMucmVuZGVyU2l6ZSAvIGN1c3RvbVJlbmRlclNpemUsXG4gICAgICAgICAgICBzd2F0Y2g6IDFcbiAgICAgICAgfSxdLFxuICAgICAgICBjdXN0b21SZW5kZXJTaXplOiBjdXN0b21SZW5kZXJTaXplLFxuICAgIH1cbn1cblxuLyoqXG4gKiBHZXQgbGl0dGxlIG1hbiBmb3IgcGxheWVyIHR5cGUgY2hhbmdlciBvYmplY3RcbiAqIEBwYXJhbSBvYmplY3QgVGhlIHBsYXllciB0eXBlIGNoYW5nZXIgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpdHRsZU1hbk1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICB2YXIgb2JqQ29weSA9IG9iamVjdDtcbiAgICBvYmpDb3B5LndpZHRoID0gMjtcbiAgICBvYmpDb3B5LmhlaWdodCA9IDM7XG5cbiAgICB2YXIgcGxheWVyVHlwZUNoYW5nZXJNYXN0ZXJQaWVjZSA9IF9wbGF5ZXIucGxheWVyTWFzdGVyUGllY2Uob2JqQ29weSwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSk7XG4gICAgcGxheWVyVHlwZUNoYW5nZXJNYXN0ZXJQaWVjZS5jdXN0b21SZW5kZXJTaXplID0gMjtcbiAgICBzd2l0Y2ggKG9iamVjdC5uZXdQbGF5ZXJUeXBlKSB7XG4gICAgICAgIGNhc2UgdHlwZXMuUGxheWVyLkZJUkVfTUFHRTpcbiAgICAgICAgICAgIHBsYXllclR5cGVDaGFuZ2VyTWFzdGVyUGllY2UgPSBmaXJlbWFnZS5maXJlbWFnZVBsYXllck1hc3RlclBpZWNlKG9iakNvcHksIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpO1xuICAgICAgICAgICAgcGxheWVyVHlwZUNoYW5nZXJNYXN0ZXJQaWVjZS5jdXN0b21SZW5kZXJTaXplID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHR5cGVzLlBsYXllci5HT0Q6XG4gICAgICAgICAgICBwbGF5ZXJUeXBlQ2hhbmdlck1hc3RlclBpZWNlID0gZ29kLmdvZFBsYXllck1hc3RlclBpZWNlKG9iakNvcHksIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpO1xuICAgICAgICAgICAgcGxheWVyVHlwZUNoYW5nZXJNYXN0ZXJQaWVjZS5jdXN0b21SZW5kZXJTaXplID0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBwbGF5ZXJUeXBlQ2hhbmdlck1hc3RlclBpZWNlO1xufVxuIiwidmFyIHRlbGVwb3J0ZXJXaWR0aCA9IDU7XG52YXIgdGVsZXBvcnRlckhlaWdodCA9IDU7XG52YXIgdGVsZXBvcnRlckhpdGJveFdpZHRoID0gNTtcbnZhciB0ZWxlcG9ydGVySGl0Ym94SGVpZ2h0ID0gNTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UsIHBhcmFtcykge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlLFxuICAgICAgICBzdWJ0eXBlOiB0eXBlcy5JbnRlcmFjdGFibGUuVEVMRVBPUlRFUixcbiAgICAgICAgd2lkdGg6IHRlbGVwb3J0ZXJXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0ZWxlcG9ydGVySGVpZ2h0LFxuICAgICAgICBoaXRib3hUeXBlOiB0eXBlcy5IaXRib3hUeXBlcy5SRUNULFxuICAgICAgICBoaXRib3hXaWR0aDogdGVsZXBvcnRlckhpdGJveFdpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IHRlbGVwb3J0ZXJIaXRib3hIZWlnaHQsXG4gICAgICAgIGRlc3RYOiBwYXJhbXMuZGVzdFgsXG4gICAgICAgIGRlc3RZOiBwYXJhbXMuZGVzdFksXG4gICAgICAgIG9uSW50ZXJhY3Q6IChvYnMsIHNlbGZSZWYsIGludGVyYWN0SWQpID0+IHtcbiAgICAgICAgICAgIGlmIChvYnNbaW50ZXJhY3RJZF0pIHtcbiAgICAgICAgICAgICAgICBvYnNbaW50ZXJhY3RJZF0ueCA9IG9ic1tzZWxmUmVmXS5kZXN0WDtcbiAgICAgICAgICAgICAgICBvYnNbaW50ZXJhY3RJZF0ueSA9IG9ic1tzZWxmUmVmXS5kZXN0WTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIHRlbGVwb3J0ZXIgb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSB0ZWxlcG9ydGVyIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlciBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0ZWxlcG9ydGVyTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiNEQTcwRDZcIiwgXCIjQkE1NUQzXCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIHN0cm9rZXM6IFtcbiAgICAgICAgICAgIHtjZWxsWDogMCwgY2VsbFk6IDAsIHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgc3dhdGNoOiAwfSxcbiAgICAgICAgICAgIHtjZWxsWDogMSwgY2VsbFk6IDEsIHdpZHRoOiA4LCBoZWlnaHQ6IDgsIHN3YXRjaDogMX0sXG4gICAgICAgICAgICB7Y2VsbFg6IDIsIGNlbGxZOiAyLCB3aWR0aDogNiwgaGVpZ2h0OiA2LCBzd2F0Y2g6IDB9LFxuICAgICAgICAgICAge2NlbGxYOiAzLCBjZWxsWTogMywgd2lkdGg6IDQsIGhlaWdodDogNCwgc3dhdGNoOiAxfSxcbiAgICAgICAgICAgIHtjZWxsWDogNCwgY2VsbFk6IDQsIHdpZHRoOiAyLCBoZWlnaHQ6IDIsIHN3YXRjaDogMH0sXG4gICAgICAgIF0sXG4gICAgICAgIGN1c3RvbVJlbmRlclNpemU6IDIsXG4gICAgfVxufVxuIiwiZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiB0eXBlcy5PYmplY3RUeXBlcy5JTlRFUkFDVEFCTEUsXG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1ksXG4gICAgICAgIHVwZGF0ZTogKG9icywgc2VsZklkLCBkZWx0YSkgPT4geyB9LFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsInZhciBmaXJlbWFnZVNwZWVkID0gMC4xODtcbnZhciBmaXJlbWFnZUhlYWx0aCA9IDY0O1xuXG52YXIgYmFzZUZpcmVUaWNrc0R1cmF0aW9uID0gNTAwO1xudmFyIGZpcmVtYWdlRmlyZVRpY2tzRHVyYXRpb24gPSA3NTA7XG5cbnZhciBmaXJlVGlja0RhbWFnZSA9IDY7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBiYXNlKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4uL1ByZWZhYnNcIik7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuUGxheWVyLkZJUkVfTUFHRSxcbiAgICAgICAgbWF4SGVhbHRoOiBmaXJlbWFnZUhlYWx0aCxcbiAgICAgICAgaGVhbHRoOiBmaXJlbWFnZUhlYWx0aCxcbiAgICAgICAgc3BlZWQ6IGZpcmVtYWdlU3BlZWQsXG4gICAgICAgIGZpcmVUaWNrc0R1cmF0aW9uOiBmaXJlbWFnZUZpcmVUaWNrc0R1cmF0aW9uLFxuICAgICAgICBhYmlsaXRpZXM6IFtcbiAgICAgICAgICAgIHByZWZhYnMubmV3QWJpbGl0eShvYnMsIHR5cGVzLkFiaWxpdGllcy5GSVJFQk9MVCksXG4gICAgICAgICAgICBwcmVmYWJzLm5ld0FiaWxpdHkob2JzLCB0eXBlcy5BYmlsaXRpZXMuRkxBTUVfUElMTEFSKSxcbiAgICAgICAgICAgIHByZWZhYnMubmV3QWJpbGl0eShvYnMsIHR5cGVzLkFiaWxpdGllcy5GTEFNRV9EQVNIKSxcbiAgICAgICAgICAgIHByZWZhYnMubmV3QWJpbGl0eShvYnMsIHR5cGVzLkFiaWxpdGllcy5GTEFNRV9CQVJSSUVSKSxcbiAgICAgICAgXSxcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluY3JlYXNlRmlyZVRpY2sob2JzLCBzb3VyY2VJZCwgYW1vdW50KSB7XG4gICAgdmFyIG5ld1RpbWUgPSBEYXRlLm5vdygpO1xuICAgIGlmIChvYnNbc291cmNlSWRdLmZpcmVUaWNrcyAmJiBuZXdUaW1lIC0gb2JzW3NvdXJjZUlkXS5maXJlVGlja3NMYXN0SW5jcmVhc2UgPCBvYnNbc291cmNlSWRdLmZpcmVUaWNrc0R1cmF0aW9uKSB7XG4gICAgICAgIG9ic1tzb3VyY2VJZF0uZmlyZVRpY2tzID0gb2JzW3NvdXJjZUlkXS5maXJlVGlja3MgKyBhbW91bnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JzW3NvdXJjZUlkXS5maXJlVGlja3MgPSBhbW91bnQ7XG4gICAgICAgIFxuICAgICAgICBpZiAoIW9ic1tzb3VyY2VJZF0uZmlyZVRpY2tzRHVyYXRpb24pIHtcbiAgICAgICAgICAgIG9ic1tzb3VyY2VJZF0uZmlyZVRpY2tzRHVyYXRpb24gPSBiYXNlRmlyZVRpY2tzRHVyYXRpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgb2JzW3NvdXJjZUlkXS5maXJlVGlja3NMYXN0SW5jcmVhc2UgPSBuZXdUaW1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG4gICAgaW5jcmVhc2VGaXJlVGljazogaW5jcmVhc2VGaXJlVGljayxcbiAgICBmaXJlVGlja0RhbWFnZTogZmlyZVRpY2tEYW1hZ2UsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIGZpcmVtYWdlIHBsYXllciBvYmplY3RcbiAqIEBwYXJhbSBvYmplY3QgVGhlIGZpcmVtYWdlIHBsYXllciBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgb2JqZWN0c1xuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXIgb2JqZWN0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyZW1hZ2VQbGF5ZXJNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHsgICAgLy8gU2tpbiwgICAgICBQYW50cywgICAgIFNoaXJ0LCAgICAgIEZhY2VcbiAgICAgICAgcGFsZXR0ZTogW1wiI0QyQjQ4Q1wiLCBcIiNBNTJBMkFcIiwgXCIjREMxNDNDXCIsIFwiI2RiYzNhM1wiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiAwLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMixcbiAgICAgICAgICAgIHdpZHRoOiA0LFxuICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgc3dhdGNoOiAyXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMixcbiAgICAgICAgICAgIGhlaWdodDogNCxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMSxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDIsXG4gICAgICAgICAgICBoZWlnaHQ6IDIsXG4gICAgICAgICAgICBzd2F0Y2g6IDNcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICBjZWxsWTogNCxcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgc3dhdGNoOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAyLFxuICAgICAgICAgICAgY2VsbFk6IDQsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICAgIHN3YXRjaDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMSxcbiAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgd2lkdGg6IDAuNSxcbiAgICAgICAgICAgIGhlaWdodDogNixcbiAgICAgICAgICAgIHN3YXRjaDogMlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMi41LFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMC41LFxuICAgICAgICAgICAgaGVpZ2h0OiA2LFxuICAgICAgICAgICAgc3dhdGNoOiAyXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMixcbiAgICAgICAgICAgIGhlaWdodDogMC41LFxuICAgICAgICAgICAgc3dhdGNoOiAyXG4gICAgICAgIH0sXSxcbiAgICB9XG59XG4iLCJ2YXIgZ29kU3BlZWQgPSAwLjI4O1xudmFyIGdvZEhlYWx0aCA9IDM1MDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcbiAgICBcbiAgICByZXR1cm4geyBcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuUGxheWVyLkdPRCxcbiAgICAgICAgbWF4SGVhbHRoOiBnb2RIZWFsdGgsXG4gICAgICAgIGhlYWx0aDogZ29kSGVhbHRoLFxuICAgICAgICBjdXJyZW50RXF1aXBtZW50OiAwLFxuICAgICAgICBlcXVpcG1lbnQ6IFtcbiAgICAgICAgICAgIHByZWZhYnMubmV3RXF1aXBtZW50KG9icywgdHlwZXMuRXF1aXBtZW50VHlwZXMuQkxBU1RFUiksXG4gICAgICAgICAgICBwcmVmYWJzLm5ld0VxdWlwbWVudChvYnMsIHR5cGVzLkVxdWlwbWVudFR5cGVzLlNDQU5ORVIpLFxuICAgICAgICAgICAgcHJlZmFicy5uZXdFcXVpcG1lbnQob2JzLCB0eXBlcy5FcXVpcG1lbnRUeXBlcy5CVUlMREVSLCB7IHR5cGU6IHR5cGVzLk9iamVjdFR5cGVzLlRFUlJBSU4sIHN1YnR5cGU6IHR5cGVzLlRlcnJhaW4uVFJFRSB9KSxcbiAgICAgICAgICAgIHByZWZhYnMubmV3RXF1aXBtZW50KG9icywgdHlwZXMuRXF1aXBtZW50VHlwZXMuQklOT0NVTEFSUyksXG4gICAgICAgIF0sXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIGdvZCBwbGF5ZXIgb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSBnb2QgcGxheWVyIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlciBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnb2RQbGF5ZXJNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHsgICAgLy8gU2tpbiwgICAgICBTaGlydCwgICAgUGFudHNcbiAgICAgICAgcGFsZXR0ZTogW1wiI0QyQjQ4Q1wiLCBcIiNGMEZGRkZcIiwgXCIjODAwMDgwXCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIHN0cm9rZXM6IFtcbiAgICAgICAgICAgIHsgY2VsbFg6IDIsIGNlbGxZOiAwLCB3aWR0aDogNCwgaGVpZ2h0OiA0LCBzd2F0Y2g6IDAgfSxcbiAgICAgICAgICAgIHsgY2VsbFg6IDAsIGNlbGxZOiA0LCB3aWR0aDogOCwgaGVpZ2h0OiA0LCBzd2F0Y2g6IDEgfSxcbiAgICAgICAgICAgIHsgY2VsbFg6IDIsIGNlbGxZOiA0LCB3aWR0aDogNCwgaGVpZ2h0OiA4LCBzd2F0Y2g6IDIgfSxcbiAgICAgICAgICAgIHsgY2VsbFg6IDAsIGNlbGxZOiA2LCB3aWR0aDogMiwgaGVpZ2h0OiAyLCBzd2F0Y2g6IDAgfSxcbiAgICAgICAgICAgIHsgY2VsbFg6IDYsIGNlbGxZOiA2LCB3aWR0aDogMiwgaGVpZ2h0OiAyLCBzd2F0Y2g6IDAgfSxcbiAgICAgICAgICAgIHsgY2VsbFg6IDMsIGNlbGxZOiA0LCB3aWR0aDogMiwgaGVpZ2h0OiAzLCBzd2F0Y2g6IDEgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY3VzdG9tUmVuZGVyU2l6ZTogMlxuICAgIH1cbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3Igb2JqZWN0J3MgaGVhbHRoIGJhclxuICogQHBhcmFtIG9iamVjdCBUaGUgb2JqZWN0IHRoYXQgbmVlZHMgYSBoZWFsdGggYmFyXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIG9iamVjdHNcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyIG9iamVjdHNcbiAqIEBwYXJhbSBjdWJlU2l6ZSBUaGUgY3ViZSByZW5kZXIgc2l6ZSwgcmVxdWlyZWQgd2hlbiBkcmF3aW5nIGZyZWUgaGFuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGVhbHRoQmFyTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyLCBjdWJlU2l6ZTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiMwMGE0MDBcIiwgXCIjRkYwMDAwXCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSAtIChvYmplY3QuaGVpZ2h0ICsgNCkgKiBjdWJlU2l6ZSAvIDIsXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgZmFjaW5nOiAwLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3QuaGVhbHRoIC8gb2JqZWN0Lm1heEhlYWx0aCAqIG9iamVjdC53aWR0aCAqIGN1YmVTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiBjdWJlU2l6ZSAqIDMgLyA0LFxuICAgICAgICAgICAgc3dhdGNoOiAob2JqZWN0LmhlYWx0aCA+IG9iamVjdC5tYXhIZWFsdGggLyAzKSA/IDAgOiAxLFxuICAgICAgICB9LF0sXG4gICAgICAgIGN1c3RvbVJlbmRlclNpemU6IDFcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UsIFN0cm9rZVR5cGVzIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgaW52dWxuZXJhYmxlIHN0YXR1cyBlZmZlY3RcbiAqIEBwYXJhbSBvYmplY3QgVGhlIGludnVsbmVyYWJsZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaW52dWxuZXJhYmxlU3RhdHVzRWZmZWN0TWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyLCByZW5kZXJTaXplOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiI0ZGRkYwMDY2XCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIHN0cm9rZXM6IFt7XG4gICAgICAgICAgICBjZWxsWDogb2JqZWN0LndpZHRoIC8gMixcbiAgICAgICAgICAgIGNlbGxZOiBvYmplY3QuaGVpZ2h0IC8gMixcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgICAgICBzd2F0Y2g6IDAsXG4gICAgICAgICAgICB0eXBlOiBTdHJva2VUeXBlcy5DSVJDLFxuICAgICAgICB9LF0sXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBzdHVubmVkIHN0YXR1cyBlZmZlY3RcbiAqIEBwYXJhbSBvYmplY3QgVGhlIHN0dW5uZWQgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0dW5uZWRTdGF0dXNFZmZlY3RNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIsIHJlbmRlclNpemU6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjRkZGRjAwXCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gb2JqZWN0LmhlaWdodCAvIDIgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IDYsXG4gICAgICAgIGZhY2luZzogMCxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDMsXG4gICAgICAgICAgICBjZWxsWTogNCxcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAyLFxuICAgICAgICAgICAgY2VsbFk6IDUsXG4gICAgICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogNSxcbiAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDQsXG4gICAgICAgICAgICBjZWxsWTogMixcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIF0sXG4gICAgICAgIGN1c3RvbVJlbmRlclNpemU6IDIsXG4gICAgfVxufVxuIiwidmFyIHBsYXllclNwZWVkID0gMC4yO1xudmFyIHBsYXllckhlYWx0aCA9IDEwMDtcbnZhciBwbGF5ZXJXaWR0aCA9IDg7XG52YXIgcGxheWVySGVpZ2h0ID0gODtcbnZhciBwbGF5ZXJWaWV3UmFuZ2UgPSAxIC8gMjtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIGNvbGxpc2lvbnMgPSByZXF1aXJlKFwiLi4vLi4vQ29sbGlzaW9uc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJVdGlsc1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLk9iamVjdFR5cGVzLlBMQVlFUixcbiAgICAgICAgc3VidHlwZTogdHlwZXMuUGxheWVyLkhVTUFOLFxuICAgICAgICB4OiBwb3NYLFxuICAgICAgICB5OiBwb3NZLFxuICAgICAgICB2ZWxvY2l0eVg6IDAsXG4gICAgICAgIHZlbG9jaXR5WTogMCxcbiAgICAgICAgc3BlZWQ6IHBsYXllclNwZWVkLFxuICAgICAgICB3aWR0aDogcGxheWVyV2lkdGgsXG4gICAgICAgIGhlaWdodDogcGxheWVySGVpZ2h0LFxuICAgICAgICBoaXRib3hUeXBlOiB0eXBlcy5IaXRib3hUeXBlcy5SRUNULFxuICAgICAgICBoaXRib3hXaWR0aDogcGxheWVyV2lkdGggLSAyLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IHBsYXllckhlaWdodCxcbiAgICAgICAgaGVhbHRoOiBwbGF5ZXJIZWFsdGgsXG4gICAgICAgIG1heEhlYWx0aDogcGxheWVySGVhbHRoLFxuICAgICAgICBjdXJyZW50RXF1aXBtZW50OiB1bmRlZmluZWQsXG4gICAgICAgIGVxdWlwbWVudDogWyBdLFxuICAgICAgICBhYmlsaXRpZXM6IFsgXSxcbiAgICAgICAgc3RhdHVzRWZmZWN0czogeyB9LFxuICAgICAgICB2aWV3UmFuZ2U6IHBsYXllclZpZXdSYW5nZSxcbiAgICAgICAgZGVhdGhyYXR0bGU6IChvYnMsIHNlbGZSZWYpID0+IHtcbiAgICAgICAgICAgIHByZWZhYnMuZ2VuZXJhdGVOZXcob2JzLCBzZWxmUmVmLCBvYnNbc2VsZlJlZl0ueCwgb2JzW3NlbGZSZWZdLnksIHR5cGVzLk9iamVjdFR5cGVzLkdSQVZFU1RPTkUpO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IChvYnMsIHNlbGZJZCwgZGVsdGEpID0+IHtcbiAgICAgICAgICAgIG9ic1tzZWxmSWRdLnVwZGF0ZVN0YXR1c0VmZmVjdHMob2JzLCBzZWxmSWQpO1xuXG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgcGxheWVyIG1vdmVtZW50XG4gICAgICAgICAgICBvYnNbc2VsZklkXS54ICs9IG9ic1tzZWxmSWRdLnZlbG9jaXR5WCAqIGRlbHRhO1xuICAgICAgICAgICAgb2JzW3NlbGZJZF0ueSArPSBvYnNbc2VsZklkXS52ZWxvY2l0eVkgKiBkZWx0YTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgY29sbGlzaW9ucyB3aXRoIHRlcnJhaW4gYW5kIHJlcG9zaXRpb24gYWNjb3JkaW5nbHlcbiAgICAgICAgICAgIGNvbGxpc2lvbnMuY2hlY2tDb2xsaXNpb25zKHNlbGZJZCwgb2JzLCBwcmVmYWJzLnJlbmRlclNpemUsIChzcmNJZCwgY29sbGlzaW9uSWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob2JzW3NyY0lkXSAmJiBjb2xsaXNpb25JZCAhPSBzcmNJZCl7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob2JzW2NvbGxpc2lvbklkXS50eXBlKSB7ICAgICAgICAvLyBTaG91bGQgcGxheWVycyBjb2xsaWRlIHdpdGggb3RoZXIgcGxheWVycz9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVkVISUNMRTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVEVSUkFJTjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25zLnB1c2hCYWNrKG9icywgc3JjSWQsIGNvbGxpc2lvbklkLCBwcmVmYWJzLnJlbmRlclNpemUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlRG93bjogKG9icywgbW91c2VFdmVudCkgPT4geyAgIC8vIFByaW1hcnkgY2xpY2sgY2FzdHMgZmlyc3QgYWJpbGl0eVxuICAgICAgICAgICAgaWYgKG9ic1ttb3VzZUV2ZW50LnNvdXJjZUlkXS5hYmlsaXRpZXNbMF0gJiYgIWNoZWNrU3RhdHVzRWZmZWN0KG9icywgbW91c2VFdmVudC5zb3VyY2VJZCwgdHlwZXMuU3RhdHVzRWZmZWN0cy5TVFVOTkVEKSkge1xuICAgICAgICAgICAgICAgIG9ic1ttb3VzZUV2ZW50LnNvdXJjZUlkXS5hYmlsaXRpZXNbMF0uY2FzdChvYnMsIG1vdXNlRXZlbnQuc291cmNlSWQsIDAsIG1vdXNlRXZlbnQudGFyZ2V0WCwgbW91c2VFdmVudC50YXJnZXRZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb25QbGF5ZXJJbnB1dDogKG9icywgc2VsZklkLCBwbGF5ZXJJbnB1dCkgPT4ge1xuICAgICAgICAgICAgcGxheWVyID0gb2JzW3NlbGZJZF07XG4gICAgICAgICAgICBpZiAoY2hlY2tTdGF0dXNFZmZlY3Qob2JzLCBzZWxmSWQsIHR5cGVzLlN0YXR1c0VmZmVjdHMuU1RVTk5FRCkpIHtcbiAgICAgICAgICAgICAgICAgcGxheWVyLnZlbG9jaXR5WCA9IDA7XG4gICAgICAgICAgICAgICAgIHBsYXllci52ZWxvY2l0eVkgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgeERpciA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIHlEaXIgPSAwO1xuICAgIFxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXJJbnB1dC5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHhEaXIgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHhEaXIgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LnVwKSB7XG4gICAgICAgICAgICAgICAgICAgIHlEaXIgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LmRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgeURpciArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBwbGF5ZXIudmVsb2NpdHlYID0geERpciAqIHBsYXllci5zcGVlZDtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudmVsb2NpdHlZID0geURpciAqIHBsYXllci5zcGVlZDtcblxuICAgICAgICAgICAgICAgIGlmICh4RGlyICE9IDAgfHwgeURpciAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5mYWNpbmcgPSAoTWF0aC5hdGFuKHBsYXllci52ZWxvY2l0eVkgLyBwbGF5ZXIudmVsb2NpdHlYKSAqIDU3LjI5NTggKyA5MCkgKyh4RGlyIDwgMCA/IDE4MCA6IDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh4RGlyICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmhpdGJveFdpZHRoID0gb2JzW3NlbGZJZF0uaGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuaGl0Ym94SGVpZ2h0ID0gb2JzW3NlbGZJZF0ud2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh5RGlyICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmhpdGJveFdpZHRoID0gb2JzW3NlbGZJZF0ud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5oaXRib3hIZWlnaHQgPSBvYnNbc2VsZklkXS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAocGxheWVySW5wdXQuY3ljbGVFcXVpcG1lbnRGb3J3YXJkICYmICFwbGF5ZXJJbnB1dC5jeWNsZUVxdWlwbWVudEJhY2t3YXJkICYmIG9ic1tzZWxmSWRdLmN1cnJlbnRFcXVpcG1lbnQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5lcXVpcG1lbnRbcGxheWVyLmN1cnJlbnRFcXVpcG1lbnRdLm9uRGVxdWlwKG9icywgc2VsZklkKTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmN1cnJlbnRFcXVpcG1lbnQgPSBwbGF5ZXIuY3VycmVudEVxdWlwbWVudCArIDEgPj0gcGxheWVyLmVxdWlwbWVudC5sZW5ndGggPyAwIDogcGxheWVyLmN1cnJlbnRFcXVpcG1lbnQgKyAxO1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZXF1aXBtZW50W3BsYXllci5jdXJyZW50RXF1aXBtZW50XS5vbkVxdWlwKG9icywgc2VsZklkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LmN5Y2xlRXF1aXBtZW50QmFja3dhcmQgJiYgIXBsYXllcklucHV0LmN5Y2xlRXF1aXBtZW50Rm9yd2FyZCAmJiBvYnNbc2VsZklkXS5jdXJyZW50RXF1aXBtZW50ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuZXF1aXBtZW50W3BsYXllci5jdXJyZW50RXF1aXBtZW50XS5vbkRlcXVpcChvYnMsIHNlbGZJZCk7XG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5jdXJyZW50RXF1aXBtZW50ID0gcGxheWVyLmN1cnJlbnRFcXVpcG1lbnQgLSAxIDwgMCA/IHBsYXllci5lcXVpcG1lbnQubGVuZ3RoIC0gMSA6IHBsYXllci5jdXJyZW50RXF1aXBtZW50IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmVxdWlwbWVudFtwbGF5ZXIuY3VycmVudEVxdWlwbWVudF0ub25FcXVpcChvYnMsIHNlbGZJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXJJbnB1dC51c2VFcXVpcG1lbnQgJiYgb2JzW3NlbGZJZF0uY3VycmVudEVxdWlwbWVudCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzW3NlbGZJZF0uZXF1aXBtZW50W29ic1tzZWxmSWRdLmN1cnJlbnRFcXVpcG1lbnRdXG4gICAgICAgICAgICAgICAgICAgICAgICAudXNlKG9icywgc2VsZklkLCBwbGF5ZXJJbnB1dC50YXJnZXRYLCBwbGF5ZXJJbnB1dC50YXJnZXRZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LmFiaWxpdHkxICYmIG9ic1tzZWxmSWRdLmFiaWxpdGllc1swXSkge1xuICAgICAgICAgICAgICAgICAgICBvYnNbc2VsZklkXS5hYmlsaXRpZXNbMF0uY2FzdChvYnMsIHNlbGZJZCwgMCwgcGxheWVySW5wdXQudGFyZ2V0WCwgcGxheWVySW5wdXQudGFyZ2V0WSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXJJbnB1dC5hYmlsaXR5MiAmJiBvYnNbc2VsZklkXS5hYmlsaXRpZXNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzW3NlbGZJZF0uYWJpbGl0aWVzWzFdLmNhc3Qob2JzLCBzZWxmSWQsIDEsIHBsYXllcklucHV0LnRhcmdldFgsIHBsYXllcklucHV0LnRhcmdldFkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGxheWVySW5wdXQuYWJpbGl0eTMgJiYgb2JzW3NlbGZJZF0uYWJpbGl0aWVzWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic1tzZWxmSWRdLmFiaWxpdGllc1syXS5jYXN0KG9icywgc2VsZklkLCAyLCBwbGF5ZXJJbnB1dC50YXJnZXRYLCBwbGF5ZXJJbnB1dC50YXJnZXRZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LmFiaWxpdHk0ICYmIG9ic1tzZWxmSWRdLmFiaWxpdGllc1szXSkge1xuICAgICAgICAgICAgICAgICAgICBvYnNbc2VsZklkXS5hYmlsaXRpZXNbM10uY2FzdChvYnMsIHNlbGZJZCwgMywgcGxheWVySW5wdXQudGFyZ2V0WCwgcGxheWVySW5wdXQudGFyZ2V0WSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAocGxheWVySW5wdXQucGlja3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvbnMuY2hlY2tDb2xsaXNpb25zKHNlbGZJZCwgb2JzLCBwcmVmYWJzLnJlbmRlclNpemUsIChzcmNJZCwgY29sbGlzaW9uSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYnNbc3JjSWRdICYmIGNvbGxpc2lvbklkICE9IHNyY0lkICYmIG9ic1tjb2xsaXNpb25JZF0udHlwZSA9PSB0eXBlcy5PYmplY3RUeXBlcy5JTlRFUkFDVEFCTEUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNbY29sbGlzaW9uSWRdLm9uSW50ZXJhY3Qob2JzLCBjb2xsaXNpb25JZCwgc3JjSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGhlYWw6IChvYnMsIHNlbGZJZCwgYW1vdW50KSA9PiB7XG4gICAgICAgICAgICBpZiAob2JzW3NlbGZJZF0pIHtcbiAgICAgICAgICAgICAgICB2YXIgaGVhbEFtb3VudCA9IG9ic1tzZWxmSWRdLmhlYWx0aCArIGFtb3VudCA+PSBvYnNbc2VsZklkXS5tYXhIZWFsdGhcbiAgICAgICAgICAgICAgICAgICAgPyBvYnNbc2VsZklkXS5tYXhIZWFsdGggLSBvYnNbc2VsZklkXS5oZWFsdGhcbiAgICAgICAgICAgICAgICAgICAgOiBhbW91bnQ7XG4gICAgICAgICAgICAgICAgb2JzW3NlbGZJZF0uaGVhbHRoICs9IGhlYWxBbW91bnRcbiAgICAgICAgICAgICAgICBwcmVmYWJzLmdlbmVyYXRlTmV3KG9icywgc2VsZklkLCAwLCAwLCB0eXBlcy5PYmplY3RUeXBlcy5DT01CQVRfVEVYVCwgdHlwZXMuQ29tYmF0VGV4dC5IRUFMX1RFWFQsIHsgdGV4dDogXCIrXCIgKyBoZWFsQW1vdW50IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYW1hZ2U6IChvYnMsIHNlbGZJZCwgYW1vdW50LCBkYW1hZ2VUeXBlKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2hlY2tTdGF0dXNFZmZlY3Qob2JzLCBzZWxmSWQsIHR5cGVzLlN0YXR1c0VmZmVjdHMuSU5WVUxORVJBQkxFKSkge1xuICAgICAgICAgICAgICAgIHByZWZhYnMuZ2VuZXJhdGVOZXcob2JzLCBzZWxmSWQsIDAsIDAsIHR5cGVzLk9iamVjdFR5cGVzLkNPTUJBVF9URVhULCB0eXBlcy5Db21iYXRUZXh0LklOVlVMTkVSQUJMRV9URVhULCB7IHRleHQ6IFwiKiBcIiArIGFtb3VudCB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuZGFtYWdlKG9icywgc2VsZklkLCBhbW91bnQsIGRhbWFnZVR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGVTdGF0dXNFZmZlY3RzOiAob2JzLCBzZWxmSWQpID0+IHtcbiAgICAgICAgICAgIHZhciBuZXdUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgICAgc3RhdHVzRWZmZWN0Q2hlY2tIZWxwZXIob2JzLCBzZWxmSWQsIHR5cGVzLlN0YXR1c0VmZmVjdHMuU1RVTk5FRCwgbmV3VGltZSk7XG4gICAgICAgICAgICBzdGF0dXNFZmZlY3RDaGVja0hlbHBlcihvYnMsIHNlbGZJZCwgdHlwZXMuU3RhdHVzRWZmZWN0cy5JTlZVTE5FUkFCTEUsIG5ld1RpbWUpO1xuICAgICAgICB9LFxuICAgICAgICBhZGRTdGF0dXNFZmZlY3Q6IChvYnMsIGlkLCBlZmZlY3QsIGR1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICB2YXIgbmV3VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIE9ubHkgcmVwbGFjZSB0aGUgY3VycmVudCBzdGF0dXMgZWZmZWN0IGxhc3QgY2FzdCBhbmQgZHVyYXRpb24gaWYgdGhlIG5ldyBkdXJhdGlvbiBpcyBsb25nZXIgdGhhbiB3aGF0J3MgbGVmdFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XSB8fFxuICAgICAgICAgICAgICAgIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdLmR1cmF0aW9uIC0gKG5ld1RpbWUgLSBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XS5sYXN0KSA8IGR1cmF0aW9uXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XSA9IHsgfTtcbiAgICAgICAgICAgICAgICBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XS5sYXN0ID0gbmV3VGltZTtcbiAgICAgICAgICAgICAgICBvYnNbaWRdLnN0YXR1c0VmZmVjdHNbZWZmZWN0XS5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHN0YXR1c0VmZmVjdENoZWNrSGVscGVyKG9icywgaWQsIGVmZmVjdCwgbmV3VGltZSkge1xuICAgIGlmIChcbiAgICAgICAgb2JzW2lkXS5zdGF0dXNFZmZlY3RzW2VmZmVjdF0gJiZcbiAgICAgICAgbmV3VGltZSAtIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdLmxhc3QgPj0gb2JzW2lkXS5zdGF0dXNFZmZlY3RzW2VmZmVjdF0uZHVyYXRpb25cbiAgICApIHtcbiAgICAgICAgZGVsZXRlIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tTdGF0dXNFZmZlY3Qob2JzLCBpZCwgZWZmZWN0KSB7XG4gICAgcmV0dXJuIG9ic1tpZF0uc3RhdHVzRWZmZWN0c1tlZmZlY3RdO1xufVxuXG5mdW5jdGlvbiBjaGVja1N0YXR1c0VmZmVjdE9iamVjdChvYmplY3QsIGVmZmVjdCkge1xuICAgIHJldHVybiBvYmplY3Quc3RhdHVzRWZmZWN0c1tlZmZlY3RdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG4gICAgY2hlY2tTdGF0dXNFZmZlY3Q6IGNoZWNrU3RhdHVzRWZmZWN0T2JqZWN0LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UsIFN0cm9rZVR5cGVzIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgcGxheWVyIG9iamVjdFxuICogQHBhcmFtIG9iamVjdCBUaGUgcGxheWVyIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlciBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwbGF5ZXJNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiIzk5OTk5OVwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzaGFkb3dIZWlnaHQ6IDYsXG4gICAgICAgIHN0cm9rZXM6IFt7XG4gICAgICAgICAgICB0eXBlOiBTdHJva2VUeXBlcy5TVkcsXG4gICAgICAgICAgICBwYXRoOiAnTSA4IDMyIEwgOCAzMiBRIDQgMTIgMTYgMCBRIDI4IDEyIDI0IDMyIFEgMTYgMTYgOCAzMicsIFxuICAgICAgICAgICAgcGFyYW1zOiB7IGZpbGw6ICcjOTkyMjIyJywgZmlsbFN0eWxlOiAnc29saWQnLCBzdHJva2VXaWR0aDogMC4yIH1cbiAgICAgICAgfV1cbiAgICB9XG59XG4iLCJ2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vT2JqZWN0VHlwZXNcIik7XG52YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuL1ByZWZhYnNcIik7XG5cbmZ1bmN0aW9uIGRhbWFnZShvYnMsIHNlbGZJZCwgYW1vdW50LCBkYW1hZ2VUeXBlKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4vUHJlZmFic1wiKTtcblxuICAgIG9ic1tzZWxmSWRdLmhlYWx0aCAtPSBhbW91bnQ7XG5cbiAgICB2YXIgdGV4dFR5cGUgPSB1bmRlZmluZWQ7XG4gICAgc3dpdGNoIChkYW1hZ2VUeXBlKSB7XG4gICAgICAgIGNhc2UgdHlwZXMuRGFtYWdlVHlwZXMuTk9STUFMOlxuICAgICAgICAgICAgdGV4dFR5cGUgPSB0eXBlcy5Db21iYXRUZXh0LkRBTUFHRV9URVhUO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdHlwZXMuRGFtYWdlVHlwZXMuRklSRTpcbiAgICAgICAgICAgIHRleHRUeXBlID0gdHlwZXMuQ29tYmF0VGV4dC5GSVJFX0RBTUFHRV9URVhUO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICh0ZXh0VHlwZSkgcHJlZmFicy5nZW5lcmF0ZU5ldyhvYnMsIHNlbGZJZCwgMCwgMCwgdHlwZXMuT2JqZWN0VHlwZXMuQ09NQkFUX1RFWFQsIHRleHRUeXBlLCB7IHRleHQ6IFwiLVwiICsgYW1vdW50IH0pO1xuXG4gICAgaWYgKG9ic1tzZWxmSWRdLmhlYWx0aCA8PSAwKXtcbiAgICAgICAgb2JzW3NlbGZJZF0uZGVhdGhyYXR0bGUob2JzLCBzZWxmSWQpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGFtYWdlOiBkYW1hZ2UsXG59XG4iLCJ2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vT2JqZWN0VHlwZXNcIik7XG52YXIgY29sbGlzaW9ucyA9IHJlcXVpcmUoXCIuLi9Db2xsaXNpb25zXCIpO1xudmFyIHV0aWxzID0gcmVxdWlyZShcIi4vUHJlZmFiVXRpbHNcIik7XG5cbi8vIC0tLS0tIFByZWZhYnMgLS0tLS0gLy9cbnZhciBfcGxheWVyID0gcmVxdWlyZShcIi4vUGxheWVyL19QbGF5ZXJcIik7XG52YXIgZ29kID0gcmVxdWlyZShcIi4vUGxheWVyL0dvZFwiKTtcbnZhciBmaXJlbWFnZSA9IHJlcXVpcmUoXCIuL1BsYXllci9GaXJlTWFnZVwiKTtcblxudmFyIF9ncmF2ZXN0b25lID0gcmVxdWlyZShcIi4vR3JhdmVzdG9uZS9fR3JhdmVzdG9uZVwiKTtcblxudmFyIF9wcm9qZWN0aWxlID0gcmVxdWlyZShcIi4vUHJvamVjdGlsZS9fUHJvamVjdGlsZVwiKTtcbnZhciBmaXJlYm9sdFByb2plY3RpbGUgPSByZXF1aXJlKFwiLi9Qcm9qZWN0aWxlL0ZpcmVib2x0UHJvamVjdGlsZVwiKTtcbnZhciBmbGFtZVBpbGxhclByb2plY3RpbGUgPSByZXF1aXJlKFwiLi9Qcm9qZWN0aWxlL0ZsYW1lUGlsbGFyUHJvamVjdGlsZVwiKTtcbnZhciBmbGFtZURhc2hQcm9qZWN0aWxlID0gcmVxdWlyZShcIi4vUHJvamVjdGlsZS9GbGFtZURhc2hQcm9qZWN0aWxlXCIpO1xuXG52YXIgX3RlcnJhaW4gPSByZXF1aXJlKFwiLi9UZXJyYWluL19UZXJyYWluXCIpO1xudmFyIHRyZWUgPSByZXF1aXJlKFwiLi9UZXJyYWluL1RyZWVcIik7XG52YXIgd2FsbEhvcml6ID0gcmVxdWlyZShcIi4vVGVycmFpbi9XYWxsSG9yaXpcIik7XG52YXIgY2FzdGxlV2FsbEhvcml6ID0gcmVxdWlyZShcIi4vVGVycmFpbi9DYXN0bGVXYWxsSG9yaXpcIik7XG52YXIgY2FzdGxlV2FsbFZlcnQgPSByZXF1aXJlKFwiLi9UZXJyYWluL0Nhc3RsZVdhbGxWZXJ0XCIpO1xuXG52YXIgX2ludGVyYWN0YWJsZSA9IHJlcXVpcmUoXCIuL0ludGVyYWN0YWJsZS9fSW50ZXJhY3RhYmxlXCIpO1xudmFyIGhlYWx0aFBpY2t1cCA9IHJlcXVpcmUoXCIuL0ludGVyYWN0YWJsZS9IZWFsdGhQaWNrdXBcIik7XG52YXIgY2FyRW50ZXIgPSByZXF1aXJlKFwiLi9JbnRlcmFjdGFibGUvQ2FyRW50ZXJcIik7XG52YXIgcGxheWVyVHlwZUNoYW5nZXIgPSByZXF1aXJlKFwiLi9JbnRlcmFjdGFibGUvUGxheWVyVHlwZUNoYW5nZXJcIik7XG52YXIgdGVsZXBvcnRlciA9IHJlcXVpcmUoXCIuL0ludGVyYWN0YWJsZS9UZWxlcG9ydGVyXCIpO1xuXG52YXIgX3RyaWdnZXIgPSByZXF1aXJlKFwiLi9UcmlnZ2VyL19UcmlnZ2VyXCIpO1xudmFyIHNwaWtlVHJhcCA9IHJlcXVpcmUoXCIuL1RyaWdnZXIvU3Bpa2VUcmFwXCIpO1xudmFyIGludnVsblBsYXRmb3JtID0gcmVxdWlyZShcIi4vVHJpZ2dlci9JbnZ1bG5QbGF0Zm9ybVwiKTtcblxudmFyIF92ZWhpY2xlID0gcmVxdWlyZShcIi4vVmVoaWNsZS9fVmVoaWNsZVwiKTtcbnZhciBjYXIgPSByZXF1aXJlKFwiLi9WZWhpY2xlL0NhclwiKTtcblxudmFyIF9kZWNvcmF0aW9uID0gcmVxdWlyZShcIi4vRGVjb3JhdGlvbi9fRGVjb3JhdGlvblwiKTtcbnZhciBkZWFkRHVtbXkgPSByZXF1aXJlKFwiLi9EZWNvcmF0aW9uL0RlYWREdW1teVwiKTtcbnZhciB3YXRjaFRvd2VyID0gcmVxdWlyZShcIi4vRGVjb3JhdGlvbi9XYXRjaFRvd2VyXCIpO1xudmFyIGNhc3RsZUZsb29yID0gcmVxdWlyZShcIi4vRGVjb3JhdGlvbi9DYXN0bGVGbG9vclwiKTtcblxudmFyIGJsYXN0ZXIgPSByZXF1aXJlKFwiLi9FcXVpcG1lbnQvQmxhc3RlclwiKTtcbnZhciBzY2FubmVyID0gcmVxdWlyZShcIi4vRXF1aXBtZW50L1NjYW5uZXJcIik7XG52YXIgYnVpbGRlciA9IHJlcXVpcmUoXCIuL0VxdWlwbWVudC9CdWlsZGVyXCIpO1xudmFyIGJpbm9jdWxhcnMgPSByZXF1aXJlKFwiLi9FcXVpcG1lbnQvQmlub2N1bGFyc1wiKTtcblxudmFyIGZpcmVib2x0ID0gcmVxdWlyZShcIi4vQWJpbGl0aWVzL0ZpcmVib2x0XCIpO1xudmFyIGZsYW1lUGlsbGFyID0gcmVxdWlyZShcIi4vQWJpbGl0aWVzL0ZsYW1lUGlsbGFyXCIpO1xudmFyIGZsYW1lRGFzaCA9IHJlcXVpcmUoXCIuL0FiaWxpdGllcy9GbGFtZURhc2hcIik7XG52YXIgZmxhbWVCYXJyaWVyID0gcmVxdWlyZShcIi4vQWJpbGl0aWVzL0ZsYW1lQmFycmllclwiKTtcblxudmFyIF9jb21iYXRUZXh0ID0gcmVxdWlyZShcIi4vQ29tYmF0VGV4dC9fQ29tYmF0VGV4dFwiKTtcbnZhciBkYW1hZ2VUZXh0ID0gcmVxdWlyZShcIi4vQ29tYmF0VGV4dC9EYW1hZ2VUZXh0XCIpO1xudmFyIGZpcmVEYW1hZ2VUZXh0ID0gcmVxdWlyZShcIi4vQ29tYmF0VGV4dC9GaXJlRGFtYWdlVGV4dFwiKTtcbnZhciBpbnZ1bG5lcmFibGVUZXh0ID0gcmVxdWlyZShcIi4vQ29tYmF0VGV4dC9JbnZ1bG5lcmFibGVUZXh0XCIpO1xudmFyIGhlYWxUZXh0ID0gcmVxdWlyZShcIi4vQ29tYmF0VGV4dC9IZWFsVGV4dFwiKTtcblxudmFyIF9lbmVteSA9IHJlcXVpcmUoXCIuL0VuZW15L19FbmVteVwiKTtcblxuLy8gRXhwb3J0IHJlbmRlciBzaXplXG52YXIgcmVuZGVyU2l6ZSA9IDQ7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHJlbmRlclNpemU6IHJlbmRlclNpemUsXG4gICAgLy8gR2VuZXJhdGUgYSBuZXcgdGVycmFpbiBvYmplY3RcbiAgICBnZW5lcmF0ZU5ldzogKG9icywgc3JjLCBwb3NYLCBwb3NZLCB0eXBlLCBzdWJ0eXBlLCBwYXJhbXMgPSB7IH0pID0+IHtcbiAgICAgICAgdmFyIG5ld09iajtcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5QTEFZRVI6XG4gICAgICAgICAgICAgICAgbmV3T2JqID0gX3BsYXllci5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzdWJ0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuUGxheWVyLkdPRDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IGdvZC5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlBsYXllci5GSVJFX01BR0U6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBmaXJlbWFnZS5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYnNbc3JjXSA9IG5ld09iajtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLkdSQVZFU1RPTkU6XG4gICAgICAgICAgICAgICAgbmV3T2JqID0gX2dyYXZlc3RvbmUuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpO1xuICAgICAgICAgICAgICAgIG9ic1tzcmNdID0gbmV3T2JqO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuUFJPSkVDVElMRTpcbiAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSB1bmlxdWUgSWQgZm9yIG5ldyBwcm9qZWN0aWxlXG4gICAgICAgICAgICAgICAgdmFyIG5ld0lkID0gc3JjLmNvbmNhdChcIjpcIiArIHR5cGUgKyBcIjpcIiArIHN1YnR5cGUgKyBcIjpcIiwgcG9zWCwgXCI6XCIsIHBvc1kpO1xuICAgICAgICAgICAgICAgIHZhciBkdXAgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlIChvYnNbbmV3SWQuY29uY2F0KFwiOlwiICsgZHVwKV0pe1xuICAgICAgICAgICAgICAgICAgICBkdXArKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBuZXdPYmogPSBfcHJvamVjdGlsZS5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzdWJ0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuUHJvamVjdGlsZS5GSVJFQk9MVF9QUk9KRUNUSUxFOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gZmlyZWJvbHRQcm9qZWN0aWxlLmdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBuZXdPYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuUHJvamVjdGlsZS5GTEFNRV9QSUxMQVJfUFJPSkVDVElMRTpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IGZsYW1lUGlsbGFyUHJvamVjdGlsZS5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlByb2plY3RpbGUuRkxBTUVfREFTSF9QUk9KRUNUSUxFOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gZmxhbWVEYXNoUHJvamVjdGlsZS5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbmV3T2JqKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2JzW25ld0lkLmNvbmNhdChcIjpcIiArIGR1cCldID0gbmV3T2JqO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVEVSUkFJTjpcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBfdGVycmFpbi5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzdWJ0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuVGVycmFpbi5UUkVFOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gdHJlZS5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlRlcnJhaW4uV0FMTF9IT1JJWjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IHdhbGxIb3Jpei5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlRlcnJhaW4uQ0FTVExFX1dBTExfSE9SSVo6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBjYXN0bGVXYWxsSG9yaXouZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIG5ld09iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5UZXJyYWluLkNBU1RMRV9XQUxMX1ZFUlQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBjYXN0bGVXYWxsVmVydC5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuSU5URVJBQ1RBQkxFOlxuICAgICAgICAgICAgICAgIG5ld09iaiA9IF9pbnRlcmFjdGFibGUuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoc3VidHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkludGVyYWN0YWJsZS5IRUFMVEhfUElDS1VQOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gaGVhbHRoUGlja3VwLmdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBuZXdPYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuSW50ZXJhY3RhYmxlLkNBUl9FTlRFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IGNhckVudGVyLmdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBuZXdPYmopO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNbc3JjICsgXCI6XCIgKyB0eXBlICsgXCI6XCIgKyBzdWJ0eXBlXSA9IG5ld09iajtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5JbnRlcmFjdGFibGUuUExBWUVSX1RZUEVfQ0hBTkdFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IHBsYXllclR5cGVDaGFuZ2VyLmdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBuZXdPYmosIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5JbnRlcmFjdGFibGUuVEVMRVBPUlRFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IHRlbGVwb3J0ZXIuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIG5ld09iaiwgeyBkZXN0WDogcGFyYW1zLmRlc3RYLCBkZXN0WTogcGFyYW1zLmRlc3RZIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVFJJR0dFUjpcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBfdHJpZ2dlci5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzdWJ0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuVHJpZ2dlci5TUElLRV9UUkFQOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gc3Bpa2VUcmFwLmdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBuZXdPYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuVHJpZ2dlci5JTlZVTE5fUExBVEZPUk06XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBpbnZ1bG5QbGF0Zm9ybS5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVkVISUNMRTpcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBfdmVoaWNsZS5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzdWJ0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuVmVoaWNsZS5DQVI6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBjYXIuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIG5ld09iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5ERUNPUkFUSU9OOlxuICAgICAgICAgICAgICAgIG5ld09iaiA9IF9kZWNvcmF0aW9uLmdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHN1YnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5EZWNvcmF0aW9uLkRFQURfRFVNTVk6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBkZWFkRHVtbXkuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIG5ld09iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5EZWNvcmF0aW9uLldBVENIX1RPV0VSOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gd2F0Y2hUb3dlci5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkRlY29yYXRpb24uQ0FTVExFX0ZMT09SOlxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gY2FzdGxlRmxvb3IuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIG5ld09iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLkNPTUJBVF9URVhUOlxuICAgICAgICAgICAgICAgIC8vIEdlbmVyYXRlIHVuaXF1ZSBJZCBmb3IgbmV3IGNvbWJhdCB0ZXh0XG4gICAgICAgICAgICAgICAgdmFyIG5ld0lkID0gc3JjLmNvbmNhdChcIjpcIiArIHR5cGUgKyBcIjpcIiArIHN1YnR5cGUgKyBcIjpcIiwgcG9zWCwgXCI6XCIsIHBvc1kpO1xuICAgICAgICAgICAgICAgIHZhciBkdXAgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlIChvYnNbbmV3SWQuY29uY2F0KFwiOlwiICsgZHVwKV0pe1xuICAgICAgICAgICAgICAgICAgICBkdXArKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3T2JqID0gX2NvbWJhdFRleHQuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzdWJ0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuQ29tYmF0VGV4dC5EQU1BR0VfVEVYVDpcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IGRhbWFnZVRleHQuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIG5ld09iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5Db21iYXRUZXh0LkZJUkVfREFNQUdFX1RFWFQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBmaXJlRGFtYWdlVGV4dC5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkNvbWJhdFRleHQuSU5WVUxORVJBQkxFX1RFWFQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBpbnZ1bG5lcmFibGVUZXh0LmdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBuZXdPYmopO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuQ29tYmF0VGV4dC5IRUFMX1RFWFQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSBoZWFsVGV4dC5nZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgbmV3T2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYnNbbmV3SWQuY29uY2F0KFwiOlwiICsgZHVwKV0gPSBuZXdPYmo7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5FTkVNWTpcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBfZW5lbXkuZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpO1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoc3VidHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IENvbnNpZGVyIHJlbW92aW5nIHRoaXM/XG4gICAgICAgIGlmICghbmV3T2JqKSB7XG4gICAgICAgICAgICBuZXdPYmogPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogdHlwZXMuT2JqZWN0VHlwZXMuVEVSUkFJTixcbiAgICAgICAgICAgICAgICBzdWJ0eXBlOiBzdWJ0eXBlLFxuICAgICAgICAgICAgICAgIHg6IHBvc1gsXG4gICAgICAgICAgICAgICAgeTogcG9zWSxcbiAgICAgICAgICAgICAgICB3aWR0aDogNixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDYsXG4gICAgICAgICAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgICAgICAgICBoaXRib3hXaWR0aDogNixcbiAgICAgICAgICAgICAgICBoaXRib3hIZWlnaHQ6IDYsXG4gICAgICAgICAgICAgICAgaGVhbHRoOiAxLFxuICAgICAgICAgICAgICAgIG1heEhlYWx0aDogMSxcbiAgICAgICAgICAgICAgICB1cGRhdGU6IChvYnMsIHNlbGZJZCwgZGVsdGEpID0+IHsgfSxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IHV0aWxzLmRhbWFnZSxcbiAgICAgICAgICAgICAgICBkZWF0aHJhdHRsZTogKG9icywgc2VsZklkKSA9PiB7IH0sXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb2JzW3NyYyArIFwiOlwiICsgdHlwZSArIFwiOlwiICsgc3VidHlwZSArIFwiOlwiICsgcG9zWCArIFwiOlwiICsgcG9zWV0gPSBuZXdPYmo7XG4gICAgfSxcbiAgICBuZXdFcXVpcG1lbnQ6IChvYnMsIHR5cGUsIHBhcmFtcyA9IHsgfSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuRXF1aXBtZW50VHlwZXMuQkxBU1RFUjpcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxhc3Rlci5nZW5lcmF0ZU5ldyhvYnMsIHBhcmFtcyk7XG4gICAgICAgICAgICBjYXNlIHR5cGVzLkVxdWlwbWVudFR5cGVzLlNDQU5ORVI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjYW5uZXIuZ2VuZXJhdGVOZXcob2JzLCBwYXJhbXMpO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5FcXVpcG1lbnRUeXBlcy5CVUlMREVSOlxuICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmdlbmVyYXRlTmV3KG9icywgcGFyYW1zKTtcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuRXF1aXBtZW50VHlwZXMuQklOT0NVTEFSUzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYmlub2N1bGFycy5nZW5lcmF0ZU5ldyhvYnMsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG5ld0FiaWxpdHk6IChvYnMsIHR5cGUsIHBhcmFtcyA9IHsgfSkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuQWJpbGl0aWVzLkZJUkVCT0xUOlxuICAgICAgICAgICAgICAgIHJldHVybiBmaXJlYm9sdC5nZW5lcmF0ZU5ldyhvYnMpO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5BYmlsaXRpZXMuRkxBTUVfUElMTEFSOlxuICAgICAgICAgICAgICAgIHJldHVybiBmbGFtZVBpbGxhci5nZW5lcmF0ZU5ldyhvYnMpO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5BYmlsaXRpZXMuRkxBTUVfREFTSDpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmxhbWVEYXNoLmdlbmVyYXRlTmV3KG9icyk7XG4gICAgICAgICAgICBjYXNlIHR5cGVzLkFiaWxpdGllcy5GTEFNRV9CQVJSSUVSOlxuICAgICAgICAgICAgICAgIHJldHVybiBmbGFtZUJhcnJpZXIuZ2VuZXJhdGVOZXcob2JzKTtcbiAgICAgICAgfVxuICAgIH0sXG59IiwidmFyIGZpcmVib2x0U3BlZWQgPSAwLjM1O1xudmFyIGZpcmVib2x0V2lkdGggPSAzO1xudmFyIGZpcmVib2x0SGVpZ2h0ID0gMztcbnZhciBmaXJlYm9sdEhpdEJveFJhZGl1cyA9IDEuNTtcbnZhciBmaXJlYm9sdERhbWFnZSA9IDEyO1xudmFyIGZpcmVib2x0VGlja0luY3JlYXNlID0gMTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcbiAgICB2YXIgZmlyZW1hZ2UgPSByZXF1aXJlKFwiLi4vUGxheWVyL0ZpcmVNYWdlXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLlByb2plY3RpbGUuRklSRUJPTFRfUFJPSkVDVElMRSxcbiAgICAgICAgdmVsb2NpdHlYOiBNYXRoLmNvcyhiYXNlLmFuZ2xlKSAqIGZpcmVib2x0U3BlZWQsXG4gICAgICAgIHZlbG9jaXR5WTogTWF0aC5zaW4oYmFzZS5hbmdsZSkgKiBmaXJlYm9sdFNwZWVkLFxuICAgICAgICB3aWR0aDogZmlyZWJvbHRXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBmaXJlYm9sdEhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuQ0lSQyxcbiAgICAgICAgaGl0Ym94UmFkaXVzOiBmaXJlYm9sdEhpdEJveFJhZGl1cyxcbiAgICAgICAgZGFtYWdlOiBmaXJlYm9sdERhbWFnZSxcbiAgICAgICAgb25IaXQ6IChvYnMsIHNyY0lkLCBjb2xsaXNpb25JZCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChvYnNbY29sbGlzaW9uSWRdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlBMQVlFUjpcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLkdSQVZFU1RPTkU6XG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5WRUhJQ0xFOlxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVEVSUkFJTjpcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLkVORU1ZOlxuICAgICAgICAgICAgICAgICAgICBpZiAob2JzW3NyY0lkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ic1tjb2xsaXNpb25JZF0gJiYgb2JzW2NvbGxpc2lvbklkXS5kYW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJlbWFnZS5pbmNyZWFzZUZpcmVUaWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic1tzcmNJZF0uc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JzW2NvbGxpc2lvbklkXS50eXBlID09PSB0eXBlcy5PYmplY3RUeXBlcy5QTEFZRVIgfHwgb2JzW2NvbGxpc2lvbklkXS50eXBlID09PSB0eXBlcy5PYmplY3RUeXBlcy5FTkVNWSkgPyBmaXJlYm9sdFRpY2tJbmNyZWFzZSA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGFtYWdlID0gb2JzW3NyY0lkXS5kYW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyZURhbWFnZSA9IG9ic1tvYnNbc3JjSWRdLnNvdXJjZV0uZmlyZVRpY2tzID8gb2JzW29ic1tzcmNJZF0uc291cmNlXS5maXJlVGlja3MgKiBmaXJlbWFnZS5maXJlVGlja0RhbWFnZTogMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic1tjb2xsaXNpb25JZF0uZGFtYWdlKG9icywgY29sbGlzaW9uSWQsIGRhbWFnZSwgdHlwZXMuRGFtYWdlVHlwZXMuTk9STUFMKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlyZURhbWFnZSAmJiBvYnNbY29sbGlzaW9uSWRdKSBvYnNbY29sbGlzaW9uSWRdLmRhbWFnZSggb2JzLCBjb2xsaXNpb25JZCwgZmlyZURhbWFnZSwgdHlwZXMuRGFtYWdlVHlwZXMuRklSRSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgb2JzW3NyY0lkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgZmlyZWJvbHQgcHJvamVjdGlsZVxuICogQHBhcmFtIG9iamVjdCBUaGUgZmlyZWJvbHQgcHJvamVjdGlsZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdHNcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXJlYm9sdFByb2plY3RpbGVNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiI0NENUM1Q1wiLCBcIiNGRjhDMDBcIl0sXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgIGZhY2luZzogb2JqZWN0LmZhY2luZyxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMC41LFxuICAgICAgICAgICAgY2VsbFk6IDAuNSxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDEsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMSxcbiAgICAgICAgICAgIHN3YXRjaDogMVxuICAgICAgICB9LF1cbiAgICB9XG59XG4iLCJ2YXIgZmxhbWVEYXNoU3BlZWQgPSAwLjE0O1xudmFyIGZsYW1lRGFzaFdpZHRoID0gMjtcbnZhciBmbGFtZURhc2hIZWlnaHQgPSAyO1xudmFyIGZsYW1lRGFzaEhpdEJveFJhZGl1cyA9IDE7XG52YXIgZmxhbWVEYXNoRGFtYWdlID0gNjtcbnZhciBmbGFtZURhc2hUaWNrSW5jcmVhc2UgPSAyO1xudmFyIGZsYW1lRGFzaFRyYWNraW5nUmFkaXVzID0gMTUwO1xudmFyIGZsYW1lRGFzaE1heFByb2pEaXN0YW5jZSA9IGZsYW1lRGFzaFRyYWNraW5nUmFkaXVzICogMjtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIHByZWZhYnMgPSByZXF1aXJlKFwiLi4vUHJlZmFic1wiKTtcbiAgICB2YXIgZmlyZW1hZ2UgPSByZXF1aXJlKFwiLi4vUGxheWVyL0ZpcmVNYWdlXCIpO1xuICAgIHZhciBjb2xsaXNpb25zID0gcmVxdWlyZShcIi4uLy4uL0NvbGxpc2lvbnNcIik7XG5cbiAgICB2YXIgdHJhY2tJZCA9IHVuZGVmaW5lZDtcbiAgICB2YXIgc21hbGxlc3REaXN0ID0gdW5kZWZpbmVkO1xuXG4gICAgY29sbGlzaW9ucy5jaGVja0NvbGxpc2lvbnNCeURpc3RhbmNlKHNyYywgb2JzLCBmbGFtZURhc2hUcmFja2luZ1JhZGl1cywgKHNyY0lkLCBjb2xsaXNpb25JZCwgZGlzdCkgPT4ge1xuICAgICAgICBpZiAob2JzW2NvbGxpc2lvbklkXSAmJiBvYnNbc3JjSWRdICYmIHNyY0lkICE9PSBjb2xsaXNpb25JZCkge1xuICAgICAgICAgICAgc3dpdGNoIChvYnNbY29sbGlzaW9uSWRdLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlBMQVlFUjpcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLkVORU1ZOlxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuR1JBVkVTVE9ORTpcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlZFSElDTEU6XG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5URVJSQUlOOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyYWNrSWQgfHwgZGlzdCA8IHNtYWxsZXN0RGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2tJZCA9IGNvbGxpc2lvbklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgc21hbGxlc3REaXN0ID0gZGlzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdHJhY2tJZCkgcmV0dXJuO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLlByb2plY3RpbGUuRkxBTUVfREFTSF9QUk9KRUNUSUxFLFxuICAgICAgICB2ZWxvY2l0eVg6IDAsXG4gICAgICAgIHZlbG9jaXR5WTogMCxcbiAgICAgICAgd2lkdGg6IGZsYW1lRGFzaFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGZsYW1lRGFzaEhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGZsYW1lRGFzaEhpdEJveFJhZGl1cyxcbiAgICAgICAgaGl0Ym94SGVpZ2h0OiBmbGFtZURhc2hIaXRCb3hSYWRpdXMsXG4gICAgICAgIGRhbWFnZTogZmxhbWVEYXNoRGFtYWdlLFxuICAgICAgICB0cmFja0lkOiB0cmFja0lkLFxuICAgICAgICBtYXhQcm9qRGlzdDogZmxhbWVEYXNoTWF4UHJvakRpc3RhbmNlLFxuICAgICAgICB1cGRhdGU6IChvYnMsIHNlbGZJZCwgZGVsdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChvYnNbc2VsZklkXSAmJiBvYnNbb2JzW3NlbGZJZF0udHJhY2tJZF0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhvYnNbc2VsZklkXS54IC0gb2JzW29ic1tzZWxmSWRdLnRyYWNrSWRdLngsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3cob2JzW3NlbGZJZF0ueSAtIG9ic1tvYnNbc2VsZklkXS50cmFja0lkXS55LCAyKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IGZsYW1lRGFzaFRyYWNraW5nUmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvYnNbc2VsZklkXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzW29ic1tzZWxmSWRdLnRyYWNrSWRdLnkgLSBvYnNbc2VsZklkXS55LFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzW29ic1tzZWxmSWRdLnRyYWNrSWRdLnggLSBvYnNbc2VsZklkXS54KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG9ic1tzZWxmSWRdLnZlbG9jaXR5WCA9IE1hdGguY29zKGFuZ2xlKSAqIGZsYW1lRGFzaFNwZWVkLFxuICAgICAgICAgICAgICAgICAgICBvYnNbc2VsZklkXS52ZWxvY2l0eVkgPSBNYXRoLnNpbihhbmdsZSkgKiBmbGFtZURhc2hTcGVlZCxcblxuICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgcHJvamVjdGlsZSBtb3ZlbWVudFxuICAgICAgICAgICAgICAgICAgICBvYnNbc2VsZklkXS54ICs9IG9ic1tzZWxmSWRdLnZlbG9jaXR5WCAqIGRlbHRhO1xuICAgICAgICAgICAgICAgICAgICBvYnNbc2VsZklkXS55ICs9IG9ic1tzZWxmSWRdLnZlbG9jaXR5WSAqIGRlbHRhO1xuICAgICAgICAgICAgICAgICAgICBvYnNbc2VsZklkXS5kaXN0ICs9IE1hdGguc3FydChcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgucG93KG9ic1tzZWxmSWRdLnZlbG9jaXR5WCAqIGRlbHRhLCAyKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhvYnNbc2VsZklkXS52ZWxvY2l0eVkgKiBkZWx0YSwgMikpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvbnMuY2hlY2tDb2xsaXNpb25zKHNlbGZJZCwgb2JzLCBwcmVmYWJzLnJlbmRlclNpemUsIChzcmNJZCwgY29sbGlzaW9uSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYnNbc3JjSWRdICYmIGNvbGxpc2lvbklkICE9IHNyY0lkICYmIGNvbGxpc2lvbklkICE9IG9ic1tzcmNJZF0uc291cmNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNbc3JjSWRdLm9uSGl0KG9icywgc3JjSWQsIGNvbGxpc2lvbklkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYnNbc2VsZklkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ic1tzZWxmSWRdLmRpc3QgPiBvYnNbc2VsZklkXS5tYXhQcm9qRGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvYnNbc2VsZklkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9ic1tzZWxmSWRdKSBkZWxldGUgb2JzW3NlbGZJZF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uSGl0OiAob2JzLCBzcmNJZCwgY29sbGlzaW9uSWQpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAob2JzW2NvbGxpc2lvbklkXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5QTEFZRVI6XG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5HUkFWRVNUT05FOlxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVkVISUNMRTpcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlRFUlJBSU46XG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5FTkVNWTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ic1tzcmNJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYnNbY29sbGlzaW9uSWRdICYmIG9ic1tjb2xsaXNpb25JZF0uZGFtYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyZW1hZ2UuaW5jcmVhc2VGaXJlVGljayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNbc3JjSWRdLnNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9ic1tjb2xsaXNpb25JZF0udHlwZSA9PT0gdHlwZXMuT2JqZWN0VHlwZXMuUExBWUVSIHx8IG9ic1tjb2xsaXNpb25JZF0udHlwZSA9PT0gdHlwZXMuT2JqZWN0VHlwZXMuRU5FTVkpID8gZmxhbWVEYXNoVGlja0luY3JlYXNlIDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYW1hZ2UgPSBvYnNbc3JjSWRdLmRhbWFnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaXJlRGFtYWdlID0gb2JzW29ic1tzcmNJZF0uc291cmNlXS5maXJlVGlja3MgPyBvYnNbb2JzW3NyY0lkXS5zb3VyY2VdLmZpcmVUaWNrcyAqIGZpcmVtYWdlLmZpcmVUaWNrRGFtYWdlOiAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzW2NvbGxpc2lvbklkXS5kYW1hZ2Uob2JzLCBjb2xsaXNpb25JZCwgZGFtYWdlLCB0eXBlcy5EYW1hZ2VUeXBlcy5OT1JNQUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaXJlRGFtYWdlICYmIG9ic1tjb2xsaXNpb25JZF0pIG9ic1tjb2xsaXNpb25JZF0uZGFtYWdlKCBvYnMsIGNvbGxpc2lvbklkLCBmaXJlRGFtYWdlLCB0eXBlcy5EYW1hZ2VUeXBlcy5GSVJFKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvYnNbc3JjSWRdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBmaXJlIGRhc2ggcHJvamVjdGlsZVxuICogQHBhcmFtIG9iamVjdCBUaGUgZmlyZSBkYXNoIHByb2plY3RpbGUgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhbWVEYXNoUHJvamVjdGlsZU1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICBjb25zdCBjdXN0b21SZW5kZXJTaXplID0gMjtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjQ0Q1QzVDXCIsIFwiI0ZGOEMwMFwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0ICAqIGN1c3RvbVJlbmRlclNpemUsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMSxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGggKiBjdXN0b21SZW5kZXJTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAwLjUsXG4gICAgICAgICAgICBjZWxsWTogMC41LFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICBjZWxsWTogMSxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgc3dhdGNoOiAxXG4gICAgICAgIH0sXSxcbiAgICAgICAgY3VzdG9tUmVuZGVyU2l6ZTogY3VzdG9tUmVuZGVyU2l6ZSxcbiAgICB9XG59XG4iLCJ2YXIgZmxhbWVQaWxsYXJTcGVlZCA9IDA7XG52YXIgZmxhbWVQaWxsYXJXaWR0aCA9IDY7XG52YXIgZmxhbWVQaWxsYXJIZWlnaHQgPSAxMjtcbnZhciBmbGFtZVBpbGxhckhpdEJveFdpZHRoID0gNjtcbnZhciBmbGFtZVBpbGxhckhpdEJveEhlaWdodCA9IDEyO1xudmFyIGZsYW1lUGlsbGFyRGFtYWdlID0gMTY7XG52YXIgZmxhbWVQaWxsYXJUaWNrSW5jcmVhc2UgPSAyO1xudmFyIGZsYW1lUGlsbGFyU3R1bkR1cmF0aW9uID0gMTUwMDtcblxudmFyIGZsYW1lUGlsbGFyVHJpZ2dlckRlbGF5ID0gNTAwO1xudmFyIGZsYW1lUGlsbGFyVGltZW91dCA9IDEwMDA7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBiYXNlKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4uL1ByZWZhYnNcIik7XG4gICAgdmFyIGZpcmVtYWdlID0gcmVxdWlyZShcIi4uL1BsYXllci9GaXJlTWFnZVwiKTtcbiAgICB2YXIgY29sbGlzaW9ucyA9IHJlcXVpcmUoXCIuLi8uLi9Db2xsaXNpb25zXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLlByb2plY3RpbGUuRkxBTUVfUElMTEFSX1BST0pFQ1RJTEUsXG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1ksXG4gICAgICAgIHZlbG9jaXR5WDogZmxhbWVQaWxsYXJTcGVlZCxcbiAgICAgICAgdmVsb2NpdHlZOiBmbGFtZVBpbGxhclNwZWVkLFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIHdpZHRoOiBmbGFtZVBpbGxhcldpZHRoLFxuICAgICAgICBoZWlnaHQ6IGZsYW1lUGlsbGFySGVpZ2h0LFxuICAgICAgICBoaXRib3hUeXBlOiB0eXBlcy5IaXRib3hUeXBlcy5SRUNULFxuICAgICAgICBoaXRib3hXaWR0aDogZmxhbWVQaWxsYXJIaXRCb3hXaWR0aCxcbiAgICAgICAgaGl0Ym94SGVpZ2h0OiBmbGFtZVBpbGxhckhpdEJveEhlaWdodCxcbiAgICAgICAgZGFtYWdlOiBmbGFtZVBpbGxhckRhbWFnZSxcbiAgICAgICAgaW5pdFRpbWU6IERhdGUubm93KCksXG4gICAgICAgIHRyaWdnZXJlZDogZmFsc2UsXG4gICAgICAgIHVwZGF0ZTogKG9icywgc2VsZklkLCBkZWx0YSkgPT4ge1xuICAgICAgICAgICAgdmFyIG5ld1RpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aW1lb3V0IGlzIHBhc3NlZCwgZGVsZXRlIGl0ZW1cbiAgICAgICAgICAgIGlmIChvYnNbc2VsZklkXSAmJiBuZXdUaW1lIC0gb2JzW3NlbGZJZF0uaW5pdFRpbWUgPj0gZmxhbWVQaWxsYXJUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ic1tzZWxmSWRdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0cmlnZ2VyIGRlbGF5IGVsYXBzZWQsIGNoZWNrIGZvciBvYmplY3QgY29sbGlzaW9uc1xuICAgICAgICAgICAgaWYgKG9ic1tzZWxmSWRdICYmIG5ld1RpbWUgLSBvYnNbc2VsZklkXS5pbml0VGltZSA+PSBmbGFtZVBpbGxhclRyaWdnZXJEZWxheSkge1xuICAgICAgICAgICAgICAgIG9ic1tzZWxmSWRdLnRyaWdnZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29sbGlzaW9ucy5jaGVja0NvbGxpc2lvbnMoc2VsZklkLCBvYnMsIHByZWZhYnMucmVuZGVyU2l6ZSwgKHNyY0lkLCBjb2xsaXNpb25JZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2JzW3NyY0lkXSAmJiBjb2xsaXNpb25JZCAhPSBzcmNJZCAmJiBjb2xsaXNpb25JZCAhPSBvYnNbc3JjSWRdLnNvdXJjZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNbc3JjSWRdLm9uSGl0KG9icywgc3JjSWQsIGNvbGxpc2lvbklkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbkhpdDogKG9icywgc3JjSWQsIGNvbGxpc2lvbklkKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKG9ic1tjb2xsaXNpb25JZF0udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuUExBWUVSOlxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuRU5FTVk6XG4gICAgICAgICAgICAgICAgICAgIG9ic1tjb2xsaXNpb25JZF0uYWRkU3RhdHVzRWZmZWN0KG9icywgY29sbGlzaW9uSWQsIHR5cGVzLlN0YXR1c0VmZmVjdHMuU1RVTk5FRCwgZmxhbWVQaWxsYXJTdHVuRHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuR1JBVkVTVE9ORTpcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlZFSElDTEU6XG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5URVJSQUlOOlxuICAgICAgICAgICAgICAgICAgICBpZiAob2JzW3NyY0lkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ic1tjb2xsaXNpb25JZF0gJiYgb2JzW2NvbGxpc2lvbklkXS5kYW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJlbWFnZS5pbmNyZWFzZUZpcmVUaWNrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic1tzcmNJZF0uc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob2JzW2NvbGxpc2lvbklkXS50eXBlID09PSB0eXBlcy5PYmplY3RUeXBlcy5QTEFZRVIgfHwgb2JzW2NvbGxpc2lvbklkXS50eXBlID09PSB0eXBlcy5PYmplY3RUeXBlcy5FTkVNWSkgPyBmbGFtZVBpbGxhclRpY2tJbmNyZWFzZSA6IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGFtYWdlID0gb2JzW3NyY0lkXS5kYW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlyZURhbWFnZSA9IG9ic1tvYnNbc3JjSWRdLnNvdXJjZV0uZmlyZVRpY2tzID8gb2JzW29ic1tzcmNJZF0uc291cmNlXS5maXJlVGlja3MgKiBmaXJlbWFnZS5maXJlVGlja0RhbWFnZTogMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic1tjb2xsaXNpb25JZF0uZGFtYWdlKG9icywgY29sbGlzaW9uSWQsIGRhbWFnZSwgdHlwZXMuRGFtYWdlVHlwZXMuTk9STUFMKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlyZURhbWFnZSAmJiBvYnNbY29sbGlzaW9uSWRdKSBvYnNbY29sbGlzaW9uSWRdLmRhbWFnZSggb2JzLCBjb2xsaXNpb25JZCwgZmlyZURhbWFnZSwgdHlwZXMuRGFtYWdlVHlwZXMuRklSRSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgb2JzW3NyY0lkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgZmlyZSBwaWxsYXIgcHJvamVjdGlsZVxuICogQHBhcmFtIG9iamVjdCBUaGUgZmlyZSBwaWxsYXIgcHJvamVjdGlsZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhbWVQaWxsYXJQcm9qZWN0aWxlTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiNFNjdFMDBEOVwiLCBcIiNGRjY5MzNEOVwiLCBcIiNGRjhDMDBEOVwiLCBcIiNGRkE1MDBEOVwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGggLSAyLFxuICAgICAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMSA6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMSxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQgLSAxLFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMSA6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMyxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMyA6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDIsXG4gICAgICAgICAgICBjZWxsWTogNCxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMyA6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDQsXG4gICAgICAgICAgICBjZWxsWTogNSxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMyA6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogNyxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMyA6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDIsXG4gICAgICAgICAgICBjZWxsWTogOCxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMyA6IDJcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDQsXG4gICAgICAgICAgICBjZWxsWTogOSxcbiAgICAgICAgICAgIHdpZHRoOiAyLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiBvYmplY3QudHJpZ2dlcmVkID8gMyA6IDJcbiAgICAgICAgfSxdXG4gICAgfVxufVxuIiwidmFyIHByb2plY3RpbGVXaWR0aCA9IDQ7XG52YXIgcHJvamVjdGlsZUhlaWdodCA9IDQ7XG52YXIgcHJvamVjdGlsZUhpdEJveFJhZGl1cyA9IDEuNTtcbnZhciBiYXNlUHJvamVjdGlsZURhbWFnZSA9IDEwO1xudmFyIHByb2plY3RpbGVTcGVlZCA9IDAuNDsgXG52YXIgbWF4UHJvakRpc3QgPSAxNjAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgY29sbGlzaW9ucyA9IHJlcXVpcmUoXCIuLi8uLi9Db2xsaXNpb25zXCIpO1xuICAgIHZhciBwcmVmYWJzID0gcmVxdWlyZShcIi4uL1ByZWZhYnNcIik7XG5cbiAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKFxuICAgICAgICBwb3NZIC0gb2JzW3NyY10ueSxcbiAgICAgICAgcG9zWCAtIG9ic1tzcmNdLngpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogdHlwZXMuT2JqZWN0VHlwZXMuUFJPSkVDVElMRSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuUHJvamVjdGlsZS5CQVNJQ19QUk9KRUNUSUxFLFxuICAgICAgICBzb3VyY2U6IHNyYyxcbiAgICAgICAgeDogb2JzW3NyY10ueCxcbiAgICAgICAgeTogb2JzW3NyY10ueSxcbiAgICAgICAgYW5nbGU6IGFuZ2xlLFxuICAgICAgICB2ZWxvY2l0eVg6IE1hdGguY29zKGFuZ2xlKSAqIHByb2plY3RpbGVTcGVlZCxcbiAgICAgICAgdmVsb2NpdHlZOiBNYXRoLnNpbihhbmdsZSkgKiBwcm9qZWN0aWxlU3BlZWQsXG4gICAgICAgIHdpZHRoOiBwcm9qZWN0aWxlV2lkdGgsXG4gICAgICAgIGhlaWdodDogcHJvamVjdGlsZUhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IHByb2plY3RpbGVIaXRCb3hSYWRpdXMsXG4gICAgICAgIGhpdGJveEhlaWdodDogcHJvamVjdGlsZUhpdEJveFJhZGl1cyxcbiAgICAgICAgZmFjaW5nOiBhbmdsZSAqIDE4MCAvIE1hdGguUEksXG4gICAgICAgIGRpc3Q6IDAsXG4gICAgICAgIG1heFByb2pEaXN0OiBtYXhQcm9qRGlzdCxcbiAgICAgICAgZGFtYWdlOiBiYXNlUHJvamVjdGlsZURhbWFnZSxcbiAgICAgICAgdXBkYXRlOiAob2JzLCBzZWxmSWQsIGRlbHRhKSA9PiB7XG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgcHJvamVjdGlsZSBtb3ZlbWVudFxuICAgICAgICAgICAgb2JzW3NlbGZJZF0ueCArPSBvYnNbc2VsZklkXS52ZWxvY2l0eVggKiBkZWx0YTtcbiAgICAgICAgICAgIG9ic1tzZWxmSWRdLnkgKz0gb2JzW3NlbGZJZF0udmVsb2NpdHlZICogZGVsdGE7XG4gICAgICAgICAgICBvYnNbc2VsZklkXS5kaXN0ICs9IE1hdGguc3FydChcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhvYnNbc2VsZklkXS52ZWxvY2l0eVggKiBkZWx0YSwgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KG9ic1tzZWxmSWRdLnZlbG9jaXR5WSAqIGRlbHRhLCAyKSk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IENoYW5nZSBwcm9qZWN0aWxlIGNvbGxpc2lvbnMgdG8gcmF5IGNhc3RcbiAgICAgICAgICAgIGNvbGxpc2lvbnMuY2hlY2tDb2xsaXNpb25zKHNlbGZJZCwgb2JzLCBwcmVmYWJzLnJlbmRlclNpemUsIChzcmNJZCwgY29sbGlzaW9uSWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob2JzW3NyY0lkXSAmJiBjb2xsaXNpb25JZCAhPSBzcmNJZCAmJiBjb2xsaXNpb25JZCAhPSBvYnNbc3JjSWRdLnNvdXJjZSl7XG4gICAgICAgICAgICAgICAgICAgIG9ic1tzcmNJZF0ub25IaXQob2JzLCBzcmNJZCwgY29sbGlzaW9uSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKG9ic1tzZWxmSWRdKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9ic1tzZWxmSWRdLmRpc3QgPiBvYnNbc2VsZklkXS5tYXhQcm9qRGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgb2JzW3NlbGZJZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvbkhpdDogKG9icywgc3JjSWQsIGNvbGxpc2lvbklkKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKG9ic1tjb2xsaXNpb25JZF0udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuUExBWUVSOlxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuRU5FTVk6XG4gICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5HUkFWRVNUT05FOlxuICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuVkVISUNMRTpcbiAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlRFUlJBSU46XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYnNbc3JjSWRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JzW2NvbGxpc2lvbklkXSAmJiBvYnNbY29sbGlzaW9uSWRdLmRhbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic1tjb2xsaXNpb25JZF0uZGFtYWdlKG9icywgY29sbGlzaW9uSWQsIG9ic1tzcmNJZF0uZGFtYWdlLCB0eXBlcy5EYW1hZ2VUeXBlcy5OT1JNQUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG9ic1tzcmNJZF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UsIFN0cm9rZVR5cGVzIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgYmFzaWMgcHJvamVjdGlsZVxuICogQHBhcmFtIG9iamVjdCBUaGUgcHJvamVjdGlsZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdHNcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0aWxlTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIC8qIHJldHVybiB7XG4gICAgICAgIC8vIFJlbW92ZSBjb21tZW50cyBmb3IgcmFpbmJvdyBidWxsZXRzXG4gICAgICAgIC8vIHBhbGV0dGU6IFtcIiNGRjY2NjZcIiwgXCIjNjZGRjY2XCIsIFwiIzY2NjZGRlwiLCBcIiNGRkZGNjZcIiwgXCIjRkY2NkZGXCIsIFwiIzY2RkZGRlwiXSxcbiAgICAgICAgcGFsZXR0ZTogW1wiIzIyMjIyMlwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgICAgICAvLyBzd2F0Y2g6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfV1cbiAgICB9ICAgKi9cblxuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiM5OTk5OTlcIl0sXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgIGZhY2luZzogb2JqZWN0LmZhY2luZyxcbiAgICAgICAgc2hhZG93SGVpZ2h0OiA2LFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgdHlwZTogU3Ryb2tlVHlwZXMuU1ZHLFxuICAgICAgICAgICAgcGF0aDogJ00gMTQgNiBRIDE2IDggMTQgMTAgUSA3IDE1IDAgMTMgUSA1IDggMCA0IFEgOCAxIDE0IDYgWicsIFxuICAgICAgICAgICAgcGFyYW1zOiB7IGZpbGw6ICcjOTkyMjIyJywgZmlsbFN0eWxlOiAnc29saWQnLCBzdHJva2VXaWR0aDogMC4yIH1cbiAgICAgICAgfV1cbiAgICB9XG59XG4iLCJ2YXIgY2FzdGxlV2FsbEhvcml6V2lkdGggPSAyMTA7XG52YXIgY2FzdGxlV2FsbEhvcml6SGVpZ2h0ID0gMTI7XG52YXIgY2FzdGxlV2FsbEhvcml6SGl0Ym94V2lkdGggPSAyMTA7XG52YXIgY2FzdGxlV2FsbEhvcml6SGl0Ym94SGVpZ2h0ID0gMjtcbnZhciBjYXN0bGVXYWxsSG9yaXpIZWFsdGggPSAyNTAwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlLFxuICAgICAgICBzdWJ0eXBlOiB0eXBlcy5UZXJyYWluLkNBU1RMRV9XQUxMX0hPUklaLFxuICAgICAgICB3aWR0aDogY2FzdGxlV2FsbEhvcml6V2lkdGgsXG4gICAgICAgIGhlaWdodDogY2FzdGxlV2FsbEhvcml6SGVpZ2h0LFxuICAgICAgICBoaXRib3hUeXBlOiB0eXBlcy5IaXRib3hUeXBlcy5SRUNULFxuICAgICAgICBoaXRib3hXaWR0aDogY2FzdGxlV2FsbEhvcml6SGl0Ym94V2lkdGgsXG4gICAgICAgIGhpdGJveEhlaWdodDogY2FzdGxlV2FsbEhvcml6SGl0Ym94SGVpZ2h0LFxuICAgICAgICBoZWFsdGg6IGNhc3RsZVdhbGxIb3JpekhlYWx0aCxcbiAgICAgICAgbWF4SGVhbHRoOiBjYXN0bGVXYWxsSG9yaXpIZWFsdGgsXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBob3Jpem9udGFsIGNhc3RsZSB3YWxsIG9iamVjdCBiYXNlXG4gKiBAcGFyYW0gb2JqZWN0IFRoZSBob3Jpem9udGFsIHdhbGwgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhc3RsZVdhbGxIb3JpekJhc2VNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiIzIyMjIyMlwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3QuaGl0Ym94V2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhpdGJveEhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3QuaGl0Ym94V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oaXRib3hIZWlnaHQsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfV1cbiAgICB9XG59XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgaG9yaXpvbnRhbCBjYXN0bGUgd2FsbCBvYmplY3QgY292ZXJcbiAqIEBwYXJhbSBvYmplY3QgVGhlIGhvcml6b250YWwgY2FzdGxlIHdhbGwgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhc3RsZVdhbGxIb3JpekNvdmVyTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiMzMzMzMzNcIiwgXCIjRkFGMEU2XCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IG9iamVjdC5mYWNpbmcsXG4gICAgICAgIHN0cm9rZXM6IFtcbiAgICAgICAgICAgIHsgY2VsbFg6IDAsIGNlbGxZOiAtb2JqZWN0LmhlaWdodCAvIDIgLHdpZHRoOiBvYmplY3Qud2lkdGgsIGhlaWdodDogb2JqZWN0LmhlaWdodCwgc3dhdGNoOiAwIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAxMDMsIGNlbGxZOiAxICwgd2lkdGg6IDEsIGhlaWdodDogMiwgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAxMDMsIGNlbGxZOiAyICwgd2lkdGg6IDIsIGhlaWdodDogMSwgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAxMDcsIGNlbGxZOiAxICwgd2lkdGg6IDEsIGhlaWdodDogMiwgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAxMDYsIGNlbGxZOiAyICwgd2lkdGg6IDIsIGhlaWdodDogMSwgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAxMDMsIGNlbGxZOiAtMiAsIHdpZHRoOiAxLCBoZWlnaHQ6IDIsIHN3YXRjaDogMSB9LFxuICAgICAgICAgICAgeyBjZWxsWDogMTAzLCBjZWxsWTogLTIgLCB3aWR0aDogMiwgaGVpZ2h0OiAxLCBzd2F0Y2g6IDEgfSxcbiAgICAgICAgICAgIHsgY2VsbFg6IDEwNywgY2VsbFk6IC0yICwgd2lkdGg6IDEsIGhlaWdodDogMiwgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAxMDYsIGNlbGxZOiAtMiAsIHdpZHRoOiAyLCBoZWlnaHQ6IDEsIHN3YXRjaDogMSB9LFxuXG4gICAgICAgICAgICB7IGNlbGxYOiAzMywgY2VsbFk6IC0xICwgd2lkdGg6IDMsIGhlaWdodDogMywgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiA3MCwgY2VsbFk6IC0xICwgd2lkdGg6IDMsIGhlaWdodDogMywgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAxNDAsIGNlbGxZOiAtMSAsIHdpZHRoOiAzLCBoZWlnaHQ6IDMsIHN3YXRjaDogMSB9LFxuICAgICAgICAgICAgeyBjZWxsWDogMTc1LCBjZWxsWTogLTEgLCB3aWR0aDogMywgaGVpZ2h0OiAzLCBzd2F0Y2g6IDEgfSxcbiAgICAgICAgXVxuICAgIH1cbn1cbiIsInZhciBjYXN0bGVXYWxsVmVydFdpZHRoID0gODtcbnZhciBjYXN0bGVXYWxsVmVydEhlaWdodCA9IDIxMDtcbnZhciBjYXN0bGVXYWxsVmVydEhpdGJveFdpZHRoID0gODtcbnZhciBjYXN0bGVXYWxsVmVydEhpdGJveEhlaWdodCA9IDIxMDtcbnZhciBjYXN0bGVXYWxsVmVydEhlYWx0aCA9IDI1MDA7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBiYXNlKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLlRlcnJhaW4uQ0FTVExFX1dBTExfVkVSVCxcbiAgICAgICAgd2lkdGg6IGNhc3RsZVdhbGxWZXJ0V2lkdGgsXG4gICAgICAgIGhlaWdodDogY2FzdGxlV2FsbFZlcnRIZWlnaHQsXG4gICAgICAgIGhpdGJveFR5cGU6IHR5cGVzLkhpdGJveFR5cGVzLlJFQ1QsXG4gICAgICAgIGhpdGJveFdpZHRoOiBjYXN0bGVXYWxsVmVydEhpdGJveFdpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IGNhc3RsZVdhbGxWZXJ0SGl0Ym94SGVpZ2h0LFxuICAgICAgICBoZWFsdGg6IGNhc3RsZVdhbGxWZXJ0SGVhbHRoLFxuICAgICAgICBtYXhIZWFsdGg6IGNhc3RsZVdhbGxWZXJ0SGVhbHRoLFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgdmVydGljYWwgY2FzdGxlIHdhbGwgb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSB2ZXJ0aWNhbCBjYXN0bGUgd2FsbCBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgdGhlIG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FzdGxlV2FsbFZlcnRNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiIzMzMzMzM1wiLCBcIiNGQUYwRTZcIl0sXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LmhpdGJveFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oaXRib3hIZWlnaHQsXG4gICAgICAgIGZhY2luZzogb2JqZWN0LmZhY2luZyxcbiAgICAgICAgc3Ryb2tlczogW1xuICAgICAgICAgICAgeyBjZWxsWDogMCwgY2VsbFk6IDAsIHdpZHRoOiBvYmplY3QuaGl0Ym94V2lkdGgsIGhlaWdodDogb2JqZWN0LmhpdGJveEhlaWdodCwgc3dhdGNoOiAwIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAzLCBjZWxsWTogMzMsIHdpZHRoOiAyLCBoZWlnaHQ6IDIsIHN3YXRjaDogMSB9LFxuICAgICAgICAgICAgeyBjZWxsWDogMywgY2VsbFk6IDcwLCB3aWR0aDogMiwgaGVpZ2h0OiAyLCBzd2F0Y2g6IDEgfSxcbiAgICAgICAgICAgIHsgY2VsbFg6IDMsIGNlbGxZOiAxMDUsIHdpZHRoOiAyLCBoZWlnaHQ6IDIsIHN3YXRjaDogMSB9LFxuICAgICAgICAgICAgeyBjZWxsWDogMywgY2VsbFk6IDE0MCwgd2lkdGg6IDIsIGhlaWdodDogMiwgc3dhdGNoOiAxIH0sXG4gICAgICAgICAgICB7IGNlbGxYOiAzLCBjZWxsWTogMTc1LCB3aWR0aDogMiwgaGVpZ2h0OiAyLCBzd2F0Y2g6IDEgfSxcbiAgICAgICAgXVxuICAgIH1cbn1cbiIsInZhciB0cmVlV2lkdGggPSA0O1xudmFyIHRyZWVIZWlnaHQgPSA4O1xudmFyIHRyZWVIaXRib3hXaWR0aCA9IDQ7XG52YXIgdHJlZUhpdGJveEhlaWdodCA9IDg7XG52YXIgdHJlZUhlYWx0aCA9IDIwMDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1ksIGJhc2UpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuVGVycmFpbi5UUkVFLFxuICAgICAgICB3aWR0aDogdHJlZVdpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRyZWVIZWlnaHQsXG4gICAgICAgIGhpdGJveFR5cGU6IHR5cGVzLkhpdGJveFR5cGVzLlJFQ1QsXG4gICAgICAgIGhpdGJveFdpZHRoOiB0cmVlSGl0Ym94V2lkdGgsXG4gICAgICAgIGhpdGJveEhlaWdodDogdHJlZUhpdGJveEhlaWdodCxcbiAgICAgICAgaGVhbHRoOiB0cmVlSGVhbHRoLFxuICAgICAgICBtYXhIZWFsdGg6IHRyZWVIZWFsdGgsXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciB0cmVlIG9iamVjdFxuICogQHBhcmFtIG9iamVjdCBUaGUgdHJlZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRYIEhvcml6b250YWwgb2Zmc2V0IGZvciByZW5kZXJpbmcgb2JqZWN0c1xuICogQHBhcmFtIHJlbmRlck9mZnNldFkgVmVydGljYWwgb2Zmc2V0IGZvciByZW5kZXIgb2JqZWN0c1xuICovXG5leHBvcnQgZnVuY3Rpb24gdHJlZVRydW5rTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiM5OTMzMDBcIl0sXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgIGZhY2luZzogb2JqZWN0LmZhY2luZyxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAwLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sXSxcbiAgICB9O1xufVxuXG4vLyBUT0RPOiBDaGFuZ2UgbGVhZiByZW5kZXJpbmcgZGVwZW5kaW5nIG9uIHRyZWUgaGVhbHRoXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIHRyZWUgb2JqZWN0J3MgbGVhdmVzXG4gKiBAcGFyYW0gb2JqZWN0IFRoZSB0cmVlIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlciBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmVlTGVhZk1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjMjI4ODIyXCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IG9iamVjdC5mYWNpbmcsXG4gICAgICAgIHN0cm9rZXM6IFt7XG4gICAgICAgICAgICBjZWxsWDogLTIsXG4gICAgICAgICAgICBjZWxsWTogLTQsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoICogMixcbiAgICAgICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAtMTAsXG4gICAgICAgICAgICB3aWR0aDogNCxcbiAgICAgICAgICAgIGhlaWdodDogNyxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LF0sXG4gICAgfTtcbn1cbiIsInZhciB3YWxsSG9yaXpXaWR0aCA9IDIwO1xudmFyIHdhbGxIb3JpekhlaWdodCA9IDEyO1xudmFyIHdhbGxIb3JpekhpdGJveFdpZHRoID0gMjA7XG52YXIgd2FsbEhvcml6SGl0Ym94SGVpZ2h0ID0gMjtcbnZhciB3YWxsSG9yaXpIZWFsdGggPSAyNTA7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZLCBiYXNlKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLlRlcnJhaW4uV0FMTF9IT1JJWixcbiAgICAgICAgd2lkdGg6IHdhbGxIb3JpeldpZHRoLFxuICAgICAgICBoZWlnaHQ6IHdhbGxIb3JpekhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IHdhbGxIb3JpekhpdGJveFdpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IHdhbGxIb3JpekhpdGJveEhlaWdodCxcbiAgICAgICAgaGVhbHRoOiB3YWxsSG9yaXpIZWFsdGgsXG4gICAgICAgIG1heEhlYWx0aDogd2FsbEhvcml6SGVhbHRoLFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgaG9yaXpvbnRhbCB3YWxsIG9iamVjdCBiYXNlXG4gKiBAcGFyYW0gb2JqZWN0IFRoZSBob3Jpem9udGFsIHdhbGwgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhbGxIb3JpekJhc2VNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiIzg4ODg4OFwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3QuaGl0Ym94V2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhpdGJveEhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3QuaGl0Ym94V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IG9iamVjdC5oaXRib3hIZWlnaHQsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfV1cbiAgICB9XG59XG5cbi8vIFRPRE86IEFkZCBtb3JlIGRldGFpbCB0byB3YWxsIChjb2JibGVzdG9uZSBzdHlsZSksIGNoYW5nZSBjb2xvcmluZyBkZXBlbmRpbmcgb24gb2JqZWN0IGhlYWx0aFxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBob3Jpem9udGFsIHdhbGwgb2JqZWN0IGNvdmVyXG4gKiBAcGFyYW0gb2JqZWN0IFRoZSBob3Jpem9udGFsIHdhbGwgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WCBIb3Jpem9udGFsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqIEBwYXJhbSByZW5kZXJPZmZzZXRZIFZlcnRpY2FsIG9mZnNldCBmb3IgcmVuZGVyaW5nIHRoZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhbGxIb3JpekNvdmVyTWFzdGVyUGllY2Uob2JqZWN0OiBhbnksIHJlbmRlck9mZnNldFg6IG51bWJlciwgcmVuZGVyT2Zmc2V0WTogbnVtYmVyKTogbWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiNBM0EzQzJCQlwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogLW9iamVjdC5oZWlnaHQgLyAyLFxuICAgICAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9XVxuICAgIH1cbn1cbiIsImZ1bmN0aW9uIGdlbmVyYXRlTmV3KG9icywgc3JjLCBwb3NYLCBwb3NZKSB7XG4gICAgdmFyIHR5cGVzID0gcmVxdWlyZShcIi4uLy4uL09iamVjdFR5cGVzXCIpO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJVdGlsc1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLk9iamVjdFR5cGVzLlRFUlJBSU4sXG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1ksXG4gICAgICAgIHVwZGF0ZTogKG9icywgc2VsZklkLCBkZWx0YSkgPT4geyB9LFxuICAgICAgICBkZWF0aHJhdHRsZTogKG9icywgc2VsZklkKSA9PiB7XG4gICAgICAgICAgICBpZiAob2JzW3NlbGZJZF0pIGRlbGV0ZSBvYnNbc2VsZklkXTtcbiAgICAgICAgfSxcbiAgICAgICAgZGFtYWdlOiB1dGlscy5kYW1hZ2UsXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuLyoqXG4gKiBHZXQgbWFzdGVyIHBpZWNlIGZvciBkZWZhdWx0IHRlcnJhaW4gb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSB0ZXJyYWluIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0VGVycmFpbk1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6bWFzdGVyUGllY2Uge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhbGV0dGU6IFtcIiNGRkIzRkZcIl0sXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgIGZhY2luZzogb2JqZWN0LmZhY2luZyxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAwLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH1dXG4gICAgfVxufVxuIiwidmFyIGludnVsblBsYXRmb3JtV2lkdGggPSAxNjtcbnZhciBpbnZ1bG5QbGF0Zm9ybUhlaWdodCA9IDE2O1xudmFyIGludnVsblBsYXRmb3JtQnVmZkR1cmF0aW9uID0gMTUwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLlRyaWdnZXIuSU5WVUxOX1BMQVRGT1JNLFxuICAgICAgICB3aWR0aDogaW52dWxuUGxhdGZvcm1XaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBpbnZ1bG5QbGF0Zm9ybUhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGludnVsblBsYXRmb3JtV2lkdGgsXG4gICAgICAgIGhpdGJveEhlaWdodDogaW52dWxuUGxhdGZvcm1IZWlnaHQsXG4gICAgICAgIG9uVHJpZ2dlcjogKG9icywgc2VsZlJlZiwgdHJpZ2dlcklkKSA9PiB7XG4gICAgICAgICAgICBpZiAob2JzW3RyaWdnZXJJZF0pIHtcbiAgICAgICAgICAgICAgICBpZiAob2JzW3RyaWdnZXJJZF0uc3RhdHVzRWZmZWN0cykge1xuICAgICAgICAgICAgICAgICAgICBvYnNbdHJpZ2dlcklkXS5hZGRTdGF0dXNFZmZlY3Qob2JzLCB0cmlnZ2VySWQsIHR5cGVzLlN0YXR1c0VmZmVjdHMuSU5WVUxORVJBQkxFLCBpbnZ1bG5QbGF0Zm9ybUJ1ZmZEdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTmV3OiBnZW5lcmF0ZU5ldyxcbn1cbiIsImltcG9ydCB7IG1hc3RlclBpZWNlIH0gZnJvbSBcIi4uLy4uL3NyYy9Qb3BvdmEvUG9wb3ZhXCI7XG5cbi8qKlxuICogR2V0IG1hc3RlciBwaWVjZSBmb3IgaW52dWxuIHBsYXRmb3JtIG9iamVjdFxuICogQHBhcmFtIG9iamVjdCBUaGUgaW52dWxuIHBsYXRmb3JtIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyBvYmplY3RzXG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlciBvYmplY3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnZ1bG5QbGF0Zm9ybU1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjRTVFNUU1XCIsIFwiIzIyMjIyMlwiLCBcIiM4ODg4ODhcIiwgXCIjQUREOEU2XCJdLFxuICAgICAgICBwb3NYOiBvYmplY3QueCAtIHJlbmRlck9mZnNldFgsXG4gICAgICAgIHBvc1k6IG9iamVjdC55IC0gcmVuZGVyT2Zmc2V0WSxcbiAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBvYmplY3QuaGVpZ2h0LFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIHN0cm9rZXM6IFtcbiAgICAgICAgICAgIHtjZWxsWDogMiwgY2VsbFk6IDAsIHdpZHRoOiAxMiwgaGVpZ2h0OiAxNiwgc3dhdGNoOiAwfSxcbiAgICAgICAgICAgIHtjZWxsWDogMCwgY2VsbFk6IDIsIHdpZHRoOiAxNiwgaGVpZ2h0OiAxMiwgc3dhdGNoOiAwfSxcbiAgICAgICAgICAgIHtjZWxsWDogMiwgY2VsbFk6IDAsIHdpZHRoOiAxMiwgaGVpZ2h0OiAxLCBzd2F0Y2g6IDF9LFxuICAgICAgICAgICAge2NlbGxYOiAwLCBjZWxsWTogMiwgd2lkdGg6IDEsIGhlaWdodDogMTIsIHN3YXRjaDogMX0sXG4gICAgICAgICAgICB7Y2VsbFg6IDIsIGNlbGxZOiAxNSwgd2lkdGg6IDEyLCBoZWlnaHQ6IDEsIHN3YXRjaDogMX0sXG4gICAgICAgICAgICB7Y2VsbFg6IDE1LCBjZWxsWTogMiwgd2lkdGg6IDEsIGhlaWdodDogMTIsIHN3YXRjaDogMX0sXG4gICAgICAgICAgICB7Y2VsbFg6IDEsIGNlbGxZOiAxLCB3aWR0aDogMSwgaGVpZ2h0OiAxLCBzd2F0Y2g6IDF9LFxuICAgICAgICAgICAge2NlbGxYOiAxNCwgY2VsbFk6IDEsIHdpZHRoOiAxLCBoZWlnaHQ6IDEsIHN3YXRjaDogMX0sXG4gICAgICAgICAgICB7Y2VsbFg6IDEsIGNlbGxZOiAxNCwgd2lkdGg6IDEsIGhlaWdodDogMSwgc3dhdGNoOiAxfSxcbiAgICAgICAgICAgIHtjZWxsWDogMTQsIGNlbGxZOiAxNCwgd2lkdGg6IDEsIGhlaWdodDogMSwgc3dhdGNoOiAxfSxcbiAgICAgICAgICAgIHtjZWxsWDogMywgY2VsbFk6IDMsIHdpZHRoOiAxMCwgaGVpZ2h0OiA2LCBzd2F0Y2g6IDN9LFxuICAgICAgICAgICAge2NlbGxYOiA0LCBjZWxsWTogOCwgd2lkdGg6IDgsIGhlaWdodDogMywgc3dhdGNoOiAzfSxcbiAgICAgICAgICAgIHtjZWxsWDogNSwgY2VsbFk6IDEwLCB3aWR0aDogNiwgaGVpZ2h0OiAyLCBzd2F0Y2g6IDN9LFxuICAgICAgICAgICAge2NlbGxYOiAzLCBjZWxsWTogMywgd2lkdGg6IDEwLCBoZWlnaHQ6IDEsIHN3YXRjaDogMn0sXG4gICAgICAgICAgICB7Y2VsbFg6IDMsIGNlbGxZOiAzLCB3aWR0aDogMSwgaGVpZ2h0OiA2LCBzd2F0Y2g6IDJ9LFxuICAgICAgICAgICAge2NlbGxYOiAxMiwgY2VsbFk6IDMsIHdpZHRoOiAxLCBoZWlnaHQ6IDYsIHN3YXRjaDogMn0sXG4gICAgICAgICAgICB7Y2VsbFg6IDYsIGNlbGxZOiAxMiwgd2lkdGg6IDQsIGhlaWdodDogMSwgc3dhdGNoOiAyfSxcbiAgICAgICAgICAgIHtjZWxsWDogNCwgY2VsbFk6IDksIHdpZHRoOiAxLCBoZWlnaHQ6IDIsIHN3YXRjaDogMn0sXG4gICAgICAgICAgICB7Y2VsbFg6IDExLCBjZWxsWTogOSwgd2lkdGg6IDEsIGhlaWdodDogMiwgc3dhdGNoOiAyfSxcbiAgICAgICAgICAgIHtjZWxsWDogNSwgY2VsbFk6IDExLCB3aWR0aDogMSwgaGVpZ2h0OiAxLCBzd2F0Y2g6IDJ9LFxuICAgICAgICAgICAge2NlbGxYOiAxMCwgY2VsbFk6IDExLCB3aWR0aDogMSwgaGVpZ2h0OiAxLCBzd2F0Y2g6IDJ9LFxuICAgICAgICBdLFxuICAgIH1cbn1cblxuLy8gQ3JlZXBlciBmYWNlLi4uXG4vLyB7Y2VsbFg6IDAsIGNlbGxZOiAwLCB3aWR0aDogMTYsIGhlaWdodDogMTYsIHN3YXRjaDogMH0sXG4vLyB7Y2VsbFg6IDIsIGNlbGxZOiAyLCB3aWR0aDogNCwgaGVpZ2h0OiA0LCBzd2F0Y2g6IDF9LFxuLy8ge2NlbGxYOiAxMCwgY2VsbFk6IDIsIHdpZHRoOiA0LCBoZWlnaHQ6IDQsIHN3YXRjaDogMX0sXG4vLyB7Y2VsbFg6IDYsIGNlbGxZOiA2LCB3aWR0aDogNCwgaGVpZ2h0OiA2LCBzd2F0Y2g6IDF9LFxuLy8ge2NlbGxYOiA0LCBjZWxsWTogOCwgd2lkdGg6IDIsIGhlaWdodDogNiwgc3dhdGNoOiAxfSxcbi8vIHtjZWxsWDogMTAsIGNlbGxZOiA4LCB3aWR0aDogMiwgaGVpZ2h0OiA2LCBzd2F0Y2g6IDF9LFxuIiwidmFyIHNwaWtlVHJhcFdpZHRoID0gNTtcbnZhciBzcGlrZVRyYXBIZWlnaHQgPSA1O1xudmFyIHNwaWtlVHJhcEhpdGJveFdpZHRoID0gNTtcbnZhciBzcGlrZVRyYXBIaXRib3hIZWlnaHQgPSA1O1xudmFyIHNwaWtlVHJhcERhbWFnZSA9IDIwO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIHN1YnR5cGU6IHR5cGVzLlRyaWdnZXIuU1BJS0VfVFJBUCxcbiAgICAgICAgd2lkdGg6IHNwaWtlVHJhcFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IHNwaWtlVHJhcEhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IHNwaWtlVHJhcEhpdGJveFdpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IHNwaWtlVHJhcEhpdGJveEhlaWdodCxcbiAgICAgICAgb25UcmlnZ2VyOiAob2JzLCBzZWxmUmVmLCB0cmlnZ2VySWQpID0+IHtcbiAgICAgICAgICAgIGlmIChvYnNbdHJpZ2dlcklkXSAmJiAoXG4gICAgICAgICAgICAgICAgb2JzW3RyaWdnZXJJZF0udHlwZSA9PSB0eXBlcy5PYmplY3RUeXBlcy5QTEFZRVIgfHxcbiAgICAgICAgICAgICAgICBvYnNbdHJpZ2dlcklkXS50eXBlID09IHR5cGVzLk9iamVjdFR5cGVzLlZFSElDTEUgfHxcbiAgICAgICAgICAgICAgICBvYnNbdHJpZ2dlcklkXS50eXBlID09IHR5cGVzLk9iamVjdFR5cGVzLkVORU1ZXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9ic1t0cmlnZ2VySWRdLmRhbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICBvYnNbdHJpZ2dlcklkXS5kYW1hZ2Uob2JzLCB0cmlnZ2VySWQsIHNwaWtlVHJhcERhbWFnZSwgdHlwZXMuRGFtYWdlVHlwZXMuTk9STUFMKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ic1tzZWxmUmVmXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuLi8uLi9zcmMvUG9wb3ZhL1BvcG92YVwiO1xuXG4vKipcbiAqIEdldCBtYXN0ZXIgcGllY2UgZm9yIHNwaWtlIHRyYXAgb2JqZWN0XG4gKiBAcGFyYW0gb2JqZWN0IFRoZSBzcGlrZSB0cmFwIG9iamVjdFxuICogQHBhcmFtIHJlbmRlck9mZnNldFggSG9yaXpvbnRhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKiBAcGFyYW0gcmVuZGVyT2Zmc2V0WSBWZXJ0aWNhbCBvZmZzZXQgZm9yIHJlbmRlcmluZyB0aGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzcGlrZVRyYXBNYXN0ZXJQaWVjZShvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIpOiBtYXN0ZXJQaWVjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFsZXR0ZTogW1wiIzgwODA4MFwiXSxcbiAgICAgICAgcG9zWDogb2JqZWN0LnggLSByZW5kZXJPZmZzZXRYLFxuICAgICAgICBwb3NZOiBvYmplY3QueSAtIHJlbmRlck9mZnNldFksXG4gICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgIGhlaWdodDogb2JqZWN0LmhlaWdodCxcbiAgICAgICAgZmFjaW5nOiBvYmplY3QuZmFjaW5nLFxuICAgICAgICBzdHJva2VzOiBbe1xuICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICBjZWxsWTogMCxcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAzLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMCxcbiAgICAgICAgICAgIGNlbGxZOiAzLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDIsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDIsXG4gICAgICAgICAgICBjZWxsWTogMyxcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiA0LFxuICAgICAgICAgICAgY2VsbFk6IDMsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LF1cbiAgICB9O1xufVxuIiwiZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIGNvbGxpc2lvbnMgPSByZXF1aXJlKFwiLi4vLi4vQ29sbGlzaW9uc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogdHlwZXMuT2JqZWN0VHlwZXMuVFJJR0dFUixcbiAgICAgICAgeDogcG9zWCxcbiAgICAgICAgeTogcG9zWSxcbiAgICAgICAgdXBkYXRlOiAob2JzLCBzZWxmSWQsIGRlbHRhKSA9PiB7XG4gICAgICAgICAgICBjb2xsaXNpb25zLmNoZWNrQ29sbGlzaW9ucyhzZWxmSWQsIG9icywgcHJlZmFicy5yZW5kZXJTaXplLCAoc3JjSWQsIGNvbGxpc2lvbklkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG9ic1tzcmNJZF0gJiYgY29sbGlzaW9uSWQgIT0gc3JjSWQpe1xuICAgICAgICAgICAgICAgICAgICBvYnNbc3JjSWRdLm9uVHJpZ2dlcihvYnMsIHNyY0lkLCBjb2xsaXNpb25JZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwidmFyIGNhclNwZWVkID0gMC4zNTtcbnZhciBjYXJXaWR0aCA9IDEwO1xudmFyIGNhckhlaWdodCA9IDE2O1xudmFyIGNhckhpdGJveFdpZHRoID0gMTA7XG52YXIgY2FySGl0Ym94SGVpZ2h0ID0gMTY7XG52YXIgY2FySGVhbHRoID0gMjAwO1xudmFyIGNhclZpZXdSYW5nZSA9IDEgLyAzO1xudmFyIGNhckNvbG9ycyA9IFtcbiAgICBcIiNEQzE0M0NcIiwgICAgICAvLyBDcmltc29uXG4gICAgXCIjMDA2NDAwXCIsICAgICAgLy8gRGFyayBHcmVlblxuICAgIFwiI0ZGNjlCNFwiLCAgICAgIC8vIEhvdCBQaW5rXG4gICAgXCIjRkZENzAwXCIsICAgICAgLy8gR29sZFxuICAgIFwiIzcwODA5MFwiLCAgICAgIC8vIFNsYXRlIEdyYXlcbiAgICBcIiMwMEJGRkZcIiwgICAgICAvLyBEZWVwIFNreSBCbHVlXG4gICAgXCIjMDAwMENEXCIsICAgICAgLy8gTWVkaXVtIEJsdWVcbiAgICBcIiNGRjQ1MDBcIiwgICAgICAvLyBPcmFuZ2UgUmVkXG4gICAgXCIjOEIwMDhCXCIsICAgICAgLy8gRGFyayBNYWdlbnRhXG5dO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU5ldyhvYnMsIHNyYywgcG9zWCwgcG9zWSwgYmFzZSkge1xuICAgIHZhciB0eXBlcyA9IHJlcXVpcmUoXCIuLi8uLi9PYmplY3RUeXBlc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIHZhciBjYXJDb2xvciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChjYXJDb2xvcnMubGVuZ3RoKSk7XG4gICAgdmFyIHZlaGljbGVJZCA9IHNyYyArIFwiOlwiICsgdHlwZXMuT2JqZWN0VHlwZXMuVkVISUNMRSArIFwiOlwiICsgdHlwZXMuVmVoaWNsZS5DQVIgKyBcIjpcIiArIHBvc1ggKyBcIjpcIiArIHBvc1k7XG4gICAgXG4gICAgcHJlZmFicy5nZW5lcmF0ZU5ldyhvYnMsIHZlaGljbGVJZCwgcG9zWCwgcG9zWSwgdHlwZXMuT2JqZWN0VHlwZXMuSU5URVJBQ1RBQkxFLCB0eXBlcy5JbnRlcmFjdGFibGUuQ0FSX0VOVEVSKTtcblxuICAgIG9ic1t2ZWhpY2xlSWRdID0gIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgc3VidHlwZTogdHlwZXMuVmVoaWNsZS5DQVIsXG4gICAgICAgIHNwZWVkOiBjYXJTcGVlZCxcbiAgICAgICAgd2lkdGg6IGNhcldpZHRoLFxuICAgICAgICBoZWlnaHQ6IGNhckhlaWdodCxcbiAgICAgICAgaGl0Ym94VHlwZTogdHlwZXMuSGl0Ym94VHlwZXMuUkVDVCxcbiAgICAgICAgaGl0Ym94V2lkdGg6IGNhckhpdGJveFdpZHRoLFxuICAgICAgICBoaXRib3hIZWlnaHQ6IGNhckhpdGJveEhlaWdodCxcbiAgICAgICAgaGVhbHRoOiBjYXJIZWFsdGgsXG4gICAgICAgIG1heEhlYWx0aDogY2FySGVhbHRoLFxuICAgICAgICBjYXJDb2xvcjogY2FyQ29sb3JzW2NhckNvbG9yXSxcbiAgICAgICAgdmlld1JhbmdlOiBjYXJWaWV3UmFuZ2UsXG4gICAgICAgIGludGVyYWN0YWJsZUlkOiB2ZWhpY2xlSWQgKyBcIjpcIiArIHR5cGVzLk9iamVjdFR5cGVzLklOVEVSQUNUQUJMRSArIFwiOlwiICsgdHlwZXMuSW50ZXJhY3RhYmxlLkNBUl9FTlRFUixcbiAgICB9O1xuICAgIHJldHVybjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVOZXc6IGdlbmVyYXRlTmV3LFxufVxuIiwiaW1wb3J0IHsgbWFzdGVyUGllY2UgfSBmcm9tIFwiLi4vLi4vc3JjL1BvcG92YS9Qb3BvdmFcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhck1hc3RlclBpZWNlKG9iamVjdDogYW55LCByZW5kZXJPZmZzZXRYOiBudW1iZXIsIHJlbmRlck9mZnNldFk6IG51bWJlcik6IG1hc3RlclBpZWNlIHtcbiAgICB2YXIgaGlnaGxpZ2h0UjogbnVtYmVyID0gcGFyc2VJbnQoXCIweFwiICsgb2JqZWN0LmNhckNvbG9yLnN1YnN0cmluZygxLCAzKSwgMTYpICsgMHgzMztcbiAgICB2YXIgaGlnaGxpZ2h0RzogbnVtYmVyID0gcGFyc2VJbnQoXCIweFwiICsgb2JqZWN0LmNhckNvbG9yLnN1YnN0cmluZygzLCA1KSwgMTYpICsgMHgzMztcbiAgICB2YXIgaGlnaGxpZ2h0QjogbnVtYmVyID0gcGFyc2VJbnQoXCIweFwiICsgb2JqZWN0LmNhckNvbG9yLnN1YnN0cmluZyg1LCA3KSwgMTYpICsgMHgzMztcbiAgICByZXR1cm4ge1xuICAgICAgICBwYWxldHRlOiBbXCIjMzMzMzMzXCJdXG4gICAgICAgICAgICAuY29uY2F0KG9iamVjdC5jYXJDb2xvcilcbiAgICAgICAgICAgIC5jb25jYXQoXCIjXCIgK1xuICAgICAgICAgICAgICAgIChoaWdobGlnaHRSID4gMHhGRiA/IDB4RkYgOiBoaWdobGlnaHRSKS50b1N0cmluZygxNikgK1xuICAgICAgICAgICAgICAgIChoaWdobGlnaHRHID4gMHhGRiA/IDB4RkYgOiBoaWdobGlnaHRHKS50b1N0cmluZygxNikgK1xuICAgICAgICAgICAgICAgIChoaWdobGlnaHRCID4gMHhGRiA/IDB4RkYgOiBoaWdobGlnaHRCKS50b1N0cmluZygxNilcbiAgICAgICAgICAgICksXG4gICAgICAgIHBvc1g6IG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCxcbiAgICAgICAgcG9zWTogb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLFxuICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IG9iamVjdC5oZWlnaHQsXG4gICAgICAgIGZhY2luZzogb2JqZWN0LmZhY2luZyxcbiAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgIGNlbGxYOiAwLFxuICAgICAgICAgICAgY2VsbFk6IDEsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiA1LFxuICAgICAgICAgICAgc3dhdGNoOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDAsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoIC0gMixcbiAgICAgICAgICAgIGhlaWdodDogNSxcbiAgICAgICAgICAgIHN3YXRjaDogMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMSxcbiAgICAgICAgICAgIGNlbGxZOiA0LFxuICAgICAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCAtIDIsXG4gICAgICAgICAgICBoZWlnaHQ6IDYsXG4gICAgICAgICAgICBzd2F0Y2g6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICBjZWxsWTogOSxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IDYsXG4gICAgICAgICAgICBzd2F0Y2g6IDFcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICBjZWxsWTogOSxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGggLSAyLFxuICAgICAgICAgICAgaGVpZ2h0OiA3LFxuICAgICAgICAgICAgc3dhdGNoOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAxLFxuICAgICAgICAgICAgY2VsbFk6IDMsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoIC0gMixcbiAgICAgICAgICAgIGhlaWdodDogMixcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMixcbiAgICAgICAgICAgIGNlbGxZOiAyLFxuICAgICAgICAgICAgd2lkdGg6IG9iamVjdC53aWR0aCAtIDQsXG4gICAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgICBzd2F0Y2g6IDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICBjZWxsWTogMTAsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoIC0gMixcbiAgICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogMixcbiAgICAgICAgICAgIGNlbGxZOiAxMCxcbiAgICAgICAgICAgIHdpZHRoOiBvYmplY3Qud2lkdGggLSA0LFxuICAgICAgICAgICAgaGVpZ2h0OiA0LFxuICAgICAgICAgICAgc3dhdGNoOiAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiAzLFxuICAgICAgICAgICAgY2VsbFk6IDYsXG4gICAgICAgICAgICB3aWR0aDogb2JqZWN0LndpZHRoIC0gNixcbiAgICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICAgIHN3YXRjaDogMlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBjZWxsWDogLTEsXG4gICAgICAgICAgICBjZWxsWTogNixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiAxXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGNlbGxYOiBvYmplY3Qud2lkdGgsXG4gICAgICAgICAgICBjZWxsWTogNixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgc3dhdGNoOiAxXG4gICAgICAgIH0sXVxuICAgIH07XG59XG4iLCJ2YXIgZGVmYXVsdFZlaGljbGVWaWV3UmFuZ2UgPSAxIC8gNDtcblxuZnVuY3Rpb24gZ2VuZXJhdGVOZXcob2JzLCBzcmMsIHBvc1gsIHBvc1kpIHtcbiAgICB2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi4vLi4vT2JqZWN0VHlwZXNcIik7XG4gICAgdmFyIGNvbGxpc2lvbnMgPSByZXF1aXJlKFwiLi4vLi4vQ29sbGlzaW9uc1wiKTtcbiAgICB2YXIgcHJlZmFicyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJzXCIpO1xuICAgIHZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9QcmVmYWJVdGlsc1wiKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IHR5cGVzLk9iamVjdFR5cGVzLlZFSElDTEUsXG4gICAgICAgIHg6IHBvc1gsXG4gICAgICAgIHk6IHBvc1ksXG4gICAgICAgIHZlbG9jaXR5WDogMCxcbiAgICAgICAgdmVsb2NpdHlZOiAwLFxuICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgIGN1cnJlbnRFcXVpcG1lbnQ6IHVuZGVmaW5lZCxcbiAgICAgICAgZXF1aXBtZW50OiBbIF0sXG4gICAgICAgIHZpZXdSYW5nZTogZGVmYXVsdFZlaGljbGVWaWV3UmFuZ2UsXG4gICAgICAgIHJpZGVyOiB1bmRlZmluZWQsXG4gICAgICAgIGRlYXRocmF0dGxlOiAob2JzLCBzZWxmSWQpID0+IHtcbiAgICAgICAgICAgIGlmIChvYnNbc2VsZklkXS5yaWRlcikge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYnNbb2JzW3NlbGZJZF0uaW50ZXJhY3RhYmxlSWRdO1xuICAgICAgICAgICAgICAgIHZhciByaWRlciA9IG9ic1tzZWxmSWRdLnJpZGVyO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgdmVsb2NpdGllcyBhbmQgcG9zaXRpb25cbiAgICAgICAgICAgICAgICByaWRlci52ZWxvY2l0eVggPSAwO1xuICAgICAgICAgICAgICAgIHJpZGVyLnZlbG9jaXR5WSA9IDA7XG4gICAgICAgICAgICAgICAgcmlkZXIueCA9IG9ic1tzZWxmSWRdLng7XG4gICAgICAgICAgICAgICAgcmlkZXIueSA9IG9ic1tzZWxmSWRdLnk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgb2JzW3NlbGZJZF07XG4gICAgICAgICAgICAgICAgb2JzW3NlbGZJZF0gPSByaWRlcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ic1tvYnNbc2VsZklkXS5pbnRlcmFjdGFibGVJZF07XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ic1tzZWxmSWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IChvYnMsIHNlbGZJZCwgZGVsdGEpID0+IHtcbiAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBjYXIgbW92ZW1lbnRcbiAgICAgICAgICAgIG9ic1tzZWxmSWRdLnggKz0gb2JzW3NlbGZJZF0udmVsb2NpdHlYICogZGVsdGE7XG4gICAgICAgICAgICBvYnNbc2VsZklkXS55ICs9IG9ic1tzZWxmSWRdLnZlbG9jaXR5WSAqIGRlbHRhO1xuXG4gICAgICAgICAgICBpZiAob2JzW29ic1tzZWxmSWRdLmludGVyYWN0YWJsZUlkXSkge1xuICAgICAgICAgICAgICAgIG9ic1tvYnNbc2VsZklkXS5pbnRlcmFjdGFibGVJZF0ueCA9IG9ic1tzZWxmSWRdLng7XG4gICAgICAgICAgICAgICAgb2JzW29ic1tzZWxmSWRdLmludGVyYWN0YWJsZUlkXS55ID0gb2JzW3NlbGZJZF0ueTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgY29sbGlzaW9ucyB3aXRoIHRlcnJhaW4gYW5kIHJlcG9zaXRpb24gYWNjb3JkaW5nbHlcbiAgICAgICAgICAgIGNvbGxpc2lvbnMuY2hlY2tDb2xsaXNpb25zKHNlbGZJZCwgb2JzLCBwcmVmYWJzLnJlbmRlclNpemUsIChzcmNJZCwgY29sbGlzaW9uSWQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob2JzW3NyY0lkXSAmJiBjb2xsaXNpb25JZCAhPSBzcmNJZCl7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob2JzW2NvbGxpc2lvbklkXS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlRFUlJBSU46XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlZFSElDTEU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9ucy5wdXNoQmFjayhvYnMsIHNyY0lkLCBjb2xsaXNpb25JZCwgcHJlZmFicy5yZW5kZXJTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBtb3VzZURvd246IChvYnMsIG1vdXNlRXZlbnQpID0+IHsgfSxcbiAgICAgICAgb25QbGF5ZXJJbnB1dDogKG9icywgc2VsZklkLCBwbGF5ZXJJbnB1dCkgPT4ge1xuICAgICAgICAgICAgcGxheWVyID0gb2JzW3NlbGZJZF07XG4gICAgICAgICAgICB2YXIgeERpciA9IDA7XG4gICAgICAgICAgICB2YXIgeURpciA9IDA7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXJJbnB1dC5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgeERpciAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgeERpciArPSAxO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LnVwKSB7XG4gICAgICAgICAgICAgICAgeURpciAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBsYXllcklucHV0LmRvd24pIHtcbiAgICAgICAgICAgICAgICB5RGlyICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBsYXllci52ZWxvY2l0eVggPSB4RGlyICogcGxheWVyLnNwZWVkO1xuICAgICAgICAgICAgcGxheWVyLnZlbG9jaXR5WSA9IHlEaXIgKiBwbGF5ZXIuc3BlZWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh4RGlyICE9IDAgfHwgeURpciAhPSAwKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLmZhY2luZyA9IChNYXRoLmF0YW4ocGxheWVyLnZlbG9jaXR5WSAvIHBsYXllci52ZWxvY2l0eVgpICogNTcuMjk1OCArIDkwKSArKHhEaXIgPCAwID8gMTgwIDogMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4RGlyICE9IDApIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaGl0Ym94V2lkdGggPSBvYnNbc2VsZklkXS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgcGxheWVyLmhpdGJveEhlaWdodCA9IG9ic1tzZWxmSWRdLndpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHlEaXIgIT0gMCkge1xuICAgICAgICAgICAgICAgIHBsYXllci5oaXRib3hXaWR0aCA9IG9ic1tzZWxmSWRdLndpZHRoO1xuICAgICAgICAgICAgICAgIHBsYXllci5oaXRib3hIZWlnaHQgPSBvYnNbc2VsZklkXS5oZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwbGF5ZXJJbnB1dC5waWNrdXApIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmVjaGljbGVJZCA9IHNlbGZJZCArIFwiOlwiICsgb2JzW3NlbGZJZF0udHlwZSArIFwiOlwiICsgb2JzW3NlbGZJZF0uc3VidHlwZSArIFwiOlwiICsgb2JzW3NlbGZJZF0ueCArIFwiOlwiICsgb2JzW3NlbGZJZF0ueTtcbiAgICAgICAgICAgICAgICBvYnNbb2JzW3NlbGZJZF0uaW50ZXJhY3RhYmxlSWRdLnZlaGljbGVJZCA9IG5ld1ZlY2hpY2xlSWQ7XG4gICAgICAgICAgICAgICAgb2JzW25ld1ZlY2hpY2xlSWRdID0gb2JzW3NlbGZJZF07XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ic1tzZWxmSWRdO1xuICAgICAgICAgICAgICAgIG9ic1tzZWxmSWRdID0gb2JzW25ld1ZlY2hpY2xlSWRdLnJpZGVyO1xuICAgICAgICAgICAgICAgIG9ic1tuZXdWZWNoaWNsZUlkXS5yaWRlciA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IHZlbG9jaXRpZXMgYW5kIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgb2JzW3NlbGZJZF0udmVsb2NpdHlYID0gMDtcbiAgICAgICAgICAgICAgICBvYnNbc2VsZklkXS52ZWxvY2l0eVkgPSAwO1xuICAgICAgICAgICAgICAgIG9ic1tuZXdWZWNoaWNsZUlkXS52ZWxvY2l0eVggPSAwO1xuICAgICAgICAgICAgICAgIG9ic1tuZXdWZWNoaWNsZUlkXS52ZWxvY2l0eVkgPSAwO1xuICAgICAgICAgICAgICAgIG9ic1tzZWxmSWRdLnggPSBvYnNbbmV3VmVjaGljbGVJZF0ueCArIG9ic1tuZXdWZWNoaWNsZUlkXS53aWR0aCAvIDIgKyBvYnNbc2VsZklkXS53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgb2JzW3NlbGZJZF0ueSA9IG9ic1tuZXdWZWNoaWNsZUlkXS55O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBkYW1hZ2U6IHV0aWxzLmRhbWFnZSxcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZU5ldzogZ2VuZXJhdGVOZXcsXG59XG4iLCJpbXBvcnQgeyBtYXN0ZXJQaWVjZSwgUG9wb3ZhIH0gZnJvbSBcIi4uL1BvcG92YS9Qb3BvdmFcIjtcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gXCIuLi8uLi9PYmplY3RUeXBlc1wiO1xuXG5pbXBvcnQgeyBjaGVja1N0YXR1c0VmZmVjdCB9IGZyb20gXCIuLi8uLi9QcmVmYWJzL1BsYXllci9fUGxheWVyXCI7XG5pbXBvcnQgKiBhcyBwbGF5ZXIgZnJvbSBcIi4uLy4uL1ByZWZhYnMvUGxheWVyL19QbGF5ZXIudGVtcGxhdGVcIjtcbmltcG9ydCAqIGFzIGdvZCBmcm9tIFwiLi4vLi4vUHJlZmFicy9QbGF5ZXIvR29kLnRlbXBsYXRlXCI7XG5pbXBvcnQgKiBhcyBmaXJlbWFnZSBmcm9tIFwiLi4vLi4vUHJlZmFicy9QbGF5ZXIvRmlyZU1hZ2UudGVtcGxhdGVcIjtcbmltcG9ydCAqIGFzIGhlYWx0aGJhciBmcm9tIFwiLi4vLi4vUHJlZmFicy9QbGF5ZXIvSGVhbHRoQmFyLnRlbXBsYXRlXCI7XG5cbmltcG9ydCAqIGFzIHN0dW5uZWRTdGF0dXNFZmZlY3QgZnJvbSBcIi4uLy4uL1ByZWZhYnMvUGxheWVyL1N0YXR1c0VmZmVjdHMvU3R1bm5lZC50ZW1wbGF0ZVwiO1xuaW1wb3J0ICogYXMgaW52dWxuZWFyYWJsZVN0YXR1c0VmZmVjdCBmcm9tIFwiLi4vLi4vUHJlZmFicy9QbGF5ZXIvU3RhdHVzRWZmZWN0cy9JbnZ1bG5lcmFibGUudGVtcGxhdGVcIjtcblxuaW1wb3J0ICogYXMgcHJvamVjdGlsZSBmcm9tIFwiLi4vLi4vUHJlZmFicy9Qcm9qZWN0aWxlL19Qcm9qZWN0aWxlLnRlbXBsYXRlXCI7XG5pbXBvcnQgKiBhcyBmaXJlYm9sdCBmcm9tIFwiLi4vLi4vUHJlZmFicy9Qcm9qZWN0aWxlL0ZpcmVib2x0UHJvamVjdGlsZS50ZW1wbGF0ZVwiO1xuaW1wb3J0ICogYXMgZmxhbWVQaWxsYXIgZnJvbSBcIi4uLy4uL1ByZWZhYnMvUHJvamVjdGlsZS9GbGFtZVBpbGxhclByb2plY3RpbGUudGVtcGxhdGVcIjtcbmltcG9ydCAqIGFzIGZsYW1lRGFzaCBmcm9tIFwiLi4vLi4vUHJlZmFicy9Qcm9qZWN0aWxlL0ZsYW1lRGFzaFByb2plY3RpbGUudGVtcGxhdGVcIjtcblxuaW1wb3J0ICogYXMgZ3JhdmVzdG9uZSBmcm9tIFwiLi4vLi4vUHJlZmFicy9HcmF2ZXN0b25lL19HcmF2ZXN0b25lLnRlbXBsYXRlXCI7XG5cbmltcG9ydCAqIGFzIF90ZXJyYWluIGZyb20gXCIuLi8uLi9QcmVmYWJzL1RlcnJhaW4vX1RlcnJhaW4udGVtcGxhdGVcIjtcbmltcG9ydCAqIGFzIHRyZWUgZnJvbSBcIi4uLy4uL1ByZWZhYnMvVGVycmFpbi9UcmVlLnRlbXBsYXRlXCI7XG5pbXBvcnQgKiBhcyB3YWxsSG9yaXogZnJvbSBcIi4uLy4uL1ByZWZhYnMvVGVycmFpbi9XYWxsSG9yaXoudGVtcGxhdGVcIjtcbmltcG9ydCAqIGFzIGNhc3RsZVdhbGxIb3JpeiBmcm9tIFwiLi4vLi4vUHJlZmFicy9UZXJyYWluL0Nhc3RsZVdhbGxIb3Jpei50ZW1wbGF0ZVwiO1xuaW1wb3J0ICogYXMgY2FzdGxlV2FsbFZlcnQgZnJvbSBcIi4uLy4uL1ByZWZhYnMvVGVycmFpbi9DYXN0bGVXYWxsVmVydC50ZW1wbGF0ZVwiO1xuXG5pbXBvcnQgKiBhcyBoZWFsdGhQaWNrdXAgZnJvbSBcIi4uLy4uL1ByZWZhYnMvSW50ZXJhY3RhYmxlL0hlYWx0aFBpY2t1cC50ZW1wbGF0ZVwiO1xuaW1wb3J0ICogYXMgcGxheWVyVHlwZUNoYW5nZXIgZnJvbSBcIi4uLy4uL1ByZWZhYnMvSW50ZXJhY3RhYmxlL1BsYXllclR5cGVDaGFuZ2VyLnRlbXBsYXRlXCI7XG5pbXBvcnQgKiBhcyB0ZWxlcG9ydGVyIGZyb20gXCIuLi8uLi9QcmVmYWJzL0ludGVyYWN0YWJsZS9UZWxlcG9ydGVyLnRlbXBsYXRlXCI7XG5cbmltcG9ydCAqIGFzIHNwaWtlVHJhcCBmcm9tIFwiLi4vLi4vUHJlZmFicy9UcmlnZ2VyL1NwaWtlVHJhcC50ZW1wbGF0ZVwiO1xuaW1wb3J0ICogYXMgaW52dWxuUGxhdGZvcm0gZnJvbSBcIi4uLy4uL1ByZWZhYnMvVHJpZ2dlci9JbnZ1bG5QbGF0Zm9ybS50ZW1wbGF0ZVwiO1xuXG5pbXBvcnQgKiBhcyBjYXIgZnJvbSBcIi4uLy4uL1ByZWZhYnMvVmVoaWNsZS9DYXIudGVtcGxhdGVcIjtcblxuaW1wb3J0ICogYXMgZGVhZER1bW15IGZyb20gXCIuLi8uLi9QcmVmYWJzL0RlY29yYXRpb24vRGVhZER1bW15LnRlbXBsYXRlXCI7XG5pbXBvcnQgKiBhcyB3YXRjaFRvd2VyIGZyb20gXCIuLi8uLi9QcmVmYWJzL0RlY29yYXRpb24vV2F0Y2hUb3dlci50ZW1wbGF0ZVwiO1xuaW1wb3J0ICogYXMgY2FzdGxlRmxvb3IgZnJvbSBcIi4uLy4uL1ByZWZhYnMvRGVjb3JhdGlvbi9DYXN0bGVGbG9vci50ZW1wbGF0ZVwiO1xuXG5pbXBvcnQgKiBhcyBiaW5vY3VsYXJzSWNvbiBmcm9tIFwiLi4vLi4vUHJlZmFicy9FcXVpcG1lbnQvQmlub2N1bGFycy5pY29uXCI7XG5pbXBvcnQgKiBhcyBibGFzdGVySWNvbiBmcm9tIFwiLi4vLi4vUHJlZmFicy9FcXVpcG1lbnQvQmxhc3Rlci5pY29uXCI7XG5pbXBvcnQgKiBhcyBidWlsZGVySWNvbiBmcm9tIFwiLi4vLi4vUHJlZmFicy9FcXVpcG1lbnQvQnVpbGRlci5pY29uXCI7XG5pbXBvcnQgKiBhcyBzY2FubmVySWNvbiBmcm9tIFwiLi4vLi4vUHJlZmFicy9FcXVpcG1lbnQvU2Nhbm5lci5pY29uXCI7XG5cbmltcG9ydCAqIGFzIF9lbmVteSBmcm9tIFwiLi4vLi4vUHJlZmFicy9FbmVteS9fRW5lbXkudGVtcGxhdGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck9iamVjdHMoXG4gICAgb2JqZWN0czogYW55LFxuICAgIHJlbmRlck9mZnNldFg6IG51bWJlcixcbiAgICByZW5kZXJPZmZzZXRZOiBudW1iZXIsXG4gICAgcmVuZGVyU2l6ZTogbnVtYmVyLFxuICAgIGJhY2tncm91bmQ6IFBvcG92YSxcbiAgICBlbnY6IFBvcG92YSxcbiAgICBmb3JlZ3JvdW5kOiBQb3BvdmEsXG4gICAgY292ZXI6IFBvcG92YSxcbiAgICB1aTogUG9wb3ZhLFxuKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gb2JqZWN0cykge1xuICAgICAgICB2YXIgb2JqZWN0ID0gb2JqZWN0c1tpZF07XG5cbiAgICAgICAgc3dpdGNoIChvYmplY3QudHlwZSkge1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5QTEFZRVI6XG4gICAgICAgICAgICAgICAgc3dpdGNoIChvYmplY3Quc3VidHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlBsYXllci5IVU1BTjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVncm91bmQuZHJhdyhwbGF5ZXIucGxheWVyTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5QbGF5ZXIuR09EOlxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWdyb3VuZC5kcmF3KGdvZC5nb2RQbGF5ZXJNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlBsYXllci5GSVJFX01BR0U6XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlZ3JvdW5kLmRyYXcoZmlyZW1hZ2UuZmlyZW1hZ2VQbGF5ZXJNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkcmF3U3RhdHVzRWZmZWN0cyhvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFksIHJlbmRlclNpemUsIGNvdmVyKTtcbiAgICAgICAgICAgICAgICBmb3JlZ3JvdW5kLmRyYXcoaGVhbHRoYmFyLmhlYWx0aEJhck1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSwgcmVuZGVyU2l6ZSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5QUk9KRUNUSUxFOlxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2JqZWN0LnN1YnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5Qcm9qZWN0aWxlLkJBU0lDX1BST0pFQ1RJTEU6XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnYuZHJhdyhwcm9qZWN0aWxlLnByb2plY3RpbGVNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlByb2plY3RpbGUuRklSRUJPTFRfUFJPSkVDVElMRTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KGZpcmVib2x0LmZpcmVib2x0UHJvamVjdGlsZU1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuUHJvamVjdGlsZS5GTEFNRV9QSUxMQVJfUFJPSkVDVElMRTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KGZsYW1lUGlsbGFyLmZsYW1lUGlsbGFyUHJvamVjdGlsZU1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuUHJvamVjdGlsZS5GTEFNRV9EQVNIX1BST0pFQ1RJTEU6XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnYuZHJhdyhmbGFtZURhc2guZmxhbWVEYXNoUHJvamVjdGlsZU1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuR1JBVkVTVE9ORTpcbiAgICAgICAgICAgICAgICBlbnYuZHJhdyhncmF2ZXN0b25lLmdyYXZlU3RvbmVNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICBlbnYuZHJhdyhoZWFsdGhiYXIuaGVhbHRoQmFyTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZLCByZW5kZXJTaXplKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLlRFUlJBSU46XG4gICAgICAgICAgICAgICAgc3dpdGNoIChvYmplY3Quc3VidHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlRlcnJhaW4uVFJFRTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KHRyZWUudHJlZVRydW5rTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Zlci5kcmF3KHRyZWUudHJlZUxlYWZNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLlRlcnJhaW4uV0FMTF9IT1JJWjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KHdhbGxIb3Jpei53YWxsSG9yaXpCYXNlTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Zlci5kcmF3KHdhbGxIb3Jpei53YWxsSG9yaXpDb3Zlck1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuVGVycmFpbi5DQVNUTEVfV0FMTF9IT1JJWjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KGNhc3RsZVdhbGxIb3Jpei5jYXN0bGVXYWxsSG9yaXpCYXNlTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Zlci5kcmF3KGNhc3RsZVdhbGxIb3Jpei5jYXN0bGVXYWxsSG9yaXpDb3Zlck1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuVGVycmFpbi5DQVNUTEVfV0FMTF9WRVJUOlxuICAgICAgICAgICAgICAgICAgICAgICAgY292ZXIuZHJhdyhjYXN0bGVXYWxsVmVydC5jYXN0bGVXYWxsVmVydE1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5JTlRFUkFDVEFCTEU6XG4gICAgICAgICAgICAgICAgc3dpdGNoIChvYmplY3Quc3VidHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkludGVyYWN0YWJsZS5IRUFMVEhfUElDS1VQOlxuICAgICAgICAgICAgICAgICAgICAgICAgZW52LmRyYXcoaGVhbHRoUGlja3VwLmhlYWx0aFBpY2t1cE1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuSW50ZXJhY3RhYmxlLlBMQVlFUl9UWVBFX0NIQU5HRVI6XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnYuZHJhdyhwbGF5ZXJUeXBlQ2hhbmdlci5wbGF5ZXJUeXBlQ2hhbmdlck1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW52LmRyYXcocGxheWVyVHlwZUNoYW5nZXIubGl0dGxlTWFuTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5JbnRlcmFjdGFibGUuVEVMRVBPUlRFUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KHRlbGVwb3J0ZXIudGVsZXBvcnRlck1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5UUklHR0VSOlxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2JqZWN0LnN1YnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5UcmlnZ2VyLlNQSUtFX1RSQVA6XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnYuZHJhdyhzcGlrZVRyYXAuc3Bpa2VUcmFwTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5UcmlnZ2VyLklOVlVMTl9QTEFURk9STTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KGludnVsblBsYXRmb3JtLmludnVsblBsYXRmb3JtTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSB0eXBlcy5PYmplY3RUeXBlcy5WRUhJQ0xFOlxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2JqZWN0LnN1YnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSB0eXBlcy5WZWhpY2xlLkNBUjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVncm91bmQuZHJhdyhjYXIuY2FyTWFzdGVyUGllY2Uob2JqZWN0LCByZW5kZXJPZmZzZXRYLCByZW5kZXJPZmZzZXRZKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIHR5cGVzLk9iamVjdFR5cGVzLkRFQ09SQVRJT046XG4gICAgICAgICAgICAgICAgc3dpdGNoIChvYmplY3Quc3VidHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkRlY29yYXRpb24uREVBRF9EVU1NWTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kcmF3KGRlYWREdW1teS5kZWFkRHVtbXlNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkRlY29yYXRpb24uV0FUQ0hfVE9XRVI6XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Zlci5kcmF3KHdhdGNoVG93ZXIud2F0Y2hUb3dlck1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgdHlwZXMuRGVjb3JhdGlvbi5DQVNUTEVfRkxPT1I6XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLmRyYXcoY2FzdGxlRmxvb3IuY2FzdGxlRmxvb3JNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuQ09NQkFUX1RFWFQ6XG4gICAgICAgICAgICAgICAgdWkuZHJhd1RleHQob2JqZWN0LnRleHQsIG9iamVjdC54IC0gcmVuZGVyT2Zmc2V0WCwgb2JqZWN0LnkgLSByZW5kZXJPZmZzZXRZLCBvYmplY3Quc2l6ZSwgb2JqZWN0LmNvbG9yLCBvYmplY3QuZmFjaW5nKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuT2JqZWN0VHlwZXMuRU5FTVk6XG4gICAgICAgICAgICAgICAgc3dpdGNoIChvYmplY3Quc3VidHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIHR5cGVzLkVuZW15LlRBUkdFVF9EVU1NWTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmVncm91bmQuZHJhdyhfZW5lbXkuZW5lbXlNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3JlZ3JvdW5kLmRyYXcoaGVhbHRoYmFyLmhlYWx0aEJhck1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSwgcmVuZGVyU2l6ZSkpO1xuICAgICAgICAgICAgICAgIGRyYXdTdGF0dXNFZmZlY3RzKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSwgcmVuZGVyU2l6ZSwgY292ZXIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBlbnYuZHJhdyhfdGVycmFpbi5kZWZhdWx0VGVycmFpbk1hc3RlclBpZWNlKG9iamVjdCwgcmVuZGVyT2Zmc2V0WCwgcmVuZGVyT2Zmc2V0WSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ3VycmVudEVxdWlwbWVudChwbGF5ZXI6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIsIHVpOiBQb3BvdmEpIHtcbiAgICBpZiAocGxheWVyICYmIHBsYXllci5jdXJyZW50RXF1aXBtZW50ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBzd2l0Y2ggKHBsYXllci5lcXVpcG1lbnRbcGxheWVyLmN1cnJlbnRFcXVpcG1lbnRdLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuRXF1aXBtZW50VHlwZXMuQkxBU1RFUjpcbiAgICAgICAgICAgICAgICB1aS5kcmF3KGJsYXN0ZXJJY29uLmJsYXN0ZXJVSU1hc3RlclBpZWNlKHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuRXF1aXBtZW50VHlwZXMuU0NBTk5FUjpcbiAgICAgICAgICAgICAgICB1aS5kcmF3KHNjYW5uZXJJY29uLnNjYW5uZXJVSU1hc3RlclBpZWNlKHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuRXF1aXBtZW50VHlwZXMuQlVJTERFUjpcbiAgICAgICAgICAgICAgICB1aS5kcmF3KGJ1aWxkZXJJY29uLmJ1aWxkZXJVSU1hc3RlclBpZWNlKHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgdHlwZXMuRXF1aXBtZW50VHlwZXMuQklOT0NVTEFSUzpcbiAgICAgICAgICAgICAgICB1aS5kcmF3KGJpbm9jdWxhcnNJY29uLmJpbm9jdWxhcnNVSU1hc3RlclBpZWNlKHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJBYmlsaXRpZXMocGxheWVyOiBhbnksIHVpOiBQb3BvdmEpIHtcbiAgICBpZiAocGxheWVyICYmIHBsYXllci5hYmlsaXRpZXMpIHtcbiAgICAgICAgY29uc3QgaWNvblNpemUgPSA0ODtcbiAgICAgICAgY29uc3QgbnVtQWJpbGl0aWVzID0gcGxheWVyLmFiaWxpdGllcy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHJlbmRlcldpZHRoID0gdWkuc2l6ZSgpLndpZHRoIC8gMjtcbiAgICAgICAgY29uc3QgcmVuZGVySGVpZ2h0ID0gdWkuc2l6ZSgpLmhlaWdodCAtIGljb25TaXplO1xuXG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhlc2UgdG8gdGhlaXIgb3duIHRlbXBsYXRlIGZpbGVzXG4gICAgICAgIHBsYXllci5hYmlsaXRpZXMuZm9yRWFjaCgoYWJpbGl0eTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpY29uUG9zWCA9IHJlbmRlcldpZHRoICsgKDAuNSAtIG51bUFiaWxpdGllcyAvIDIgKyBpbmRleCkgKiBpY29uU2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZzogbnVtYmVyID0gKGFiaWxpdHkuY29vbGRvd24gLSAoRGF0ZS5ub3coKSAtIGFiaWxpdHkubGFzdGNhc3QpKSAvIDEwMDA7XG4gICAgICAgICAgICB1aS5kcmF3KHtcbiAgICAgICAgICAgICAgICBwYWxldHRlOiBbXCIjODg4ODg4XCIsIFwiI0NDQ0NDQ1wiLCBcIiNCQkJCQkJcIl0sXG4gICAgICAgICAgICAgICAgcG9zWDogaWNvblBvc1gsXG4gICAgICAgICAgICAgICAgcG9zWTogcmVuZGVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiA4LFxuICAgICAgICAgICAgICAgIGhlaWdodDogOCxcbiAgICAgICAgICAgICAgICBmYWNpbmc6IDAsXG4gICAgICAgICAgICAgICAgc3Ryb2tlczogW3tcbiAgICAgICAgICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxZOiAwLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTYsXG4gICAgICAgICAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbFg6IDAsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTYsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTQsXG4gICAgICAgICAgICAgICAgICAgIHN3YXRjaDogMFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbFg6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxZOiAxLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTQsXG4gICAgICAgICAgICAgICAgICAgIHN3YXRjaDogKHJlbWFpbmluZyA+IDApID8gMSA6IDJcbiAgICAgICAgICAgICAgICB9LF0sXG4gICAgICAgICAgICAgICAgY3VzdG9tUmVuZGVyU2l6ZTogMlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgICAgICAgICAgIHVpLmRyYXdUZXh0KFxuICAgICAgICAgICAgICAgICAgICByZW1haW5pbmcudG9GaXhlZCgxKSxcbiAgICAgICAgICAgICAgICAgICAgaWNvblBvc1gsXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckhlaWdodCArIDQsXG4gICAgICAgICAgICAgICAgICAgIDEyLFxuICAgICAgICAgICAgICAgICAgICBcIiNFRUVFRUVcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVpLmRyYXdUZXh0KFN0cmluZyhpbmRleCArIDEpLCBpY29uUG9zWCwgcmVuZGVySGVpZ2h0ICsgNiwgMTgsIFwiI0VFRUVFRVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U3RhdHVzRWZmZWN0cyhvYmplY3Q6IGFueSwgcmVuZGVyT2Zmc2V0WDogbnVtYmVyLCByZW5kZXJPZmZzZXRZOiBudW1iZXIsIHJlbmRlclNpemU6IG51bWJlciwgY292ZXI6IFBvcG92YSkge1xuICAgIGlmIChjaGVja1N0YXR1c0VmZmVjdChvYmplY3QsIHR5cGVzLlN0YXR1c0VmZmVjdHMuU1RVTk5FRCkpIHtcbiAgICAgICAgY292ZXIuZHJhdyhzdHVubmVkU3RhdHVzRWZmZWN0LnN0dW5uZWRTdGF0dXNFZmZlY3RNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFksIHJlbmRlclNpemUpKTtcbiAgICB9XG4gICAgaWYgKGNoZWNrU3RhdHVzRWZmZWN0KG9iamVjdCwgdHlwZXMuU3RhdHVzRWZmZWN0cy5JTlZVTE5FUkFCTEUpKSB7XG4gICAgICAgIGNvdmVyLmRyYXcoaW52dWxuZWFyYWJsZVN0YXR1c0VmZmVjdC5pbnZ1bG5lcmFibGVTdGF0dXNFZmZlY3RNYXN0ZXJQaWVjZShvYmplY3QsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFksIHJlbmRlclNpemUpKTtcbiAgICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIG1hc3RlclBpZWNlIHtcbiAgICBwYWxldHRlOiBzdHJpbmdbXSxcbiAgICBwb3NYOiBudW1iZXIsXG4gICAgcG9zWTogbnVtYmVyLFxuICAgIHdpZHRoOiBudW1iZXIsXG4gICAgaGVpZ2h0OiBudW1iZXIsXG4gICAgZmFjaW5nOiBudW1iZXIsXG4gICAgc3Ryb2tlczogKHN0cm9rZXxzdmdTdHJva2UpW10sXG4gICAgY3VzdG9tUmVuZGVyU2l6ZT86IG51bWJlcixcbiAgICBzaGFkb3dIZWlnaHQ/OiBudW1iZXIsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2Ugc3Ryb2tlIHtcbiAgICBjZWxsWDogbnVtYmVyLFxuICAgIGNlbGxZOiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICBzd2F0Y2g6IG51bWJlcixcbiAgICB0eXBlPzogU3Ryb2tlVHlwZXMsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2Ugc3ZnU3Ryb2tlIHtcbiAgICB0eXBlOiBTdHJva2VUeXBlcyxcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgcGFyYW1zOiBvYmplY3QsXG59XG5cbmV4cG9ydCBlbnVtIFN0cm9rZVR5cGVzIHtcbiAgICBSRUNUID0gXCJzdHJva2UtcmVjdFwiLFxuICAgIENJUkMgPSBcInN0cm9rZS1jaXJjXCIsXG4gICAgU1ZHID0gXCJzdHJva2Utc3ZnXCIsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgbW91c2VQb3NpdGlvbiB7XG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICBvdXRPZkJvdW5kczogYm9vbGVhbixcbn1cblxuZXhwb3J0IGNsYXNzIFBvcG92YSB7XG5cbiAgICBwcml2YXRlIGNhbnZhczogYW55O1xuICAgIHByaXZhdGUgcmNhbnZhczogYW55O1xuICAgIHByaXZhdGUgY3R4OiBhbnk7XG4gICAgcHJpdmF0ZSB3aWR0aDogbnVtYmVyO1xuICAgIHByaXZhdGUgaGVpZ2h0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBjdWJlU2l6ZTogbnVtYmVyID0gMTI7XG4gICAgcHJpdmF0ZSBzaGFkb3dDb2xvcjogc3RyaW5nID0gXCIjNzc3Nzc3OTlcIjtcbiAgICBwcml2YXRlIHNoYWRvd0hlaWdodDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIFBvcG92YSdzIGNhbnZhc1xuICAgICAqIEBwYXJhbSBjYW52YXNJZCBJZCBvZiBodG1sIGNhbnZhcyBlbGVtZW50XG4gICAgICogQHBhcmFtIGN1YmVTaXplIFJlbmRlciBzaXplIGZvciBlYWNoIGN1YmUgd2hlbiBkcmF3aW5nIHdpdGggY3ViZXNcbiAgICAgKi9cbiAgICBpbml0KGNhbnZhc0lkOiBzdHJpbmcsIHNoYWRvd0hlaWdodDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY2FudmFzID0gPGFueT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudmFzSWQpO1xuICAgICAgICAvLyBAdHMtaWdub3JlICAgLS0gICBJZ25vcmVzIFwiQ2Fubm90IGZpbmQgbmFtZSAncm91Z2gnXCJcbiAgICAgICAgdGhpcy5yY2FudmFzID0gPGFueT4gcm91Z2guY2FudmFzKHRoaXMuY2FudmFzKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoIC0gNDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQgLSA0O1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5zaGFkb3dIZWlnaHQgPSBzaGFkb3dIZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyBhIGdyaWQgb24gdGhlIGNhbnZhc1xuICAgICAqIEBwYXJhbSBzcGFjaW5nIE51bWJlciBvZiBwaXhlbHMgYmV0d2VlbiBncmlkIGxpbmVzXG4gICAgKi9cbiAgICBkcmF3R3JpZChzcGFjaW5nOiBudW1iZXIsIG9mZnNldFg/OiBudW1iZXIsIG9mZnNldFk/OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgLy8gRHJhdyBncmlkIG9uIGJhY2tncm91bmRcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBcIiNmMGU3ZGJcIjtcbiAgICAgICAgZm9yICh2YXIgeCA9ICghIW9mZnNldFgpID8gb2Zmc2V0WCAlIHNwYWNpbmcgOiAwOyB4IDw9IHRoaXMud2lkdGg7IHggKz0gc3BhY2luZykge1xuICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKHgsIDApO1xuICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHkgPSAoISFvZmZzZXRZKSA/IG9mZnNldFkgJSBzcGFjaW5nIDogMDsgeSA8PSB0aGlzLmhlaWdodDsgeSArPSBzcGFjaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8oMCwgeSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy53aWR0aCwgeSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3cyBhIG1hc3RlcnBpZWNlIHRvIHRoZSBjYW52YXNcbiAgICAgKiBAcGFyYW0gbWFzdGVyUGllY2UgRGVmaW5pdGlvbiBmb3Igd2hhdCB0byBkcmF3XG4gICAgICovXG4gICAgZHJhdyhtYXN0ZXJQaWVjZTogbWFzdGVyUGllY2UpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hhZG93SGVpZ2h0ID4gMCkgeyAgICAgICAgLy8gUmVuZGVyIHNoYWRvd3MgICYmIChtYXN0ZXJQaWVjZS5zaGFkb3dIZWlnaHQpID8gbWFzdGVyUGllY2Uuc2hhZG93SGVpZ2h0ID4gMCA6IHRydWVcbiAgICAgICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcblxuICAgICAgICAgICAgdGhpcy5wcmVwQ2FudmFzKFxuICAgICAgICAgICAgICAgIG1hc3RlclBpZWNlLnBvc1ggKyAoKG1hc3RlclBpZWNlLnNoYWRvd0hlaWdodCkgPyBtYXN0ZXJQaWVjZS5zaGFkb3dIZWlnaHQgOiB0aGlzLnNoYWRvd0hlaWdodCksXG4gICAgICAgICAgICAgICAgbWFzdGVyUGllY2UucG9zWSArICgobWFzdGVyUGllY2Uuc2hhZG93SGVpZ2h0KSA/IG1hc3RlclBpZWNlLnNoYWRvd0hlaWdodCA6IHRoaXMuc2hhZG93SGVpZ2h0KSxcbiAgICAgICAgICAgICAgICBtYXN0ZXJQaWVjZS53aWR0aCxcbiAgICAgICAgICAgICAgICBtYXN0ZXJQaWVjZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgbWFzdGVyUGllY2UuZmFjaW5nKTtcbiAgICAgICAgICAgIG1hc3RlclBpZWNlLnN0cm9rZXMuZm9yRWFjaCgoc3Ryb2tlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNoYWRvdyhzdHJva2UsIHRoaXMuc2hhZG93Q29sb3IsIG1hc3RlclBpZWNlLmN1c3RvbVJlbmRlclNpemUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcblxuICAgICAgICB0aGlzLnByZXBDYW52YXMoXG4gICAgICAgICAgICBtYXN0ZXJQaWVjZS5wb3NYLFxuICAgICAgICAgICAgbWFzdGVyUGllY2UucG9zWSxcbiAgICAgICAgICAgIG1hc3RlclBpZWNlLndpZHRoLFxuICAgICAgICAgICAgbWFzdGVyUGllY2UuaGVpZ2h0LFxuICAgICAgICAgICAgbWFzdGVyUGllY2UuZmFjaW5nKTtcbiAgICAgICAgbWFzdGVyUGllY2Uuc3Ryb2tlcy5mb3JFYWNoKChzdHJva2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJTdHJva2Uoc3Ryb2tlLCBtYXN0ZXJQaWVjZS5wYWxldHRlLCBtYXN0ZXJQaWVjZS5jdXN0b21SZW5kZXJTaXplKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENlbnRlcnMgdGhlIGNhbnZhcyBvbiBwb3NpdGlvbiwgYW5kIHJvdGF0ZXMgdG8gYSBjZXJ0YWluIGZhY2luZ1xuICAgICAqIEBwYXJhbSBwb3NpdGlvblggVGhlIHggcG9zaXRpb24gb2Ygd2hhdCBpcyBiZWluZyBkcmF3blxuICAgICAqIEBwYXJhbSBwb3NpdGlvblkgVGhlIHkgcG9zaXRpb24gb2Ygd2hhdCBpcyBiZWluZyBkcmF3blxuICAgICAqIEBwYXJhbSB3aWR0aCBUaGUgd2lkdGggb2Ygd2hhdCBpcyBiZWluZyBkcmF3blxuICAgICAqIEBwYXJhbSBoZWlnaHQgVGhlIGhlaWdodCBvZiB3aGF0IGlzIGJlaW5nIGRyYXduXG4gICAgICogQHBhcmFtIGRlZ3JlZXMgRGVncmVlcyB0byByb3RhdGUgdGhlIGNhbnZhcyBieVxuICAgICAqIEBwYXJhbSBjdXN0b21SZW5kZXJTaXplIFJlbmRlciB0aGUgbWFzdGVyIHBpZWNlIHdpdGggY3VzdG9tIGN1YmUgc2l6aW5nXG4gICAgICovXG4gICAgcHJlcENhbnZhcyhwb3NpdGlvblg6IG51bWJlciwgcG9zaXRpb25ZOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkZWdyZWVzOiBudW1iZXIsIGN1c3RvbVJlbmRlclNpemU/OiBudW1iZXIpe1xuICAgICAgICBjb25zdCByZW5kZXJTaXplID0gY3VzdG9tUmVuZGVyU2l6ZSA/IGN1c3RvbVJlbmRlclNpemUgOiB0aGlzLmN1YmVTaXplO1xuXG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUocG9zaXRpb25YLCBwb3NpdGlvblkpO1xuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoZGVncmVlcyAqIE1hdGguUEkgLyAxODApO1xuICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoLSB3aWR0aCAqIHJlbmRlclNpemUgLyAyLCAtIGhlaWdodCAqIHJlbmRlclNpemUgLyAyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIG1hc3RlcnBpZWNlJ3Mgc3Ryb2tlc1xuICAgICAqIEBwYXJhbSBzdHJva2UgU3Ryb2tlIHRvIHJlbmRlclxuICAgICAqIEBwYXJhbSBwYWxldHRlIENvbnRhaW5zIHRoZSBtYXN0ZXIgcGllY2UncyBjb2xvciBzd2F0Y2hlc1xuICAgICAqIEBwYXJhbSBjdXN0b21SZW5kZXJTaXplIFJlbmRlciB0aGUgbWFzdGVyIHBpZWNlIHdpdGggY3VzdG9tIGN1YmUgc2l6aW5nXG4gICAgICovXG4gICAgcmVuZGVyU3Ryb2tlKHN0cm9rZTogYW55LCBwYWxldHRlOiBzdHJpbmdbXSwgY3VzdG9tUmVuZGVyU2l6ZT86IG51bWJlcil7XG4gICAgICAgIGlmIChzdHJva2UudHlwZSAmJiBzdHJva2UudHlwZSA9PT0gU3Ryb2tlVHlwZXMuQ0lSQykge1xuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gcGFsZXR0ZVtzdHJva2Uuc3dhdGNoXTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmFyYyhcbiAgICAgICAgICAgICAgICBzdHJva2UuY2VsbFggKiAoY3VzdG9tUmVuZGVyU2l6ZSA/IGN1c3RvbVJlbmRlclNpemUgOiB0aGlzLmN1YmVTaXplKSxcbiAgICAgICAgICAgICAgICBzdHJva2UuY2VsbFkgKiAoY3VzdG9tUmVuZGVyU2l6ZSA/IGN1c3RvbVJlbmRlclNpemUgOiB0aGlzLmN1YmVTaXplKSxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbihzdHJva2Uud2lkdGgsIHN0cm9rZS5oZWlnaHQpICogKGN1c3RvbVJlbmRlclNpemUgPyBjdXN0b21SZW5kZXJTaXplIDogdGhpcy5jdWJlU2l6ZSksXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBNYXRoLlBJICogMlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJva2UudHlwZSAmJiBzdHJva2UudHlwZSA9PT0gU3Ryb2tlVHlwZXMuU1ZHKSB7XG4gICAgICAgICAgICB0aGlzLnJjYW52YXMucGF0aChzdHJva2UucGF0aCwgc3Ryb2tlLnBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBwYWxldHRlW3N0cm9rZS5zd2F0Y2hdO1xuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoXG4gICAgICAgICAgICAgICAgc3Ryb2tlLmNlbGxYICogKGN1c3RvbVJlbmRlclNpemUgPyBjdXN0b21SZW5kZXJTaXplIDogdGhpcy5jdWJlU2l6ZSksXG4gICAgICAgICAgICAgICAgc3Ryb2tlLmNlbGxZICogKGN1c3RvbVJlbmRlclNpemUgPyBjdXN0b21SZW5kZXJTaXplIDogdGhpcy5jdWJlU2l6ZSksXG4gICAgICAgICAgICAgICAgc3Ryb2tlLndpZHRoICogKGN1c3RvbVJlbmRlclNpemUgPyBjdXN0b21SZW5kZXJTaXplIDogdGhpcy5jdWJlU2l6ZSksXG4gICAgICAgICAgICAgICAgc3Ryb2tlLmhlaWdodCAqIChjdXN0b21SZW5kZXJTaXplID8gY3VzdG9tUmVuZGVyU2l6ZSA6IHRoaXMuY3ViZVNpemUpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyBtYXN0ZXJwaWVjZSBzaGFkb3dcbiAgICAgKiBAcGFyYW0gc3Ryb2tlIFN0cm9rZSB0byByZW5kZXJcbiAgICAgKiBAcGFyYW0gc2hhZG93Q29sb3IgU2hhZG93IGZpbGwgY29sb3JcbiAgICAgKiBAcGFyYW0gY3VzdG9tUmVuZGVyU2l6ZSBSZW5kZXIgdGhlIG1hc3RlciBwaWVjZSB3aXRoIGN1c3RvbSBjdWJlIHNpemluZ1xuICAgICAqL1xuICAgIHJlbmRlclNoYWRvdyhzdHJva2U6IGFueSwgc2hhZG93Q29sb3I6IHN0cmluZywgY3VzdG9tUmVuZGVyU2l6ZT86IG51bWJlcil7XG4gICAgICAgIGlmIChzdHJva2UudHlwZSAmJiBzdHJva2UudHlwZSA9PT0gU3Ryb2tlVHlwZXMuQ0lSQykge1xuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gc2hhZG93Q29sb3I7XG4gICAgICAgICAgICB0aGlzLmN0eC5hcmMoXG4gICAgICAgICAgICAgICAgc3Ryb2tlLmNlbGxYICogKGN1c3RvbVJlbmRlclNpemUgPyBjdXN0b21SZW5kZXJTaXplIDogdGhpcy5jdWJlU2l6ZSksXG4gICAgICAgICAgICAgICAgc3Ryb2tlLmNlbGxZICogKGN1c3RvbVJlbmRlclNpemUgPyBjdXN0b21SZW5kZXJTaXplIDogdGhpcy5jdWJlU2l6ZSksXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oc3Ryb2tlLndpZHRoLCBzdHJva2UuaGVpZ2h0KSAqIChjdXN0b21SZW5kZXJTaXplID8gY3VzdG9tUmVuZGVyU2l6ZSA6IHRoaXMuY3ViZVNpemUpLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgTWF0aC5QSSAqIDJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3Ryb2tlLnR5cGUgJiYgc3Ryb2tlLnR5cGUgPT09IFN0cm9rZVR5cGVzLlNWRykge1xuICAgICAgICAgICAgdGhpcy5yY2FudmFzLnBhdGgoc3Ryb2tlLnBhdGgsIHsgZmlsbDogc2hhZG93Q29sb3IsIGZpbGxTdHlsZTogXCJzb2xpZFwiLCBzdHJva2VXaWR0aDogMC4wMSB9ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBzaGFkb3dDb2xvcjtcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgICAgIHN0cm9rZS5jZWxsWCAqIChjdXN0b21SZW5kZXJTaXplID8gY3VzdG9tUmVuZGVyU2l6ZSA6IHRoaXMuY3ViZVNpemUpLFxuICAgICAgICAgICAgICAgIHN0cm9rZS5jZWxsWSAqIChjdXN0b21SZW5kZXJTaXplID8gY3VzdG9tUmVuZGVyU2l6ZSA6IHRoaXMuY3ViZVNpemUpLFxuICAgICAgICAgICAgICAgIHN0cm9rZS53aWR0aCAqIChjdXN0b21SZW5kZXJTaXplID8gY3VzdG9tUmVuZGVyU2l6ZSA6IHRoaXMuY3ViZVNpemUpLFxuICAgICAgICAgICAgICAgIHN0cm9rZS5oZWlnaHQgKiAoY3VzdG9tUmVuZGVyU2l6ZSA/IGN1c3RvbVJlbmRlclNpemUgOiB0aGlzLmN1YmVTaXplKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVyYXNlcyBldmVyeXRoaW5nIG9uIHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICB3aXBlQ2FudmFzKCkge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGNhbnZhcycgd2lkdGggYW5kIGhlaWdodFxuICAgICAqL1xuICAgIHNpemUoKTogeyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciB9IHtcbiAgICAgICAgcmV0dXJuIHsgd2lkdGg6IHRoaXMud2lkdGgsIGhlaWdodDogdGhpcy5oZWlnaHQgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIFBvcG92YSdzIGN1YmUgcmVuZGVyIHNpemVcbiAgICAgKi9cbiAgICBnZXRDdWJlU2l6ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jdWJlU2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIFBvcG92YSdzIGN1YmUgcmVuZGVyIHNpemVcbiAgICAgKiBAcGFyYW0gc2l6ZSBWYWx1ZSBmb3IgY3ViZSByZW5kZXIgc2l6ZVxuICAgICAqL1xuICAgIHNldEN1YmVTaXplKHNpemU6IG51bWJlcikge1xuICAgICAgICB0aGlzLmN1YmVTaXplID0gc2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIG1vdXNlIHBvc2l0aW9uIGFuZCBpZiBtb3VzZSBpcyBpbnNpZGUgY2FudmFzXG4gICAgICogQHBhcmFtIGV2dCBNb3VzZSBtb3ZlbWVudCBldmVudCwgY29udGFpbmluZyBwb3NpdGlvbiBpbmZvcm1hdGlvblxuICAgICAqL1xuICAgIGdldE1vdXNlUG9zKGV2dDogYW55KTogbW91c2VQb3NpdGlvbiB7XG4gICAgICAgIHZhciByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBwb3NYID0gZXZ0LmNsaWVudFggLSByZWN0LmxlZnQ7XG4gICAgICAgIHZhciBwb3NZID0gZXZ0LmNsaWVudFkgLSByZWN0LnRvcDtcbiAgICAgICAgdmFyIG9mZkNhbnZhcyA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChwb3NYIDwgMCkge1xuICAgICAgICAgICAgcG9zWCA9IDA7XG4gICAgICAgICAgICBvZmZDYW52YXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NZIDwgMCkge1xuICAgICAgICAgICAgcG9zWSA9IDA7XG4gICAgICAgICAgICBvZmZDYW52YXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NYID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgcG9zWCA9IHRoaXMud2lkdGg7XG4gICAgICAgICAgICBvZmZDYW52YXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NZID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHBvc1kgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgIG9mZkNhbnZhcyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHBvc1gsXG4gICAgICAgICAgeTogcG9zWSxcbiAgICAgICAgICBvdXRPZkJvdW5kczogb2ZmQ2FudmFzLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgdGV4dCB0byB0aGUgY2FudmFzXG4gICAgICogQHBhcmFtIHRleHQgVGhlIHRleHQgdG8gZHJhd1xuICAgICAqIEBwYXJhbSBwb3NYIFRoZSBob3Jpem9udGFsIHBvc2l0aW9uIHRvIGRyYXcgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gcG9zWSBUaGUgdmVydGljYWwgcG9zaXRpb24gdG8gZHJhdyB0aGUgdGV4dFxuICAgICAqIEBwYXJhbSBzaXplIFRoZSBmb250IHNpemUgb2YgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gY29sb3IgVGhlIGNvbG9yIHRvIGRyYXcgdGhlIHRleHRcbiAgICAgKiBAcGFyYW0gZmFjaW5nIFRoZSBhbmdsZSB0byByZW5kZXIgdGhlIHRleHRcbiAgICAgKi9cbiAgICBkcmF3VGV4dCh0ZXh0OiBzdHJpbmcsIHBvc1g6IG51bWJlciwgcG9zWTogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBjb2xvcj86IHN0cmluZywgZmFjaW5nPzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcblxuICAgICAgICBjb25zdCBhY3R1YWxTaXplID0gc2l6ZSA/IHNpemUgOiAxNjtcbiAgICAgICAgdGhpcy5jdHguZm9udCA9IFN0cmluZyhhY3R1YWxTaXplKSArIFwicHggQXJpYWxcIjtcbiAgICAgICAgdGhpcy5wcmVwQ2FudmFzKHBvc1gsIHBvc1ksIHRoaXMuY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoLCAwLCBmYWNpbmcsIDEpO1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvciA/IGNvbG9yIDogXCJibGFja1wiO1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dCh0ZXh0LCAwLCAwKTtcblxuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgKiBhcyBzb2NrZXRJbyBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xuaW1wb3J0IHsgUG9wb3ZhLCBtb3VzZVBvc2l0aW9uLCBtYXN0ZXJQaWVjZSB9IGZyb20gXCIuL1BvcG92YS9Qb3BvdmFcIjtcbmltcG9ydCAqIGFzIGxvdXZyZSBmcm9tIFwiLi9Mb3V2cmUvTG91dnJlXCI7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tIFwiLi4vT2JqZWN0VHlwZXNcIjtcblxuLy8gU29ja2V0IGxpc3RlbmVyXG52YXIgc29ja2V0ID0gaW8oKTtcbnZhciBkZWJ1ZyA9IHRydWU7XG5cbnZhciBjdWJlU2l6ZTogbnVtYmVyO1xudmFyIGdyaWRTaXplOiBudW1iZXIgPSA0ODtcbnZhciBjYW52YXNTaXplOiB7IHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIH07XG52YXIgZXF1aXBtZW50SWNvblBvc1g6IG51bWJlciA9IDk3NjtcbnZhciBlcXVpcG1lbnRJY29uUG9zWTogbnVtYmVyID0gNzI2O1xuXG52YXIgcGxheWVySWQ6IHN0cmluZztcblxudmFyIHJlbmRlck9mZnNldFg6IG51bWJlcjtcbnZhciByZW5kZXJPZmZzZXRZOiBudW1iZXI7XG52YXIgY2FtZXJhTW92aW5nVG9YOiBudW1iZXI7XG52YXIgY2FtZXJhTW92aW5nVG9ZOiBudW1iZXI7XG52YXIgY2FtZXJhUGFuU3BlZWQgPSAwLjAxNTtcblxudmFyIG1vdXNlUG9zOiBtb3VzZVBvc2l0aW9uID0geyB4OiAwLCB5OiAwLCBvdXRPZkJvdW5kczogdHJ1ZSB9O1xuXG52YXIgcGxheWVySW5wdXQgPSB7XG4gICAgdXA6IGZhbHNlLFxuICAgIGRvd246IGZhbHNlLFxuICAgIGxlZnQ6IGZhbHNlLFxuICAgIHJpZ2h0OiBmYWxzZSxcbiAgICBjeWNsZUVxdWlwbWVudEZvcndhcmQ6IGZhbHNlLFxuICAgIGN5Y2xlRXF1aXBtZW50QmFja3dhcmQ6IGZhbHNlLFxuICAgIHVzZUVxdWlwbWVudDogZmFsc2UsXG4gICAgcGlja3VwOiBmYWxzZSxcbiAgICBhYmlsaXR5MTogZmFsc2UsXG4gICAgYWJpbGl0eTI6IGZhbHNlLFxuICAgIGFiaWxpdHkzOiBmYWxzZSxcbiAgICBhYmlsaXR5NDogZmFsc2UsXG4gICAgdGFyZ2V0WDogbW91c2VQb3MueCxcbiAgICB0YXJnZXRZOiBtb3VzZVBvcy55LFxufVxuXG52YXIgS0VZX1VQID0gODc7ICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBXXG52YXIgS0VZX0RPV04gPSA4MzsgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBTXG52YXIgS0VZX1JJR0hUID0gNjg7ICAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBEXG52YXIgS0VZX0xFRlQgPSA2NTsgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBBXG52YXIgS0VZX0NZQ0xFX0VRVUlQTUVOVF9GT1JXQVJEID0gNjk7ICAgLy8gRGVmYXVsdCB0byBFXG52YXIgS0VZX0NZQ0xFX0VRVUlQTUVOVF9CQUNLV0FSRCA9IDgxOyAgLy8gRGVmYXVsdCB0byBRXG52YXIgS0VZX1VTRV9FUVVJUE1FTlQgPSA4MiAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBSXG52YXIgS0VZX1BJQ0tVUCA9IDcwOyAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBGXG52YXIgS0VZX0FCSUxJVFlfMSA9IDQ5OyAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byAxXG52YXIgS0VZX0FCSUxJVFlfMiA9IDUwOyAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byAyXG52YXIgS0VZX0FCSUxJVFlfMyA9IDUxOyAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byAzXG52YXIgS0VZX0FCSUxJVFlfNCA9IDUyOyAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byA0XG5cbnZhciBwcmV2VGltZSA9IDA7XG52YXIgZGVsdGEgPSAwO1xuXG4vLyBBZGQgbGlzdGVuZXJzIHRvIGRvY3VtZW50XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSBLRVlfVVA6XG4gICAgICAgICAgICBwbGF5ZXJJbnB1dC51cCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLRVlfRE9XTjpcbiAgICAgICAgICAgIHBsYXllcklucHV0LmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS0VZX1JJR0hUOlxuICAgICAgICAgICAgcGxheWVySW5wdXQucmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS0VZX0xFRlQ6XG4gICAgICAgICAgICBwbGF5ZXJJbnB1dC5sZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtFWV9DWUNMRV9FUVVJUE1FTlRfRk9SV0FSRDpcbiAgICAgICAgICAgIHBsYXllcklucHV0LmN5Y2xlRXF1aXBtZW50Rm9yd2FyZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLRVlfQ1lDTEVfRVFVSVBNRU5UX0JBQ0tXQVJEOlxuICAgICAgICAgICAgcGxheWVySW5wdXQuY3ljbGVFcXVpcG1lbnRCYWNrd2FyZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLRVlfVVNFX0VRVUlQTUVOVDpcbiAgICAgICAgICAgIHBsYXllcklucHV0LnVzZUVxdWlwbWVudCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLRVlfUElDS1VQOlxuICAgICAgICAgICAgcGxheWVySW5wdXQucGlja3VwID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtFWV9BQklMSVRZXzE6XG4gICAgICAgICAgICBwbGF5ZXJJbnB1dC5hYmlsaXR5MSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLRVlfQUJJTElUWV8yOlxuICAgICAgICAgICAgcGxheWVySW5wdXQuYWJpbGl0eTIgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS0VZX0FCSUxJVFlfMzpcbiAgICAgICAgICAgIHBsYXllcklucHV0LmFiaWxpdHkzID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtFWV9BQklMSVRZXzQ6XG4gICAgICAgICAgICBwbGF5ZXJJbnB1dC5hYmlsaXR5NCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGxheWVySW5wdXQudGFyZ2V0WCA9IG1vdXNlUG9zLnggKyByZW5kZXJPZmZzZXRYO1xuICAgIHBsYXllcklucHV0LnRhcmdldFkgPSBtb3VzZVBvcy55ICsgcmVuZGVyT2Zmc2V0WTtcbiAgICBzb2NrZXQuZW1pdChcInBsYXllcklucHV0XCIsIHBsYXllcklucHV0KTtcbiAgICBcbiAgICAvLyBUcmlnZ2VyIGtleXMgYXJlIHVuc2V0IGFmdGVyIGVtaXNzaW9uXG4gICAgcGxheWVySW5wdXQucGlja3VwID0gZmFsc2U7XG4gICAgcGxheWVySW5wdXQuY3ljbGVFcXVpcG1lbnRGb3J3YXJkID0gZmFsc2U7XG4gICAgcGxheWVySW5wdXQuY3ljbGVFcXVpcG1lbnRCYWNrd2FyZCA9IGZhbHNlO1xuICAgIHBsYXllcklucHV0LnVzZUVxdWlwbWVudCA9IGZhbHNlO1xufSk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2ZW50KSA9PiB7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgS0VZX1VQOlxuICAgICAgICAgICAgcGxheWVySW5wdXQudXAgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtFWV9ET1dOOlxuICAgICAgICAgICAgcGxheWVySW5wdXQuZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS0VZX1JJR0hUOlxuICAgICAgICAgICAgcGxheWVySW5wdXQucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtFWV9MRUZUOlxuICAgICAgICAgICAgcGxheWVySW5wdXQubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS0VZX0FCSUxJVFlfMTpcbiAgICAgICAgICAgIHBsYXllcklucHV0LmFiaWxpdHkxID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLRVlfQUJJTElUWV8yOlxuICAgICAgICAgICAgcGxheWVySW5wdXQuYWJpbGl0eTIgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtFWV9BQklMSVRZXzM6XG4gICAgICAgICAgICBwbGF5ZXJJbnB1dC5hYmlsaXR5MyA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS0VZX0FCSUxJVFlfNDpcbiAgICAgICAgICAgIHBsYXllcklucHV0LmFiaWxpdHk0ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc29ja2V0LmVtaXQoXCJwbGF5ZXJJbnB1dFwiLCBwbGF5ZXJJbnB1dCk7XG59KTtcblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQ6IGFueSkge1xuICAgIG1vdXNlUG9zID0gZm9yZWdyb3VuZC5nZXRNb3VzZVBvcyhldmVudCk7XG59XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSwgZmFsc2UpO1xuXG5mdW5jdGlvbiBvbk1vdXNlQ2xpY2soZXZlbnQ6IGFueSkge1xuICAgIGlmICghbW91c2VQb3Mub3V0T2ZCb3VuZHMpIHtcbiAgICAgICAgc29ja2V0LmVtaXQoXCJtb3VzZURvd25cIiwge1xuICAgICAgICAgICAgc291cmNlSWQ6IHBsYXllcklkLFxuICAgICAgICAgICAgdGFyZ2V0WDogKG1vdXNlUG9zLnggKyByZW5kZXJPZmZzZXRYKSxcbiAgICAgICAgICAgIHRhcmdldFk6IChtb3VzZVBvcy55ICsgcmVuZGVyT2Zmc2V0WSksXG4gICAgICAgICAgICBwbGF5ZXJJbnB1dDogcGxheWVySW5wdXQsXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgb25Nb3VzZUNsaWNrLCBmYWxzZSk7XG5cbi8vIEluaXQgY2FudmFzXG52YXIgYmFja2dyb3VuZCAgPSBuZXcgUG9wb3ZhKCk7XG52YXIgZW52ICAgICAgICAgPSBuZXcgUG9wb3ZhKCk7XG52YXIgZm9yZWdyb3VuZCAgPSBuZXcgUG9wb3ZhKCk7XG52YXIgY292ZXIgICAgICAgPSBuZXcgUG9wb3ZhKCk7XG52YXIgdWkgICAgICAgICAgPSBuZXcgUG9wb3ZhKCk7XG5cbmJhY2tncm91bmQuaW5pdChcImJhY2tncm91bmRcIiwgMik7XG5lbnYuaW5pdChcImVudlwiLCAyKTtcbmZvcmVncm91bmQuaW5pdChcImZvcmVncm91bmRcIiwgMik7XG5jb3Zlci5pbml0KFwiY292ZXJcIiwgMik7XG51aS5pbml0KFwidWlcIiwgMCk7ICAgICAgIC8vIFVpIGRvZXNuJ3QgZHJvcCBhIHNoYWRvd1xuXG4vLyBUZWxsIHRoZSBzZXJ2ZXIgYSBuZXcgcGxheWVyIGhhcyBqb2luZWQgYW5kIGhhbmRzaGFrZVxuc29ja2V0LmVtaXQoXCJuZXctcGxheWVyXCIpO1xuc29ja2V0Lm9uKFwiaGFuZHNoYWtlXCIsIChpbmZvOiBhbnkpID0+IHtcbiAgICBwbGF5ZXJJZCA9IGluZm8uaWQ7XG4gICAgY3ViZVNpemUgPSBpbmZvLmN1YmVTaXplO1xuICAgIGJhY2tncm91bmQuc2V0Q3ViZVNpemUoY3ViZVNpemUpO1xuICAgIGVudi5zZXRDdWJlU2l6ZShjdWJlU2l6ZSk7XG4gICAgZm9yZWdyb3VuZC5zZXRDdWJlU2l6ZShjdWJlU2l6ZSk7XG4gICAgY292ZXIuc2V0Q3ViZVNpemUoY3ViZVNpemUpO1xuICAgIHVpLnNldEN1YmVTaXplKGN1YmVTaXplKTtcbiAgICBjYW52YXNTaXplID0gZm9yZWdyb3VuZC5zaXplKCk7XG5cbiAgICBwcmV2VGltZSA9IERhdGUubm93KCk7XG4gICAgcmVuZGVyT2Zmc2V0WCA9IDA7XG4gICAgcmVuZGVyT2Zmc2V0WSA9IDA7XG59KTtcblxuLy8gSW50ZXJwcmV0IHN0YXRlIGFuZCBkcmF3IG9iamVjdHNcbnNvY2tldC5vbihcInN0YXRlXCIsIChvYmplY3RzOiBhbnkpID0+IHtcbiAgICB2YXIgcGxheWVyID0gdW5kZWZpbmVkO1xuICAgIGlmIChwbGF5ZXJJZCAmJiBvYmplY3RzW3BsYXllcklkXSkge1xuICAgICAgICBwbGF5ZXIgPSBvYmplY3RzW3BsYXllcklkXTtcbiAgICB9XG5cbiAgICBpZiAoIWNhbnZhc1NpemUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvcmVncm91bmQud2lwZUNhbnZhcygpO1xuICAgIGVudi53aXBlQ2FudmFzKCk7XG4gICAgY292ZXIud2lwZUNhbnZhcygpO1xuICAgIHVpLndpcGVDYW52YXMoKTtcblxuICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGRlbHRhID0gdGltZSAtIHByZXZUaW1lO1xuICAgIHByZXZUaW1lID0gdGltZTtcblxuICAgIC8vIENhbWVyYSBzbW9vdGhpbmcgYW5kIHJlbmRlciBvZmZzZXQgY2FsY3VsYXRpb25zXG4gICAgY2FtZXJhTW92aW5nVG9YID0gKCEhcGxheWVyKVxuICAgICAgICA/IHBsYXllci54ICsgKG1vdXNlUG9zLnggLSAoY2FudmFzU2l6ZS53aWR0aCAvIDIpKSAqIHBsYXllci52aWV3UmFuZ2UgLSBjYW52YXNTaXplLndpZHRoIC8gMlxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICBjYW1lcmFNb3ZpbmdUb1kgPSAoISFwbGF5ZXIpXG4gICAgICAgID8gcGxheWVyLnkgKyAobW91c2VQb3MueSAtIChjYW52YXNTaXplLmhlaWdodCAvIDIpKSAqIHBsYXllci52aWV3UmFuZ2UgLSBjYW52YXNTaXplLmhlaWdodCAvIDJcbiAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICByZW5kZXJPZmZzZXRYICs9ICghIWNhbWVyYU1vdmluZ1RvWClcbiAgICAgICAgPyAoY2FtZXJhTW92aW5nVG9YIC0gcmVuZGVyT2Zmc2V0WCkgKiBjYW1lcmFQYW5TcGVlZCAqIGRlbHRhXG4gICAgICAgIDogMDtcbiAgICByZW5kZXJPZmZzZXRZICs9ICghIWNhbWVyYU1vdmluZ1RvWSlcbiAgICAgICAgPyAoY2FtZXJhTW92aW5nVG9ZIC0gcmVuZGVyT2Zmc2V0WSkgKiBjYW1lcmFQYW5TcGVlZCAqIGRlbHRhXG4gICAgICAgIDogMDtcblxuICAgIC8vIFRPRE86IERyYXcgYmFja2dyb3VuZCBtYXAgKGluc3RlYWQgb2Yvd2l0aCBncmlkKVxuICAgIGlmICghIW9iamVjdHMpIHtcbiAgICAgICAgYmFja2dyb3VuZC53aXBlQ2FudmFzKCk7XG4gICAgICAgIC8vIGJhY2tncm91bmQuZHJhd0dyaWQoZ3JpZFNpemUsIC1yZW5kZXJPZmZzZXRYLCAtcmVuZGVyT2Zmc2V0WSk7XG4gICAgfVxuXG4gICAgaWYgKGRlYnVnKSB7XG4gICAgICAgIHVpLmRyYXdUZXh0KGRlbHRhLnRvU3RyaW5nKCkgKyBcIm1zXCIsIGNhbnZhc1NpemUud2lkdGggLSAzMiwgMTYsIDE2LCBcIiM0NDQ0NDRcIik7XG4gICAgfVxuXG4gICAgLy8gUmVuZGVyIGN1cnJlbnQgZXF1aXBtZW50IHVpIGljb25cbiAgICBsb3V2cmUucmVuZGVyQ3VycmVudEVxdWlwbWVudChwbGF5ZXIsIGVxdWlwbWVudEljb25Qb3NYLCBlcXVpcG1lbnRJY29uUG9zWSwgdWkpO1xuXG4gICAgLy8gUmVuZGVyIHBsYXllcidzIGFiaWxpdGllc1xuICAgIGxvdXZyZS5yZW5kZXJBYmlsaXRpZXMocGxheWVyLCB1aSk7XG5cbiAgICAvLyBSZW5kZXIgb2JqZWN0c1xuICAgIGxvdXZyZS5yZW5kZXJPYmplY3RzKG9iamVjdHMsIHJlbmRlck9mZnNldFgsIHJlbmRlck9mZnNldFksIGN1YmVTaXplLCBiYWNrZ3JvdW5kLCBlbnYsIGZvcmVncm91bmQsIGNvdmVyLCB1aSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=