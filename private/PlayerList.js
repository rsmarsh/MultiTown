var utils = require('./utils.js');
var list = {};


var addPlayer = function(playerInstance) {
    list[playerInstance.playerId] = playerInstance 
};

// A connecting user provided a playerId, check if it matches any of the stored users
var checkPlayerExists = function(playerId) {
    return typeof list[playerId] !== 'undefined';
};

var restorePlayerData = function(playerId) {
    return list[playerId].gameData;
};

var removePlayer = function(playerId) {
    delete list[playerId];
};

// creates a trimmed down player list with only the necessary info
var getAllPlayerStates = function(excludeId) {
    var strippedList = [];
        
    for (var player in list) {
        // only return players who are online
        if (list[player].isOnline() && list[player].getPlayerId() !== excludeId) {
            strippedList.push({
                safeId: list[player].gameData.safeId,
                name: list[player].gameData.name,
                position: list[player].getPosition(),
                colour: list[player].gameData.colour
            });
        }
    }

    return strippedList;
};

getPlayerCount = function() {
    return utils.getObjectLength(list);
};

module.exports = {
    addPlayer: addPlayer,
    getAllPlayerStates: getAllPlayerStates,
    getPlayerCount: getPlayerCount,
    checkPlayerExists: checkPlayerExists,
    restorePlayerData: restorePlayerData,
    getAllPlayerStates: getAllPlayerStates,
    removePlayer: removePlayer
};