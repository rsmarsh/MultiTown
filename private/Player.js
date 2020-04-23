const utils = require('./utils');
var PlayerList = require('./PlayerList.js');

// the Player constructor creates a single player object, storing all the relevant user information
// The functions provide the different actions a player can take
var Player = function(socket) {

    this.setInitialised(false);

    this.socket = socket;
    this.socketId = socket.id;

    // if a playerId was provided by the connecting user, check to see if they have a record
    var returningPlayer = socket.handshake.query.playerId && PlayerList.checkPlayerExists(socket.handshake.query.playerId);
    console.log(`ID: ${socket.handshake.query.playerId}`);
    if (returningPlayer) {
        console.log("returning player");
        this.playerId = socket.handshake.query.playerId;
        this.gameData = PlayerList.restorePlayerData(socket.handshake.query.playerId);

    } else {
        console.log("brand new player");
        this.playerId = utils.getRandomString();
        this.gameData = this.generateGameData();
    }

    // if this player is joining but is already online, there must have been a disconnection or they have multiple tabs open
    if (this.isOnline()) {
        // force a disconnect before reconnecting
        this.disconnect();
    }

    this.connect();

    PlayerList.addPlayer(this);
    
};

Player.prototype = {

    speak: function() {
        console.log(this.gameData.name+ " says hello");
    },

    connect: function() {
        console.log(this.gameData.name+" connected");
        this.online = true;
    },

    disconnect: function() {
        console.log(this.gameData.name+" disconnected");
        this.online = false;
        this.socket.broadcast.emit('player-left', this.getPublicInfo());
    },

    // a new position was received by the client, store the latest x/y coordinates
    updatePosition: function(position) {
        this.gameData.position.x = position.x;
        this.gameData.position.y = position.y;
        this.gameData.anim = position.anim;
    },

    getPosition: function(){
        return {
            x: this.gameData.position.x,
            y: this.gameData.position.y
        };
    },

    // generates the minimal basic info required for a brand new player
    generateGameData: function() {
        return {
            safeId: utils.getRandomString(20),
            name: 'guest'+(PlayerList.getPlayerCount()+1),
            position: {
                x: 100,
                y: 100
            },
        }
    },

    // returns the info which is sent to this own player's client
    //contains sensitive player ID info
    getPrivateInfo: function() {
        return {
            playerId: this.playerId,
            colour: this.gameData.colour,
            name: this.gameData.name,
            position: this.getPosition()
        }
    },

    // returns safe info about this player
    // contains game data and public facing data
    getPublicInfo: function() {
        return this.gameData;
    },  

    getAllPlayerStates: function(excludeSelf) {
        var excludeId = '';
        if (excludeSelf) {
            excludeId = this.playerId;
        }
        return PlayerList.getAllPlayerStates(excludeId);
    },

    isOnline: function() {
        return this.online;
    },

    getPlayerId: function() {
        return this.playerId;
    },

    // sometimes a client will begin to load, then fail to complete.
    // in this scenario, do not store their player as it will be half complted
    setInitialised: function(initialised) {
        this.initialised = initialised;
    },

    isInitialised: function() {
        return this.initialised;
    },

    removePlayer: function() {
        PlayerList.removePlayer(this.getPlayerId());
    },
};


module.exports = Player;