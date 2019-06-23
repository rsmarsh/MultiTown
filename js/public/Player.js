import * as utils from './utilities.js';

class Player {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        
        for (var property in config){
            this[property] = config[property];
        }

        this.addGraphics();
        this.addPhysics();
        
        if (this.controllable) {
            this.addControls();
        } else {
            this.sprite.body.gravity.y = -300;
        }
    };

    addPhysics() {
        // this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        
        // world objects which the player model should interact with
        for (var i = 0; i < this.config.collideWith.length; i++) {
            this.scene.physics.add.collider(this.sprite, this.config.collideWith[i]);
        }
    };
    
    addGraphics() {
        // they may actually be standing at position 0 so watch for false negatives
        var startingX = !isNaN(this.position.x) ? this.position.x : 100;
        var startingY = !isNaN(this.position.y) ? this.position.y : 450;

        this.sprite = this.scene.physics.add.sprite(startingX, startingY, 'dude');
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: 'turn',
            frames: [{
                key: 'dude',
                frame: 4
            }],
            frameRate: 20
        });

        var onScreenName = this.name.trim();
        if (onScreenName > 16) {
            onScreenName = onScreenName.substring(0, 13) + '...';
        }
        this.visibleName = this.scene.add.text(this.sprite.x, this.sprite.y - this.sprite.height/1.5, this.name, {
            fontSize: '16px',
            fill: this.colour || utils.getRandomColour('#'),
            stroke: '#000000',
            strokeThickness: 5
        });
        this.visibleName.setOrigin(0.5);

    }

    addControls() {
        // actions are treated differently to movement keys, since they are single events which won't be held
        this.scene.input.keyboard.on('keydown_W', function(){
            this.jump();
        }, this)


        this.movementKeys = {
            // 'up': this.scene.input.keyboard.addKey('W'),
            'down': this.scene.input.keyboard.addKey('S'),
            'left': this.scene.input.keyboard.addKey('A'),
            'right': this.scene.input.keyboard.addKey('D'),
            getKeys: () => {
                var keys = [];
                // iterate over each key object and return an array of the currently pressed keys
                for (var key in this.movementKeys) {
                    if (this.movementKeys[key].isDown) {
                        keys.push(key);
                    }
                }
                return keys;
            }
        };

    };

    destroyPlayer() {
        this.visibleName.destroy();
        this.sprite.destroy();
    };

    // determine which key press should take priority
    determineAction(keysPressed) {
        // don't prioritise one direction
        if (keysPressed.includes('left') && keysPressed.includes('right')) {
            return 'still';
        }

        if (keysPressed.includes('left')) {
            return 'left';
        }

        if (keysPressed.includes('right')) {
            return 'right';
        }
    };

    // this is used when online players are moving around, since they are just a sprite and do not require usual phaser calculations
    manuallyUpdatePosition(newData) {
        this.sprite.x = newData.position.x;
        this.sprite.y = newData.position.y;

        this.updateFloatingName(this.sprite.x, this.sprite.y - this.sprite.height/1.5, newData.name);
    }

    // called each frame by the game's update loop
    updatePosition() {

        this.updateFloatingName(this.sprite.x, this.sprite.y - this.sprite.height/1.5, this.name);

        if (!this.controllable) {
            return;
        }
       
        var keysPressed = this.movementKeys.getKeys();
        var action = this.determineAction(keysPressed);

        var newAnim;
        switch(action) {
            case 'left':
                newAnim = 'left';
                this.runDirection('left');
                break;
            case 'right':
                newAnim = 'right';
                this.runDirection('right');
                break;
            case 'down':
                break;

            default: 
                newAnim = 'turn';
                this.runDirection('stop');
        }

        this.changeAnim(newAnim);
        
        if (this.previousPosition) {
            if (this.previousPosition.x !== this.sprite.x || this.previousPosition.y !== this.sprite.y) {
                
                this.previousPosition.x = this.sprite.x;
                this.previousPosition.y = this.sprite.y;                
                
                //inform the server of the latest position when it changes
                broadcastPosition({
                    x: Number(this.sprite.x.toFixed(2)),
                    y: Number(this.sprite.y.toFixed(2))
                });
            }
        } else {
            this.previousPosition = {
                x: this.sprite.x,
                y: this.sprite.y
            };
        }

    };

    updateFloatingName(newX, newY, name) {
        this.visibleName.x = newX;
        this.visibleName.y = newY;
        this.visibleName.text = name;
    };

    // changes the player's sprite to a new animation, such as running left/right
    // anim is a string value of the animation's key as it named when loaded in
    changeAnim(anim){
    
        if (this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key === anim){ 
            return;
        }
        this.sprite.anims.play(anim);
    };

    runDirection(direction) {
        if (direction === 'left') {
            this.sprite.setVelocityX(-160);

        } else if (direction === 'right') {
            this.sprite.setVelocityX(160);
        } else {
            this.sprite.setVelocityX(0);
        }
    };

    jump() {
        if (this.isOnGround()) {
            this.sprite.setVelocityY(-330);
        }
    };

    isOnGround() {
        return this.sprite.body.touching.down;
    };

}

export default Player;