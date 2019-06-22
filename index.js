var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Player = require('./private/Player.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));



io.on('connection', function(socket){
  var player = new Player(socket);
  socket.player = player;

  // wait until the client gives the load complete signal
  socket.on('game-loaded', function() {
      io.to(socket.id).emit('player-data', socket.player.getPrivateInfo());
      io.to(socket.id).emit('player-list', socket.player.getAllPlayerStates(true));
      socket.player.setInitialised(true);
  });

  socket.on('pos', function(position) {
    socket.player.updatePosition(position);
    socket.broadcast.emit('player-positions', socket.player.getAllPlayerStates(false));
  });

  socket.on('disconnect', function() {
    // if (player.isInitialised() === false) {
      socket.player.removePlayer();
    // }
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});