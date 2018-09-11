import * as socketIo from "socket.io-client";
import { Popova, mousePosition, masterPiece } from "./Popova/Popova";
import * as louvre from "./Louvre/Louvre";
import * as types from "../ObjectTypes";

// Socket listener
var socket = io();
var debug = true;

var cubeSize: number;
var gridSize: number = 48;
var canvasSize: { width: number, height: number };
var equipmentIconPosX: number = 976;
var equipmentIconPosY: number = 726;

var playerId: string;

var renderOffsetX: number;
var renderOffsetY: number;
var cameraMovingToX: number;
var cameraMovingToY: number;
var cameraPanSpeed = 0.015;

var mousePos: mousePosition = { x: 0, y: 0, outOfBounds: true };

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
}

var KEY_UP = 87;                        // Default to W
var KEY_DOWN = 83;                      // Default to S
var KEY_RIGHT = 68;                     // Default to D
var KEY_LEFT = 65;                      // Default to A
var KEY_CYCLE_EQUIPMENT_FORWARD = 69;   // Default to E
var KEY_CYCLE_EQUIPMENT_BACKWARD = 81;  // Default to Q
var KEY_USE_EQUIPMENT = 82              // Default to R
var KEY_PICKUP = 70;                    // Default to F
var KEY_ABILITY_1 = 49;                 // Default to 1
var KEY_ABILITY_2 = 50;                 // Default to 2
var KEY_ABILITY_3 = 51;                 // Default to 3
var KEY_ABILITY_4 = 52;                 // Default to 4

var prevTime = 0;
var delta = 0;

// Add listeners to document
document.addEventListener("keydown", (event) => {
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
document.addEventListener("keyup", (event) => {
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

function onMouseMove(event: any) {
    mousePos = foreground.getMousePos(event);
}
window.addEventListener("mousemove", onMouseMove, false);

function onMouseClick(event: any) {
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
var background  = new Popova();
var env         = new Popova();
var foreground  = new Popova();
var cover       = new Popova();
var ui          = new Popova();

background.init("background", 2);
env.init("env", 2);
foreground.init("foreground", 2);
cover.init("cover", 2);
ui.init("ui", 0);       // Ui doesn't drop a shadow

// Tell the server a new player has joined and handshake
socket.emit("new-player");
socket.on("handshake", (info: any) => {
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
socket.on("state", (objects: any) => {
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

    const time = Date.now();
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
    louvre.renderCurrentEquipment(player, equipmentIconPosX, equipmentIconPosY, ui);

    // Render player's abilities
    louvre.renderAbilities(player, ui);

    // Render objects
    louvre.renderObjects(objects, renderOffsetX, renderOffsetY, cubeSize, background, env, foreground, cover, ui);
});
