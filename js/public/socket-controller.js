var connQuery = '';

if (localStorage) {
    var playerId = localStorage.getItem('playerId');
    // if an existing player id is found in the local cache, let the server know who we are
    if (playerId) {
        connQuery+='playerId='+playerId;
    }
    connQuery 
} 

var socket = io('', {query: connQuery});

// receive info about user ID and store it to take care of returning users
socket.on('player-id', updateSessionInfo)

// receives the player ID which can be used to inform the server who the user is
// this assists with returning users allowing the server to reload their previous game info
function updateSessionInfo(playerId) {
    if (localStorage) {
        localStorage.setItem('playerId', playerId);
    }
};
