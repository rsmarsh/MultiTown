var connQuery = '';

if (localStorage) {
    var playerId = localStorage.getItem('playerId');
    // if an existing player id is found in the local cache, let the server know who we are
    if (playerId) {
        connQuery+='playerId='+playerId;
    }
} 

var socket = io('', {
    query: connQuery,
    reconnection: false
});

function broadcastPosition(position) {
    socket.emit('pos', position);
};
