import Player from './Player.js';


var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300},
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

var platforms;

function create() {
  this.add.image(400, 300, 'sky');
  
  platforms = this.physics.add.staticGroup();
  
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
  
  addSocketComms.call(this, socket);
  requestPlayerData.call(this, socket);
  
}

function update() {

  if (currentPlayer) {
    // checks for keyboard inputs and moves the player if the necessary keys are down
    currentPlayer.updatePosition();
  }
}

function updateOnlinePlayers(playerList){
  for (var i = 0; i < playerList.length; i++) {
    // use the safeId to identify which character needs to move
    var onlinePlayer = onlinePlayers[playerList[i].safeId];

    // ensure that this is not a new player who has joined since this user connected
    if (onlinePlayer) {
      onlinePlayer.manuallyUpdatePosition(playerList[i]);
    }
    
  }
};


function receivePlayerInfo(playerData) {
  if (localStorage) {
    // update/store the player ID for this character
    localStorage.setItem('playerId', playerData.playerId);
  }

  addPlayer.call(this, playerData);
};

function receiveOnlinePlayerList(playerList) {
  for (var i = 0; i < playerList.length; i++) {
    onlinePlayers[playerList[i].safeId] = addPlayer.call(this, playerList[i], true);
  }
};

// otherPlayer refers to whether this is the current user, or other online players
function addPlayer(playerData, otherPlayer){
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
    collideWith: [platforms],
    position: playerData.position
  });

  if (!otherPlayer) {
    currentPlayer = newPlayer;
  }

  return newPlayer;

}


function addSocketComms(socket) {
  socket.on('player-data', receivePlayerInfo.bind(this));

  // receive a list of all other players
  socket.on('player-list', receiveOnlinePlayerList.bind(this));
  
  // receive the positions of all other players
  socket.on('player-positions', updateOnlinePlayers.bind(this));

}

function requestPlayerData(socket) {
  // inform the server that the game has fully loaded
  socket.emit('game-loaded');
}

// receives a list of players and their latest positions from the server
function updatePlayerPositions(playerList) {
  console.log("received a player list as");
  console.log(playerList);
};