// Dependencies
var http = require("http");
var path = require("path");
var express = require("express");
var socketIO = require("socket.io");
var types = require("./ObjectTypes");
var prefabs = require("./Prefabs/Prefabs");
var collisions = require("./Collisions");
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.use("/dist", express.static(__dirname + "/dist"));

const PORT = process.env.PORT || 5000;
const INDEX = path.join(__dirname, "dist/index.html");

app.use((req, res) => res.sendFile(INDEX) );

// Start the server
server.listen(PORT, () => {
    console.log(`Starting server on port ${ PORT }`);
});

var renderSize = prefabs.renderSize;
var prevTime = Date.now();
var delta = 0;
var objects = {};

// Adds starting resources to the map
initializeMap(objects);

// Listen for connection on IO
io.on("connection", (socket) => {
    // Handle connection
    socket.on("new-player", () => {
        prefabs.generateNew(objects, socket.id, 0, 0, types.ObjectTypes.PLAYER, types.Player.HUMAN);

        socket.emit("handshake", {
            id: socket.id,
            cubeSize: renderSize,
        });
    });

    // Handle player input event
    socket.on("playerInput", (playerInput) => {
        if (objects[socket.id]) {
            objects[socket.id].onPlayerInput(objects, socket.id, playerInput);
        }
    });

    // Handle mouse down event from player
    socket.on("mouseDown", (object) => {
        if (objects[object.sourceId]) {
            objects[object.sourceId].mouseDown(objects, object);
        }
    });

    // Handle player disconnect - Clean up resources 
    socket.on("disconnect", () => {
        delete objects[socket.id];
    });
});

// Main update loop at 60fps
setInterval(() => {
    const time = Date.now();
    delta = time - prevTime;
    prevTime = time;

    for (var id in objects) {
        if (objects[id]) {
            objects[id].update(objects, id, delta);
        }
    }

    io.sockets.emit("state", objects);
}, 1000 / 60);

// Initializes starting map resources
function initializeMap(obs) {
    prefabs.generateNew(obs, "init", 75, -25, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 180, 210, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -150, 200, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 220, -205, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -195, -175, types.ObjectTypes.TERRAIN, types.Terrain.TREE);

    prefabs.generateNew(obs, "init", -104, 125, types.ObjectTypes.TERRAIN, types.Terrain.WALL_HORIZ);
    prefabs.generateNew(obs, "init", 0, 150, types.ObjectTypes.TERRAIN, types.Terrain.WALL_HORIZ);
    prefabs.generateNew(obs, "init", 104, 125, types.ObjectTypes.TERRAIN, types.Terrain.WALL_HORIZ);

    prefabs.generateNew(obs, "init", -100, 0, types.ObjectTypes.INTERACTABLE, types.Interactable.HEALTH_PICKUP);
    prefabs.generateNew(obs, "init", -124, 0, types.ObjectTypes.INTERACTABLE, types.Interactable.HEALTH_PICKUP);
    prefabs.generateNew(obs, "init", -148, 0, types.ObjectTypes.INTERACTABLE, types.Interactable.HEALTH_PICKUP);

    prefabs.generateNew(obs, "init", -100, 32, types.ObjectTypes.INTERACTABLE, types.Interactable.PLAYER_TYPE_CHANGER, { newType: types.Player.HUMAN });
    prefabs.generateNew(obs, "init", -124, 32, types.ObjectTypes.INTERACTABLE, types.Interactable.PLAYER_TYPE_CHANGER, { newType: types.Player.FIRE_MAGE });
    prefabs.generateNew(obs, "init", -148, 32, types.ObjectTypes.INTERACTABLE, types.Interactable.PLAYER_TYPE_CHANGER, { newType: types.Player.GOD });

    prefabs.generateNew(obs, "init", 150, 0, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);
    prefabs.generateNew(obs, "init", 150, 24, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);
    prefabs.generateNew(obs, "init", 150, 48, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);
    prefabs.generateNew(obs, "init", 170, 12, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);
    prefabs.generateNew(obs, "init", 170, 36, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);
    prefabs.generateNew(obs, "init", 190, 0, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);
    prefabs.generateNew(obs, "init", 190, 24, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);
    prefabs.generateNew(obs, "init", 190, 48, types.ObjectTypes.TRIGGER, types.Trigger.SPIKE_TRAP);

    prefabs.generateNew(obs, "init", -300, 0, types.ObjectTypes.VEHICLE, types.Vehicle.CAR);
    prefabs.generateNew(obs, "init", -300, 74, types.ObjectTypes.VEHICLE, types.Vehicle.CAR);
    prefabs.generateNew(obs, "init", -350, 0, types.ObjectTypes.VEHICLE, types.Vehicle.CAR);
    prefabs.generateNew(obs, "init", -350, 74, types.ObjectTypes.VEHICLE, types.Vehicle.CAR);

    prefabs.generateNew(obs, "init", -25, -100, types.ObjectTypes.ENEMY, types.Enemy.TARGET_DUMMY);
    prefabs.generateNew(obs, "init", 25, -100, types.ObjectTypes.ENEMY, types.Enemy.TARGET_DUMMY);

    prefabs.generateNew(obs, "init", 0, 0, types.ObjectTypes.TRIGGER, types.Trigger.INVULN_PLATFORM);

    prefabs.generateNew(obs, "init", 0, 75, types.ObjectTypes.INTERACTABLE, types.Interactable.TELEPORTER, { destX: 0, destY: 1985 });

    // Castle
    prefabs.generateNew(obs, "init", 0, 1985, types.ObjectTypes.DECORATION, types.Decoration.CASTLE_FLOOR);

    prefabs.generateNew(obs, "init", 0, 1613, types.ObjectTypes.TERRAIN, types.Terrain.CASTLE_WALL_HORIZ);
    prefabs.generateNew(obs, "init", 0, 2413, types.ObjectTypes.TERRAIN, types.Terrain.CASTLE_WALL_HORIZ);

    prefabs.generateNew(obs, "init", 400, 1500, types.ObjectTypes.DECORATION, types.Decoration.WATCH_TOWER);
    prefabs.generateNew(obs, "init", -400, 1500, types.ObjectTypes.DECORATION, types.Decoration.WATCH_TOWER);

    prefabs.generateNew(obs, "init", 400, 1985, types.ObjectTypes.TERRAIN, types.Terrain.CASTLE_WALL_VERT);
    prefabs.generateNew(obs, "init", -400, 1985, types.ObjectTypes.TERRAIN, types.Terrain.CASTLE_WALL_VERT);
    
    prefabs.generateNew(obs, "init", 400, 2300, types.ObjectTypes.DECORATION, types.Decoration.WATCH_TOWER);
    prefabs.generateNew(obs, "init", -400, 2300, types.ObjectTypes.DECORATION, types.Decoration.WATCH_TOWER);

    prefabs.generateNew(obs, "init", 200, 1785, types.ObjectTypes.INTERACTABLE, types.Interactable.HEALTH_PICKUP);
    prefabs.generateNew(obs, "init", -200, 1785, types.ObjectTypes.INTERACTABLE, types.Interactable.HEALTH_PICKUP);
    prefabs.generateNew(obs, "init", 200, 2185, types.ObjectTypes.INTERACTABLE, types.Interactable.HEALTH_PICKUP);
    prefabs.generateNew(obs, "init", -200, 2185, types.ObjectTypes.INTERACTABLE, types.Interactable.HEALTH_PICKUP);

    prefabs.generateNew(obs, "init", 600, 1400, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 634, 1550, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 720, 1800, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 550, 2100, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -600, 2100, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -634, 1800, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -720, 1400, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -550, 1500, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -350, 1450, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -50, 1400, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 150, 1450, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 230, 1300, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -350, 2500, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -50, 2700, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 150, 2650, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 230, 2550, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -580, 2650, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", -500, 2550, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 450, 2500, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
    prefabs.generateNew(obs, "init", 630, 2700, types.ObjectTypes.TERRAIN, types.Terrain.TREE);
}
