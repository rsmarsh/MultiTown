var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var playerList = require('./private/PlayerList.js');
var playerController = require('./private/player-controller.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));



io.on('connection', function(socket){
  console.log('a user connected');
  playerController.newConnection(socket, io);
  
  // a new client will request an up to date list of all the currently active players
  socket.on('request-player-data', function() {
    
    // inform the new connection about the current list of players
    io.to(socket.id).emit('player-list', playerController.getPlayerList());
  });
  
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});