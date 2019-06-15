var crypto = require('crypto');
var io = require('socket.io');
const playerList = {};

// when a new client connects to the server,
// the socket connection is passed to this function to establish whether they are a new or returning player
var newConnection = function(socket, ioRespond) {

    // creates or updates the entry for this user in the previous players list
    storeUser(socket.handshake.query.playerId, socket.id);

    console.log("\nthe player list is now:\n");
    outputPlayers();

    // set up this socket to listen for positional data
    setUpSocketEvents(socket, ioRespond);
};

// attempt to reconnect a user to their previous state
// this function is called when a playerId was passed along with the socket handshake
var storeUser = function(playerId, socketId) {
    if (!playerId) {
        playerId = crypto.randomBytes(20).toString('hex');
    }

    //does the player already exist?
    if (playerList[playerId]) {
       //don't create anything new, player already exists
    } else {
        // create a new user entry
        playerList[playerId] = {
            connectionCount: 0,
            position: {x: undefined, y: undefined}
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

var getPlayerData = function(playerId) {
    return {
        playerId: playerId,
        position: playerList[playerId].position,
        name: playerList[playerId].name
    }
};

var sendPlayerData = function(playerId, socket, ioRespond) {
 // get all the info needed for the player to spawn
 var playerData = getPlayerData(playerId);

 ioRespond.to(socket.id).emit('player-data', playerData);

}

setUpSocketEvents = function(socket, ioRespond) {
    var playerId = getPlayerIdFromSocketId(socket.id);
    socket.on('pos', storePlayerPosition.bind(this, playerId));
    socket.on('request-player-data', sendPlayerData.bind(this, playerId, socket, ioRespond));
    socket.on('player-name-change', storePlayerName.bind(this, playerId));
};



// The playerID is binded to this callback function
var storePlayerPosition = function(playerId, position) {
    playerList[playerId].position = position;
};

// this could be a new player's name, or an existing player changing their name
var storePlayerName = function(playerId, newName) {
    playerList[playerId].name = newName;
}

module.exports = {
    newConnection: newConnection
};