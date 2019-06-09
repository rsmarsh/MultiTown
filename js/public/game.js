import Player from './Player.js'

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
    update: update
  }
};

var game = new Phaser.Game(config);
var currentPlayer;

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

  
  addPlayer.call(this);
}

function update() {

  // checks for keyboard inputs and moves the player if the necessary keys are down
  currentPlayer.updatePosition();
}


function addPlayer(){
  var sceneRef = this;
  var graphics = this.add.graphics();
  currentPlayer = new Player('richard', {
    scene: sceneRef,
    graphics: graphics,
    controllable: true,
    collideWith: [platforms]
  });
  

}