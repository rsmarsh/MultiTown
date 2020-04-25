import utils from './utilities.js';

class Level {
    constructor(config) {
        this.width = config.width;
        this.height = config.height;
        this.scene = config.scene;

        // determines whether the level layout wuill be completely random
        this.randomise = config.randomise;

        this.spawnPoint = config.spawnPoint;

        this.createLayout(config.layout);

        console.log("new level made");
    
    }

    createLayout(layoutArray) { 
        let platformArray = [];

        if (this.randomise) {
            let startY = 0;

            // keep generating platforms from the top to the bottom until the bottom is reached
            while (startY <= this.scene.cameras.main.height) {
                startY += utils.integer(64, 100);

                // craete a single platform with all random properties
                platformArray.push(this.createPlatform(
                    utils.integer(0, this.scene.cameras.main.width),
                    utils.integer(0, this.scene.cameras.main.height),
                    utils.integer(20, this.scene.cameras.main.width/2),
                    utils.integer(10, 20),
                    utils.integer(0, 30)
                ));
                console.log("added another platorm", startY);
            }

        } else {
            // platformArray = locationArray.map(createPlatform);

        }

        this.platformsGroup = this.scene.physics.add.staticGroup();

        // add each entry within the platform array to the phaser physics group
        platformArray.forEach((plat) => {
            this.platformsGroup.add(plat);
        });
    }

    createPlatform(x, y, width, height, angle) {
        var platform = this.scene.add.sprite(x, y, 'ground');
        // platform.displayWidth = width;
        // platform.displayHeight = height;

        return platform;
        // this.platformsGroup.create(x, y, 'ground').setw
            // platformsGroup.create(400, 568, 'ground').setScale(2).refreshBody();
    // platformsGroup.create(600, 400, 'ground');
    }

    /*
     * Creates the endpoint which the player must reach to complete the level
    */
    createGoal() {

    }

    getSpawnPoint() {
        return {
            x: this.spawnPoint.x,
            y: this.spawnPoint.y
        }
    }
}

export default Level;