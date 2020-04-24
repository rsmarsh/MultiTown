import Player from './Player.js';
import World from './World.js';


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

window.game = new Phaser.Game(config);

var currentPlayer;
var onlinePlayers = {};
var worldObject;

function createWorldObject() {
    var sceneRef = this;
    worldObject = new World({sceneRef});
}

function preload() {
    this.load.image('sky', 'assets/env/sky.png');
    this.load.image('ground', 'assets/env/platform.png');
    this.load.image('star', 'assets/env/star.png');
    this.load.image('bomb', 'assets/env/bomb.png');
    this.load.spritesheet('dude',
        'assets/player/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

var platformsGroup;
var playersGroup;

function create() {
    this.add.image(400, 300, 'sky');

    platformsGroup = this.physics.add.staticGroup();
    playersGroup = this.physics.add.group();


    platformsGroup.create(400, 568, 'ground').setScale(2).refreshBody();
    platformsGroup.create(600, 400, 'ground');
    platformsGroup.create(50, 250, 'ground');
    platformsGroup.create(750, 220, 'ground');

    createWorldObject.call(this);
    addSocketComms.call(this, socket);
    requestPlayerData.call(this, socket);

}

function update() {

    if (currentPlayer && currentPlayer.banned === false) {
        // checks for keyboard inputs and moves the player if the necessary keys are down
        currentPlayer.updatePosition();
    } 
}

function updateOnlinePlayerPositions(playerList) {
    for (var i = 0; i < playerList.length; i++) {
        // use the safeId to identify which character needs to move
        var onlinePlayer = onlinePlayers[playerList[i].safeId];

        // ensure that this is not a new player who has joined since this user connected
        if (onlinePlayer) {
            onlinePlayer.manuallyUpdatePosition(playerList[i]);
        }

    }
};

function onlinePlayerLeft(playerData) {
    if (onlinePlayers[playerData.safeId]) {
        onlinePlayers[playerData.safeId].destroyPlayer();
    } else {
        console.warn('online player left but it wasnt in the list');
    }
};

function receiveSessionData(sessionData) {
    if (!localStorage) {
        return;
    }

    // if this player has data from an old instance, remove it
    if (localStorage.getItem('sessionId') !== sessionData.sessionId) {
        localStorage.removeItem('playerId');
    }

    localStorage.setItem('sessionId', sessionData.sessionId);
};

function receivePlayerInfo(playerData) {
    if (localStorage) {
        // update/store the player ID for this character
        localStorage.setItem('playerId', playerData.playerId);
    }

    addPlayer.call(this, playerData, false);
};


// receive a list of one or more other players who were already online when this client joined
function receiveOnlinePlayerList(playerList) {
    for (var i = 0; i < playerList.length; i++) {
        onlinePlayers[playerList[i].safeId] = addPlayer.call(this, playerList[i], true);
    }
};

// get the data of one other user, who will have joined since this client
function receiveOnlinePlayerInfo(playerData) {
    // is this a player on two tabs, or one that disconnected and rejoined
    if (onlinePlayers[playerData.safeId] === currentPlayer.safeId) {
        // destroy the existing instance of this player
        // currentPlayer.destroyPlayer();
    }
    onlinePlayers[playerData.safeId] = addPlayer.call(this, playerData, true);
};

// otherPlayer refers to whether this is the current user, or other online players
function addPlayer(playerData, otherPlayer) {
    var sceneRef = this;
    var graphics = this.add.graphics();

    var playerName = playerData.name;

    // if this is a new player, then no name will exist
    if (!otherPlayer && !playerName) {
        // prevent blank/space names
        while (!playerName) {
            playerName = prompt('What is your name?');
        }
        socket.emit('player-name-change', playerName);
    }

    var newPlayer = new Player(playerName, {
        scene: sceneRef,
        graphics: graphics,
        controllable: !otherPlayer,
        physicsGroup: playersGroup,
        collideWith: [platformsGroup, playersGroup],
        position: playerData.position,
        isLocalUser: !otherPlayer,
        playerId: playerData.playerId,
        worldObject
    });

    if (!otherPlayer) {
        currentPlayer = newPlayer;
    }

    return newPlayer;

}


function addSocketComms(socket) {
    socket.on('session-data', receiveSessionData.bind(this));

    socket.on('player-data', receivePlayerInfo.bind(this));

    // receive a list of all other players
    socket.on('player-list', receiveOnlinePlayerList.bind(this));

    // receive subsequent players after joining
    socket.on('new-online-player', receiveOnlinePlayerInfo.bind(this));

    socket.on('player-left', onlinePlayerLeft.bind(this));

    // receive the positions of all other players
    socket.on('player-positions', updateOnlinePlayerPositions.bind(this));

}

function requestPlayerData(socket) {
    // inform the server that the game has fully loaded
    socket.emit('game-loaded');
}

