import * as utils from './utilities.js';

class Player {
    constructor(name, config) {
        this.name = name;
        this.graphics = config.graphics;
        for (var property in config){
            this[property] = config[property];
        }

        this.createSprite(this.colour);
    };

    // creates the onscreen spite to be used by this player
    createSprite(colour) {
        this.colour = this.colour || utils.getRandomColour();
        var rect = new Phaser.Geom.Rectangle(50, 50, 50, 50);

        this.graphics.fillStyle(this.colour);
        this.graphics.fillRectShape(rect);

    };
};

export default Player;