var utils = require('./utils.js');
var list = {};


var addPlayer = function(playerInstance) {
    list[playerInstance.playerId] = playerInstance 
    // {
    //     playerId: playerInfo.playerId,
    //     safeId: playerInfo.gameData.safeId,
    //     name: playerInfo.gameData.name,
    //     position: playerInfo.gameData.position,
    //     colour: playerInfo.gameData.colour,
    //     online: playerInfo.online,
    //     socketId: playerInfo.socketId,
    //     lastConnected: playerInfo.lastConnected,
    //     connectionCount: playerInfo.connectionCount
    // };
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
    if (strippedList[0]) {

        console.log('0: '+strippedList[0].position.x);
    }
    if (strippedList[1]) {
        console.log('1: '+strippedList[1].position.x);
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