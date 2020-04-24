class Bullet {
    constructor(config) {
        this.bulletSprite = config.bulletSprite;
    }

    launch(x, y, angle, maxDamage) {
        // spawn 
        
    }

    // the first object to be hit by the bullet
    objectHit(target) {
        // attempt to trigger a take damage function on the target if it exists
        
    }

    destroy() {
        
    }
}

export default Bullet;