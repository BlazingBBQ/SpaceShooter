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
function initializeMap(obs) { }
