/*
* This module exports useful helper functions 
* The functions are individual area of the game 
*
*/
var getObjectLength = function(obj) {
    var count = 0;
    for (var prop in obj) {
        count+=1;
    }
    return count;
};

module.exports = {
    getObjectLength: getObjectLength
};