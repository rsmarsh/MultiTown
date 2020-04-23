const crypto = require('crypto');

/*
* This module exports useful helper functions 
* The functions are individual area of the game 
*
*/
const getObjectLength = (obj) => {
    let count = 0;
    for (let prop in obj) {
        count+=1;
    }
    return count;
};

const getRandomString = (length = 20) => {
    return crypto.randomBytes(length).toString('hex');
};

module.exports = {
    getObjectLength,
    getRandomString
};