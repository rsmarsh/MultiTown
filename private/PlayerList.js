var list = [];


var addPlayer = function(playerInfo) {
    list.push({
        playerId: playerInfo.playerId,
        name: playerInfo.name,
        position: playerInfo.position,
        colour: playerInfo.colour,
        online: playerInfo.online,
        socketId: playerInfo.socketId,
        lastConnected: playerInfo.lastConnected,
        connectionCount: playerInfo.connectionCount
    });
}

// creates a trimmed down player list with only the necessary info
var getList = function() {
    var strippedList = [];
        
    for (var i = 0; i < list.length; i++) {
        // only need players who are online
        if (!this.list[i].online) {
            continue;
        }
        strippedList.push({
            name: list[i].name,
            position: list[i].position,
            colour: list[i].colour
        });
    }

}

module.exports = {
    addPlayer: addPlayer,
    getList: getList
};