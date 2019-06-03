import Player from './Player.js'

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  // this.load.image('imageName', 'assets/*.png');
}

function create() {
  // this.add.image(400, 300, 'imageName');
  addPlayer.call(this);
}

function update() {

}


function addPlayer(){
  var graphics = this.add.graphics();
  var player1 = new Player('richard', {graphics: graphics});

}