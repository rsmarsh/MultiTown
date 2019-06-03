var crypto = require('crypto');
const playerList = {};

// when a new client connects to the server,
// the socket connection is passed to this function to establish whether they are a new or returning player
var newConnection = function(socket) {
    console.log("new connection received");
    
    storeUser(socket.handshake.query.playerId, socket.id);


    var playerId = getPlayerIdFromSocketId(socket.id);

    socket.emit('player-id', playerId);

    console.log("\nthe player list is now:\n");
    outputPlayers();
};

// attempt to reconnect a user to their previous state
// this function is called when a playerId was passed along with the socket handshake
var storeUser = function(playerId, socketId) {
    if (!playerId) {
        playerId = crypto.randomBytes(20).toString('hex');
    }

    //does the player already exist?
    if (playerList[playerId]) {
        console.log("returning player");
    } else {
        // create a new user entry
        playerList[playerId] = {
            connectionCount: 0
        };
    }

    playerList[playerId].online = true;
    playerList[playerId].socketId = socketId;
    playerList[playerId].lastConnected = new Date().getUTCMilliseconds();
    playerList[playerId].connectionCount += 1;
};

// inform the user what their playerId is, so that if they leave and return they can reconnect
var returnUserCredentials = function(playerId) {

}

var userDisconnected = function(playerId) {
    playerList[playerId].online = false;
};

var outputPlayers = function() {
    console.log(playerList);
};

// iterate over the playerlist, finding a matching player if one if discovered
var getPlayerIdFromSocketId = function(socketId) {
    for (var playerId in playerList) {
        if (playerList[playerId].socketId === socketId){
            return playerId;
        }
    }
};

module.exports = {
    newConnection: newConnection
};