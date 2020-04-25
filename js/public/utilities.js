const funcs = {


    //generates a random colour between #000000 and #ffffff
    getRandomColour(prefix) {
        // default to 0x, but allow for # colour prefixes
        prefix = prefix || '0x';

        return prefix
            + Math.floor(Math.random() * 16).toString(16) + ''
            + Math.floor(Math.random() * 16).toString(16) + ''
            + Math.floor(Math.random() * 16).toString(16) + ''
            + Math.floor(Math.random() * 16).toString(16) + ''
            + Math.floor(Math.random() * 16).toString(16) + ''
            + Math.floor(Math.random() * 16).toString(16);
    },

    /**
     * Has equal chance of returning true or false
     * Uses the internal function to retrieve the random value
     *
     * @returns {Boolean}
     */
    boolean() {
        return Math.random() > 0.5;
    },

    /**
     * Returns a random integer
     * By default ranges between 0 and the maximum integer value
     *
     * @param {Boolean} allowNegative - Allow negative numbers to be returned also
     * @param {Number} [min=0] - The lowest number allowed to be returned
     * @param {Number} [max=Number.MAX_SAFE_INTEGER] - The highest number allowed to be returned
     * @returns {Number} - A random number within the provided range
     */
    integer(min = 0, max = Number.MAX_SAFE_INTEGER) {
        return min + Math.floor(Math.random() * (Math.abs(min) + max));
    },

    /**
     * Gets a random letter from the English alphabet, between A-Z
     * Capitalisation is not handed within this function, which always returns a lower case letter
     *
     * @returns {String} - a single letter from the alphabet
     */
    character() {
        return randomFromArray('abcdefghijklmnopqrstuvwxyz'[integer(false, 0, 25)]);
    },

    /**
     * This returns a random element from a provided array
     *
     * @param {*} [fromArray=[]] - Arrayfrom which to return a random element/character
     * @returns {*} - the element found at the random position
     */
    randomFromArray(fromArray = []) {
        return fromArray[_randomInRange(0, fromArray.length)];
    }

};

export default funcs;