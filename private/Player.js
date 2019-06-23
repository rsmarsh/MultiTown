var crypto = require('crypto');
var PlayerList = require('./PlayerList.js');

// the Player constructor creates a single player object, storing all the relevant user information
// The functions provide the different actions a player can take
var Player = function(socket) {

    this.setInitialised(false);

    this.socket = socket;
    this.socketId = socket.id;

    // if a playerId was provided by the connecting user, check to see if they have a record
    var returningPlayer = socket.handshake.query.playerId && PlayerList.checkPlayerExists(socket.handshake.query.playerId);

    if (returningPlayer) {
        console.log("returning player");
        this.playerId = socket.handshake.query.playerId;
        this.gameData = PlayerList.restorePlayerData(socket.handshake.query.playerId);

    } else {
        console.log("brand new player");
        this.playerId = crypto.randomBytes(20).toString('hex');
        this.gameData = this.generateGameData();
    }



    // This player could either be a returning player, or a new player
    this.gameData.name = this.name || 'no name'+crypto.randomBytes(3).toString('hex');;


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
    },

    // a new position was received by the client, store the latest x/y coordinates
    updatePosition: function(position) {
        this.gameData.position.x = position.x;
        this.gameData.position.y = position.y;
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
            safeId: crypto.randomBytes(20).toString('hex'),
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