import * as utils from './utilities.js';
import Bullet from './Bullet.js';

class Weapon {
    constructor(props) {
        this.name = props.name;
        this.damage = props.damage;
        this.spritesheet = props.spritesheet;
        this.soundList = props.soundList;
        this.type = "weapon";
    }

    shoot(x, y, direction) {
        // create new bullet
        let newBullet = new Bullet();

        // fire bullet with given parameters 
        newBullet.launch(x, y, direction, this.damage);
    }

    playSound(sound) {
        switch(sound) {
            case 'equip':
                // TODO: play the equip sound
                break;
        }
        // play a random sound from the list of provided sounds
    }
}

export default Weapon